const textInput = document.getElementById("text-to-encrypt");
const textLabel = document.getElementById("text-to-encrypt-label");
const shiftInput = document.getElementById("shift-length");
const shiftLabel = document.getElementById("shift-length-label");
const encryptBtn = document.getElementById("encrypt");
const decryptBtn = document.getElementById("decrypt");
const originalTextRow = document.getElementById("original-text-row");
const encryptedText = document.getElementById("encrypted-text");

const textLabelRot13 = document.getElementById("text-to-encrypt-label-rot13");
const textInputRot13 = document.getElementById("text-to-encrypt-rot13");
const encryptBtnRot13 = document.getElementById("encrypt-rot13");
const decryptBtnRot13 = document.getElementById("decrypt-rot13");
const originalTextRowRot13 = document.getElementById("original-text-row-rot13");
const encryptedTextRot13 = document.getElementById("encrypted-text-rot13");
const textToEncryptErrorRot13 = document.getElementById("text-to-encrypt-error-rot13");
const shiftValue = document.getElementById("shift-value");

function ComputeAnalytics(inputText, outputText, durationMs) {
  const totalChars = inputText.length;
  const bytes = totalChars * 2;

  let lettersEncrypted = 0;
  let nonLettersPreserved = 0;
  const freq = {};

  const isLetter = ch => /[a-z]/i.test(ch);


  for (const ch of inputText)
    isLetter(ch) ? lettersEncrypted++ : nonLettersPreserved++;


  for (const ch of outputText) {
    if (!isLetter(ch)) continue;
    const up = ch.toUpperCase();
    freq[up] = (freq[up] || 0) + 1;
  }


  const mostCommonLetters = Object.entries(freq)
    .sort(([, countA], [, countB]) => countB - countA)
    .slice(0, 3);

  const speed = durationMs > 0 ? totalChars / (durationMs / 1000) : 0;

  return {
    durationMs,
    speed,
    totalChars,
    bytes,
    lettersEncrypted,
    nonLettersPreserved,
    mostCommonLetters
  };
}

function PrintAnalytics(inputText, outputText, durationMs) {
  const analyticsStats = ComputeAnalytics(inputText, outputText, durationMs);

  let mc;
  if (!analyticsStats.lettersEncrypted || analyticsStats.mostCommonLetters.length === 0) {
    mc = "Invalid value";
  } else {
    mc = "";
    for (const item of analyticsStats.mostCommonLetters) {
      const letter = item[0];
      const count = item[1];
      const valueToPercentage = (count / analyticsStats.lettersEncrypted) * 100;
      mc += `${letter}: ${count} (${valueToPercentage.toFixed(1)}%)  `;
    }
    mc = mc.trim();
  }

  console.log(
    `• Performance Duration: ${analyticsStats.durationMs.toFixed(2)}ms` +
    ` || Speed: ${Math.round(analyticsStats.speed)} chars/sec | M Data\n` +
    `Metrics Input: ${analyticsStats.totalChars} chars (${analyticsStats.bytes} bytes)` +
    ` | Letters encrypted: ${analyticsStats.lettersEncrypted}` +
    ` | Non-letters preserved: ${analyticsStats.nonLettersPreserved}` +
    ` | Most Common Letters | ${mc}`
  );
}
async function ROT13Encryption(textToEncrypt) {
  let result = "";
  const rows = document.querySelectorAll("#rot13 table tr");

  for (let char of textToEncrypt) {
    if (/[a-z]/i.test(char)) {
      const isUpper = char === char.toUpperCase();
      const code = char.toUpperCase().charCodeAt(0) - 65;
      const newCode = (code + 13) % 26;

      rows[code].style.background = "rgba(255, 0, 0, 0.6)";
      rows[code].style.boxShadow = "0 0 10px rgba(255, 0, 0, 0.8)";
      await new Promise(r => setTimeout(r, 250));
      rows[code].style.background = "";
      rows[code].style.boxShadow = "";

      rows[newCode].style.background = "rgba(0, 255, 0, 0.6)";
      rows[newCode].style.boxShadow = "0 0 10px rgba(0, 255, 0, 0.8)";

      const encrypted = String.fromCharCode(newCode + 65);
      result += isUpper ? encrypted : encrypted.toLowerCase();
      encryptedTextRot13.textContent = result;

      await new Promise(r => setTimeout(r, 1000));
      rows[newCode].style.background = "";
      rows[newCode].style.boxShadow = "";
    } else {
      result += char;
      encryptedTextRot13.textContent = result;
    }
  }
  return result;
}
async function CaesarEncryption(textToEncrypt, shift, encrypt) {
  originalTextRow.innerHTML = '';
  textInput.value = "";
  let result = "";
  const rows = document.querySelectorAll("table tr");
  shift = encrypt ? shift : -shift;


  for (let char of textToEncrypt) {
    if (/[a-z]/i.test(char)) {
      const isUpper = char === char.toUpperCase();
      const code = char.toUpperCase().charCodeAt(0) - 65;
      const newCode = (code + shift + 26) % 26;
      const encrypted = String.fromCharCode(newCode + 65);
      result += isUpper ? encrypted : encrypted.toLowerCase();

      rows[code].style.background = "rgba(255, 0, 0, 0.6)";
      rows[code].style.boxShadow = "0 0 10px rgba(255, 0, 0, 0.8)";
      await new Promise((r) => setTimeout(r, 250));
      rows[code].style.background = "";
      rows[code].style.boxShadow = "";

      rows[newCode].style.background = "rgba(0, 255, 0, 0.6)";
      rows[newCode].style.boxShadow = "0 0 10px rgba(0, 255, 0, 0.8)";
      encryptedText.textContent = result;

      await new Promise((r) => setTimeout(r, 1000));
      rows[newCode].style.background = "";
      rows[newCode].style.boxShadow = "";
    } else {
      result += char;
      encryptedText.textContent = result;
    }
  }
  return result;
}
function ValidateInput(input, label, errorMessage, successMessage) {
  const text = input.value;
  const hasLetters = /[A-Za-z]/.test(text);

  if (!hasLetters) {
    SetError(input, label, errorMessage);
    return false;
  }

  SetSuccess(input, label, successMessage);
  return true;
}
function SetError(input, label, message) {
  label.style.color = "red";
  label.textContent = message;
  input.style.borderColor = "red";
  input.style.boxShadow =
    "0 0 5px 2px rgba(255, 255, 255, 0.8), 0 0 15px 5px rgba(255, 0, 0, 0.6), 0 0 30px 10px rgba(255, 50, 50, 0.4), 0 0 50px 15px rgba(255, 100, 100, 0.2)";

}

function SetSuccess(input, label, message) {
  label.style.color = "white";
  label.textContent = message;
  input.style.borderColor = "white";
  input.style.boxShadow =
    "0 0 5px 2px rgba(255, 255, 255, 0.8), 0 0 15px 5px rgba(138, 43, 226, 0.6), 0 0 30px 10px rgba(0, 191, 255, 0.4), 0 0 50px 15px rgba(0, 150, 255, 0.2)";

}
function DisplayText(text, container) {
  container.innerHTML = "";
  for (let char of text) {
    const p = document.createElement("p");
    p.textContent = char === " " ? "␣" : char;
    container.appendChild(p);
  }
}
encryptBtn.addEventListener("click", async function () {
  const inputText = textInput.value;
  const shift = parseInt(shiftInput.value);

  const start = performance.now();
  const result = await CaesarEncryption(inputText, shift, true);
  const end = performance.now();

  PrintAnalytics(inputText, result, end - start);

  originalTextRow.innerHTML = '';
  textInput.value = "";
});
decryptBtn.addEventListener("click", async function () {
  const inputText = textInput.value;
  const shift = parseInt(shiftInput.value);

  const start = performance.now();
  const result = await CaesarEncryption(inputText, shift, false);
  const end = performance.now();

  PrintAnalytics(inputText, result, end - start);

  originalTextRow.innerHTML = '';
  textInput.value = "";
});

textInput.addEventListener("input", function () {
  if (!ValidateInput(textInput, textLabel, "Text must have some letters!", "Enter text to encrypt:")) {
    encryptBtn.disabled = true;
    decryptBtn.disabled = true;
  }
  else {
    encryptBtn.disabled = false;
    decryptBtn.disabled = false;
  }
  DisplayText(this.value, originalTextRow);
});
document.querySelectorAll("input[type='text']").forEach(input => {
  input.addEventListener("focus", function () {
    this.style.boxShadow = `
      0 0 5px 2px rgba(255, 255, 255, 0.8),
      0 0 15px 5px rgba(138, 43, 226, 0.6),
      0 0 30px 10px rgba(0, 191, 255, 0.4),
      0 0 50px 15px rgba(0, 150, 255, 0.2)`;
    this.style.outline = "none";
  });

  input.addEventListener("blur", function () {
    this.style.boxShadow = "none";
    this.style.outline = "none";
  });
});


shiftInput.addEventListener("input", function () {
  shiftValue.textContent = this.value;
});
encryptBtnRot13.addEventListener("click", async function () {
  const inputText = textInputRot13.value;

  const start = performance.now();
  const result = await ROT13Encryption(inputText);
  const end = performance.now();

  PrintAnalytics(inputText, result, end - start);

  textInputRot13.value = "";
  originalTextRowRot13.innerHTML = "";
});

decryptBtnRot13.addEventListener("click", async function () {
  const inputText = textInputRot13.value;

  const start = performance.now();
  const result = await ROT13Encryption(inputText);
  const end = performance.now();

  PrintAnalytics(inputText, result, end - start);

  textInputRot13.value = "";
  originalTextRowRot13.innerHTML = "";
});

textInputRot13.addEventListener("input", function () {
  if (!ValidateInput(textInputRot13, textLabelRot13, "Text must have some letters!", "Enter text to encrypt:")) {
    encryptBtnRot13.disabled = true;
    decryptBtnRot13.disabled = true;
  }
  else {
    encryptBtnRot13.disabled = false;
    decryptBtnRot13.disabled = false;
  }

  DisplayText(this.value, originalTextRowRot13);
});