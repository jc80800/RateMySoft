import { useState } from 'react';
import SoftwareCard from '../components/SoftwareCard';
import './SoftwareList.css';

const SoftwareList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('rating');

  // Software data will be loaded from API
  const [allSoftware, setAllSoftware] = useState([]);

  // Categories will be loaded from API
  const [categories, setCategories] = useState(['all']);

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
        {sortedSoftware.length > 0 ? (
          sortedSoftware.map((software) => (
            <SoftwareCard key={software.id} software={software} />
          ))
        ) : (
          <div className="empty-state">
            <h3>No software found</h3>
            <p>Try adjusting your search or category filter</p>
          </div>
        )}
      </div>
      </div>
    </div>
  );
};

export default SoftwareList;
