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

function CaesarEncrypt(str, shift) {
  const start_t = performance.now();
  let result = "";

  for (let i = 0; i < str.length; i++) {
    let char = str[i];
    if (char.match(/[a-zа-я]/i)) {
      let code = str.charCodeAt(i); // Get the Unicode of the latter
      let base = code >= 65 && code <= 90 ? 65 : 97; // Determine if it's uppercase or lowercase
      char = String.fromCharCode(((code - base + shift) % 26) + base); // Shift the letter and wrap around the alphabet
    }
    result += char;
  }
  const end_t = performance.now();
  console.log(`CaesarEncrypt took ${end_t - start_t} milliseconds.`);
  console.log(result);
  return { result: result, time: end_t - start_t };
}

function CheckShiftLength(shiftLengthInput) {
  const value = parseInt(shiftLengthInput.value);

  if (isNaN(value) || shiftLengthInput.value.length < 1) {
    // if it stroke/char or empty
    // value <= 0, value can be <= 0 (mb) + need to check for empty
    shiftLengthLabel.style.color = "red";
    shiftLengthLabel.textContent = "Please enter correct shift!";
    shiftLengthInput.style.boxShadow = `0 0 5px 2px rgba(255, 255, 255, 0.8), 0 0 15px 5px rgba(255, 0, 0, 0.6), 0 0 30px 10px rgba(255, 50, 50, 0.4), 0 0 50px 15px rgba(255, 100, 100, 0.2)`;
    shiftLengthInput.style.borderColor = "red";
    encryptBtn.disabled = true;
    return false;
  } else {
    shiftLengthLabel.style.color = "white";
    shiftLengthLabel.textContent = "Enter shift length:";
    shiftLengthInput.style.boxShadow = `0 0 5px 2px rgba(255, 255, 255, 0.8), 0 0 15px 5px rgba(138, 43, 226, 0.6), 0 0 30px 10px rgba(0, 191, 255, 0.4), 0 0 50px 15px rgba(0, 150, 255, 0.2)`;
    shiftLengthInput.style.borderColor = "white";
    encryptBtn.disabled = false;
    return true;
  }
}

// function CheckTextToEncrypt(text) {
//   if (/\d/.test(text)) {
//     // if it digit we can skip it
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

function CheckTextToAnyLatter(text) {
  for (let i = 0; i < text.length; i++) {
    if (text[i].match(/[a-zа-я]/i)) {
      textToEncryptLabel.style.color = "white";
      textToEncrypt.style.boxShadow = `0 0 5px 2px rgba(255, 255, 255, 0.8), 0 0 15px 5px rgba(138, 43, 226, 0.6), 0 0 30px 10px rgba(0, 191, 255, 0.4), 0 0 50px 15px rgba(0, 150, 255, 0.2)`;
      textToEncrypt.style.borderColor = "white";
      textToEncryptLabel.textContent = "Enter text to encrypt:";
      encryptBtn.disabled = false;
      return true;
    }
  }
  textToEncryptLabel.style.color = "red";
  textToEncryptLabel.textContent = "Text must have some latters!";
  textToEncrypt.style.boxShadow = `0 0 5px 2px rgba(255, 255, 255, 0.8), 0 0 15px 5px rgba(255, 0, 0, 0.6), 0 0 30px 10px rgba(255, 50, 50, 0.4), 0 0 50px 15px rgba(255, 100, 100, 0.2)`;
  textToEncrypt.style.borderColor = "red";
  encryptBtn.disabled = true;
  return false;
}

let textToEncrypt = document.getElementById("text-to-encrypt");
let textToEncryptLabel = document.getElementById("text-to-encrypt-label");
// let encryptedTextOutput = document.getElementById("encrypted-text");
let encryptBtn = document.getElementById("encrypt");
let shiftLength = document.getElementById("shift-length");
// let shiftLengthError = document.getElementById("shift-length-error");
let shiftLengthLabel = document.getElementById("shift-length-label");
// let textToEncryptError = document.getElementById("text-to-encrypt-error");

encryptBtn.addEventListener("click", function () {
  if (
    CheckShiftLength(shiftLength) &&
    // CheckTextToEncrypt(textToEncrypt.value)
    CheckTextToAnyLatter(textToEncrypt.value)
  ) {
    document.getElementById("encrypted-text").textContent = CaesarEncrypt(
      textToEncrypt.value,
      parseInt(shiftLength.value)
    ).result;
  }
});

shiftLength.addEventListener("input", function () {
  CheckShiftLength(shiftLength);
});

textToEncrypt.addEventListener("input", function () {
  CheckTextToAnyLatter(textToEncrypt.value);
});

// And we need to add graphs with time, safety and iterations
// + mb realize AES-GCM encryption and compare with Caesar bt it's built in obj in JS, so idk how to compare with custom algo (await crypto.subtle.encrypt(...))
// + mb add decryption too
// graphs we can draw with chart.js lib (https://www.chartjs.org/docs/latest/getting-started/)