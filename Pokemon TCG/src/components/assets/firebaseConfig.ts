// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA2WxqlbPgqsSZ4Rm5q8jmlp_v5_wmLPds",
  authDomain: "pokemontcg-42156.firebaseapp.com",
  projectId: "pokemontcg-42156",
  storageBucket: "pokemontcg-42156.firebasestorage.app",
  messagingSenderId: "434119578280",
  appId: "1:434119578280:web:77baf9305219f5b859e89d",
  measurementId: "G-BV8207MTYX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

// Optional: Configure Google provider settings
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

export default app;