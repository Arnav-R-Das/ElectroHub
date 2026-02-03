import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/orders/my-orders');
      setOrders(response.data);
    } catch (error) {
      console.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading orders...</div>;
  }

  if (orders.length === 0) {
    return (
      <div>
        <h1>Your Orders</h1>
        <p>You have no orders yet</p>
      </div>
    );
  }

  return (
    <div>
      <h1>Your Orders</h1>
      
      <div className="orders-list">
        {orders.map(order => (
          <div key={order._id} className="product-card" style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <h3>Order #{order._id.slice(-6)}</h3>
                <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                <p>Status: <strong>{order.orderStatus}</strong></p>
                <p>Payment: <strong>{order.paymentStatus}</strong></p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <h3>Total: ₹{order.totalAmount.toFixed(2)}</h3>
              </div>
            </div>
            
            <div style={{ marginTop: '20px' }}>
              <h4>Items:</h4>
              {order.items.map((item, index) => (
                <div key={index} style={{ display: 'flex', alignItems: 'center', margin: '10px 0' }}>
                  <img 
                    src={item.product?.image || 'https://via.placeholder.com/50'} 
                    alt={item.product?.name}
                    style={{ width: '50px', height: '50px', marginRight: '10px' }}
                  />
                  <div>
                    <p>{item.product?.name}</p>
                    <p>{item.quantity} x ₹{item.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;