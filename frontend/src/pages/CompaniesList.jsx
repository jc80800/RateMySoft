import { useState, useEffect } from 'react';
import CompanyCard from '../components/CompanyCard';
import apiService from '../services/api';
import './CompaniesList.css';

const CompaniesList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [viewMode, setViewMode] = useState('masonry'); // masonry or grid

  // Company data loaded from API
  const [allCompanies, setAllCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load companies on component mount
  useEffect(() => {
    const loadCompanies = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Load all companies
        const response = await apiService.getCompanies();
        const companies = response.companies || response;
        setAllCompanies(companies);
        
      } catch (err) {
        console.error('Failed to load companies data:', err);
        setError('Failed to load companies data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadCompanies();
  }, []);

  const filteredCompanies = allCompanies.filter(company => {
    const matchesSearch = company.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         company.website?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const sortedCompanies = [...filteredCompanies].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'created':
        return new Date(b.created_at) - new Date(a.created_at);
      case 'updated':
        return new Date(b.updated_at) - new Date(a.updated_at);
      default:
        return 0;
    }
  });

  return (
    <div className="companies-list">
      <div className="container">
        <div className="page-header">
          <h1>Company Directory</h1>
          <p>Discover innovative companies and their software solutions</p>
        </div>

        {/* Controls */}
        <div className="controls">
          <div className="search-section">
            <div className="search-box">
              <input
                type="text"
                placeholder="Search companies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              <div className="search-icon">🔍</div>
            </div>
          </div>

          <div className="control-actions">
            <div className="view-toggle">
              <button 
                className={`view-btn ${viewMode === 'masonry' ? 'active' : ''}`}
                onClick={() => setViewMode('masonry')}
                title="Masonry View"
              >
                ⧉
              </button>
              <button 
                className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
                title="Grid View"
              >
                ⊞
              </button>
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
            >
              <option value="name">Sort by Name</option>
              <option value="created">Sort by Created Date</option>
              <option value="updated">Sort by Updated Date</option>
            </select>
          </div>
        </div>

        {/* Results Header */}
        <div className="results-header">
          <p>{sortedCompanies.length} companies found</p>
          <div className="view-mode-indicator">
            {viewMode === 'masonry' ? 'Masonry Layout' : 'Grid Layout'}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading companies...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="error-state">
            <h3>Error</h3>
            <p>{error}</p>
            <button 
              className="btn btn-primary"
              onClick={() => window.location.reload()}
            >
              Try Again
            </button>
          </div>
        )}

        {/* Companies Display */}
        {!loading && !error && (
          <div className={`companies-display ${viewMode}`}>
            {sortedCompanies.length > 0 ? (
              sortedCompanies.map((company, index) => (
                <CompanyCard 
                  key={company.id} 
                  company={company} 
                  index={index}
                  viewMode={viewMode}
                />
              ))
            ) : (
              <div className="empty-state">
                <div className="empty-icon">🏢</div>
                <h3>No companies found</h3>
                <p>Try adjusting your search terms</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CompaniesList;
