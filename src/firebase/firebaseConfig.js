// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCeJEPUIrk-tyQoOzk5YVEesc_GnLR8FNs",
  authDomain: "blog-app-e4dab.firebaseapp.com",
  projectId: "blog-app-e4dab",
  storageBucket: "blog-app-e4dab.appspot.com",
  messagingSenderId: "770156771827",
  appId: "1:770156771827:web:d3509da9101c8c48a17a86"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);
