import React from 'react';
import './ProductCard.css';

const ProductCard = ({ product }) => {
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
      </div>
      
      <div className="product-info">
        <span className="product-category">{product.category}</span>
        
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
                className={`star ${i < Math.floor(product.rating) ? 'filled' : ''}`}
              >
                ★
              </span>
            ))}
          </div>
          <span className="rating-number">({product.rating.toFixed(1)})</span>
          <span className="reviews">• {product.reviews} reviews</span>
        </div>
        
        <div className="product-footer">
          <div className="price-container">
            <span className="product-price">₹{product.price.toFixed(2)}</span>
            {product.inStock && (
              <span className="in-stock">In Stock ✓</span>
            )}
          </div>
          
          <button 
            className="add-to-cart-btn"
            disabled={!product.inStock}
          >
            {product.inStock ? 'Add to Cart' : 'Out of Stock'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;