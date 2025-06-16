// src/contexts/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // This will now be in context

import {
  auth,
  db,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  arrayUnion,
  arrayRemove // Make sure this is imported if you use it
} from '../firebase'; // Import Firebase services and functions from your configured firebase.js

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // This line now works because AuthProvider is inside BrowserRouter

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
        role: 'user', // Default role for new users is 'user'
        registeredEvents: []
      });
      // setCurrentUser and setUserProfile will be handled by the onAuthStateChanged listener
      // Redirection for new users to dashboard is also handled by onAuthStateChanged listener
      return true;
    } catch (error) {
      console.error("Error registering user:", error.message);
      let errorMessage = 'Failed to register. Please try again.';
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'This email is already registered. Try logging in.';
      }
      throw new Error(errorMessage);
    }
  };

  // MODIFIED: Consolidated login function for both users and admins
  const login = async (email, password) => {
    try {
      // Authenticate with Firebase Auth
      await signInWithEmailAndPassword(auth, email, password);
      // The onAuthStateChanged listener (in the useEffect below) will now:
      // 1. Fetch the user's profile from Firestore
      // 2. Determine their 'isAdmin' status based on their Firestore 'role'
      // 3. Handle redirection to the appropriate dashboard ('/dashboard' or '/admin-dashboard')
      return true; // Indicate successful authentication, further logic handled by useEffect
    } catch (error) {
      console.error("Error logging in:", error.message);
      let errorMessage = 'Login failed. Please try again.';
      if (error.code === 'auth/invalid-email' || error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found') {
        errorMessage = 'Incorrect email or password.';
      } else if (error.code === 'auth/too-many-requests') {
          errorMessage = 'Too many failed login attempts. Please try again later.';
      }
      throw new Error(errorMessage); // Throw a user-friendly error message
    }
  };

  // Function to logout a user
  const logout = async () => {
    try {
      await signOut(auth);
      // Reset all user-related states
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

  // Function to update user profile in Firestore
  const updateUserProfile = async (uid, dataToUpdate) => {
    try {
      const userDocRef = doc(db, 'users', uid);
      await updateDoc(userDocRef, dataToUpdate);
      // After successful update, re-fetch or update local userProfile state to ensure UI reflects changes
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
      if (user) {
        const userDocRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(userDocRef);

        if (docSnap.exists()) {
          const profileData = docSnap.data();
          setCurrentUser(user);
          setUserProfile(profileData);
          setIsAdmin(profileData.role === 'admin');

          const currentPath = window.location.pathname;
          // Only navigate if not already on the correct dashboard or coming from login/signup
          if (profileData.role === 'admin' && currentPath !== '/admin-dashboard') {
            navigate('/admin-dashboard');
          } else if (profileData.role === 'user' && currentPath !== '/dashboard' && currentPath !== '/login' && currentPath !== '/signup') {
            navigate('/dashboard');
          }
        } else {
          // User authenticated but no profile: create one or log out
          setCurrentUser(user);
          setUserProfile(null);
          setIsAdmin(false);
          console.warn("User profile not found for UID:", user.uid);
          // Forcing logout or redirection to a profile creation page is advisable
          await signOut(auth); // Log them out if no profile
          navigate('/login');
        }
      } else {
        // User is logged out
        setCurrentUser(null);
        setUserProfile(null);
        setIsAdmin(false);
        // Redirect to login if on a protected route while logged out
        if (['/dashboard', '/admin-dashboard', '/register-aurora'].includes(window.location.pathname)) {
            navigate('/login');
        }
      }
      setLoading(false);
    });

    return unsubscribe;
  }, [navigate]);

  const value = {
    currentUser,
    userProfile,
    isAdmin,
    loading,
    register,
    login, // This is the single login function
    logout,
    updateUserProfile
    // adminLogin is no longer exposed from here
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}