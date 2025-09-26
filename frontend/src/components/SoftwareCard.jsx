import { Link } from 'react-router-dom';
import './SoftwareCard.css';

const SoftwareCard = ({ software }) => {
  const { id, name, category, description, rating, reviewCount, logo, pricing } = software;

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
          <span className="software-category">{category}</span>
        </div>
      </div>

      <p className="software-description">{description}</p>

      <div className="card-footer">
        <div className="rating-section">
          <div className="stars">
            {renderStars(rating)}
          </div>
          <span className="rating-number">{rating.toFixed(1)}</span>
          <span className="review-count">({reviewCount} reviews)</span>
        </div>

        <div className="pricing">
          <span className="price">{pricing}</span>
        </div>
      </div>

      <div className="card-actions">
        <Link to={`/software/${id}`} className="btn btn-outline">
          View Details
        </Link>
        <button className="btn btn-primary">
          Write Review
        </button>
      </div>
    </div>
  );
};

export default SoftwareCard;
