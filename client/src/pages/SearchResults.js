import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import { useAuth } from '../context/AuthContext';
import './SearchResults.css';

const SearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    brands: [],
    categories: []
  });
  const [selectedFilters, setSelectedFilters] = useState({
    category: 'all',
    brand: 'all',
    minPrice: '',
    maxPrice: '',
    sort: 'newest'
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [totalResults, setTotalResults] = useState(0);

  // Get query from URL
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const q = queryParams.get('q') || '';
    const category = queryParams.get('category') || 'all';
    const brand = queryParams.get('brand') || 'all';
    const minPrice = queryParams.get('minPrice') || '';
    const maxPrice = queryParams.get('maxPrice') || '';
    const sort = queryParams.get('sort') || 'newest';
    
    setSearchQuery(q);
    setSelectedFilters({
      category,
      brand,
      minPrice,
      maxPrice,
      sort
    });
  }, [location]);

  // Fetch search results
  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!searchQuery && selectedFilters.category === 'all') {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const params = {
          q: searchQuery,
          ...selectedFilters
        };
        
        const response = await axios.get('http://localhost:5000/api/products/search', { params });
        setProducts(response.data.products);
        setFilters(response.data.filters);
        setTotalResults(response.data.total);
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [searchQuery, selectedFilters]);

  const handleFilterChange = (filterName, value) => {
    const newFilters = {
      ...selectedFilters,
      [filterName]: value
    };
    setSelectedFilters(newFilters);
    updateURL(newFilters);
  };

  const clearFilters = () => {
    const defaultFilters = {
      category: 'all',
      brand: 'all',
      minPrice: '',
      maxPrice: '',
      sort: 'newest'
    };
    setSelectedFilters(defaultFilters);
    updateURL(defaultFilters);
  };

  const updateURL = (filters) => {
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    if (filters.category !== 'all') params.set('category', filters.category);
    if (filters.brand !== 'all') params.set('brand', filters.brand);
    if (filters.minPrice) params.set('minPrice', filters.minPrice);
    if (filters.maxPrice) params.set('maxPrice', filters.maxPrice);
    if (filters.sort !== 'newest') params.set('sort', filters.sort);
    
    navigate({ search: params.toString() });
  };

  const addToCart = async (productId) => {
    if (!user) {
      alert('Please login to add items to cart');
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/cart', {
        productId,
        quantity: 1
      });
      alert('Added to cart successfully!');
    } catch (error) {
      alert('Failed to add to cart');
    }
  };

  const formatPrice = (price) => {
    return `₹${price.toLocaleString('en-IN')}`;
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Searching products...</p>
      </div>
    );
  }

  return (
    <div className="search-results-page">
      {/* Search Header */}
      <div className="search-header">
        <h1 className="search-title">
          {searchQuery ? `Search Results for "${searchQuery}"` : 'All Products'}
        </h1>
        <p className="search-results-count">
          Found {totalResults} product{totalResults !== 1 ? 's' : ''}
        </p>
      </div>

      <div className="search-layout">
        {/* Filters Sidebar */}
        <div className="filters-sidebar">
          <div className="filters-header">
            <h3>Filters</h3>
            <button onClick={clearFilters} className="clear-filters">
              Clear All
            </button>
          </div>

          {/* Category Filter */}
          <div className="filter-section">
            <h4 className="filter-title">Category</h4>
            <div className="filter-options">
              <button
                className={`filter-option ${selectedFilters.category === 'all' ? 'active' : ''}`}
                onClick={() => handleFilterChange('category', 'all')}
              >
                All Categories
              </button>
              {filters.categories.map(category => (
                <button
                  key={category}
                  className={`filter-option ${selectedFilters.category === category ? 'active' : ''}`}
                  onClick={() => handleFilterChange('category', category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Brand Filter */}
          {filters.brands.length > 0 && (
            <div className="filter-section">
              <h4 className="filter-title">Brand</h4>
              <div className="filter-options">
                <button
                  className={`filter-option ${selectedFilters.brand === 'all' ? 'active' : ''}`}
                  onClick={() => handleFilterChange('brand', 'all')}
                >
                  All Brands
                </button>
                {filters.brands.map(brand => (
                  <button
                    key={brand}
                    className={`filter-option ${selectedFilters.brand === brand ? 'active' : ''}`}
                    onClick={() => handleFilterChange('brand', brand)}
                  >
                    {brand}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Price Filter */}
          <div className="filter-section">
            <h4 className="filter-title">Price Range</h4>
            <div className="price-inputs">
              <div className="price-input-group">
                <label>Min Price (₹)</label>
                <input
                  type="number"
                  value={selectedFilters.minPrice}
                  onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                  placeholder="0"
                  min="0"
                />
              </div>
              <div className="price-input-group">
                <label>Max Price (₹)</label>
                <input
                  type="number"
                  value={selectedFilters.maxPrice}
                  onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                  placeholder="100000"
                  min="0"
                />
              </div>
            </div>
          </div>

          {/* Sort Options */}
          <div className="filter-section">
            <h4 className="filter-title">Sort By</h4>
            <div className="filter-options">
              <button
                className={`filter-option ${selectedFilters.sort === 'newest' ? 'active' : ''}`}
                onClick={() => handleFilterChange('sort', 'newest')}
              >
                Newest First
              </button>
              <button
                className={`filter-option ${selectedFilters.sort === 'price-low' ? 'active' : ''}`}
                onClick={() => handleFilterChange('sort', 'price-low')}
              >
                Price: Low to High
              </button>
              <button
                className={`filter-option ${selectedFilters.sort === 'price-high' ? 'active' : ''}`}
                onClick={() => handleFilterChange('sort', 'price-high')}
              >
                Price: High to Low
              </button>
              <button
                className={`filter-option ${selectedFilters.sort === 'rating' ? 'active' : ''}`}
                onClick={() => handleFilterChange('sort', 'rating')}
              >
                Highest Rated
              </button>
              <button
                className={`filter-option ${selectedFilters.sort === 'discount' ? 'active' : ''}`}
                onClick={() => handleFilterChange('sort', 'discount')}
              >
                Best Discount
              </button>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="search-results-content">
          {/* Active Filters */}
          <div className="active-filters">
            {selectedFilters.category !== 'all' && (
              <span className="active-filter">
                Category: {selectedFilters.category}
                <button onClick={() => handleFilterChange('category', 'all')}>×</button>
              </span>
            )}
            {selectedFilters.brand !== 'all' && (
              <span className="active-filter">
                Brand: {selectedFilters.brand}
                <button onClick={() => handleFilterChange('brand', 'all')}>×</button>
              </span>
            )}
            {selectedFilters.minPrice && (
              <span className="active-filter">
                Min: ₹{selectedFilters.minPrice}
                <button onClick={() => handleFilterChange('minPrice', '')}>×</button>
              </span>
            )}
            {selectedFilters.maxPrice && (
              <span className="active-filter">
                Max: ₹{selectedFilters.maxPrice}
                <button onClick={() => handleFilterChange('maxPrice', '')}>×</button>
              </span>
            )}
          </div>

          {/* Products */}
          {products.length === 0 ? (
            <div className="no-results">
              <div className="no-results-icon">🔍</div>
              <h3>No products found</h3>
              <p>Try adjusting your search or filters</p>
              <button onClick={clearFilters} className="btn-primary">
                Clear Filters
              </button>
            </div>
          ) : (
            <>
              <div className="products-grid">
                {products.map(product => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    onAddToCart={addToCart}
                  />
                ))}
              </div>
              
              {/* Pagination (optional) */}
              {totalResults > products.length && (
                <div className="pagination">
                  <button className="pagination-btn" disabled>
                    Previous
                  </button>
                  <span className="pagination-info">
                    Showing {products.length} of {totalResults} products
                  </span>
                  <button className="pagination-btn">
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchResults;