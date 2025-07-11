import React, { useState, useEffect } from "react";
import Login from "./components/Login";
import PasswordGenerator from "./components/passwordGenerator";
import SavedPasswords from "./components/SavedPasswords";
import "./index.css"; // or App.css

function App() {
  const [user, setUser] = useState(null);
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    document.body.className = darkMode ? "dark" : "light";
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  return (
    <div>
      <div style={{ position: "fixed", top: 10, right: 20 }}>
        <button onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? "🌞 Light Mode" : "🌙 Dark Mode"}
        </button>
      </div>

      {!user ? (
        <Login setUser={setUser} />
      ) : (
        <>
          <div style={{ textAlign: "center", marginTop: "50px" }}>
            <h2>Welcome, {user.name} 👋</h2>
            <img src={user.photo} alt="Profile" style={{ borderRadius: "50%", width: "60px" }} />
            <p>{user.email}</p>
          </div>

          <PasswordGenerator user={user} />
          <SavedPasswords user={user} />
        </>
      )}
    </div>
  );
}

export default App;
