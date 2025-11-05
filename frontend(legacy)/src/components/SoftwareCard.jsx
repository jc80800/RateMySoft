import { Link } from 'react-router-dom';
import './SoftwareCard.css';

const SoftwareCard = ({ software, onWriteReview }) => {
  // Map backend data structure to component props
  const { 
    id, 
    name, 
    category, 
    description, 
    short_tagline,
    avg_rating, 
    total_reviews,
    homepage_url 
  } = software;
  
  // Use avg_rating if available, otherwise default to 0
  const rating = avg_rating || 0;
  const reviewCount = total_reviews || 0;
  
  // Use short_tagline as description if description is empty
  const displayDescription = description || short_tagline || 'No description available';
  
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
  
  // For now, we don't have logo or pricing data from backend
  const logo = null;
  const pricing = 'Contact for pricing';

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={i} className="star full">★</span>);
    }

    if (hasHalfStar) {
      stars.push(<span key="half" className="star half">☆</span>);
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<span key={`empty-${i}`} className="star empty">☆</span>);
    }

    return stars;
  };

  const handleWriteReview = () => {
    if (onWriteReview) {
      onWriteReview(software);
    }
  };

  return (
    <div className="software-card">
      <div className="card-header">
        <div className="software-logo">
          {logo ? (
            <img src={logo} alt={`${name} logo`} />
          ) : (
            <div className="default-logo">
              <span>{name.charAt(0)}</span>
            </div>
          )}
        </div>
        <div className="software-info">
          <h3 className="software-name">{name}</h3>
          <span className="software-category">{getCategoryDisplayName(category)}</span>
        </div>
      </div>

      <p className="software-description">{displayDescription}</p>

      <div className="card-footer">
        <div className="rating-section">
          <div className="stars">
            {renderStars(rating)}
          </div>
          <span className="rating-number">{rating.toFixed(1)}</span>
          <span className="review-count">({reviewCount} reviews)</span>
        </div>
      </div>

      <div className="card-actions">
        <Link to={`/software/${id}`} className="btn btn-outline">
          View Details
        </Link>
        <button className="btn btn-primary" onClick={handleWriteReview}>
          Write Review
        </button>
      </div>
    </div>
  );
};

export default SoftwareCard;
