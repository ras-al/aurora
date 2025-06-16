// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  doc,
  getDoc,
  query,
  where,
  updateDoc,
  deleteDoc,
  setDoc,
  arrayUnion, // <--- Import arrayUnion here
  arrayRemove // <--- Also good to have for later if you need to remove
} from 'firebase/firestore';

// **IMPORTANT: Replace with your actual Firebase config**
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

export {
  app,
  auth,
  db,
  // Firebase Auth functions
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  // Firebase Firestore functions
  collection,
  addDoc,
  getDocs,
  doc,
  getDoc,
  query,
  where,
  updateDoc,
  deleteDoc,
  setDoc,
  arrayUnion, // <--- Export arrayUnion
  arrayRemove // <--- Export arrayRemove
};