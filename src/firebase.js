// src/firebase.js
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  arrayUnion,
  arrayRemove,
  query,
  where,
  getDocs,           // Ensure getDocs is imported from firestore
  addDoc,            // Ensure addDoc is imported from firestore
  serverTimestamp    // Ensure serverTimestamp is imported from firestore
} from 'firebase/firestore'; // Make sure all Firestore functions come from 'firebase/firestore'

// Your Firebase configuration (REPLACE WITH YOUR ACTUAL CONFIG)
const firebaseConfig = {
  apiKey: "AIzaSyA_ltOHuACtL_uAkfAuzPOnEdbfC1QSabw",
  authDomain: "aurora-f8685.firebaseapp.com",
  projectId: "aurora-f8685",
  storageBucket: "aurora-f8685.firebasestorage.app",
  messagingSenderId: "629475411215",
  appId: "1:629475411215:web:ca88f00136e3fc2d1a2a7a",
  measurementId: "G-TY8F5T22MS"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Export all the Firebase services and functions you intend to use in other files.
// This is how they become available for import from '../firebase'.
export {
  auth,
  db,
  // Auth Functions
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  // Firestore Functions
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  arrayUnion,
  arrayRemove,
  query,
  where,
  getDocs,           // Export getDocs
  addDoc,            // Export addDoc
  serverTimestamp    // Export serverTimestamp
};