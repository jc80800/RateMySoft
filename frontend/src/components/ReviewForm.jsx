import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import apiService from '../services/api';
import './ReviewForm.css';

const ReviewForm = ({ product, onClose, onSuccess }) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [formData, setFormData] = useState({
    title: '',
    body: '',
    rating: 5
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check for pending review data when component mounts
  useEffect(() => {
    const pendingReview = sessionStorage.getItem('pendingReview');
    if (pendingReview && isAuthenticated) {
      try {
        const { formData: savedFormData } = JSON.parse(pendingReview);
        setFormData(savedFormData);
        // Clear the pending review data
        sessionStorage.removeItem('pendingReview');
      } catch (error) {
        console.error('Failed to restore pending review:', error);
        sessionStorage.removeItem('pendingReview');
      }
    }
  }, [isAuthenticated]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleRatingChange = (rating) => {
    setFormData(prev => ({
      ...prev,
      rating: rating
    }));
    
    // Clear rating error
    if (errors.rating) {
      setErrors(prev => ({
        ...prev,
        rating: ''
      }));
    }
  };

  const handleAuthenticationCheck = () => {
    if (!isAuthenticated) {
      // Store the form data in sessionStorage to restore after login
      sessionStorage.setItem('pendingReview', JSON.stringify({
        product,
        formData,
        returnPath: location.pathname
      }));
      
      // Redirect to login with current location as return path
      navigate('/login', { 
        state: { from: { pathname: location.pathname } },
        replace: true 
      });
      return false;
    }
    return true;
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Title validation (optional, max 200 chars)
    if (formData.title && formData.title.length > 200) {
      newErrors.title = 'Title must be 200 characters or less';
    }
    
    // Body validation (required, min 10 chars)
    if (!formData.body.trim()) {
      newErrors.body = 'Review content is required';
    } else if (formData.body.trim().length < 10) {
      newErrors.body = 'Review must be at least 10 characters long';
    }
    
    // Rating validation (required, 1-5)
    if (!formData.rating || formData.rating < 1 || formData.rating > 5) {
      newErrors.rating = 'Please select a rating from 1 to 5 stars';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check authentication first
    if (!handleAuthenticationCheck()) {
      return;
    }
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const reviewData = {
        product_id: product.id,
        title: formData.title.trim(),
        body: formData.body.trim(),
        rating: formData.rating
      };
      
      await apiService.createReview(reviewData);
      
      // Call success callback
      if (onSuccess) {
        onSuccess();
      }
      
      // Close the form
      onClose();
      
    } catch (error) {
      console.error('Failed to create review:', error);
      
      // Handle specific error cases
      if (error.message.includes('already reviewed')) {
        setErrors({ general: 'You have already reviewed this product' });
      } else if (error.message.includes('not authenticated')) {
        setErrors({ general: 'Please log in to write a review' });
      } else {
        setErrors({ general: 'Failed to submit review. Please try again.' });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <button
          key={i}
          type="button"
          className={`star ${i <= rating ? 'filled' : 'empty'}`}
          onClick={() => handleRatingChange(i)}
          disabled={isSubmitting}
        >
          ★
        </button>
      );
    }
    return stars;
  };

  return (
    <div className="review-form-overlay">
      <div className="review-form-container">
        <div className="review-form-header">
          <h2>🐼 Write a Review</h2>
          <p className="product-name">for {product.name}</p>
          <button 
            className="close-btn" 
            onClick={onClose}
            disabled={isSubmitting}
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="review-form">
          {errors.general && (
            <div className="error-message general-error">
              {errors.general}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="title" className="form-label">
              Review Title (Optional)
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className={`form-input ${errors.title ? 'error' : ''}`}
              placeholder="Summarize your experience..."
              maxLength={200}
              disabled={isSubmitting}
            />
            {errors.title && (
              <span className="error-message">{errors.title}</span>
            )}
            <div className="char-count">
              {formData.title.length}/200 characters
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="rating" className="form-label">
              Rating <span className="required">*</span>
            </label>
            <div className="rating-input">
              {renderStars(formData.rating)}
              <span className="rating-text">
                {formData.rating === 1 && 'Poor'}
                {formData.rating === 2 && 'Fair'}
                {formData.rating === 3 && 'Good'}
                {formData.rating === 4 && 'Very Good'}
                {formData.rating === 5 && 'Excellent'}
              </span>
            </div>
            {errors.rating && (
              <span className="error-message">{errors.rating}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="body" className="form-label">
              Your Review <span className="required">*</span>
            </label>
            <textarea
              id="body"
              name="body"
              value={formData.body}
              onChange={handleInputChange}
              className={`form-textarea ${errors.body ? 'error' : ''}`}
              placeholder="Share your experience with this software. What did you like? What could be improved?"
              rows={6}
              disabled={isSubmitting}
            />
            {errors.body && (
              <span className="error-message">{errors.body}</span>
            )}
            <div className="char-count">
              {formData.body.length} characters (minimum 10)
            </div>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewForm;
