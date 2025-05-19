import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

// A wrapper component for routes that should only be accessible to authenticated users
const PrivateRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();

  // Show loading state if authentication is still being checked
  if (loading) {
    return <div className="loading-container">Loading...</div>;
  }

  // Redirect to login if user is not authenticated
  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  // Render the protected content if user is authenticated
  return children;
};

export default PrivateRoute; 