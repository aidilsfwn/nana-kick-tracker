import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCYx7KirX52EuzxIEI7z4JsG-rkPeblEjM",
  authDomain: "nana-kick-tracker.firebaseapp.com",
  projectId: "nana-kick-tracker",
  storageBucket: "nana-kick-tracker.firebasestorage.app",
  messagingSenderId: "802858568941",
  appId: "1:802858568941:web:e378fbf344cda6af6fd0e4",
  measurementId: "G-ECYQ9TNSMW",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
