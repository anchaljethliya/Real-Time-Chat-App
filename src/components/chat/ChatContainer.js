import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import ChatHeader from './ChatHeader';
import TypingIndicator from './TypingIndicator';
import { createOrGetChat, subscribeToMessages } from '../../services/firebase';

const ChatContainer = ({ selectedContact }) => {
  const { currentUser } = useAuth();
  const [messages, setMessages] = useState([]);
  const [chatId, setChatId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!selectedContact || !currentUser) {
      setMessages([]);
      setChatId(null);
      return;
    }

    const initializeChat = async () => {
      try {
        setLoading(true);
        setError('');
        
        // Create or get chat between current user and selected contact
        const newChatId = await createOrGetChat([currentUser.uid, selectedContact.id]);
        setChatId(newChatId);
        
        // Subscribe to messages in this chat
        const unsubscribe = subscribeToMessages(newChatId, (chatMessages) => {
          setMessages(chatMessages);
        });

        return unsubscribe;
      } catch (err) {
        setError('Failed to load chat: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    const unsubscribe = initializeChat();
    return () => {
      if (unsubscribe) {
        unsubscribe.then(unsub => unsub());
      }
    };
  }, [selectedContact, currentUser]);

  if (!selectedContact) {
    return (
      <div className="chat-container">
        <div className="no-chat-selected">
          <h3>Welcome to Chat App</h3>
          <p>Select a contact from the sidebar to start chatting!</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="chat-container">
        <div className="loading-container">
          <p>Loading chat...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="chat-container">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="chat-container">
      <ChatHeader contact={selectedContact} />
      <MessageList messages={messages} currentUser={currentUser} />
      <TypingIndicator chatId={chatId} currentUser={currentUser} />
      <MessageInput chatId={chatId} currentUser={currentUser} />
    </div>
  );
};

export default ChatContainer; 