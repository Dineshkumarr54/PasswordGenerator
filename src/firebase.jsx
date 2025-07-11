import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCeeqsu7U7vIRhPoHlnX1NWub5V8ZJziRs",
  authDomain: "password-generator-19343.firebaseapp.com",
  projectId: "password-generator-19343",
  storageBucket: "password-generator-19343.firebasestorage.app",
  messagingSenderId: "99356209742",
  appId: "1:99356209742:web:eaafb61f148cd818b5491f"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
