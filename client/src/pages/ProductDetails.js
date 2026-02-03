import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './ProductDetails.css';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    fetchProductDetails();
  }, [id]);

  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      const [productRes, relatedRes] = await Promise.all([
        axios.get(`http://localhost:5000/api/products/${id}`),
        axios.get(`http://localhost:5000/api/products?category=${encodeURIComponent(product?.category || 'Electronics')}&limit=4`)
      ]);
      
      setProduct(productRes.data);
      setRelatedProducts(relatedRes.data.filter(p => p._id !== id).slice(0, 4));
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/cart', {
        productId: id,
        quantity: quantity
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

  const handleAddToWishlist = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/wishlist', {
        productId: id
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const event = new CustomEvent('showNotification', {
        detail: { message: 'Added to wishlist!', type: 'success' }
      });
      window.dispatchEvent(event);
    } catch (error) {
      const event = new CustomEvent('showNotification', {
        detail: { message: 'Failed to add to wishlist', type: 'error' }
      });
      window.dispatchEvent(event);
    }
  };

  const handleBuyNow = async () => {
    await handleAddToCart();
    navigate('/cart');
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="error-container">
        <h2>Product not found</h2>
        <button onClick={() => navigate('/products')}>Browse Products</button>
      </div>
    );
  }

  const discountedPrice = product.discount > 0
    ? Math.round(product.price * (100 - product.discount) / 100)
    : product.price;

  const images = [
    product.image,
    'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500&auto=format&fit=crop'
  ];

  return (
    <div className="product-details-page">
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <span onClick={() => navigate('/')}>Home</span>
        <span>›</span>
        <span onClick={() => navigate('/products')}>Products</span>
        <span>›</span>
        <span onClick={() => navigate(`/products?category=${product.category}`)}>{product.category}</span>
        <span>›</span>
        <span className="current">{product.name}</span>
      </div>

      <div className="product-details-container">
        {/* Product Images */}
        <div className="product-images">
          <div className="main-image">
            <img src={images[selectedImage]} alt={product.name} />
            {product.discount > 0 && (
              <div className="discount-badge-large">-{product.discount}%</div>
            )}
          </div>
          <div className="thumbnail-images">
            {images.map((img, index) => (
              <div
                key={index}
                className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                onClick={() => setSelectedImage(index)}
              >
                <img src={img} alt={`Product view ${index + 1}`} />
              </div>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="product-info">
          <div className="product-header">
            <span className="product-category">{product.category}</span>
            <h1 className="product-title">{product.name}</h1>
            <div className="product-brand">by {product.brand}</div>
          </div>

          <div className="product-rating-section">
            <div className="stars-large">
              {'★'.repeat(Math.floor(product.ratings || 4))}
              {'☆'.repeat(5 - Math.floor(product.ratings || 4))}
            </div>
            <span className="rating-text">
              {product.ratings || 4.0} • 124 reviews • 234 sold
            </span>
          </div>

          <div className="price-section">
            <div className="current-price-large">
              ₹{discountedPrice.toLocaleString('en-IN')}
            </div>
            {product.discount > 0 && (
              <div className="original-price-section">
                <span className="original-price-large">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
                <span className="discount-amount">
                  Save ₹{(product.price - discountedPrice).toLocaleString('en-IN')}
                </span>
              </div>
            )}
          </div>

          <div className="stock-status">
            <span className={`stock-badge ${product.stock > 10 ? 'in-stock' : 'low-stock'}`}>
              {product.stock > 10 ? 'In Stock' : `Only ${product.stock} left`}
            </span>
            <span className="delivery-info">✓ Free delivery</span>
          </div>

          {/* Quantity Selector */}
          <div className="quantity-selector">
            <label>Quantity:</label>
            <div className="quantity-controls">
              <button 
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                className="quantity-btn"
              >
                −
              </button>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                min="1"
                max={product.stock}
                className="quantity-input"
              />
              <button 
                onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                className="quantity-btn"
              >
                +
              </button>
            </div>
            <span className="stock-left">{product.stock} available</span>
          </div>

          {/* Action Buttons */}
          <div className="action-buttons">
            <button 
              onClick={handleAddToCart}
              className="btn-cart"
              disabled={product.stock === 0}
            >
              <span className="btn-icon">🛒</span>
              Add to Cart
            </button>
            <button 
              onClick={handleBuyNow}
              className="btn-buy"
              disabled={product.stock === 0}
            >
              Buy Now
            </button>
            <button 
              onClick={handleAddToWishlist}
              className="btn-wishlist"
            >
              <span className="btn-icon">♡</span>
              Add to Wishlist
            </button>
          </div>

          {/* Product Details */}
          <div className="product-specs">
            <h3>Specifications</h3>
            <div className="specs-grid">
              <div className="spec-item">
                <span className="spec-label">Brand</span>
                <span className="spec-value">{product.brand}</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">Category</span>
                <span className="spec-value">{product.category}</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">Stock</span>
                <span className="spec-value">{product.stock} units</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">Ratings</span>
                <span className="spec-value">{product.ratings || 4.0}/5</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Description */}
      <div className="product-description">
        <h2>Description</h2>
        <p>{product.description}</p>
        
        <div className="features">
          <h3>Key Features</h3>
          <ul>
            <li>Premium quality materials</li>
            <li>1-year manufacturer warranty</li>
            <li>Free shipping across India</li>
            <li>7-day return policy</li>
            <li>24/7 customer support</li>
          </ul>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="related-products">
          <h2>Related Products</h2>
          <div className="products-grid">
            {relatedProducts.map(relatedProduct => (
              <div
                key={relatedProduct._id}
                className="related-product-card"
                onClick={() => navigate(`/product/${relatedProduct._id}`)}
              >
                <img src={relatedProduct.image} alt={relatedProduct.name} />
                <h4>{relatedProduct.name}</h4>
                <div className="price">
                  ₹{relatedProduct.price.toLocaleString('en-IN')}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;