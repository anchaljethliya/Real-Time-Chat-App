import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  signUpUser, 
  signInUser, 
  signOutUser, 
  subscribeToAuthChanges,
  updateUserProfile,
  auth 
} from '../services/firebase';

// Create the Auth Context
const AuthContext = createContext();

// Custom hook to use the Auth Context
export const useAuth = () => {
  return useContext(AuthContext);
};

// Provider component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    console.log("Setting up auth state listener...");
    // Subscribe to auth state changes
    const unsubscribe = subscribeToAuthChanges((user) => {
      console.log("Auth state changed:", user ? "User is signed in" : "No user");
      setCurrentUser(user);
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return unsubscribe;
  }, []);

  // Sign up function
  const signup = async (email, password, displayName) => {
    setError('');
    try {
      console.log("Attempting to sign up user:", email);
      return await signUpUser(email, password, displayName);
    } catch (error) {
      console.error("Sign up error:", error.code, error.message);
      setError(`Sign up failed: ${error.message}`);
      throw error;
    }
  };

  // Log in function
  const login = async (email, password) => {
    setError('');
    try {
      console.log("Attempting to log in user:", email);
      return await signInUser(email, password);
    } catch (error) {
      console.error("Login error:", error.code, error.message);
      setError(`Login failed: ${error.message}`);
      throw error;
    }
  };

  // Log out function
  const logout = async () => {
    setError('');
    try {
      console.log("Attempting to log out user");
      await signOutUser();
    } catch (error) {
      console.error("Logout error:", error.code, error.message);
      setError(`Logout failed: ${error.message}`);
      throw error;
    }
  };

  // Update profile function
  const updateProfile = async (data) => {
    setError('');
    try {
      if (!currentUser) {
        console.error("No user is logged in");
        throw new Error('No user is logged in');
      }
      console.log("Updating profile for user:", currentUser.uid);
      await updateUserProfile(currentUser.uid, data);
    } catch (error) {
      console.error("Update profile error:", error.code, error.message);
      setError(`Profile update failed: ${error.message}`);
      throw error;
    }
  };

  const value = {
    currentUser,
    signup,
    login,
    logout,
    updateProfile,
    loading,
    error
  };

  return (
    <AuthContext.Provider value={value}>
      {loading ? (
        <div className="loading-container">
          <p>Loading authentication...</p>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};

export default AuthProvider; 