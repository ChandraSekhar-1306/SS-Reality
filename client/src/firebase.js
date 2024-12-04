// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "ss-reality.firebaseapp.com",
  projectId: "ss-reality",
  storageBucket: "ss-reality.firebasestorage.app",
  messagingSenderId: "132565955651",
  appId: import.meta.env.VITE_APP_ID
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);