import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Register.css';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
    } else if (formData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    } else if (!/(?=.*[A-Z])(?=.*[0-9])/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one uppercase letter and one number';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (formData.phone && !/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = 'Phone number must be 10 digits';
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
      const result = await register(formData.name, formData.email, formData.password);
      
      if (result.success) {
        const event = new CustomEvent('showNotification', {
          detail: { message: 'Registration successful!', type: 'success' }
        });
        window.dispatchEvent(event);
        navigate('/');
      } else {
        setErrors({ general: result.message || 'Registration failed' });
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

  const passwordStrength = () => {
    const password = formData.password;
    let strength = 0;
    
    if (password.length >= 6) strength++;
    if (password.length >= 8) strength++;
    if (/(?=.*[A-Z])/.test(password)) strength++;
    if (/(?=.*[0-9])/.test(password)) strength++;
    if (/(?=.*[!@#$%^&*])/.test(password)) strength++;
    
    return strength;
  };

  const getStrengthColor = (strength) => {
    if (strength === 0) return '#e2e8f0';
    if (strength <= 2) return '#fc8181';
    if (strength <= 3) return '#f6ad55';
    if (strength <= 4) return '#68d391';
    return '#38b2ac';
  };

  const getStrengthText = (strength) => {
    if (strength === 0) return 'No password';
    if (strength <= 2) return 'Weak';
    if (strength <= 3) return 'Good';
    if (strength <= 4) return 'Strong';
    return 'Very Strong';
  };

  const strength = passwordStrength();
  const strengthColor = getStrengthColor(strength);
  const strengthText = getStrengthText(strength);

  return (
    <div className="register-page">
      <div className="register-container">
        <div className="register-left">
          <div className="register-content">
            <div className="register-header">
              <div className="register-logo">
                <span className="logo-icon">🛒</span>
                <span className="logo-text">ElectroHub</span>
              </div>
              <h1>Create Account</h1>
              <p>Join thousands of happy customers</p>
            </div>
            
            {errors.general && (
              <div className="error-message">
                <span className="error-icon">⚠️</span>
                {errors.general}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="register-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">Full Name *</label>
                  <div className="input-wrapper">
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      className={errors.name ? 'input-error' : ''}
                    />
                  </div>
                  {errors.name && <span className="field-error">{errors.name}</span>}
                </div>
                
                <div className="form-group">
                  <label htmlFor="email">Email Address *</label>
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
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="phone">Phone Number</label>
                  <div className="input-wrapper">
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Enter your phone number"
                      className={errors.phone ? 'input-error' : ''}
                    />
                  </div>
                  {errors.phone && <span className="field-error">{errors.phone}</span>}
                </div>
                
                <div className="form-group">
                  <label htmlFor="address">Address</label>
                  <div className="input-wrapper">
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="Enter your address"
                    />
                  </div>
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="password">Password *</label>
                <div className="input-wrapper">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create a password"
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
                
                {formData.password && (
                  <div className="password-strength">
                    <div className="strength-meter">
                      <div 
                        className="strength-bar" 
                        style={{
                          width: `${(strength / 5) * 100}%`,
                          background: strengthColor
                        }}
                      ></div>
                    </div>
                    <div className="strength-info">
                      <span className="strength-text" style={{ color: strengthColor }}>
                        {strengthText}
                      </span>
                      <span className="strength-tips">
                        {strength < 4 && 'Include uppercase, numbers & symbols'}
                      </span>
                    </div>
                  </div>
                )}
                
                {errors.password && <span className="field-error">{errors.password}</span>}
                
                <div className="password-requirements">
                  <p>Password must contain:</p>
                  <ul>
                    <li className={formData.password.length >= 6 ? 'met' : ''}>
                      At least 6 characters
                    </li>
                    <li className={/(?=.*[A-Z])/.test(formData.password) ? 'met' : ''}>
                      One uppercase letter
                    </li>
                    <li className={/(?=.*[0-9])/.test(formData.password) ? 'met' : ''}>
                      One number
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password *</label>
                <div className="input-wrapper">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm your password"
                    className={errors.confirmPassword ? 'input-error' : ''}
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? '🙈' : '👁️'}
                  </button>
                </div>
                {errors.confirmPassword && <span className="field-error">{errors.confirmPassword}</span>}
              </div>
              
              <div className="form-options">
                <label className="checkbox">
                  <input type="checkbox" required />
                  <span className="checkmark"></span>
                  I agree to the{' '}
                  <Link to="/terms" className="terms-link">Terms & Conditions</Link>{' '}
                  and{' '}
                  <Link to="/privacy" className="terms-link">Privacy Policy</Link>
                </label>
              </div>
              
              <button 
                type="submit" 
                className="register-button"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-small"></span>
                    Creating Account...
                  </>
                ) : 'Create Account'}
              </button>
              
              <div className="divider">
                <span>or sign up with</span>
              </div>
              
              <div className="social-register">
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
            
            <div className="register-footer">
              <p>
                Already have an account?{' '}
                <Link to="/login" className="login-link">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
        
        <div className="register-right">
          <div className="register-graphics">
            <div className="graphic-circle circle-1"></div>
            <div className="graphic-circle circle-2"></div>
            <div className="graphic-circle circle-3"></div>
            <div className="floating-element element-1">🎁</div>
            <div className="floating-element element-2">💰</div>
            <div className="floating-element element-3">🚀</div>
            <div className="benefits">
              <h2>Benefits of Joining</h2>
              <ul>
                <li>🎯 Exclusive member discounts</li>
                <li>🚚 Free shipping on orders</li>
                <li>⭐ Early access to sales</li>
                <li>📱 Personalized recommendations</li>
                <li>🔒 Secure shopping experience</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;