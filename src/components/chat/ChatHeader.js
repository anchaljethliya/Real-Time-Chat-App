import React from 'react';

const ChatHeader = ({ contact }) => {
  if (!contact) return null;

  return (
    <div className="chat-header">
      <div className="contact-info">
        <div className="contact-avatar">
          <span>{contact.displayName?.charAt(0) || 'U'}</span>
          <div className={`status-indicator ${contact.isOnline ? 'online' : 'offline'}`}></div>
        </div>
        <div className="contact-details">
          <h3>{contact.displayName || 'Unknown User'}</h3>
          <p className="contact-status">
            {contact.isOnline ? 'Online' : 'Offline'}
            {contact.lastSeen && !contact.isOnline && (
              <span> • Last seen {new Date(contact.lastSeen?.toDate()).toLocaleString()}</span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader; 