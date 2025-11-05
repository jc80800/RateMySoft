import './CompanyCard.css';

const CompanyCard = ({ company, index, viewMode }) => {
  const { 
    id, 
    name, 
    website, 
    slug, 
    logo_url,
    created_at,
    updated_at
  } = company;
  
  // Generate a professional color scheme based on company name using panda theme colors
  const getCompanyColor = (companyName) => {
    const colors = [
      '#7cb342', // bamboo-green
      '#9ccc65', // bamboo-light
      '#689f38', // bamboo-dark
      '#4a4a4a', // panda-medium
      '#6b6b6b', // panda-light
      '#2d2d2d', // panda-dark
      '#1a1a1a', // panda-black
    ];
    
    const hash = companyName.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    
    return colors[Math.abs(hash) % colors.length];
  };

  const companyColor = getCompanyColor(name);
  
  // Format dates
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Get company initials for logo fallback
  const getInitials = (companyName) => {
    return companyName
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 3);
  };

  // Render panda logo for default
  const renderPandaLogo = () => (
    <div className="panda-logo">
      <div className="panda-head">
        <div className="panda-ear left"></div>
        <div className="panda-ear right"></div>
        <div className="panda-eye-patch left"></div>
        <div className="panda-eye-patch right"></div>
        <div className="panda-eye left"></div>
        <div className="panda-eye right"></div>
        <div className="panda-nose"></div>
        <div className="panda-mouth"></div>
      </div>
    </div>
  );

  // Get real company data - no mock data
  const companyStat = null; // Remove mock stats entirely

  const handleWebsiteClick = (e) => {
    e.preventDefault();
    if (website) {
      window.open(website.startsWith('http') ? website : `https://${website}`, '_blank');
    }
  };

  return (
    <div className={`company-card ${viewMode}`} style={{ '--company-color': companyColor }}>
      <div className="card-background" style={{ background: companyColor }}></div>
      
      <div className="card-content">
        {/* Company Logo */}
        <div className="company-logo">
          {logo_url && logo_url.trim() !== '' ? (
            <img 
              src={logo_url} 
              alt={`${name} logo`} 
              onError={(e) => {
                // If image fails to load, show placeholder instead
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
          ) : null}
          <div 
            className="logo-placeholder" 
            style={{ 
              background: companyColor,
              display: logo_url && logo_url.trim() !== '' ? 'none' : 'flex'
            }}
          >
            {renderPandaLogo()}
          </div>
        </div>

        {/* Company Info */}
        <div className="company-info">
          <h3 className="company-name">{name}</h3>
          <div className="company-slug">@{slug}</div>
          
          <div className="company-website">
            {website && website.trim() !== '' ? (
              <a 
                href={website.startsWith('http') ? website : `https://${website}`}
                onClick={handleWebsiteClick}
                target="_blank"
                rel="noopener noreferrer"
                className="website-link"
              >
                🌐 {website.replace(/^https?:\/\//, '')}
              </a>
            ) : (
              <span className="website-placeholder">
                🌐 URL missing
              </span>
            )}
          </div>
        </div>

        {/* Company Stats - Only show if we have real data */}
        {/* Removed mock stats section entirely */}

        {/* Company Meta */}
        <div className="company-meta">
          <div className="meta-item">
            <span className="meta-label">Added</span>
            <span className="meta-value">{formatDate(created_at)}</span>
          </div>
          {updated_at !== created_at && (
            <div className="meta-item">
              <span className="meta-label">Updated</span>
              <span className="meta-value">{formatDate(updated_at)}</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="card-actions">
          <button className="btn btn-outline btn-sm">
            View Products
          </button>
          <button className="btn btn-primary btn-sm">
            Follow
          </button>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="card-decoration">
        <div className="decoration-circle"></div>
        <div className="decoration-line"></div>
      </div>
    </div>
  );
};

export default CompanyCard;
