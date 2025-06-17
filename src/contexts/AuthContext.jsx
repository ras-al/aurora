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

  // Consolidated login function for both users and admins
  const login = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return true;
    } catch (error) {
      console.error("Error logging in:", error.message);
      let errorMessage = 'Login failed. Please try again.';
      if (error.code === 'auth/invalid-email' || error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found') {
        errorMessage = 'Incorrect email or password.';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Too many failed login attempts. Please try again later.';
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
      if (user) {
        const userDocRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(userDocRef);

        if (docSnap.exists()) {
          const profileData = docSnap.data();
          setCurrentUser(user);
          setUserProfile(profileData);
          setIsAdmin(profileData.role === 'admin');

          const currentPath = window.location.pathname;

          // Define paths that are ONLY for authentication (login/signup)
          const authOnlyPaths = ['/login', '/signup'];
          // Define paths that are "protected" (require login)
          const protectedUserPaths = ['/dashboard', '/register-aurora']; // Add other user-specific protected paths
          const protectedAdminPaths = ['/admin-dashboard']; // Add other admin-specific protected paths

          if (profileData.role === 'admin') {
            // ADMIN REDIRECTION LOGIC
            // If admin is on an auth-only page or not on their admin dashboard, redirect to admin dashboard.
            if (authOnlyPaths.includes(currentPath) || !protectedAdminPaths.includes(currentPath)) {
              navigate('/admin-dashboard');
            }
          } else { // Regular user
            // REGULAR USER REDIRECTION LOGIC
            // If user is on an auth-only page, redirect to dashboard.
            if (authOnlyPaths.includes(currentPath)) {
              navigate('/dashboard');
            }
            // If user is on a protected user path but not /dashboard, make sure they go to /dashboard
            // (This handles cases where they might go to /register-aurora while logged in,
            // but we want to ensure they land on the dashboard if that's the primary authenticated view)
            else if (protectedUserPaths.includes(currentPath) && currentPath !== '/dashboard') {
                navigate('/dashboard');
            }
            // IMPORTANT: No 'else' or 'else if' here to redirect to dashboard for public paths.
            // This allows users to browse /, /events, etc., while logged in.
          }

        } else {
          // User authenticated but no profile: this is an edge case, log them out.
          setCurrentUser(user);
          setUserProfile(null);
          setIsAdmin(false);
          console.warn("User profile not found for UID:", user.uid);
          await signOut(auth);
          navigate('/login'); // Redirect to login
        }
      } else {
        // User is logged out
        setCurrentUser(null);
        setUserProfile(null);
        setIsAdmin(false);

        // Define all paths that require ANY login (user or admin)
        const allProtectedPaths = ['/dashboard', '/admin-dashboard', '/register-aurora']; // Add all other protected paths
        if (allProtectedPaths.includes(window.location.pathname)) {
            navigate('/login'); // Redirect to login if on any protected route while logged out
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
    updateUserProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}