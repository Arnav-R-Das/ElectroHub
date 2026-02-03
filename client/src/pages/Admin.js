import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Admin = () => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState('products');
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: ''
  });

  useEffect(() => {
    if (activeTab === 'products') fetchProducts();
    if (activeTab === 'orders') fetchOrders();
    if (activeTab === 'users') fetchUsers();
  }, [activeTab]);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Failed to load products');
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/orders');
      setOrders(response.data);
    } catch (error) {
      console.error('Failed to load orders');
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Failed to load users');
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/products', newProduct);
      setNewProduct({ name: '', description: '', price: '', category: '', stock: '' });
      fetchProducts();
    } catch (error) {
      console.error('Failed to add product');
    }
  };

  const deleteProduct = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await axios.delete(`http://localhost:5000/api/products/${id}`);
        fetchProducts();
      } catch (error) {
        console.error('Failed to delete product');
      }
    }
  };

  return (
    <div>
      <h1>Admin Panel</h1>
      
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <button 
          onClick={() => setActiveTab('products')}
          className={`btn ${activeTab === 'products' ? 'btn-primary' : 'btn-secondary'}`}
        >
          Products
        </button>
        <button 
          onClick={() => setActiveTab('orders')}
          className={`btn ${activeTab === 'orders' ? 'btn-primary' : 'btn-secondary'}`}
        >
          Orders
        </button>
        <button 
          onClick={() => setActiveTab('users')}
          className={`btn ${activeTab === 'users' ? 'btn-primary' : 'btn-secondary'}`}
        >
          Users
        </button>
      </div>

      {activeTab === 'products' && (
        <div>
          <h2>Add New Product</h2>
          <form onSubmit={handleAddProduct} className="form-container">
            <div className="form-group">
              <input
                type="text"
                placeholder="Product Name"
                value={newProduct.name}
                onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                placeholder="Description"
                value={newProduct.description}
                onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <input
                type="number"
                placeholder="Price"
                value={newProduct.price}
                onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                placeholder="Category"
                value={newProduct.category}
                onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <input
                type="number"
                placeholder="Stock"
                value={newProduct.stock}
                onChange={(e) => setNewProduct({...newProduct, stock: e.target.value})}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary">Add Product</button>
          </form>

          <h2>All Products</h2>
          <div className="products-grid">
            {products.map(product => (
              <div key={product._id} className="product-card">
                <h3>{product.name}</h3>
                <p>{product.description}</p>
                <p>Price: ₹{product.price}</p>
                <p>Stock: {product.stock}</p>
                <button 
                  onClick={() => deleteProduct(product._id)}
                  className="btn btn-danger"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'orders' && (
        <div>
          <h2>All Orders</h2>
          {orders.map(order => (
            <div key={order._id} className="product-card" style={{ marginBottom: '15px' }}>
              <p><strong>Order ID:</strong> {order._id}</p>
              <p><strong>User:</strong> {order.user?.name}</p>
              <p><strong>Total:</strong> ₹{order.totalAmount}</p>
              <p><strong>Status:</strong> {order.orderStatus}</p>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'users' && (
        <div>
          <h2>All Users</h2>
          {users.map(user => (
            <div key={user._id} className="product-card" style={{ marginBottom: '15px' }}>
              <p><strong>Name:</strong> {user.name}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Role:</strong> {user.role}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Admin;