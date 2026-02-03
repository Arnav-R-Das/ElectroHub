import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    setErrors({});
    
    try {
      const result = await login(formData.email, formData.password);
      
      if (result.success) {
        const event = new CustomEvent('showNotification', {
          detail: { message: 'Login successful!', type: 'success' }
        });
        window.dispatchEvent(event);
        navigate('/');
      } else {
        setErrors({ general: result.message || 'Login failed' });
      }
    } catch (error) {
      setErrors({ general: 'An error occurred. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    
    // Clear field error when user starts typing
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: ''
      });
    }
  };

  const handleDemoLogin = (type) => {
    const demoCredentials = {
      admin: { email: 'admin@shop.com', password: 'admin123' },
      user: { email: 'user@shop.com', password: 'user123' }
    };
    
    setFormData(demoCredentials[type]);
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-left">
          <div className="login-content">
            <div className="login-header">
              <div className="login-logo">
                <span className="logo-icon">🛒</span>
                <span className="logo-text">ElectroHub</span>
              </div>
              <h1>Welcome Back</h1>
              <p>Sign in to your account to continue shopping</p>
            </div>
            
            {errors.general && (
              <div className="error-message">
                <span className="error-icon">⚠️</span>
                {errors.general}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="login-form">
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <div className="input-wrapper">
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    className={errors.email ? 'input-error' : ''}
                  />
                </div>
                {errors.email && <span className="field-error">{errors.email}</span>}
              </div>
              
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <div className="input-wrapper">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    className={errors.password ? 'input-error' : ''}
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
                {errors.password && <span className="field-error">{errors.password}</span>}
              </div>
              
              <div className="form-options">
                <label className="checkbox">
                  <input type="checkbox" />
                  <span className="checkmark"></span>
                  Remember me
                </label>
                <Link to="/forgot-password" className="forgot-password">
                  Forgot Password?
                </Link>
              </div>
              
              <button 
                type="submit" 
                className="login-button"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-small"></span>
                    Signing In...
                  </>
                ) : 'Sign In'}
              </button>
              
              <div className="demo-login">
                <p>Try demo accounts:</p>
                <div className="demo-buttons">
                  <button 
                    type="button"
                    className="demo-btn admin"
                    onClick={() => handleDemoLogin('admin')}
                  >
                    Admin Login
                  </button>
                  <button 
                    type="button"
                    className="demo-btn user"
                    onClick={() => handleDemoLogin('user')}
                  >
                    User Login
                  </button>
                </div>
              </div>
              
              <div className="divider">
                <span>or continue with</span>
              </div>
              
              <div className="social-login">
                <button type="button" className="social-btn google">
                  <span className="social-icon">G</span>
                  Google
                </button>
                <button type="button" className="social-btn facebook">
                  <span className="social-icon">f</span>
                  Facebook
                </button>
              </div>
            </form>
            
            <div className="login-footer">
              <p>
                Don't have an account?{' '}
                <Link to="/register" className="register-link">
                  Create account
                </Link>
              </p>
            </div>
          </div>
        </div>
        
        <div className="login-right">
          <div className="login-graphics">
            <div className="graphic-circle circle-1"></div>
            <div className="graphic-circle circle-2"></div>
            <div className="graphic-circle circle-3"></div>
            <div className="floating-element element-1">📱</div>
            <div className="floating-element element-2">💻</div>
            <div className="floating-element element-3">🎧</div>
            <div className="welcome-text">
              <h2>Start Shopping</h2>
              <p>Access millions of products with exclusive deals</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;