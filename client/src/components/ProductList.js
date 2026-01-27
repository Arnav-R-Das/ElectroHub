import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from './ProductCard';
import './ProductList.css';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortOption, setSortOption] = useState('newest');
  const [searchQuery, setSearchQuery] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  // Categories that match exactly with database
  const categories = [
    'All', 
    'Smartphones', 
    'Laptops', 
    'Tablets', 
    'Audio', 
    'Wearables', 
    'TVs & Monitors', 
    'Cameras', 
    'Gaming', 
    'Accessories', 
    'Home Appliances'
  ];

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterAndSortProducts();
  }, [products, selectedCategory, sortOption, searchQuery, minPrice, maxPrice]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      console.log('Fetching products...');
      
      // Fetch all products without limit
      const response = await axios.get('/api/products', {
        params: {
          limit: 200 // Request more products
        }
      });
      
      console.log('API Response:', response.data);
      
      if (response.data && response.data.products) {
        setProducts(response.data.products);
        setFilteredProducts(response.data.products);
      } else if (Array.isArray(response.data)) {
        setProducts(response.data);
        setFilteredProducts(response.data);
      } else {
        setProducts([]);
        setFilteredProducts([]);
      }
      
      setError(null);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load products. Please check if server is running.');
      setProducts([]);
      setFilteredProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortProducts = () => {
    if (!Array.isArray(products)) {
      setFilteredProducts([]);
      return;
    }

    let result = [...products];

    // Filter by category
    if (selectedCategory !== 'All') {
      result = result.filter(product => 
        product.category === selectedCategory
      );
    }

    // Filter by search query
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      result = result.filter(product =>
        product.name.toLowerCase().includes(query) ||
        product.brand.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query)
      );
    }

    // Filter by price range
    if (minPrice) {
      const min = parseFloat(minPrice);
      if (!isNaN(min)) {
        result = result.filter(product => product.price >= min);
      }
    }

    if (maxPrice) {
      const max = parseFloat(maxPrice);
      if (!isNaN(max)) {
        result = result.filter(product => product.price <= max);
      }
    }

    // Sort products
    result.sort((a, b) => {
      switch (sortOption) {
        case 'price-low':
          return (a.price || 0) - (b.price || 0);
        case 'price-high':
          return (b.price || 0) - (a.price || 0);
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'discount':
          return (b.discount || 0) - (a.discount || 0);
        case 'newest':
        default:
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      }
    });

    setFilteredProducts(result);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    filterAndSortProducts();
  };

  const handleResetFilters = () => {
    setSelectedCategory('All');
    setSortOption('newest');
    setSearchQuery('');
    setMinPrice('');
    setMaxPrice('');
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p className="error-message">{error}</p>
        <div className="server-check">
          <p>Make sure:</p>
          <ol>
            <li>MongoDB is running: <code>sudo systemctl status mongodb</code></li>
            <li>Server is running: <code>cd server && npm run dev</code></li>
            <li>Database is seeded: <code>cd server && node fixedSeed.js</code></li>
          </ol>
        </div>
        <button onClick={fetchProducts} className="retry-btn">
          Retry Loading Products
        </button>
      </div>
    );
  }

  return (
    <div className="product-list-container">
      <div className="product-header">
        <h2>ElectroHub - Electronics Store</h2>
        <p>Discover amazing electronics products at great prices in India</p>
      </div>

      <div className="filter-controls">
        {/* Search Bar */}
        <div className="search-bar-container">
          <form onSubmit={handleSearch} className="search-form">
            <input
              type="text"
              placeholder="Search products, brands..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input-large"
            />
            <button type="submit" className="search-btn">
              <span className="search-icon">🔍</span> Search
            </button>
          </form>
        </div>

        {/* Price Filter */}
        <div className="price-filter">
          <label>Price Range (₹):</label>
          <div className="price-inputs">
            <input
              type="number"
              placeholder="Min"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="price-input"
            />
            <span>to</span>
            <input
              type="number"
              placeholder="Max"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="price-input"
            />
          </div>
        </div>

        {/* Category Filter */}
        <div className="category-filter">
          <label>Category:</label>
          <div className="category-buttons">
            {categories.map(category => (
              <button
                key={category}
                className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Sort and Reset */}
        <div className="sort-reset-container">
          <div className="sort-filter">
            <label>Sort by:</label>
            <select 
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="sort-select"
            >
              <option value="newest">Newest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="discount">Highest Discount</option>
            </select>
          </div>

          <button onClick={handleResetFilters} className="reset-btn">
            Reset Filters
          </button>
        </div>
      </div>

      {/* Products Count */}
      <div className="products-count">
        <p>
          Showing <strong>{filteredProducts.length}</strong> of <strong>{products.length}</strong> products
          {selectedCategory !== 'All' && ` in ${selectedCategory}`}
          {searchQuery && ` matching "${searchQuery}"`}
        </p>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="no-products">
          <p>No products found. Try changing your filters or search query.</p>
          <button onClick={handleResetFilters} className="retry-btn">
            Reset All Filters
          </button>
        </div>
      ) : (
        <>
          <div className="product-grid">
            {filteredProducts.map(product => (
              <ProductCard key={product._id || product.id} product={product} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ProductList;