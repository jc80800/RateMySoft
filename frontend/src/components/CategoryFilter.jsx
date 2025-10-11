import { useState } from 'react';
import './CategoryFilter.css';

const CategoryFilter = ({ onCategorySelect, selectedCategory, categories = [] }) => {
  // Default "All Software" category
  const defaultCategories = [
    {
      id: 'all',
      name: 'All Software',
      icon: '🔍',
      description: 'Browse all software'
    }
  ];
  
  // Combine default with dynamic categories from props
  const allCategories = [...defaultCategories, ...categories];

  return (
    <div className="category-filter">
      <div className="filter-header">
        <h2>Browse by Category</h2>
        <p>Find software solutions that fit your needs</p>
      </div>
      
      <div className="filter-tabs">
        {allCategories.map((category) => (
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
