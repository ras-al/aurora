// src/contexts/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  auth,
  db,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  sendEmailVerification,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  arrayUnion,
  arrayRemove
} from '../firebase';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Function to register a user
  const register = async (email, password, userData) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await sendEmailVerification(user);
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

  // MODIFIED LOGIN FUNCTION TO ENFORCE EMAIL VERIFICATION
  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      if (!user.emailVerified) {
        // Resend verification email for user convenience
        await sendEmailVerification(user);
        // Sign the unverified user out immediately
        await signOut(auth);
        // Throw a specific error to display on the login page
        throw new Error('Your email is not verified. A new verification email has been sent. Please check your inbox.');
      }
      
      // If email is verified, proceed as normal
      return true;

    } catch (error) {
      console.error("Error logging in:", error.message);
      
      // Pass our custom verification error message directly
      if (error.message.includes('Your email is not verified')) {
        throw error;
      }

      let errorMessage = 'Login failed. Please try again.';
      if (error.code === 'auth/invalid-email' || error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found') {
        errorMessage = 'Incorrect email or password.';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Too many failed login attempts. Please try again later.';
      }
      throw new Error(errorMessage);
    }
  };
  
  // Function to send a password reset email
  const sendPasswordReset = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
      return true;
    } catch (error) {
      console.error("Error sending password reset email:", error.message);
      let errorMessage = 'Failed to send password reset email. Please try again.';
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'No user found with this email address.';
      }
      throw new Error(errorMessage);
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

  // Function to update user profile in Firestore
  const updateUserProfile = async (uid, dataToUpdate) => {
    try {
      const userDocRef = doc(db, 'users', uid);
      await updateDoc(userDocRef, dataToUpdate);
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
      // Only proceed with user setup if their email is verified
      if (user && user.emailVerified) {
        const userDocRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(userDocRef);

        if (docSnap.exists()) {
          const profileData = docSnap.data();
          setCurrentUser(user);
          setUserProfile(profileData);
          setIsAdmin(profileData.role === 'admin');

          const currentPath = window.location.pathname;
          const authOnlyPaths = ['/login', '/signup', '/forgot-password'];
          const protectedAdminPaths = ['/admin-dashboard'];

          if (profileData.role === 'admin') {
            if (authOnlyPaths.includes(currentPath) || !protectedAdminPaths.includes(currentPath)) {
              navigate('/admin-dashboard');
            }
          } else { // Regular user
            if (authOnlyPaths.includes(currentPath)) {
              navigate('/dashboard');
            }
          }

        } else {
          // User authenticated but no profile: this is an edge case, log them out.
          console.warn("User profile not found for UID:", user.uid);
          await signOut(auth);
          navigate('/login');
        }
      } else {
        // User is logged out OR email is not verified
        setCurrentUser(null);
        setUserProfile(null);
        setIsAdmin(false);

        const allProtectedPaths = ['/dashboard', '/admin-dashboard', '/register-aurora'];
        if (allProtectedPaths.includes(window.location.pathname)) {
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
    login,
    logout,
    updateUserProfile,
    sendPasswordReset
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}