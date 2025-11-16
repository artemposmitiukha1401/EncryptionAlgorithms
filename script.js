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
      await new Promise(r => setTimeout(r, 250));
      rows[code].style.background = "";
      rows[code].style.boxShadow = "";
      
      rows[newCode].style.background = "rgba(0, 255, 0, 0.6)";
      rows[newCode].style.boxShadow = "0 0 10px rgba(0, 255, 0, 0.8)";
      
      const encrypted = String.fromCharCode(newCode + 65);
      result += isUpper ? encrypted : encrypted.toLowerCase();
      document.getElementById("encrypted-text").textContent = result;
      
      await new Promise(r => setTimeout(r, 1000));
      rows[newCode].style.background = "";
      rows[newCode].style.boxShadow = "";    
    } 
    else {
      result += char;
      document.getElementById("encrypted-text").textContent = result;
    }
  }
}

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
  input.style.boxShadow = "0 0 5px 2px rgba(255, 255, 255, 0.8), 0 0 15px 5px rgba(255, 0, 0, 0.6), 0 0 30px 10px rgba(255, 50, 50, 0.4), 0 0 50px 15px rgba(255, 100, 100, 0.2)";
  encryptBtn.disabled = true;
}


function setSuccess(input, label, message) {
  label.style.color = "white";
  label.textContent = message;
  input.style.borderColor = "white";
  input.style.boxShadow = "0 0 5px 2px rgba(255, 255, 255, 0.8), 0 0 15px 5px rgba(138, 43, 226, 0.6), 0 0 30px 10px rgba(0, 191, 255, 0.4), 0 0 50px 15px rgba(0, 150, 255, 0.2)";
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

encryptBtn.addEventListener("click", async function() {
  if (ValidateInput()) {
    encryptBtn.disabled = true;
    document.getElementById("encrypted-text").textContent = "";
    
    await CaesarEncryption(textInput.value, parseInt(shiftInput.value));
    textInput.value = "";    
    encryptBtn.disabled = false;
  }
});


shiftInput.addEventListener("input", ValidateInput);

textInput.addEventListener("input", function() {
  ValidateInput();
  displayText(this.value);
});
shiftInput.addEventListener("input", function() {
  document.getElementById("shift-value").textContent = this.value;
  ValidateInput();
});

