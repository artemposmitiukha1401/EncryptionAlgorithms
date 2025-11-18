// const alphabet = [
//   "A",
//   "B",
//   "C",
//   "D",
//   "E",
//   "F",
//   "G",
//   "H",
//   "I",
//   "J",
//   "K",
//   "L",
//   "M",
//   "N",
//   "O",
//   "P",
//   "Q",
//   "R",
//   "S",
//   "T",
//   "U",
//   "V",
//   "W",
//   "X",
//   "Y",
//   "Z",
// ];

// function EncryptLetter(letterToEncrypt, shiftLength) {
//   letterToEncrypt = letterToEncrypt.toUpperCase();
//   let letter_position = -1;
//   for (let letterIndex = 0; letterIndex < alphabet.length; letterIndex++) {
//     if (alphabet[letterIndex] === letterToEncrypt) {
//       letter_position = letterIndex;
//       break;
//     }
//   }
//   if (letter_position === -1) return letterToEncrypt;
//   let newPosition = (letter_position + shiftLength) % alphabet.length;
//   if (newPosition < 0) newPosition += alphabet.length;
//   let encryptedLetter = alphabet[newPosition];
//   return encryptedLetter;
// }

// function EncryptText(text, shiftLength) {
//   let encryptedText = "";
//   for (let i = 0; i < text.length; i++)
//     encryptedText += EncryptLetter(text[i], shiftLength);
//   return encryptedText;
// }

// function CheckTextToEncrypt(text) {
//   if (/\d/.test(text)) {
//
//     textToEncryptLabel.style.color = "red";
//     textToEncryptLabel.textContent = "Text contains digits!";
//     textToEncrypt.style.boxShadow = `0 0 5px 2px rgba(255, 255, 255, 0.8), 0 0 15px 5px rgba(255, 0, 0, 0.6), 0 0 30px 10px rgba(255, 50, 50, 0.4), 0 0 50px 15px rgba(255, 100, 100, 0.2)`;
//     textToEncrypt.style.borderColor = "red";
//     encryptBtn.disabled = true;
//     return false;
//   } else {
//     textToEncryptLabel.style.color = "white";
//     textToEncrypt.style.boxShadow = `0 0 5px 2px rgba(255, 255, 255, 0.8), 0 0 15px 5px rgba(138, 43, 226, 0.6), 0 0 30px 10px rgba(0, 191, 255, 0.4), 0 0 50px 15px rgba(0, 150, 255, 0.2)`;
//     textToEncrypt.style.borderColor = "white";
//     textToEncryptLabel.textContent = "Enter text to encrypt:";
//     encryptBtn.disabled = false;
//     return true;
//   }
// }
async function CaesarEncryption(textToEncrypt, shift) {
  let result = "";
  const rows = document.querySelectorAll("table tr");

  for (let char of textToEncrypt) {
    if (/[a-z]/i.test(char)) {
      const isUpper = char === char.toUpperCase();
      const code = char.toUpperCase().charCodeAt(0) - 65;
      const newCode = (code + shift + 26) % 26;

      rows[code].style.background = "rgba(255, 0, 0, 0.6)";
      rows[code].style.boxShadow = "0 0 10px rgba(255, 0, 0, 0.8)";
      await new Promise((r) => setTimeout(r, 250));
      rows[code].style.background = "";
      rows[code].style.boxShadow = "";

      rows[newCode].style.background = "rgba(0, 255, 0, 0.6)";
      rows[newCode].style.boxShadow = "0 0 10px rgba(0, 255, 0, 0.8)";

      const encrypted = String.fromCharCode(newCode + 65);
      result += isUpper ? encrypted : encrypted.toLowerCase();
      document.getElementById("encrypted-text").textContent = result;

      await new Promise((r) => setTimeout(r, 1000));
      rows[newCode].style.background = "";
      rows[newCode].style.boxShadow = "";
    } else {
      result += char;
      document.getElementById("encrypted-text").textContent = result;
    }
  }
}

async function quarterRound(state, a, b, c, d, log = null) {
  if (log)
    log.push({
      step: "start",
      a,
      b,
      c,
      d,
      state: [...state],
    });

  state[a] += state[b];
  state[d] ^= state[a];
  state[d] = (state[d] << 16) | (state[d] >>> 16);
  state[c] += state[d];
  state[b] ^= state[c];
  state[b] = (state[b] << 12) | (state[b] >>> 12);
  state[a] += state[b];
  state[d] ^= state[a];
  state[d] = (state[d] << 8) | (state[d] >>> 8);
  state[c] += state[d];
  state[b] ^= state[c];
  state[b] = (state[b] << 7) | (state[b] >>> 7);
  if (log)
    log.push({
      step: "4",
      state: [...state],
    });
}

function chacha20Block(key, counter, nonce) {
  const state = new Uint32Array(16);

  // Константы
  state[0] = 0x61707865; // "expa"
  state[1] = 0x3320646e; // "nd 3"
  state[2] = 0x79622d32; // "2-by"
  state[3] = 0x6b206574; // "te k"

  // Ключ (8 слов по 4 байта)
  for (let i = 0; i < 8; i++) {
    state[4 + i] =
      key[i * 4] |
      (key[i * 4 + 1] << 8) |
      (key[i * 4 + 2] << 16) |
      (key[i * 4 + 3] << 24);
  }

  // Счётчик 32 бита
  state[12] = counter;

  // nonce 3 слова
  for (let i = 0; i < 3; i++) {
    state[13 + i] =
      nonce[i * 4] |
      (nonce[i * 4 + 1] << 8) |
      (nonce[i * 4 + 2] << 16) |
      (nonce[i * 4 + 3] << 24);
  }

  // Копия для финального сложения
  const working = new Uint32Array(state);

  // 20 раундов = 10 пар (column + diagonal)
  for (let i = 0; i < 10; i++) {
    // column rounds
    quarterRound(working, 0, 4, 8, 12);
    quarterRound(working, 1, 5, 9, 13);
    quarterRound(working, 2, 6, 10, 14);
    quarterRound(working, 3, 7, 11, 15);

    // diagonal rounds
    quarterRound(working, 0, 5, 10, 15);
    quarterRound(working, 1, 6, 11, 12);
    quarterRound(working, 2, 7, 8, 13);
    quarterRound(working, 3, 4, 9, 14);
  }

  // Складываем с исходным состоянием
  for (let i = 0; i < 16; i++) {
    working[i] = (working[i] + state[i]) >>> 0;
  }

  // Превращаем 64 байта блока в Uint8Array
  const out = new Uint8Array(64);
  for (let i = 0; i < 16; i++) {
    out[i * 4] = working[i] & 0xff;
    out[i * 4 + 1] = (working[i] >>> 8) & 0xff;
    out[i * 4 + 2] = (working[i] >>> 16) & 0xff;
    out[i * 4 + 3] = (working[i] >>> 24) & 0xff;
  }

  return out;
}

// --------------------
// 3. Шифрование массива байт
// --------------------
function chacha20EncryptBytes(key, nonce, bytes) {
  const out = new Uint8Array(bytes.length);
  let blockCount = 0;

  for (let i = 0; i < bytes.length; i += 64) {
    const keystream = chacha20Block(key, blockCount++, nonce);

    for (let j = 0; j < 64 && i + j < bytes.length; j++) {
      out[i + j] = bytes[i + j] ^ keystream[j];
    }
  }
  return out; // возвращаем сырые байты
}

// hex/base64 helpers
const toBase64 = (bytes) => btoa(String.fromCharCode(...bytes));
const fromBase64 = (str) => Uint8Array.from(atob(str), (c) => c.charCodeAt(0));

function chacha20encryptText(key, nonce, text) {
  const bytes = new TextEncoder().encode(text);
  const encryptedBytes = chacha20EncryptBytes(key, nonce, bytes);
  return toBase64(encryptedBytes);
}

function chacha20decryptText(key, nonce, encryptedB64) {
  const bytes = fromBase64(encryptedB64);
  const decryptedBytes = chacha20EncryptBytes(key, nonce, bytes);
  return new TextDecoder().decode(decryptedBytes);
}

// --------------------
// Keys
const key = crypto.getRandomValues(new Uint8Array(32));
const nonce = crypto.getRandomValues(new Uint8Array(12));
// --------------------

// Example usage:
const textToEncrypt = "Hello, World!";
const encrypted = chacha20encryptText(key, nonce, textToEncrypt);
const decrypted = chacha20decryptText(key, nonce, encrypted);
console.log("Original:", textToEncrypt);
console.log("Encrypted (base64):", encrypted);
console.log("Decrypted:", decrypted);

// + it's encrypt = decrypt

function ValidateInput() {
  const text = textInput.value;
  const shift = shiftInput.value;

  const hasLetters = /[A-Za-z]/i.test(text);
  const validShift = !isNaN(shift) && shift !== "";

  if (!hasLetters) {
    SetError(textInput, textLabel, "Text must have some letters!");
    return false;
  }
  if (!validShift) {
    SetError(shiftInput, shiftLabel, "Please enter correct shift!");
    return false;
  }

  setSuccess(textInput, textLabel, "Enter text to encrypt:");
  setSuccess(shiftInput, shiftLabel, "Enter shift length:");
  return true;
}

function SetError(input, label, message) {
  label.style.color = "red";
  label.textContent = message;
  input.style.borderColor = "red";
  input.style.boxShadow =
    "0 0 5px 2px rgba(255, 255, 255, 0.8), 0 0 15px 5px rgba(255, 0, 0, 0.6), 0 0 30px 10px rgba(255, 50, 50, 0.4), 0 0 50px 15px rgba(255, 100, 100, 0.2)";
  encryptBtn.disabled = true;
}

function setSuccess(input, label, message) {
  label.style.color = "white";
  label.textContent = message;
  input.style.borderColor = "white";
  input.style.boxShadow =
    "0 0 5px 2px rgba(255, 255, 255, 0.8), 0 0 15px 5px rgba(138, 43, 226, 0.6), 0 0 30px 10px rgba(0, 191, 255, 0.4), 0 0 50px 15px rgba(0, 150, 255, 0.2)";
  encryptBtn.disabled = false;
}

function displayText(text) {
  originalTextRow.innerHTML = "";
  for (let char of text) {
    const p = document.createElement("p");
    p.textContent = char === " " ? "␣" : char;
    originalTextRow.appendChild(p);
  }
}

const textInput = document.getElementById("text-to-encrypt");
const textLabel = document.getElementById("text-to-encrypt-label");
const shiftInput = document.getElementById("shift-length");
const shiftLabel = document.getElementById("shift-length-label");
const encryptBtn = document.getElementById("encrypt");
const originalTextRow = document.getElementById("original-text-row");

encryptBtn.addEventListener("click", async function () {
  if (ValidateInput()) {
    encryptBtn.disabled = true;
    document.getElementById("encrypted-text").textContent = "";

    await CaesarEncryption(textInput.value, parseInt(shiftInput.value));
    textInput.value = "";
    encryptBtn.disabled = false;
  }
});

shiftInput.addEventListener("input", ValidateInput);

textInput.addEventListener("input", function () {
  ValidateInput();
  displayText(this.value);
});
shiftInput.addEventListener("input", function () {
  document.getElementById("shift-value").textContent = this.value;
  ValidateInput();
});
