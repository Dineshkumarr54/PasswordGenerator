import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
  deleteDoc,
  doc,
  orderBy,
} from "firebase/firestore";
import CryptoJS from "crypto-js";

const SavedPasswords = ({ user }) => {
  const [saved, setSaved] = useState([]);

  useEffect(() => {
    const q = query(
      collection(db, "passwords"),
      where("uid", "==", user.uid),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setSaved(data);
    });

    return () => unsubscribe();
  }, [user.uid]);

  const decryptPassword = (encrypted) => {
    const bytes = CryptoJS.AES.decrypt(encrypted, "secret-key");
    return bytes.toString(CryptoJS.enc.Utf8);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert("Password copied!");
  };

  const deletePassword = async (id) => {
    if (window.confirm("Delete this password?")) {
      await deleteDoc(doc(db, "passwords", id));
    }
  };

return (
  <div style={{ marginTop: "3rem" }}>
    <h3 style={{ textAlign: "center" }}>🔒 Your Saved Passwords</h3>
    {saved.length === 0 && <p style={{ textAlign: "center" }}>No passwords saved yet.</p>}

    {saved.map((item) => {
      const decrypted = decryptPassword(item.password);
      return (
        <div key={item.id} className="card">
          <strong>Hint:</strong> {item.hint}<br />
          <strong>Password:</strong> {decrypted}<br />
          <button onClick={() => copyToClipboard(decrypted)}>📋 Copy</button>
          <button className="danger" onClick={() => deletePassword(item.id)}>❌ Delete</button>
        </div>
      );
    })}
  </div>
);
};

export default SavedPasswords;
