import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "meal-on-wheels-00.firebaseapp.com",
  projectId: "meal-on-wheels-00",
  storageBucket: "meal-on-wheels-00.firebasestorage.app",
  messagingSenderId: "107417201872",
  appId: "1:107417201872:web:151a2ba24a75b1ae1a82d5",
  measurementId: "G-TSLEETVNP3",
};

// console.log("api key ", import.meta.env.VITE_FIREBASE_API_KEY);

const firebaseApp = initializeApp(firebaseConfig);

export default firebaseApp;
