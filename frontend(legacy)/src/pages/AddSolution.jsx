import React, { useState, useEffect, useRef } from 'react';
import apiService from '../services/api';
import './AddSolution.css';

const AddSolution = () => {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    homepage_url: '',
    company_name: '',
    company_id: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [companies, setCompanies] = useState([]);
  const [showCompanySearch, setShowCompanySearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const dropdownRef = useRef(null);

  // Handle clicking outside the dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowCompanySearch(false);
        setCompanies([]);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCompanySearch = async (query) => {
    if (query.length < 2) {
      setCompanies([]);
      setShowCompanySearch(false);
      return;
    }

    setIsSearching(true);
    try {
      const data = await apiService.searchCompanies(query);
      const foundCompanies = data.companies || [];
      setCompanies(foundCompanies);
      // Only show dropdown if we found companies
      setShowCompanySearch(foundCompanies.length > 0);
    } catch (error) {
      console.error('Error searching companies:', error);
      setCompanies([]);
      setShowCompanySearch(false);
    } finally {
      setIsSearching(false);
    }
  };

  const selectCompany = (company) => {
    setFormData(prev => ({
      ...prev,
      company_id: company.id,
      company_name: company.name
    }));
    setSearchQuery(company.name);
    setShowCompanySearch(false);
    setCompanies([]);
  };

  const useDefaultCompany = () => {
    // Since company is optional, just clear the company selection
    setFormData(prev => ({
      ...prev,
      company_id: '',
      company_name: ''
    }));
    setSearchQuery('');
    setShowCompanySearch(false);
    setCompanies([]);
  };

  // Generate slug from name
  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Validate required fields
      if (!formData.name.trim()) {
        alert('Product name is required');
        return;
      }
      
      if (!formData.category) {
        alert('Product category is required');
        return;
      }

      // Generate slug from name
      const slug = generateSlug(formData.name);
      
      // Prepare request data - company_id is optional
      const requestData = {
        name: formData.name.trim(),
        slug: slug,
        category: formData.category,
        description: formData.description.trim(),
        homepage_url: formData.homepage_url.trim()
      };

      // Add company_id only if a company is selected
      if (formData.company_id) {
        requestData.company_id = formData.company_id;
      }

      // Add short_tagline if description exists
      if (formData.description.trim()) {
        requestData.short_tagline = formData.description.trim().substring(0, 200);
      }

      console.log('Submitting solution:', requestData);
      
      // Make actual API call
      const response = await apiService.createProduct(requestData);
      
      alert('Solution submitted successfully!');
      setFormData({
        name: '',
        category: '',
        description: '',
        homepage_url: '',
        company_name: '',
        company_id: ''
      });
      setSearchQuery('');
    } catch (error) {
      console.error('Error submitting solution:', error);
      alert(`Error submitting solution: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="add-solution-page">
      <div className="container">
        <div className="page-header">
          <h1>Add a New Solution</h1>
          <p>Share your favorite software tools and help the community discover new solutions.</p>
        </div>

        <div className="form-container">
          <form onSubmit={handleSubmit} className="solution-form">
            <div className="form-group">
              <label htmlFor="name">Software Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g., Notion, Slack, Figma"
                maxLength="200"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="category">Category *</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
              >
                <option value="">Select a category</option>
                <option value="hosting">Hosting</option>
                <option value="feature_toggles">Feature Toggles</option>
                <option value="ci_cd">CI/CD</option>
                <option value="observability">Observability</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="company_search">Company (Optional)</label>
              <div className="company-search-container" ref={dropdownRef}>
                <input
                  type="text"
                  id="company_search"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    handleCompanySearch(e.target.value);
                  }}
                  placeholder="Search for existing company or leave blank"
                />
                {showCompanySearch && companies.length > 0 && (
                  <div className="company-search-results">
                    {isSearching && <div className="search-loading">Searching...</div>}
                    {!isSearching && (
                      <div className="company-list">
                        {companies.map(company => (
                          <div 
                            key={company.id}
                            className="company-option"
                            onClick={() => selectCompany(company)}
                          >
                            <strong>{company.name}</strong>
                            {company.website && <span className="company-website">{company.website}</span>}
                          </div>
                        ))}
                        <div className="company-option default-option" onClick={useDefaultCompany}>
                          <strong>No company</strong>
                          <span>Leave company field empty</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe what this software does and why it's useful..."
                rows="4"
              />
            </div>

            <div className="form-group">
              <label htmlFor="homepage_url">Website URL</label>
              <input
                type="url"
                id="homepage_url"
                name="homepage_url"
                value={formData.homepage_url}
                onChange={handleInputChange}
                placeholder="https://example.com"
              />
            </div>


            <div className="form-actions">
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={isSubmitting || !formData.name || !formData.category}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Solution'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddSolution;
