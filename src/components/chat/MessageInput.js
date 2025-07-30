import React, { useState } from 'react';
import { sendMessage, setTypingIndicator } from '../../services/firebase';

const MessageInput = ({ chatId, currentUser }) => {
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!message.trim() || !chatId || !currentUser) return;

    try {
      setSending(true);
      await sendMessage(chatId, currentUser.uid, message.trim());
      setMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setSending(false);
    }
  };

  const handleTyping = (e) => {
    const isTyping = e.target.value.length > 0;
    setTypingIndicator(chatId, currentUser?.uid, isTyping);
    setMessage(e.target.value);
  };

  if (!chatId) {
    return (
      <div className="message-input-container">
        <input
          type="text"
          placeholder="Select a contact to start chatting..."
          disabled
          className="message-input"
        />
        <button disabled className="send-button">Send</button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="message-input-container">
      <input
        type="text"
        placeholder="Type a message..."
        value={message}
        onChange={handleTyping}
        disabled={sending}
        className="message-input"
      />
      <button type="submit" disabled={sending || !message.trim()} className="send-button">
        {sending ? 'Sending...' : 'Send'}
      </button>
    </form>
  );
};

export default MessageInput; 