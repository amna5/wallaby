import { initializeApp } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-app.js";
import { getAuth, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyAUG-P0gTKhztGgRyC-hHBgw6sqiZ0dBfI",
  authDomain: "wallaby-48e72.firebaseapp.com",
  projectId: "wallaby-48e72",
  storageBucket: "wallaby-48e72.firebasestorage.app",
  messagingSenderId: "750037641954",
  appId: "1:750037641954:web:12f69b760e66d5ccf74cbb",
  measurementId: "G-MQD0LJ0H3P"
};


const app = initializeApp(firebaseConfig);
export const auth = getAuth(app); //export to be able to use anywhere
export const googleProvider = new GoogleAuthProvider();