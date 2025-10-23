import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import SoftwareCard from '../components/SoftwareCard';
import ReviewForm from '../components/ReviewForm';
import apiService from '../services/api';
import './SoftwareList.css';

const SoftwareList = () => {
  const { isAuthenticated } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('rating');

  // Software data loaded from API
  const [allSoftware, setAllSoftware] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Categories loaded from API
  const [categories, setCategories] = useState(['all']);

  // Review form modal state
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Handle review submission - refresh data
  const handleReviewSubmitted = () => {
    // Reload software data to get updated ratings and review counts
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Load all products
        const products = await apiService.getProducts();
        setAllSoftware(products);
        
        // Extract unique categories from products
        const uniqueCategories = [...new Set(products.map(p => p.category).filter(Boolean))];
        setCategories(['all', ...uniqueCategories]);
        
      } catch (err) {
        console.error('Failed to reload software data:', err);
        setError('Failed to reload software data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  };

  // Handle write review button click
  const handleWriteReview = (product) => {
    setSelectedProduct(product);
    setShowReviewForm(true);
  };

  // Handle review form close
  const handleCloseReviewForm = () => {
    setShowReviewForm(false);
    setSelectedProduct(null);
  };

  // Handle review form success
  const handleReviewFormSuccess = () => {
    setShowReviewForm(false);
    setSelectedProduct(null);
    handleReviewSubmitted();
  };

  // Category display mapping
  const getCategoryDisplayName = (category) => {
    const categoryMap = {
      'all': 'All Categories',
      'hosting': 'Web Hosting',
      'feature_toggles': 'Feature Management',
      'ci_cd': 'CI/CD & DevOps',
      'observability': 'Monitoring & Analytics',
      'other': 'Other Tools'
    };
    return categoryMap[category] || category;
  };

  // Load products and categories on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Load all products
        const products = await apiService.getProducts();
        setAllSoftware(products);
        
        // Extract unique categories from products
        const uniqueCategories = [...new Set(products.map(p => p.category).filter(Boolean))];
        setCategories(['all', ...uniqueCategories]);
        
      } catch (err) {
        console.error('Failed to load software data:', err);
        setError('Failed to load software data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Check for pending review data when user returns from login
  useEffect(() => {
    if (isAuthenticated) {
      const pendingReview = sessionStorage.getItem('pendingReview');
      if (pendingReview) {
        try {
          const { product } = JSON.parse(pendingReview);
          setSelectedProduct(product);
          setShowReviewForm(true);
        } catch (error) {
          console.error('Failed to restore pending review:', error);
          sessionStorage.removeItem('pendingReview');
        }
      }
    }
  }, [isAuthenticated]);

  const filteredSoftware = allSoftware.filter(software => {
    const matchesSearch = software.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         software.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || software.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const sortedSoftware = [...filteredSoftware].sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return b.rating - a.rating;
      case 'reviews':
        return b.reviewCount - a.reviewCount;
      case 'name':
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  return (
    <div className="software-list">
      <div className="container">
        <div className="page-header">
          <h1>Software Directory</h1>
          <p>Discover and compare software solutions</p>
        </div>

        {/* Filters */}
        <div className="filters">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search software..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="filter-controls">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="filter-select"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {getCategoryDisplayName(category)}
                </option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="filter-select"
            >
              <option value="rating">Sort by Rating</option>
              <option value="reviews">Sort by Reviews</option>
              <option value="name">Sort by Name</option>
            </select>
          </div>
        </div>

        {/* Results */}
        <div className="results-header">
          <p>{sortedSoftware.length} software found</p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading software...</p>
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

        {/* Software Grid */}
        {!loading && !error && (
          <div className="software-grid">
            {sortedSoftware.length > 0 ? (
              sortedSoftware.map((software) => (
                <SoftwareCard 
                  key={software.id} 
                  software={software} 
                  onWriteReview={handleWriteReview}
                />
              ))
            ) : (
              <div className="empty-state">
                <h3>No software found</h3>
                <p>Try adjusting your search or category filter</p>
              </div>
            )}
          </div>
        )}

        {/* Review Form Modal */}
        {showReviewForm && selectedProduct && (
          <ReviewForm
            product={selectedProduct}
            onClose={handleCloseReviewForm}
            onSuccess={handleReviewFormSuccess}
          />
        )}
      </div>
    </div>
  );
};

export default SoftwareList;
