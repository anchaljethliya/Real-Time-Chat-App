import React from 'react';

const Home = () => {
  return (
    <div className="home-container">
      <div className="chat-area">
        <div className="chat-messages">
          <p>Welcome to the Chat App!</p>
          <p>Select a contact to start chatting or create a new conversation.</p>
        </div>
      </div>
      <div className="message-input-container">
        <input 
          type="text" 
          placeholder="Type a message..." 
          disabled
          className="message-input" 
        />
        <button disabled className="send-button">Send</button>
      </div>
    </div>
  );
};

export default Home; 