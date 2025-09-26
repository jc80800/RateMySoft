import { useState } from 'react';
import SoftwareCard from '../components/SoftwareCard';
import './SoftwareList.css';

const SoftwareList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('rating');

  // Mock data - in real app, this would come from API
  const allSoftware = [
    {
      id: 1,
      name: 'Vercel',
      category: 'Deployment & Hosting',
      description: 'The platform for frontend developers. Deploy your projects with zero configuration.',
      rating: 4.8,
      reviewCount: 1247,
      pricing: 'Free - $20/mo',
      logo: null
    },
    {
      id: 2,
      name: 'Netlify',
      category: 'Deployment & Hosting',
      description: 'Deploy static sites and full-stack apps with continuous deployment.',
      rating: 4.6,
      reviewCount: 892,
      pricing: 'Free - $19/mo',
      logo: null
    },
    {
      id: 3,
      name: 'PostgreSQL',
      category: 'Database',
      description: 'The world\'s most advanced open source relational database.',
      rating: 4.7,
      reviewCount: 892,
      pricing: 'Free',
      logo: null
    },
    {
      id: 4,
      name: 'MongoDB',
      category: 'Database',
      description: 'The database for modern applications. Build faster with MongoDB.',
      rating: 4.5,
      reviewCount: 756,
      pricing: 'Free - $57/mo',
      logo: null
    },
    {
      id: 5,
      name: 'LaunchDarkly',
      category: 'Feature Toggles',
      description: 'Feature flags as a service. Build better software faster.',
      rating: 4.5,
      reviewCount: 456,
      pricing: '$10/mo',
      logo: null
    },
    {
      id: 6,
      name: 'Split.io',
      category: 'Feature Toggles',
      description: 'Feature flags and experimentation platform for modern teams.',
      rating: 4.3,
      reviewCount: 234,
      pricing: '$15/mo',
      logo: null
    },
    {
      id: 7,
      name: 'DataDog',
      category: 'Monitoring & Analytics',
      description: 'Cloud monitoring and security platform for modern applications.',
      rating: 4.4,
      reviewCount: 673,
      pricing: '$15/mo',
      logo: null
    },
    {
      id: 8,
      name: 'New Relic',
      category: 'Monitoring & Analytics',
      description: 'Full-stack observability platform built to help engineers create more perfect software.',
      rating: 4.2,
      reviewCount: 445,
      pricing: '$25/mo',
      logo: null
    },
    {
      id: 9,
      name: 'Auth0',
      category: 'Authentication',
      description: 'Secure access for everyone. But not just anyone.',
      rating: 4.6,
      reviewCount: 789,
      pricing: '$23/mo',
      logo: null
    },
    {
      id: 10,
      name: 'Firebase Auth',
      category: 'Authentication',
      description: 'Easy-to-use authentication service from Google.',
      rating: 4.4,
      reviewCount: 567,
      pricing: 'Free - $0.01/verification',
      logo: null
    },
    {
      id: 11,
      name: 'Cloudflare',
      category: 'CDN & Performance',
      description: 'The web performance and security company.',
      rating: 4.7,
      reviewCount: 1023,
      pricing: 'Free - $20/mo',
      logo: null
    },
    {
      id: 12,
      name: 'AWS CloudFront',
      category: 'CDN & Performance',
      description: 'Fast, secure, and cost-effective content delivery network.',
      rating: 4.5,
      reviewCount: 789,
      pricing: '$0.085/GB',
      logo: null
    }
  ];

  const categories = ['all', 'Deployment & Hosting', 'Database', 'Feature Toggles', 'Monitoring & Analytics', 'Authentication', 'CDN & Performance'];

  const filteredSoftware = allSoftware.filter(software => {
    const matchesSearch = software.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         software.description.toLowerCase().includes(searchTerm.toLowerCase());
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
                  {category === 'all' ? 'All Categories' : category}
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

        <div className="software-grid">
          {sortedSoftware.map((software) => (
            <SoftwareCard key={software.id} software={software} />
          ))}
        </div>

        {sortedSoftware.length === 0 && (
          <div className="no-results">
            <p>No software found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SoftwareList;
