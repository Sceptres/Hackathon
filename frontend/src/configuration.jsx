import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDep6pZJB65oCc5qgvlRGoYh-q6MmjbmHE",
  authDomain: "hackathon-1d88e.firebaseapp.com",
  databaseURL: "https://hackathon-1d88e-default-rtdb.firebaseio.com",
  projectId: "hackathon-1d88e",
  storageBucket: "hackathon-1d88e.appspot.com",
  messagingSenderId: "618396293604",
  appId: "1:618396293604:web:3e07051a723fc58ad54ff1",
  measurementId: "G-74MF6QKZK2"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);