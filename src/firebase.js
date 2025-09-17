// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
// For Firebase JS SDK v9-compat and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB_WQ4muP2JlHGCtY_fO855VAcXDicIPu0",
  authDomain: "mesa-trading-marathone.firebaseapp.com",
  databaseURL: "https://mesa-trading-marathone-default-rtdb.firebaseio.com",
  projectId: "mesa-trading-marathone",
  storageBucket: "mesa-trading-marathone.firebasestorage.app",
  messagingSenderId: "837946078410",
  appId: "1:837946078410:web:8825bdef1e260cfa557033",
  measurementId: "G-XXSEZQR7ZB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export default app;