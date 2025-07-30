import React, { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Home from '../chat/Home';
import Login from '../authentication/Login';
import SignUp from '../authentication/SignUp';
import Profile from '../authentication/Profile';
import ContactList from '../contacts/ContactList';
import SearchContacts from '../contacts/SearchContacts';
import ChatContainer from '../chat/ChatContainer';
import PrivateRoute from '../authentication/PrivateRoute';

const MainContent = () => {
  const [selectedContact, setSelectedContact] = useState(null);
  const navigate = useNavigate();

  const handleContactSelect = (contact) => {
    setSelectedContact(contact);
    navigate('/');
  };

  return (
    <div className="main-content">
      <Routes>
        <Route 
          path="/" 
          element={
            <PrivateRoute>
              <ChatContainer selectedContact={selectedContact} />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/contacts" 
          element={
            <PrivateRoute>
              <div className="contacts-page">
                <ContactList onContactSelect={handleContactSelect} />
                <SearchContacts />
              </div>
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