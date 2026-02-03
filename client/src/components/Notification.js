import React, { useState, useEffect } from 'react';
import './Notification.css';

const Notification = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const handleNotification = (event) => {
      const newNotification = {
        id: Date.now(),
        message: event.detail.message,
        type: event.detail.type || 'info'
      };
      
      setNotifications(prev => [...prev, newNotification]);
      
      // Auto remove after 3 seconds
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== newNotification.id));
      }, 3000);
    };

    window.addEventListener('showNotification', handleNotification);
    return () => window.removeEventListener('showNotification', handleNotification);
  }, []);

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  if (notifications.length === 0) return null;

  return (
    <div className="notification-container">
      {notifications.map(notification => (
        <div 
          key={notification.id} 
          className={`notification notification-${notification.type}`}
          onClick={() => removeNotification(notification.id)}
        >
          <div className="notification-content">
            <span className="notification-icon">
              {notification.type === 'success' ? '✅' : 
               notification.type === 'error' ? '❌' : 
               notification.type === 'warning' ? '⚠️' : 'ℹ️'}
            </span>
            <span className="notification-message">{notification.message}</span>
          </div>
          <button className="notification-close">×</button>
        </div>
      ))}
    </div>
  );
};

export default Notification;