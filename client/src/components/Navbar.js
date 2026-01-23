import React, { useState } from 'react';
import './Navbar.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <div className="navbar-logo">
          <a href="/" className="logo-text">
            <span className="logo-icon">👨‍💻</span>
            Electro<span className="logo-highlight">Hub</span>
          </a>
        </div>

        {/* Desktop Navigation Menu */}
        <div className={`navbar-menu ${isMenuOpen ? 'active' : ''}`}>
          <ul className="navbar-list">
            <li className="navbar-item">
              <a href="/" className="navbar-link active">
                Home
              </a>
            </li>
            <li className="navbar-item">
              <a href="/products" className="navbar-link">
                Products
              </a>
            </li>
            <li className="navbar-item">
              <a href="/categories" className="navbar-link">
                Categories
              </a>
            </li>
            <li className="navbar-item">
              <a href="/deals" className="navbar-link">
                Deals
              </a>
            </li>
            <li className="navbar-item">
              <a href="/about" className="navbar-link">
                About
              </a>
            </li>
            <li className="navbar-item">
              <a href="/contact" className="navbar-link">
                Contact
              </a>
            </li>
          </ul>
        </div>

        {/* Right Side Icons */}
        <div className="navbar-icons">
          <button className="icon-button search-button" aria-label="Search">
            <span className="icon">🔍</span>
          </button>
          <button className="icon-button user-button" aria-label="Account">
            <span className="icon">👤</span>
          </button>
          <button className="icon-button cart-button" aria-label="Shopping Cart">
            <span className="icon">🛍️</span>
            <span className="cart-count">0</span>
          </button>
        </div>

        {/* Mobile Menu Toggle Button */}
        <button 
          className="menu-toggle" 
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <span className={`hamburger ${isMenuOpen ? 'active' : ''}`}></span>
        </button>
      </div>

      {/* Mobile Search Bar - Only visible on mobile */}
      <div className="mobile-search">
        <div className="search-container">
          <input 
            type="text" 
            placeholder="Search products..." 
            className="search-input"
          />
          <button className="search-submit">
            <span className="search-icon">🔍</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;