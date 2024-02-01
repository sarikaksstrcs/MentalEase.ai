// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyACnrypxlgfR-fYSmKM1_Od4rzg1_NET1M",
  authDomain: "mentalease-4341c.firebaseapp.com",
  projectId: "mentalease-4341c",
  storageBucket: "mentalease-4341c.appspot.com",
  messagingSenderId: "728776911113",
  appId: "1:728776911113:web:277dda6d444addc0d78bd8",
  measurementId: "G-3BW8DXPN9V"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
