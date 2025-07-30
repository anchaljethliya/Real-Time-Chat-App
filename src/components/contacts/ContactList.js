import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getUserContacts, subscribeToUserStatus } from '../../services/firebase';

const ContactList = ({ onContactSelect }) => {
  const { currentUser } = useAuth();
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!currentUser) return;

    const loadContacts = async () => {
      try {
        setLoading(true);
        const userContacts = await getUserContacts(currentUser.uid);
        setContacts(userContacts);
      } catch (err) {
        setError('Failed to load contacts: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    loadContacts();
  }, [currentUser]);

  useEffect(() => {
    // Subscribe to online status for each contact
    const unsubscribers = contacts.map(contact => 
      subscribeToUserStatus(contact.id, (updatedContact) => {
        setContacts(prev => 
          prev.map(c => 
            c.id === updatedContact.id ? { ...c, ...updatedContact } : c
          )
        );
      })
    );

    return () => {
      unsubscribers.forEach(unsub => unsub());
    };
  }, [contacts]);

  const handleContactClick = (contact) => {
    if (onContactSelect) {
      onContactSelect(contact);
    }
  };

  if (loading) {
    return <div className="loading-container">Loading contacts...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="contact-list">
      <h3>Contacts ({contacts.length})</h3>
      {contacts.length === 0 ? (
        <p className="no-contacts">No contacts found. Add some friends to start chatting!</p>
      ) : (
        <div className="contacts-grid">
          {contacts.map(contact => (
            <div 
              key={contact.id} 
              className="contact-item"
              onClick={() => handleContactClick(contact)}
            >
              <div className="contact-avatar">
                <span>{contact.displayName?.charAt(0) || 'U'}</span>
                <div className={`status-indicator ${contact.isOnline ? 'online' : 'offline'}`}></div>
              </div>
              <div className="contact-info">
                <h4>{contact.displayName || 'Unknown User'}</h4>
                <p className="contact-status">
                  {contact.isOnline ? 'Online' : 'Offline'}
                </p>
                {contact.lastSeen && (
                  <p className="last-seen">
                    Last seen: {new Date(contact.lastSeen?.toDate()).toLocaleString()}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ContactList; 