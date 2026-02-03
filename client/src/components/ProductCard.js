import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleAddToCart = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    try {
      const response = await fetch('http://localhost:5000/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          productId: product._id,
          quantity: 1
        })
      });
      
      if (response.ok) {
        // Show success notification
        const event = new CustomEvent('showNotification', {
          detail: { message: 'Added to cart!', type: 'success' }
        });
        window.dispatchEvent(event);
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const handleQuickView = () => {
    navigate(`/product/${product._id}`);
  };

  const discountedPrice = product.discount > 0 
    ? Math.round(product.price * (100 - product.discount) / 100)
    : product.price;

  return (
    <div 
      className="product-card animate-fade-in"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="product-image-container">
        <img
          src={imageError 
            ? 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&auto=format&fit=crop'
            : product.image
          }
          alt={product.name}
          className="product-image"
          onError={() => setImageError(true)}
          loading="lazy"
        />
        
        <div className="product-badges">
          {product.discount > 0 && (
            <div className="badge badge-secondary">
              -{product.discount}% OFF
            </div>
          )}
          {product.stock < 10 && product.stock > 0 && (
            <div className="badge badge-danger">
              Only {product.stock} left
            </div>
          )}
          {product.stock === 0 && (
            <div className="badge badge-danger">
              Out of Stock
            </div>
          )}
        </div>

        {/* Quick Actions on Hover */}
        {isHovered && (
          <div className="quick-actions">
            <button 
              className="action-btn primary"
              onClick={handleAddToCart}
              disabled={product.stock === 0}
            >
              🛒 Add to Cart
            </button>
            <button 
              className="action-btn"
              onClick={handleQuickView}
            >
              👁 Quick View
            </button>
          </div>
        )}
      </div>
      
      <div className="product-info">
        <div className="product-category">
          {product.category} • {product.brand}
        </div>
        
        <h3 className="product-title">{product.name}</h3>
        
        <div className="product-price">
          <span className="current-price">
            ₹{discountedPrice.toLocaleString('en-IN')}
          </span>
          {product.discount > 0 && (
            <>
              <span className="original-price">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
            </>
          )}
        </div>
        
        <div className="product-rating">
          <div className="stars">
            {'★'.repeat(Math.floor(product.ratings || 4))}
            {'☆'.repeat(5 - Math.floor(product.ratings || 4))}
          </div>
          <span className="rating-count">
            ({Math.floor(Math.random() * 100) + 1} reviews)
          </span>
        </div>
        
        <div className="product-actions">
          <button 
            className="action-btn"
            onClick={() => navigate(`/product/${product._id}`)}
          >
            📝 Details
          </button>
          <button 
            className="action-btn"
            onClick={() => {/* Add to wishlist */}}
          >
            ♡ Wishlist
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;