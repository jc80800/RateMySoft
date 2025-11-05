import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Main Footer Content */}
        <div className="footer-main">
          <div className="footer-brand">
            <div className="footer-logo">
              <div className="footer-fufu">
                <div className="footer-bear-head">
                  <div className="footer-bear-ear left"></div>
                  <div className="footer-bear-ear right"></div>
                  <div className="footer-bear-eye-patch left"></div>
                  <div className="footer-bear-eye-patch right"></div>
                  <div className="footer-bear-eye left"></div>
                  <div className="footer-bear-eye right"></div>
                  <div className="footer-bear-nose"></div>
                  <div className="footer-bear-mouth"></div>
                </div>
              </div>
              <span className="footer-logo-text">RateMySoft</span>
            </div>
            <p className="footer-tagline">
              Finding the perfect software solutions with Fufu's help! 🐼✨
            </p>
            <div className="footer-social">
              <a href="#" className="social-link" aria-label="Twitter">
                <span className="social-icon">🐦</span>
              </a>
              <a href="#" className="social-link" aria-label="GitHub">
                <span className="social-icon">🐙</span>
              </a>
              <a href="#" className="social-link" aria-label="Discord">
                <span className="social-icon">💬</span>
              </a>
              <a href="#" className="social-link" aria-label="Email">
                <span className="social-icon">📧</span>
              </a>
            </div>
          </div>

          <div className="footer-links">
            <div className="footer-column">
              <h3 className="footer-title">Explore</h3>
              <ul className="footer-list">
                <li><Link to="/software" className="footer-link">All Software</Link></li>
                <li><Link to="/categories" className="footer-link">Categories</Link></li>
                <li><Link to="/reviews" className="footer-link">Latest Reviews</Link></li>
                <li><Link to="/trending" className="footer-link">Trending</Link></li>
              </ul>
            </div>

            <div className="footer-column">
              <h3 className="footer-title">Community</h3>
              <ul className="footer-list">
                <li><Link to="/write-review" className="footer-link">Write a Review</Link></li>
                <li><Link to="/community" className="footer-link">Community Guidelines</Link></li>
                <li><Link to="/discussions" className="footer-link">Discussions</Link></li>
                <li><Link to="/events" className="footer-link">Events</Link></li>
              </ul>
            </div>

            <div className="footer-column">
              <h3 className="footer-title">Support</h3>
              <ul className="footer-list">
                <li><Link to="/help" className="footer-link">Help Center</Link></li>
                <li><Link to="/contact" className="footer-link">Contact Us</Link></li>
                <li><Link to="/faq" className="footer-link">FAQ</Link></li>
                <li><Link to="/bug-report" className="footer-link">Report Bug</Link></li>
              </ul>
            </div>

            <div className="footer-column">
              <h3 className="footer-title">Company</h3>
              <ul className="footer-list">
                <li><Link to="/about" className="footer-link">About Us</Link></li>
                <li><Link to="/careers" className="footer-link">Careers</Link></li>
                <li><Link to="/press" className="footer-link">Press</Link></li>
                <li><Link to="/partners" className="footer-link">Partners</Link></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="footer-newsletter">
          <div className="newsletter-content">
            <div className="newsletter-text">
              <h3 className="newsletter-title">Stay Updated with Fufu! 🐼</h3>
              <p>Get the latest software reviews and recommendations delivered to your inbox.</p>
            </div>
            <div className="newsletter-form">
              <input 
                type="email" 
                placeholder="Enter your email address" 
                className="newsletter-input"
              />
              <button className="newsletter-btn">
                Subscribe
                <span className="btn-emoji">📬</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <div className="footer-copyright">
              <p>&copy; 2024 RateMySoft. Made with 💚 by the Fufu team.</p>
            </div>
            <div className="footer-legal">
              <Link to="/privacy" className="footer-legal-link">Privacy Policy</Link>
              <Link to="/terms" className="footer-legal-link">Terms of Service</Link>
              <Link to="/cookies" className="footer-legal-link">Cookie Policy</Link>
            </div>
          </div>
          <div className="footer-decoration">
            <div className="footer-bamboo">🎋</div>
            <div className="footer-bamboo">🎋</div>
            <div className="footer-bamboo">🎋</div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
