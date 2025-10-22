import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Header.css';

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          <div className="fufu-bear">
            <div className="bear-head">
              <div className="bear-ear left"></div>
              <div className="bear-ear right"></div>
              <div className="bear-eye-patch left"></div>
              <div className="bear-eye-patch right"></div>
              <div className="bear-eye left"></div>
              <div className="bear-eye right"></div>
              <div className="bear-nose"></div>
              <div className="bear-mouth"></div>
            </div>
          </div>
          <span className="logo-text">RateMySoft</span>
        </Link>
        
        <nav className="nav">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/software" className="nav-link">Software</Link>
          <Link to="/companies" className="nav-link">Companies</Link>
          <Link to="/add-solution" className="nav-link">Add Solution</Link>
        </nav>
        
        <div className="header-actions">
          {isAuthenticated ? (
            <>
              <Link to="/profile" className="btn btn-profile">
                <span className="profile-username">{user?.handle}</span>
                <span className="profile-icon">{user?.handle?.charAt(0).toUpperCase()}</span>
              </Link>
              <button className="btn btn-logout" onClick={handleLogout}>
                Log Out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-secondary">
                Sign In
              </Link>
              <Link to="/register" className="btn btn-primary">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
