import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/cart');
      setCart(response.data);
    } catch (error) {
      setMessage('Failed to load cart');
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      await axios.delete(`http://localhost:5000/api/cart/${itemId}`);
      fetchCart();
      setMessage('Item removed from cart');
    } catch (error) {
      setMessage('Failed to remove item');
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    if (quantity < 1) {
      removeFromCart(itemId);
      return;
    }

    try {
      await axios.put(`http://localhost:5000/api/cart/${itemId}`, { quantity });
      fetchCart();
    } catch (error) {
      setMessage('Failed to update quantity');
    }
  };

  const checkout = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/orders', {
        shippingAddress: {
          address: '123 Main St',
          city: 'New York',
          postalCode: '10001',
          country: 'USA'
        }
      });
      
      setMessage('Order placed successfully!');
      navigate('/orders');
    } catch (error) {
      setMessage('Failed to place order');
    }
  };

  const calculateTotal = () => {
    return cart.items.reduce((total, item) => {
      return total + (item.product?.price * item.quantity);
    }, 0);
  };

  if (loading) {
    return <div className="loading">Loading cart...</div>;
  }

  if (cart.items.length === 0) {
    return (
      <div>
        <h1>Your Cart</h1>
        <p>Your cart is empty</p>
      </div>
    );
  }

  return (
    <div>
      <h1>Your Cart</h1>
      {message && (
        <div className={`message ${message.includes('success') ? 'success' : 'error'}`}>
          {message}
        </div>
      )}
      
      <div className="cart-items">
        {cart.items.map(item => (
          <div key={item._id} className="cart-item">
            <img 
              src={item.product?.image || 'https://via.placeholder.com/100'} 
              alt={item.product?.name}
              className="cart-item-image"
            />
            <div style={{ flex: 1 }}>
              <h3>{item.product?.name}</h3>
              <p>₹{item.product?.price}</p>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <button 
                  onClick={() => updateQuantity(item._id, item.quantity - 1)}
                  className="btn btn-secondary"
                >
                  -
                </button>
                <span>{item.quantity}</span>
                <button 
                  onClick={() => updateQuantity(item._id, item.quantity + 1)}
                  className="btn btn-secondary"
                >
                  +
                </button>
                
                <button 
                  onClick={() => removeFromCart(item._id)}
                  className="btn btn-danger"
                  style={{ marginLeft: '20px' }}
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div style={{ marginTop: '30px', textAlign: 'right' }}>
        <h2>Total: ₹{calculateTotal().toFixed(2)}</h2>
        <button 
          onClick={checkout}
          className="btn btn-primary"
          style={{ padding: '15px 30px', fontSize: '18px' }}
        >
          Checkout
        </button>
      </div>
    </div>
  );
};

export default Cart;