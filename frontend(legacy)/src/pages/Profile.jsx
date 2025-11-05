import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Profile.css';

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) {
    return null;
  }

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-avatar">
            {user.handle.charAt(0).toUpperCase()}
          </div>
          <h1>{user.handle}</h1>
          <p className="profile-email">{user.email}</p>
          {user.role && (
            <span className={`profile-badge ${user.role.toLowerCase()}`}>
              {user.role}
            </span>
          )}
        </div>

        <div className="profile-info">
          <h2>Account Information</h2>
          <div className="info-grid">
            <div className="info-item">
              <label>User ID</label>
              <p>{user.id}</p>
            </div>
            <div className="info-item">
              <label>Email</label>
              <p>{user.email}</p>
            </div>
            <div className="info-item">
              <label>Username</label>
              <p>{user.handle}</p>
            </div>
            <div className="info-item">
              <label>Role</label>
              <p>{user.role || 'User'}</p>
            </div>
          </div>
        </div>

        <div className="profile-actions">
          <button 
            className="btn btn-secondary"
            onClick={() => navigate('/')}
          >
            Back to Home
          </button>
          <button 
            className="btn btn-logout"
            onClick={handleLogout}
          >
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;

