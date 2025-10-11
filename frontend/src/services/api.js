const API_BASE_URL = 'http://localhost:8080/api/v1';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Get auth token from localStorage
  getAuthToken() {
    return localStorage.getItem('authToken');
  }

  // Set auth token in localStorage
  setAuthToken(token) {
    localStorage.setItem('authToken', token);
  }

  // Remove auth token from localStorage
  removeAuthToken() {
    localStorage.removeItem('authToken');
  }

  // Generic request method
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const token = this.getAuthToken();

    const config = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    // Add Authorization header if token exists
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.details || 'Request failed');
      }

      return data;
    } catch (error) {
      console.error('API request error:', error);
      throw error;
    }
  }

  // Auth endpoints
  async login(email, password) {
    const data = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    if (data.token) {
      this.setAuthToken(data.token);
    }
    
    return data;
  }

  async register(email, password, handle) {
    const data = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, handle }),
    });
    
    if (data.token) {
      this.setAuthToken(data.token);
    }
    
    return data;
  }

  async getProfile() {
    return this.request('/auth/profile');
  }

  logout() {
    this.removeAuthToken();
  }

  // Product endpoints
  async getProducts(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `/products?${queryString}` : '/products';
    return this.request(endpoint);
  }

  async getProduct(id) {
    return this.request(`/products/${id}`);
  }

  async getProductBySlug(slug) {
    return this.request(`/products/slug/${slug}`);
  }

  async searchProducts(query) {
    return this.request(`/products/search?q=${encodeURIComponent(query)}`);
  }

  async getProductsByCategory(category) {
    return this.request(`/products/category/${category}`);
  }

  async getProductsByCompany(companyId) {
    return this.request(`/products/company/${companyId}`);
  }

  async createProduct(productData) {
    return this.request('/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
  }

  async updateProduct(id, productData) {
    return this.request(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    });
  }

  async deleteProduct(id) {
    return this.request(`/products/${id}`, {
      method: 'DELETE',
    });
  }

  // Company endpoints
  async getCompanies(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `/companies?${queryString}` : '/companies';
    return this.request(endpoint);
  }

  async getCompany(id) {
    return this.request(`/companies/${id}`);
  }

  async getCompanyBySlug(slug) {
    return this.request(`/companies/slug/${slug}`);
  }

  async searchCompanies(query) {
    return this.request(`/companies/search?q=${encodeURIComponent(query)}`);
  }

  async createCompany(companyData) {
    return this.request('/companies', {
      method: 'POST',
      body: JSON.stringify(companyData),
    });
  }

  async updateCompany(id, companyData) {
    return this.request(`/companies/${id}`, {
      method: 'PUT',
      body: JSON.stringify(companyData),
    });
  }

  async deleteCompany(id) {
    return this.request(`/companies/${id}`, {
      method: 'DELETE',
    });
  }

  // Review endpoints
  async getReviewsByProduct(productId) {
    return this.request(`/reviews/product/${productId}`);
  }

  async getReviewsByUser(userId) {
    return this.request(`/reviews/user/${userId}`);
  }

  async getReview(id) {
    return this.request(`/reviews/${id}`);
  }

  async createReview(reviewData) {
    return this.request('/reviews', {
      method: 'POST',
      body: JSON.stringify(reviewData),
    });
  }

  async updateReview(id, reviewData) {
    return this.request(`/reviews/${id}`, {
      method: 'PUT',
      body: JSON.stringify(reviewData),
    });
  }

  async deleteReview(id) {
    return this.request(`/reviews/${id}`, {
      method: 'DELETE',
    });
  }

  async upvoteReview(id) {
    return this.request(`/reviews/${id}/upvote`, {
      method: 'POST',
    });
  }

  async downvoteReview(id) {
    return this.request(`/reviews/${id}/downvote`, {
      method: 'POST',
    });
  }

  async flagReview(id, reason) {
    return this.request(`/reviews/${id}/flag`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    });
  }
}

// Export a singleton instance
const apiService = new ApiService();
export default apiService;

