import { useState } from 'react';
import './CategoryFilter.css';

const CategoryFilter = ({ onCategorySelect, selectedCategory }) => {
  const categories = [
    {
      id: 'all',
      name: 'All Software',
      icon: '🔍',
      description: 'Browse all software'
    },
    {
      id: 'deployment',
      name: 'Deployment',
      icon: '🚀',
      description: 'Deploy and host applications'
    },
    {
      id: 'database',
      name: 'Database',
      icon: '🗄️',
      description: 'Store and manage data'
    },
    {
      id: 'feature-toggles',
      name: 'Feature Toggles',
      icon: '🎛️',
      description: 'Control feature rollouts'
    },
    {
      id: 'monitoring',
      name: 'Monitoring',
      icon: '📊',
      description: 'Track performance and usage'
    },
    {
      id: 'authentication',
      name: 'Authentication',
      icon: '🔐',
      description: 'Secure user access'
    },
    {
      id: 'cdn',
      name: 'CDN',
      icon: '⚡',
      description: 'Speed up content delivery'
    },
    {
      id: 'email',
      name: 'Email',
      icon: '📧',
      description: 'Send transactional emails'
    },
    {
      id: 'storage',
      name: 'Storage',
      icon: '📁',
      description: 'Store and serve files'
    }
  ];

  return (
    <div className="category-filter">
      <div className="filter-header">
        <h2>Browse by Category</h2>
        <p>Find software solutions that fit your needs</p>
      </div>
      
      <div className="filter-tabs">
        {categories.map((category) => (
          <button
            key={category.id}
            className={`filter-tab ${selectedCategory === category.id ? 'active' : ''}`}
            onClick={() => onCategorySelect(category.id)}
            title={category.description}
          >
            <span className="tab-icon">{category.icon}</span>
            <span className="tab-name">{category.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;
