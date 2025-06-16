// src/contexts/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Make sure useNavigate is imported if used here

import {
  auth,
  db,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  doc, // <--- Ensure doc is imported
  getDoc,
  setDoc,
  updateDoc // <--- NEW: Import updateDoc here
} from '../firebase'; // Import Firebase functions and db instance

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // Initialize useNavigate here

  // Function to register a user
  const register = async (email, password, userData) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const userDocRef = doc(db, 'users', user.uid);
      await setDoc(userDocRef, {
        email: user.email,
        name: userData.name || '',
        phone: userData.phone || '',
        college: userData.college || '',
        isIEEE: userData.isIEEE || false,
        memberId: userData.memberId || '',
        createdAt: new Date(),
        role: 'user', // Default role for new users
        registeredEvents: [] // Initialize empty array for registered events
      });
      setCurrentUser(user);
      setUserProfile({
        email: user.email,
        name: userData.name || '',
        phone: userData.phone || '',
        college: userData.college || '',
        isIEEE: userData.isIEEE || false,
        memberId: userData.memberId || '',
        role: 'user',
        registeredEvents: []
      });
      return true;
    } catch (error) {
      console.error("Error registering user:", error.message);
      throw error;
    }
  };

  // Function to login a user
  const login = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return true;
    } catch (error) {
      console.error("Error logging in:", error.message);
      throw error;
    }
  };

  // Function to logout a user
  const logout = async () => {
    try {
      await signOut(auth);
      setCurrentUser(null);
      setUserProfile(null);
      setIsAdmin(false);
      navigate('/'); // Redirect to homepage after logout
      return true;
    } catch (error) {
      console.error("Error logging out:", error.message);
      throw error;
    }
  };

  // Function to handle admin login specifically
  const adminLogin = async (email, password) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        const userDocRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(userDocRef);

        if (docSnap.exists() && docSnap.data().role === 'admin') {
            setCurrentUser(user);
            setUserProfile(docSnap.data());
            setIsAdmin(true);
            return true;
        } else {
            // If not admin, sign out immediately to prevent unauthorized access
            await signOut(auth);
            throw new Error('Unauthorized access. Not an admin user.');
        }
    } catch (error) {
        console.error("Error during admin login:", error.message);
        throw error;
    }
  };

  // Function to update user profile in Firestore
  // This is the function called when registering for individual events
  const updateUserProfile = async (uid, dataToUpdate) => {
    try {
      const userDocRef = doc(db, 'users', uid);
      await updateDoc(userDocRef, dataToUpdate); // <--- updateDoc is now defined
      // After successful update, re-fetch or update local userProfile state
      const updatedDocSnap = await getDoc(userDocRef);
      if (updatedDocSnap.exists()) {
        setUserProfile(updatedDocSnap.data());
      }
      return true;
    } catch (error) {
      console.error("Failed to update user profile:", error.message);
      throw error;
    }
  };


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        // Fetch user profile from Firestore
        const userDocRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(userDocRef);
        if (docSnap.exists()) {
          setUserProfile(docSnap.data());
          setIsAdmin(docSnap.data().role === 'admin');
        } else {
          // If user exists in Auth but not Firestore (e.g., deleted manually),
          // ensure userProfile and isAdmin are reset
          setUserProfile(null);
          setIsAdmin(false);
          console.warn("User profile not found for UID:", user.uid);
        }
      } else {
        setUserProfile(null);
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return unsubscribe; // Cleanup subscription on unmount
  }, []);

  const value = {
    currentUser,
    userProfile,
    isAdmin,
    register,
    login,
    logout,
    adminLogin,
    updateUserProfile // Provide updateUserProfile in the context
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}