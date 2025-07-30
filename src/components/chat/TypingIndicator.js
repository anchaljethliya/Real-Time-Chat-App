import React, { useState, useEffect } from 'react';
import { subscribeToTypingIndicator } from '../../services/firebase';

const TypingIndicator = ({ chatId, currentUser }) => {
  const [typingUsers, setTypingUsers] = useState({});

  useEffect(() => {
    if (!chatId) return;

    const unsubscribe = subscribeToTypingIndicator(chatId, (typingData) => {
      // Filter out current user and users who stopped typing
      const filteredTyping = {};
      Object.keys(typingData).forEach(userId => {
        if (userId !== currentUser?.uid && typingData[userId]) {
          filteredTyping[userId] = typingData[userId];
        }
      });
      setTypingUsers(filteredTyping);
    });

    return () => unsubscribe();
  }, [chatId, currentUser]);

  if (Object.keys(typingUsers).length === 0) {
    return null;
  }

  return (
    <div className="typing-indicator">
      <div className="typing-dots">
        <span></span>
        <span></span>
        <span></span>
      </div>
      <span className="typing-text">Someone is typing...</span>
    </div>
  );
};

export default TypingIndicator; 