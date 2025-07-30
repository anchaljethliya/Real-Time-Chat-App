import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { subscribeToMessages, markMessagesAsRead } from '../services/firebase';

const MessagesContext = createContext();

export const useMessages = () => {
  return useContext(MessagesContext);
};

export const MessagesProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [messages, setMessages] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!activeChatId || !currentUser) {
      setMessages([]);
      return;
    }

    setLoading(true);
    setError('');

    const unsubscribe = subscribeToMessages(activeChatId, (chatMessages) => {
      setMessages(chatMessages);
      setLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, [activeChatId, currentUser]);

  useEffect(() => {
    if (activeChatId && currentUser) {
      // Mark messages as read when chat is active
      markMessagesAsRead(activeChatId, currentUser.uid).catch(err => {
        console.error('Failed to mark messages as read:', err);
      });
    }
  }, [messages, activeChatId, currentUser]);

  const setActiveChat = (chatId) => {
    setActiveChatId(chatId);
  };

  const value = {
    messages,
    activeChatId,
    loading,
    error,
    setActiveChat
  };

  return (
    <MessagesContext.Provider value={value}>
      {children}
    </MessagesContext.Provider>
  );
};

export default MessagesProvider; 