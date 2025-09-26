import { useState } from 'react';
import SoftwareCard from '../components/SoftwareCard';
import CategoryFilter from '../components/CategoryFilter';
import './Home.css';

const Home = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Mock data for featured software
  const featuredSoftware = [
    {
      id: 1,
      name: 'Vercel',
      category: 'deployment',
      categoryName: 'Deployment & Hosting',
      description: 'The platform for frontend developers. Deploy your projects with zero configuration.',
      rating: 4.8,
      reviewCount: 1247,
      pricing: 'Free - $20/mo',
      logo: null
    },
    {
      id: 2,
      name: 'PostgreSQL',
      category: 'database',
      categoryName: 'Database',
      description: 'The world\'s most advanced open source relational database.',
      rating: 4.7,
      reviewCount: 892,
      pricing: 'Free',
      logo: null
    },
    {
      id: 3,
      name: 'LaunchDarkly',
      category: 'feature-toggles',
      categoryName: 'Feature Toggles',
      description: 'Feature flags as a service. Build better software faster.',
      rating: 4.5,
      reviewCount: 456,
      pricing: '$10/mo',
      logo: null
    },
    {
      id: 4,
      name: 'DataDog',
      category: 'monitoring',
      categoryName: 'Monitoring & Analytics',
      description: 'Cloud monitoring and security platform for modern applications.',
      rating: 4.4,
      reviewCount: 673,
      pricing: '$15/mo',
      logo: null
    },
    {
      id: 5,
      name: 'Auth0',
      category: 'authentication',
      categoryName: 'Authentication',
      description: 'Secure access for everyone. But not just anyone.',
      rating: 4.6,
      reviewCount: 789,
      pricing: '$23/mo',
      logo: null
    },
    {
      id: 6,
      name: 'Cloudflare',
      category: 'cdn',
      categoryName: 'CDN & Performance',
      description: 'The web performance and security company.',
      rating: 4.7,
      reviewCount: 1023,
      pricing: 'Free - $20/mo',
      logo: null
    }
  ];

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
            {filteredSoftware.map((software) => (
              <SoftwareCard key={software.id} software={{
                ...software,
                category: software.categoryName
              }} />
            ))}
          </div>
          
          {filteredSoftware.length === 0 && (
            <div className="no-results">
              <p>No software found in this category yet.</p>
            </div>
          )}
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
