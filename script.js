async function ROT13Encryption(textToEncrypt, encrypt) {
  let result = "";
  const rows = document.querySelectorAll("#rot13 table tr");
  
  for (let char of textToEncrypt) {
    if (/[a-z]/i.test(char)) {
      const isUpper = char === char.toUpperCase();
      const code = char.toUpperCase().charCodeAt(0) - 65; // 0-25
      const newCode = (code + 13) % 26; // ROT13 always shifts by 13
      
      // Highlight original letter (red)
      rows[code].style.background = "rgba(255, 0, 0, 0.6)";
      rows[code].style.boxShadow = "0 0 10px rgba(255, 0, 0, 0.8)";
      await new Promise(r => setTimeout(r, 250));
      rows[code].style.background = "";
      rows[code].style.boxShadow = "";
      
      // Highlight encrypted letter (green)
      rows[newCode].style.background = "rgba(0, 255, 0, 0.6)";
      rows[newCode].style.boxShadow = "0 0 10px rgba(0, 255, 0, 0.8)";
      
      const encrypted = String.fromCharCode(newCode + 65);
      result += isUpper ? encrypted : encrypted.toLowerCase();
      document.getElementById("encrypted-text-rot13").textContent = result;
      
      await new Promise(r => setTimeout(r, 1000));
      rows[newCode].style.background = "";
      rows[newCode].style.boxShadow = "";
    } else {
      result += char;
      document.getElementById("encrypted-text-rot13").textContent = result;
    }
  }
}

async function CaesarEncryption(textToEncrypt, shift, encrypt) {
  let result = "";
  const rows = document.querySelectorAll("table tr");
  shift = encrypt ? shift : -shift;
  
  
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
  
  setSuccess(textInput, textLabel, "Enter text to encrypt:");
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

function displayTextRot13(text) {
  originalTextRowRot13.innerHTML = "";
  for (let char of text) {
    const p = document.createElement("p");
    p.textContent = char === " " ? "␣" : char;
    originalTextRowRot13.appendChild(p);
  }
}


const textInput = document.getElementById("text-to-encrypt");
const textLabel = document.getElementById("text-to-encrypt-label");
const shiftInput = document.getElementById("shift-length");
const shiftLabel = document.getElementById("shift-length-label");
const encryptBtn = document.getElementById("encrypt");
const decryptBtn = document.getElementById("decrypt");
const originalTextRow = document.getElementById("original-text-row");

const originalTextRowRot13 = document.getElementById("original-text-row-rot13");

encryptBtn.addEventListener("click", async function() {
  if (ValidateInput()) {
    encryptBtn.disabled = true;
    
    await CaesarEncryption(textInput.value, parseInt(shiftInput.value), true);
    document.getElementById("original-text-row").innerHTML = '';
    textInput.value = "";    
    encryptBtn.disabled = false;
  }
});

decryptBtn.addEventListener("click", async function() {
  if (ValidateInput()) {
    decryptBtn.disabled = true;

    await CaesarEncryption(textInput.value, parseInt(shiftInput.value), false);
    document.getElementById("original-text-row").innerHTML = '';
    textInput.value = "";    
    encryptBtn.disabled = false;
  }
});

textInput.addEventListener("input", function() {
  ValidateInput();
  displayText(this.value);
});
shiftInput.addEventListener("input", function() {
  document.getElementById("shift-value").textContent = this.value;
  ValidateInput();
});



document.getElementById("encrypt-rot13").addEventListener("click", () => {
  const text = document.getElementById("text-to-encrypt-rot13").value;
  if (text.trim() === "") {
    document.getElementById("text-to-encrypt-error-rot13").textContent = "Please enter text";
    return;
  }
  document.getElementById("encrypted-text-rot13").textContent = "";
  ROT13Encryption(text, true);
});

document.getElementById("decrypt-rot13").addEventListener("click", () => {
  const text = document.getElementById("encrypted-text-rot13").textContent;
  if (text.trim() === "") {
    document.getElementById("text-to-encrypt-error-rot13").textContent = "No encrypted text to decrypt";
    return;
  }
  document.getElementById("encrypted-text-rot13").textContent = "";
  ROT13Encryption(text, true); 
});

document.getElementById("text-to-encrypt-rot13").addEventListener("input", function() {
  displayTextRot13(this.value);
});