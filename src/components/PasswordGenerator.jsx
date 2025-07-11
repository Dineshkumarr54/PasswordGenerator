import React, { useState } from "react";
import { db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import CryptoJS from "crypto-js";

const PasswordGenerator = ({ user }) => {
  const [length, setLength] = useState(12);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [password, setPassword] = useState("");
  const [hint, setHint] = useState("");

  const generatePassword = () => {
    const lower = "abcdefghijklmnopqrstuvwxyz";
    const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numbers = "0123456789";
    const symbols = "!@#$%^&*()_+-=[]{}|;:,.<>?";

    let characters = lower;
    if (includeUppercase) characters += upper;
    if (includeNumbers) characters += numbers;
    if (includeSymbols) characters += symbols;

    let generated = "";
    for (let i = 0; i < length; i++) {
      generated += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    setPassword(generated);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(password);
    alert("Password copied to clipboard!");
  };

  const saveToFirebase = async () => {
    if (!password || !hint) {
      alert("Please generate a password and enter a hint.");
      return;
    }

    try {
      const encryptedPassword = CryptoJS.AES.encrypt(password, "secret-key").toString();

      await addDoc(collection(db, "passwords"), {
        uid: user.uid,
        hint,
        password: encryptedPassword,
        createdAt: serverTimestamp(),
      });

      alert("Password saved to Firebase!");
      setHint("");
      setPassword("");
    } catch (err) {
      console.error("Error saving password:", err);
      alert("Error saving password.");
    }
  };

  return (
  <div className="card">
    <h2>🔐 Password Generator</h2>

    <label>Password Length: {length}</label>
    <input
      type="range"
      min="8"
      max="32"
      value={length}
      onChange={(e) => setLength(Number(e.target.value))}
    />

    <label>
      <input type="checkbox" checked={includeUppercase} onChange={() => setIncludeUppercase(!includeUppercase)} />
      Include Uppercase
    </label><br />

    <label>
      <input type="checkbox" checked={includeNumbers} onChange={() => setIncludeNumbers(!includeNumbers)} />
      Include Numbers
    </label><br />

    <label>
      <input type="checkbox" checked={includeSymbols} onChange={() => setIncludeSymbols(!includeSymbols)} />
      Include Symbols
    </label>

    <button onClick={generatePassword}>Generate Password</button>

    {password && (
      <>
        <input value={password} readOnly />
        <button onClick={copyToClipboard}>📋 Copy</button>
        <input
          type="text"
          placeholder="Enter a hint (e.g., Gmail)"
          value={hint}
          onChange={(e) => setHint(e.target.value)}
        />
        <button onClick={saveToFirebase}>💾 Save Password</button>
      </>
    )}
  </div>
);
};

export default PasswordGenerator;
