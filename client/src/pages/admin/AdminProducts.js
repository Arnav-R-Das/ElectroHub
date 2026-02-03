import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import './AdminProducts.css';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    brand: '',
    image: '',
    stock: '',
    discount: '',
    ratings: ''
  });
  const [errors, setErrors] = useState({});
  const { user } = useAuth();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Product name is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.price || formData.price <= 0) newErrors.price = 'Valid price is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.brand) newErrors.brand = 'Brand is required';
    if (!formData.stock || formData.stock < 0) newErrors.stock = 'Valid stock is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      const token = localStorage.getItem('token');
      
      if (editingProduct) {
        // Update product
        await axios.put(
          `http://localhost:5000/api/products/${editingProduct._id}`,
          formData,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );
        
        const event = new CustomEvent('showNotification', {
          detail: { message: 'Product updated successfully!', type: 'success' }
        });
        window.dispatchEvent(event);
      } else {
        // Add new product
        await axios.post(
          'http://localhost:5000/api/products',
          formData,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );
        
        const event = new CustomEvent('showNotification', {
          detail: { message: 'Product added successfully!', type: 'success' }
        });
        window.dispatchEvent(event);
      }
      
      resetForm();
      fetchProducts();
    } catch (error) {
      const event = new CustomEvent('showNotification', {
        detail: { 
          message: error.response?.data?.message || 'Operation failed', 
          type: 'error' 
        }
      });
      window.dispatchEvent(event);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      brand: product.brand,
      image: product.image,
      stock: product.stock,
      discount: product.discount || '',
      ratings: product.ratings || ''
    });
    setShowAddForm(true);
  };

  const handleDelete = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/products/${productId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const event = new CustomEvent('showNotification', {
        detail: { message: 'Product deleted successfully!', type: 'success' }
      });
      window.dispatchEvent(event);
      
      fetchProducts();
    } catch (error) {
      const event = new CustomEvent('showNotification', {
        detail: { message: 'Failed to delete product', type: 'error' }
      });
      window.dispatchEvent(event);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      category: '',
      brand: '',
      image: '',
      stock: '',
      discount: '',
      ratings: ''
    });
    setErrors({});
    setEditingProduct(null);
    setShowAddForm(false);
  };

  const categories = ['Smartphones', 'Laptops', 'Audio', 'Wearables', 'Gaming', 'Cameras', 'Tablets', 'Monitors', 'Smart Home'];
  const brands = ['Apple', 'Samsung', 'OnePlus', 'Dell', 'HP', 'Sony', 'LG', 'Canon', 'Nikon', 'Google', 'Amazon'];

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="spinner"></div>
        <p>Loading products...</p>
      </div>
    );
  }

  return (
    <div className="admin-products">
      {/* Header */}
      <div className="admin-header">
        <h1>Products Management</h1>
        <p>Manage your product inventory</p>
      </div>

      {/* Stats Cards */}
      <div className="admin-stats">
        <div className="stat-card">
          <div className="stat-icon">📦</div>
          <div className="stat-content">
            <h3>{products.length}</h3>
            <p>Total Products</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <h3>₹{(products.reduce((sum, p) => sum + p.price, 0) / products.length).toFixed(0)}</h3>
            <p>Average Price</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <h3>{products.filter(p => p.stock < 10).length}</h3>
            <p>Low Stock</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⭐</div>
          <div className="stat-content">
            <h3>{(products.reduce((sum, p) => sum + (p.ratings || 0), 0) / products.length).toFixed(1)}</h3>
            <p>Avg Rating</p>
          </div>
        </div>
      </div>

      {/* Add/Edit Product Form */}
      <div className={`product-form-container ${showAddForm ? 'active' : ''}`}>
        <div className="form-header">
          <h2>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
          <button className="close-form" onClick={resetForm}>×</button>
        </div>
        
        <form onSubmit={handleSubmit} className="product-form">
          <div className="form-grid">
            <div className="form-group">
              <label>Product Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="Enter product name"
                className={errors.name ? 'error' : ''}
              />
              {errors.name && <span className="error-message">{errors.name}</span>}
            </div>
            
            <div className="form-group">
              <label>Price (₹) *</label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
                placeholder="Enter price"
                className={errors.price ? 'error' : ''}
              />
              {errors.price && <span className="error-message">{errors.price}</span>}
            </div>
            
            <div className="form-group">
              <label>Category *</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className={errors.category ? 'error' : ''}
              >
                <option value="">Select category</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              {errors.category && <span className="error-message">{errors.category}</span>}
            </div>
            
            <div className="form-group">
              <label>Brand *</label>
              <select
                value={formData.brand}
                onChange={(e) => setFormData({...formData, brand: e.target.value})}
                className={errors.brand ? 'error' : ''}
              >
                <option value="">Select brand</option>
                {brands.map(brand => (
                  <option key={brand} value={brand}>{brand}</option>
                ))}
              </select>
              {errors.brand && <span className="error-message">{errors.brand}</span>}
            </div>
            
            <div className="form-group full-width">
              <label>Description *</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Enter product description"
                rows="4"
                className={errors.description ? 'error' : ''}
              />
              {errors.description && <span className="error-message">{errors.description}</span>}
            </div>
            
            <div className="form-group">
              <label>Image URL</label>
              <input
                type="text"
                value={formData.image}
                onChange={(e) => setFormData({...formData, image: e.target.value})}
                placeholder="Enter image URL"
              />
            </div>
            
            <div className="form-group">
              <label>Stock *</label>
              <input
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData({...formData, stock: e.target.value})}
                placeholder="Enter stock quantity"
                className={errors.stock ? 'error' : ''}
              />
              {errors.stock && <span className="error-message">{errors.stock}</span>}
            </div>
            
            <div className="form-group">
              <label>Discount (%)</label>
              <input
                type="number"
                value={formData.discount}
                onChange={(e) => setFormData({...formData, discount: e.target.value})}
                placeholder="Enter discount percentage"
                min="0"
                max="100"
              />
            </div>
            
            <div className="form-group">
              <label>Rating (1-5)</label>
              <input
                type="number"
                value={formData.ratings}
                onChange={(e) => setFormData({...formData, ratings: e.target.value})}
                placeholder="Enter rating"
                min="0"
                max="5"
                step="0.1"
              />
            </div>
          </div>
          
          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={resetForm}>
              Cancel
            </button>
            <button type="submit" className="btn-submit">
              {editingProduct ? 'Update Product' : 'Add Product'}
            </button>
          </div>
        </form>
      </div>

      {/* Products Table */}
      <div className="products-table-container">
        <div className="table-header">
          <h3>All Products ({products.length})</h3>
          <button 
            className="btn-add"
            onClick={() => {
              resetForm();
              setShowAddForm(true);
            }}
          >
            + Add New Product
          </button>
        </div>
        
        <div className="products-table">
          <div className="table-header-row">
            <div className="table-col">Product</div>
            <div className="table-col">Category</div>
            <div className="table-col">Price</div>
            <div className="table-col">Stock</div>
            <div className="table-col">Rating</div>
            <div className="table-col">Actions</div>
          </div>
          
          {products.map(product => (
            <div key={product._id} className="table-row">
              <div className="table-col product-info">
                <img src={product.image || 'https://via.placeholder.com/50'} alt={product.name} />
                <div>
                  <h4>{product.name}</h4>
                  <p>{product.brand}</p>
                </div>
              </div>
              <div className="table-col">
                <span className="category-badge">{product.category}</span>
              </div>
              <div className="table-col">
                <div className="price-info">
                  <span className="current-price">₹{product.price.toLocaleString('en-IN')}</span>
                  {product.discount > 0 && (
                    <span className="discount-tag">-{product.discount}%</span>
                  )}
                </div>
              </div>
              <div className="table-col">
                <span className={`stock-status ${product.stock > 10 ? 'in-stock' : 'low-stock'}`}>
                  {product.stock} units
                </span>
              </div>
              <div className="table-col">
                <div className="rating">
                  {'★'.repeat(Math.floor(product.ratings || 0))}
                  {'☆'.repeat(5 - Math.floor(product.ratings || 0))}
                </div>
              </div>
              <div className="table-col">
                <div className="action-buttons">
                  <button 
                    className="btn-edit"
                    onClick={() => handleEdit(product)}
                  >
                    Edit
                  </button>
                  <button 
                    className="btn-delete"
                    onClick={() => handleDelete(product._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminProducts;