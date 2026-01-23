import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from './ProductCard';
import './ProductList.css';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortOption, setSortOption] = useState('newest');

  const categories = ['All', 'Electronics', 'Clothing', 'Books', 'Home', 'Sports', 'Other'];

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/products');
      setProducts(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load products. Please try again later.');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(product => 
    selectedCategory === 'All' || product.category === selectedCategory
  );

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortOption) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      case 'newest':
      default:
        return new Date(b.createdAt) - new Date(a.createdAt);
    }
  });

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
        <button onClick={fetchProducts} className="retry-btn">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="product-list-container">
      <div className="product-header">
        <h2>Our Products</h2>
        <p>Discover amazing products at great prices</p>
      </div>

      <div className="filter-controls">
        <div className="category-filter">
          <label>Filter by Category:</label>
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
          </select>
        </div>
      </div>

      {sortedProducts.length === 0 ? (
        <div className="no-products">
          <p>No products found in {selectedCategory} category.</p>
        </div>
      ) : (
        <>
          <div className="product-grid">
            {sortedProducts.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
          
          <div className="product-stats">
            <p>
              Showing {sortedProducts.length} of {products.length} products
              {selectedCategory !== 'All' && ` in ${selectedCategory}`}
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default ProductList;