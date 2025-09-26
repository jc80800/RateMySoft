import { Link } from 'react-router-dom';
import './Header.css';

const Header = () => {
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
          <Link to="/categories" className="nav-link">Categories</Link>
          <Link to="/reviews" className="nav-link">Reviews</Link>
        </nav>
        
        <div className="header-actions">
          <button className="btn btn-primary">Sign In</button>
        </div>
      </div>
    </header>
  );
};

export default Header;
