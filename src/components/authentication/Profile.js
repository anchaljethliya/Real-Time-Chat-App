import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { currentUser, updateProfile, logout, error } = useAuth();
  const [displayName, setDisplayName] = useState(currentUser?.displayName || '');
  const [loading, setLoading] = useState(false);
  const [updateError, setUpdateError] = useState('');
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const navigate = useNavigate();

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    
    if (!displayName.trim()) {
      return setUpdateError('Display name cannot be empty');
    }
    
    try {
      setUpdateError('');
      setUpdateSuccess(false);
      setLoading(true);
      
      await updateProfile({ displayName });
      setUpdateSuccess(true);
    } catch (err) {
      setUpdateError('Failed to update profile: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      setUpdateError('Failed to log out: ' + err.message);
    }
  };

  if (!currentUser) return <div>Loading...</div>;

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h2>Profile</h2>
        {updateError && <div className="error-message">{updateError}</div>}
        {error && <div className="error-message">{error}</div>}
        {updateSuccess && (
          <div className="success-message">Profile updated successfully!</div>
        )}
        
        <form onSubmit={handleUpdateProfile}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={currentUser.email}
              disabled
              className="input-disabled"
            />
          </div>
          <div className="form-group">
            <label htmlFor="displayName">Display Name</label>
            <input
              type="text"
              id="displayName"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              required
            />
          </div>
          <button type="submit" disabled={loading} className="profile-button">
            {loading ? 'Updating...' : 'Update Profile'}
          </button>
        </form>
        
        <button onClick={handleLogout} className="logout-button">
          Log Out
        </button>
      </div>
    </div>
  );
};

export default Profile; 