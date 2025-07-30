import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { searchUsers, addContact } from '../../services/firebase';

const SearchContacts = () => {
  const { currentUser } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (searchTerm.length < 2) {
      setSearchResults([]);
      return;
    }

    const searchUsers = async () => {
      try {
        setLoading(true);
        setError('');
        const results = await searchUsers(searchTerm);
        // Filter out current user and already added contacts
        const filteredResults = results.filter(user => 
          user.id !== currentUser?.uid
        );
        setSearchResults(filteredResults);
      } catch (err) {
        setError('Search failed: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(searchUsers, 500);
    return () => clearTimeout(timeoutId);
  }, [searchTerm, currentUser]);

  const handleAddContact = async (userId) => {
    try {
      setError('');
      setSuccess('');
      await addContact(currentUser.uid, userId);
      setSuccess('Contact added successfully!');
      // Remove from search results
      setSearchResults(prev => prev.filter(user => user.id !== userId));
    } catch (err) {
      setError('Failed to add contact: ' + err.message);
    }
  };

  return (
    <div className="search-contacts">
      <h3>Search Users</h3>
      <div className="search-input-container">
        <input
          type="text"
          placeholder="Search by display name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        {loading && <div className="search-loading">Searching...</div>}
      </div>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      {searchResults.length > 0 && (
        <div className="search-results">
          <h4>Search Results ({searchResults.length})</h4>
          <div className="results-grid">
            {searchResults.map(user => (
              <div key={user.id} className="search-result-item">
                <div className="user-avatar">
                  <span>{user.displayName?.charAt(0) || 'U'}</span>
                </div>
                <div className="user-info">
                  <h5>{user.displayName || 'Unknown User'}</h5>
                  <p>{user.email}</p>
                </div>
                <button
                  onClick={() => handleAddContact(user.id)}
                  className="add-contact-btn"
                >
                  Add Contact
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {searchTerm.length > 0 && searchResults.length === 0 && !loading && (
        <p className="no-results">No users found matching "{searchTerm}"</p>
      )}
    </div>
  );
};

export default SearchContacts; 