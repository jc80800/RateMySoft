import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ReviewForm from '../components/ReviewForm';
import apiService from '../services/api';
import './SoftwareDetail.css';

const SoftwareDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  const [software, setSoftware] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showReviewForm, setShowReviewForm] = useState(false);

  // Load software details and reviews
  useEffect(() => {
    const loadSoftwareData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Load software details
        const softwareData = await apiService.getProduct(id);
        setSoftware(softwareData);
        
        // Load reviews for this software
        setReviewsLoading(true);
        try {
          const reviewsData = await apiService.getReviewsByProduct(id);
          console.log('Reviews data received:', reviewsData);
          
          // Parse reviews properly - handle different response formats
          let reviewsArray = [];
          if (Array.isArray(reviewsData)) {
            reviewsArray = reviewsData;
          } else if (reviewsData && Array.isArray(reviewsData.reviews)) {
            reviewsArray = reviewsData.reviews;
          } else if (reviewsData && reviewsData.data && Array.isArray(reviewsData.data)) {
            reviewsArray = reviewsData.data;
          } else if (reviewsData && reviewsData.results && Array.isArray(reviewsData.results)) {
            reviewsArray = reviewsData.results;
          }
          
          console.log('Raw reviews array:', reviewsArray);
          console.log('Reviews array length:', reviewsArray.length);
          
          // Validate that we have proper review objects - more flexible validation
          const validReviews = reviewsArray.filter(review => {
            // More lenient validation - just check if it's an object with some content
            const isObject = review && typeof review === 'object';
            const hasSomeContent = review && (
              review.content || 
              review.review_content || 
              review.text || 
              review.description || 
              review.body ||
              review.comment ||
              review.review
            );
            const hasSomeId = review && (
              review.id || 
              review.review_id || 
              review._id ||
              review.reviewId
            );
            
            const isValid = isObject && (hasSomeContent || hasSomeId);
            
            if (!isValid) {
              console.log('Invalid review filtered out:', review);
              console.log('Is Object:', isObject, 'Has Content:', hasSomeContent, 'Has ID:', hasSomeId);
            }
            return isValid;
          });
          
          console.log('Valid reviews after filtering:', validReviews);
          console.log('Valid reviews count:', validReviews.length);
          
          setReviews(validReviews);
        } catch (reviewError) {
          console.error('Failed to load reviews:', reviewError);
          setReviews([]); // Don't show any reviews on error
        } finally {
          setReviewsLoading(false);
        }
        
      } catch (err) {
        console.error('Failed to load software data:', err);
        setError('Failed to load software details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadSoftwareData();
    }
  }, [id]);

  const handleWriteReview = () => {
    if (!isAuthenticated) {
      // Store the current software page URL for redirect after login
      sessionStorage.setItem('pendingReview', JSON.stringify({ 
        product: software,
        redirectUrl: `/software/${id}`
      }));
      navigate('/login');
      return;
    }
    setShowReviewForm(true);
  };

  const handleCloseReviewForm = () => {
    setShowReviewForm(false);
  };

  const handleUpvote = async (reviewId) => {
    if (!isAuthenticated) {
      // Store the current software page URL for redirect after login
      sessionStorage.setItem('pendingReview', JSON.stringify({ 
        product: software,
        redirectUrl: `/software/${id}`
      }));
      navigate('/login');
      return;
    }
    
    try {
      await apiService.upvoteReview(reviewId);
      // Reload reviews to get updated counts
      loadReviews();
    } catch (error) {
      console.error('Failed to upvote review:', error);
    }
  };

  const handleDownvote = async (reviewId) => {
    if (!isAuthenticated) {
      // Store the current software page URL for redirect after login
      sessionStorage.setItem('pendingReview', JSON.stringify({ 
        product: software,
        redirectUrl: `/software/${id}`
      }));
      navigate('/login');
      return;
    }
    
    try {
      await apiService.downvoteReview(reviewId);
      // Reload reviews to get updated counts
      loadReviews();
    } catch (error) {
      console.error('Failed to downvote review:', error);
    }
  };

  const handleFlagReview = async (reviewId) => {
    if (!isAuthenticated) {
      // Store the current software page URL for redirect after login
      sessionStorage.setItem('pendingReview', JSON.stringify({ 
        product: software,
        redirectUrl: `/software/${id}`
      }));
      navigate('/login');
      return;
    }
    
    // Get reason from user
    const reason = prompt('Please provide a reason for flagging this review:');
    if (!reason || reason.trim() === '') {
      return; // User cancelled or didn't provide reason
    }
    
    try {
      await apiService.flagReview(reviewId, reason.trim());
      alert('Review has been flagged. Thank you for helping maintain quality!');
      // Reload reviews to get updated counts
      loadReviews();
    } catch (error) {
      console.error('Failed to flag review:', error);
      alert('Failed to flag review. Please try again.');
    }
  };

  const loadReviews = async () => {
    try {
      setReviewsLoading(true);
      const reviewsData = await apiService.getReviewsByProduct(id);
      console.log('Reloaded reviews data:', reviewsData);
      
      // Parse reviews properly - handle different response formats
      let reviewsArray = [];
      if (Array.isArray(reviewsData)) {
        reviewsArray = reviewsData;
      } else if (reviewsData && Array.isArray(reviewsData.reviews)) {
        reviewsArray = reviewsData.reviews;
      } else if (reviewsData && reviewsData.data && Array.isArray(reviewsData.data)) {
        reviewsArray = reviewsData.data;
      } else if (reviewsData && reviewsData.results && Array.isArray(reviewsData.results)) {
        reviewsArray = reviewsData.results;
      }
      
      // Validate that we have proper review objects
      const validReviews = reviewsArray.filter(review => {
        // More lenient validation - just check if it's an object with some content
        const isObject = review && typeof review === 'object';
        const hasSomeContent = review && (
          review.content || 
          review.review_content || 
          review.text || 
          review.description || 
          review.body ||
          review.comment ||
          review.review
        );
        const hasSomeId = review && (
          review.id || 
          review.review_id || 
          review._id ||
          review.reviewId
        );
        
        const isValid = isObject && (hasSomeContent || hasSomeId);
        
        if (!isValid) {
          console.log('Invalid review filtered out:', review);
          console.log('Is Object:', isObject, 'Has Content:', hasSomeContent, 'Has ID:', hasSomeId);
        }
        return isValid;
      });
      
      setReviews(validReviews);
    } catch (err) {
      console.error('Failed to reload reviews:', err);
      setReviews([]); // Don't show any reviews on error
    } finally {
      setReviewsLoading(false);
    }
  };

  const handleReviewFormSuccess = () => {
    setShowReviewForm(false);
    // Reload reviews to show the new one
    loadReviews();
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={i} className="software-detail-star software-detail-star-full">★</span>);
    }

    if (hasHalfStar) {
      stars.push(<span key="half" className="software-detail-star software-detail-star-half">☆</span>);
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<span key={`empty-${i}`} className="software-detail-star software-detail-star-empty">☆</span>);
    }

    return stars;
  };

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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="software-detail-page">
        <div className="software-detail-container">
          <div className="software-detail-loading">
            <div className="software-detail-spinner"></div>
            <p>Loading software details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="software-detail-page">
        <div className="software-detail-container">
          <div className="software-detail-error">
            <h3>Error</h3>
            <p>{error}</p>
            <button 
              className="software-detail-btn software-detail-btn-primary"
              onClick={() => window.location.reload()}
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!software) {
    return (
      <div className="software-detail-page">
        <div className="software-detail-container">
          <div className="software-detail-not-found">
            <h2>Software not found</h2>
            <p>The software you're looking for doesn't exist or has been removed.</p>
            <Link to="/software" className="software-detail-btn software-detail-btn-primary">
              Back to Software List
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="software-detail-page">
      <div className="software-detail-container">
        {/* Breadcrumb */}
        <nav className="software-detail-breadcrumb">
          <Link to="/">Home</Link>
          <span>/</span>
          <Link to="/software">Software</Link>
          <span>/</span>
          <span>{software.name}</span>
        </nav>

        {/* Software Header */}
        <div className="software-detail-header">
          <div className="software-detail-logo">
            {software.logo_url ? (
              <img src={software.logo_url} alt={`${software.name} logo`} />
            ) : (
              <div className="software-detail-default-logo">
                <span>{software.name.charAt(0)}</span>
              </div>
            )}
          </div>
          
          <div className="software-detail-info">
            <h1 className="software-detail-title">{software.name}</h1>
            <span className="software-detail-category">{getCategoryDisplayName(software.category)}</span>
            
            <div className="software-detail-rating">
              <div className="software-detail-stars">
                {renderStars(software.avg_rating || 0)}
              </div>
              <span className="software-detail-rating-number">{(software.avg_rating || 0).toFixed(1)}</span>
              <span className="software-detail-review-count">({software.total_reviews || 0} reviews)</span>
            </div>
          </div>

          <div className="software-detail-actions">
            <button className="software-detail-btn software-detail-btn-primary" onClick={handleWriteReview}>
              Write Review
            </button>
            {software.homepage_url && (
              <a 
                href={software.homepage_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="software-detail-btn software-detail-btn-outline"
              >
                Visit Website
              </a>
            )}
          </div>
        </div>

        {/* Software Description */}
        <div className="software-detail-description">
          <h2>About {software.name}</h2>
          <p>{software.description || software.short_tagline || 'No description available.'}</p>
        </div>

        {/* Reviews Section */}
        <div className="software-detail-reviews">
          <div className="software-detail-reviews-header">
            <h2>Reviews ({reviews.length})</h2>
            <button className="software-detail-btn software-detail-btn-primary" onClick={handleWriteReview}>
              Write Review
            </button>
          </div>

          {reviewsLoading ? (
            <div className="software-detail-reviews-loading">
              <div className="software-detail-spinner"></div>
              <p>Loading reviews...</p>
            </div>
          ) : reviews.length > 0 ? (
                <div className="software-detail-reviews-list">
                  {reviews.map((review, index) => (
                    <div key={review.id || review.review_id || review._id || `review-${index}`} className="software-detail-review-card">
                      <div className="software-detail-review-header">
                        <div className="software-detail-reviewer-info">
                          <div className="software-detail-review-rating">
                            {renderStars(review.rating || review.score || 0)}
                          </div>
                        </div>
                        <span className="software-detail-review-date">
                          {formatDate(review.created_at || review.created_date || review.date)}
                        </span>
                      </div>
                      
                      {review.title && (
                        <h4 className="software-detail-review-title">
                          {review.title}
                        </h4>
                      )}
                      
                      <p className="software-detail-review-content">
                        {review.body || review.content || review.review_content || review.text || review.description || 'No content available'}
                      </p>
                      
                      <div className="software-detail-review-actions">
                        <button 
                          className="software-detail-btn software-detail-btn-sm software-detail-btn-outline"
                          onClick={() => handleUpvote(review.id)}
                        >
                          👍 Upvote ({review.helpful_count || review.upvotes || 0})
                        </button>
                        <button 
                          className="software-detail-btn software-detail-btn-sm software-detail-btn-outline"
                          onClick={() => handleDownvote(review.id)}
                        >
                          👎 Downvote
                        </button>
                        <button 
                          className="software-detail-btn software-detail-btn-sm software-detail-btn-outline"
                          onClick={() => handleFlagReview(review.id || review.review_id || review._id)}
                        >
                          🚩 Report
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
          ) : (
            <div className="software-detail-no-reviews">
              <p>No reviews yet. Be the first to review this software!</p>
              <button className="software-detail-btn software-detail-btn-primary" onClick={handleWriteReview}>
                Write the First Review
              </button>
            </div>
          )}
        </div>

        {/* Review Form Modal */}
        {showReviewForm && (
          <ReviewForm
            product={software}
            onClose={handleCloseReviewForm}
            onSuccess={handleReviewFormSuccess}
          />
        )}
      </div>
    </div>
  );
};

export default SoftwareDetail;
