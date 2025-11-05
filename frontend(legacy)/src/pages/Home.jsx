import { useState } from 'react';
import SoftwareCard from '../components/SoftwareCard';
import CategoryFilter from '../components/CategoryFilter';
import './Home.css';

const Home = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Featured software data will be loaded from API
  const [featuredSoftware, setFeaturedSoftware] = useState([]);

  // Filter software based on selected category
  const filteredSoftware = selectedCategory === 'all' 
    ? featuredSoftware 
    : featuredSoftware.filter(software => software.category === selectedCategory);

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  return (
    <div className="home">
      {/* Category Filter */}
      <CategoryFilter 
        onCategorySelect={handleCategorySelect}
        selectedCategory={selectedCategory}
      />

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-text">
            <h1>Find the Perfect <span className="accent">Software</span> Solution</h1>
            <p>Discover, compare, and review the best software tools for developers and teams. Get honest reviews from real users.</p>
            <div className="hero-actions">
              <button className="btn btn-primary btn-large">Browse Software</button>
              <button className="btn btn-outline btn-large">Write a Review</button>
            </div>
          </div>
          <div className="hero-visual">
            <div className="floating-element"></div>
            <div className="floating-element"></div>
            <div className="floating-element"></div>
          </div>
        </div>
      </section>

      {/* Featured Software */}
      <section className="featured-section">
        <div className="container">
          <div className="section-header">
            <h2>
              {selectedCategory === 'all' ? 'Featured Software' : 
               `Featured ${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1).replace('-', ' ')} Software`}
            </h2>
            <p>
              {selectedCategory === 'all' 
                ? 'Top-rated software solutions loved by developers'
                : `Discover the best ${selectedCategory.replace('-', ' ')} tools for your projects`}
            </p>
          </div>
          
          <div className="software-grid">
            {filteredSoftware.length > 0 ? (
              filteredSoftware.map((software) => (
                <SoftwareCard key={software.id} software={{
                  ...software,
                  category: software.categoryName
                }} />
              ))
            ) : (
              <div className="empty-state">
                <h3>No featured software available</h3>
                <p>Check back later for featured software recommendations</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-number">2,500+</div>
              <div className="stat-label">Software Reviews</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">150+</div>
              <div className="stat-label">Categories</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">50,000+</div>
              <div className="stat-label">Active Users</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">98%</div>
              <div className="stat-label">User Satisfaction</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
