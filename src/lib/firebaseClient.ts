import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD4aF4jfeAjpZHSDOsnLnnTRvg-w8hNlM4",
  authDomain: "company-eb0bf.firebaseapp.com",
  projectId: "company-eb0bf",
  storageBucket: "company-eb0bf.firebasestorage.app",
  messagingSenderId: "319683778828",
  appId: "1:319683778828:web:31ee57ea3284a033c49129",
  measurementId: "G-LG9HLMXP9F"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export default app;
