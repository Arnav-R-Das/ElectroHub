import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Home.css';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [stats, setStats] = useState({ products: 256, users: 1245, orders: 892 });
  const navigate = useNavigate();

  useEffect(() => {
    fetchHomeData();
  }, []);

  const fetchHomeData = async () => {
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        axios.get('http://localhost:5000/api/products?limit=8'),
        axios.get('http://localhost:5000/api/products/categories')
      ]);
      
      setFeaturedProducts(productsRes.data);
      setCategories(['Smartphones', 'Laptops', 'Audio', 'Wearables', 'Gaming']);
      
      // Mock stats
      setStats({
        products: 256,
        users: 1245,
        orders: 892
      });
    } catch (error) {
      console.error('Error fetching home data:', error);
    }
  };

  const CategoryCard = ({ icon, title, count, gradient }) => (
    <div 
      className="category-card"
      style={{ background: gradient }}
      onClick={() => navigate(`/products?category=${title}`)}
    >
      <div className="category-icon">{icon}</div>
      <h3>{title}</h3>
      <p>{count} Products</p>
    </div>
  );

  const StatCard = ({ icon, value, label, color }) => (
    <div className="stat-card">
      <div className="stat-icon" style={{ background: color }}>{icon}</div>
      <div className="stat-content">
        <h3>{value.toLocaleString()}+</h3>
        <p>{label}</p>
      </div>
    </div>
  );

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Discover Amazing Electronics Deals
          </h1>
          <p className="hero-subtitle">
            Shop the latest gadgets, smartphones, laptops, and more with exclusive discounts
          </p>
          <div className="hero-actions">
            <button 
              className="btn-primary btn-hero"
              onClick={() => navigate('/products')}
            >
              Shop Now →
            </button>
            <button 
              className="btn-outline btn-hero"
              onClick={() => navigate('/search?q=discount')}
            >
              View Deals
            </button>
          </div>
          <div className="hero-stats">
            <StatCard icon="🛍️" value={stats.products} label="Products" color="linear-gradient(135deg, #667eea 0%, #764ba2 100%)" />
            <StatCard icon="👥" value={stats.users} label="Happy Customers" color="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)" />
            <StatCard icon="🚚" value={stats.orders} label="Orders Delivered" color="linear-gradient(135deg, #4fd1c5 0%, #38b2ac 100%)" />
          </div>
        </div>
        <div className="hero-image">
          <img src="https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=800&auto=format&fit=crop" alt="Electronics" />
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories-section">
        <div className="section-header">
          <h2>Shop by Category</h2>
          <p>Explore our wide range of electronic categories</p>
        </div>
        <div className="categories-grid">
          <CategoryCard 
            icon="📱" 
            title="Smartphones" 
            count="45" 
            gradient="linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)"
          />
          <CategoryCard 
            icon="💻" 
            title="Laptops" 
            count="32" 
            gradient="linear-gradient(135deg, rgba(240, 147, 251, 0.1) 0%, rgba(245, 87, 108, 0.1) 100%)"
          />
          <CategoryCard 
            icon="🎧" 
            title="Audio" 
            count="67" 
            gradient="linear-gradient(135deg, rgba(79, 209, 197, 0.1) 0%, rgba(56, 178, 172, 0.1) 100%)"
          />
          <CategoryCard 
            icon="⌚" 
            title="Wearables" 
            count="28" 
            gradient="linear-gradient(135deg, rgba(246, 173, 85, 0.1) 0%, rgba(237, 137, 54, 0.1) 100%)"
          />
          <CategoryCard 
            icon="🎮" 
            title="Gaming" 
            count="23" 
            gradient="linear-gradient(135deg, rgba(99, 179, 237, 0.1) 0%, rgba(56, 123, 237, 0.1) 100%)"
          />
        </div>
      </section>

      {/* Featured Products */}
      <section className="featured-section">
        <div className="section-header">
          <h2>Featured Products</h2>
          <p>Top picks from our collection</p>
        </div>
        <div className="products-grid">
          {featuredProducts.map(product => (
            <div 
              key={product._id} 
              className="product-card-featured"
              onClick={() => navigate(`/product/${product._id}`)}
            >
              <div className="product-image">
                <img src={product.image} alt={product.name} />
                {product.discount > 0 && (
                  <div className="discount-tag">-{product.discount}%</div>
                )}
              </div>
              <div className="product-info">
                <span className="product-category">{product.category}</span>
                <h3>{product.name}</h3>
                <div className="product-price">
                  <span className="current">₹{product.price.toLocaleString('en-IN')}</span>
                </div>
                <div className="product-rating">
                  {'★'.repeat(4)}☆
                  <span>({Math.floor(Math.random() * 100) + 1})</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="section-footer">
          <button 
            className="btn-view-all"
            onClick={() => navigate('/products')}
          >
            View All Products →
          </button>
        </div>
      </section>

      {/* Banner Section */}
      <section className="banner-section">
        <div className="banner-content">
          <h2>Summer Sale!</h2>
          <p>Up to 50% off on selected items</p>
          <button 
            className="btn-banner"
            onClick={() => navigate('/search?q=discount')}
          >
            Shop Sale
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="features-grid">
          <div className="feature">
            <div className="feature-icon">🚚</div>
            <h3>Free Shipping</h3>
            <p>Free delivery on orders above ₹999</p>
          </div>
          <div className="feature">
            <div className="feature-icon">↩️</div>
            <h3>Easy Returns</h3>
            <p>30-day return policy</p>
          </div>
          <div className="feature">
            <div className="feature-icon">🔒</div>
            <h3>Secure Payment</h3>
            <p>100% secure payment methods</p>
          </div>
          <div className="feature">
            <div className="feature-icon">🛡️</div>
            <h3>2-Year Warranty</h3>
            <p>Extended warranty on all products</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;