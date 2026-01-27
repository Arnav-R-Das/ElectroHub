import React from 'react';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="product-card">
      <div className="product-image-container">
        <img 
          src={product.image} 
          alt={product.name} 
          className="product-image"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/300x300.png?text=No+Image';
          }}
        />
        {!product.inStock && (
          <div className="out-of-stock">Out of Stock</div>
        )}
        {product.discount > 0 && (
          <div className="discount-badge">{product.discount}% OFF</div>
        )}
        {product.isBestSeller && (
          <div className="best-seller-badge">Best Seller</div>
        )}
      </div>
      
      <div className="product-info">
        <span className="product-brand">{product.brand}</span>
        
        <h3 className="product-name">{product.name}</h3>
        
        <p className="product-description">
          {product.description.length > 100 
            ? `${product.description.substring(0, 100)}...` 
            : product.description}
        </p>
        
        <div className="product-rating">
          <div className="stars">
            {[...Array(5)].map((_, i) => (
              <span 
                key={i} 
                className={`star ${i < Math.floor(product.rating || 0) ? 'filled' : ''}`}
              >
                ★
              </span>
            ))}
          </div>
          <span className="rating-number">({(product.rating || 0).toFixed(1)})</span>
          <span className="reviews">• {product.reviews || 0} reviews</span>
        </div>
        
        <div className="product-footer">
          <div className="price-container">
            <div className="price-wrapper">
              <span className="product-price">{formatPrice(product.price || 0)}</span>
              {product.originalPrice > product.price && (
                <span className="original-price">{formatPrice(product.originalPrice)}</span>
              )}
            </div>
            {product.inStock ? (
              <span className="in-stock">In Stock ✓</span>
            ) : (
              <span className="out-of-stock-text">Out of Stock</span>
            )}
          </div>
          
          <button 
            className="add-to-cart-btn"
            disabled={!product.inStock}
          >
            {product.inStock ? 'Add to Cart' : 'Out of Stock'}
          </button>
          
          {product.emiAvailable && product.inStock && (
            <div className="emi-info">
              No Cost EMI available
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;