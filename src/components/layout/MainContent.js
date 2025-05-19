import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../chat/Home';
import Login from '../authentication/Login';
import SignUp from '../authentication/SignUp';
import Profile from '../authentication/Profile';
import PrivateRoute from '../authentication/PrivateRoute';

const MainContent = () => {
  return (
    <div className="main-content">
      <Routes>
        <Route 
          path="/" 
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/contacts" 
          element={
            <PrivateRoute>
              <div>Contacts Page</div>
            </PrivateRoute>
          } 
        />
        <Route 
          path="/profile" 
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          } 
        />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </div>
  );
};

export default MainContent; 