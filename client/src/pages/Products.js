import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import { useAuth } from '../context/AuthContext';
import './Products.css';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [sortBy, setSortBy] = useState('featured');
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  useEffect(() => {
    filterAndSortProducts();
  }, [products, selectedCategory, priceRange, sortBy]);

  // Extract category from URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const category = params.get('category');
    if (category) {
      setSelectedCategory(category);
    }
  }, [location]);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/products');
      setProducts(response.data);
      setFilteredProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const categories = ['all', 'Smartphones', 'Laptops', 'Audio', 'Wearables', 'Gaming', 'Cameras', 'Tablets'];
      setCategories(categories);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const filterAndSortProducts = () => {
    let filtered = [...products];

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => 
        product.category === selectedCategory
      );
    }

    // Filter by price
    filtered = filtered.filter(product => 
      product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    // Sort products
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => (b.ratings || 0) - (a.ratings || 0));
        break;
      case 'discount':
        filtered.sort((a, b) => (b.discount || 0) - (a.discount || 0));
        break;
      default:
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    setFilteredProducts(filtered);
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    navigate(`/products?category=${category}`);
  };

  const handlePriceChange = (min, max) => {
    setPriceRange([min, max]);
  };

  const handleAddToCart = async (productId) => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/cart', {
        productId,
        quantity: 1
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const event = new CustomEvent('showNotification', {
        detail: { message: 'Added to cart!', type: 'success' }
      });
      window.dispatchEvent(event);
    } catch (error) {
      const event = new CustomEvent('showNotification', {
        detail: { message: 'Failed to add to cart', type: 'error' }
      });
      window.dispatchEvent(event);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading products...</p>
      </div>
    );
  }

  return (
    <div className="products-page">
      {/* Hero Banner */}
      <div className="products-hero">
        <h1>Our Collection</h1>
        <p>Discover the latest electronics and gadgets</p>
      </div>

      <div className="products-container">
        {/* Filters Sidebar */}
        <div className="filters-sidebar">
          <div className="filter-section">
            <h3>Categories</h3>
            <div className="category-filters">
              {categories.map(category => (
                <button
                  key={category}
                  className={`category-filter ${selectedCategory === category ? 'active' : ''}`}
                  onClick={() => handleCategorySelect(category)}
                >
                  <span className="filter-name">{category === 'all' ? 'All Categories' : category}</span>
                  <span className="filter-count">
                    ({category === 'all' ? products.length : products.filter(p => p.category === category).length})
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="filter-section">
            <h3>Price Range</h3>
            <div className="price-filter">
              <div className="price-inputs">
                <input
                  type="number"
                  value={priceRange[0]}
                  onChange={(e) => handlePriceChange(Number(e.target.value), priceRange[1])}
                  placeholder="Min"
                  className="price-input"
                />
                <span className="price-separator">to</span>
                <input
                  type="number"
                  value={priceRange[1]}
                  onChange={(e) => handlePriceChange(priceRange[0], Number(e.target.value))}
                  placeholder="Max"
                  className="price-input"
                />
              </div>
              <div className="price-slider">
                <input
                  type="range"
                  min="0"
                  max="200000"
                  value={priceRange[1]}
                  onChange={(e) => handlePriceChange(priceRange[0], Number(e.target.value))}
                  className="slider"
                />
                <div className="price-labels">
                  <span>₹0</span>
                  <span>₹{priceRange[1].toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="filter-section">
            <h3>Sort By</h3>
            <div className="sort-options">
              {[
                { value: 'featured', label: 'Featured' },
                { value: 'price-low', label: 'Price: Low to High' },
                { value: 'price-high', label: 'Price: High to Low' },
                { value: 'rating', label: 'Highest Rated' },
                { value: 'discount', label: 'Best Discount' },
                { value: 'newest', label: 'Newest Arrivals' }
              ].map(option => (
                <button
                  key={option.value}
                  className={`sort-option ${sortBy === option.value ? 'active' : ''}`}
                  onClick={() => setSortBy(option.value)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <button 
            className="clear-filters"
            onClick={() => {
              setSelectedCategory('all');
              setPriceRange([0, 100000]);
              setSortBy('featured');
            }}
          >
            Clear All Filters
          </button>
        </div>

        {/* Products Grid */}
        <div className="products-main">
          <div className="products-header">
            <div className="results-info">
              <h2>{selectedCategory === 'all' ? 'All Products' : selectedCategory}</h2>
              <p>{filteredProducts.length} products found</p>
            </div>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="no-products">
              <div className="no-products-icon">🔍</div>
              <h3>No products found</h3>
              <p>Try adjusting your filters</p>
              <button 
                className="btn-primary"
                onClick={() => {
                  setSelectedCategory('all');
                  setPriceRange([0, 100000]);
                }}
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <>
              <div className="products-grid">
                {filteredProducts.map(product => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    onAddToCart={handleAddToCart}
                  />
                ))}
              </div>
              
              {/* Pagination */}
              <div className="pagination">
                <button className="pagination-btn" disabled>Previous</button>
                <div className="pagination-numbers">
                  <button className="page-number active">1</button>
                  <button className="page-number">2</button>
                  <button className="page-number">3</button>
                  <span className="page-dots">...</span>
                  <button className="page-number">10</button>
                </div>
                <button className="pagination-btn">Next</button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;