import React, { useState, useEffect } from "react";
import { 
  FaSearch, 
  FaHeart, 
  FaShoppingCart, 
  FaUser, 
  FaBars, 
  FaTimes 
} from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import { useShop } from "../context/ShopContext";
import "./Navbar.css";

function Navbar({ onLoginClick }) {
  const { cart, wishlist, setSearchQuery } = useShop();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const categories = [
    { name: "Shop All", path: "/shop" },
    { name: "Computers", path: "/shop/computers" },
    { name: "Tablets", path: "/shop/tablets" },
    { name: "Cameras", path: "/shop/cameras" },
    { name: "Audio", path: "/shop/audio" },
    { name: "Mobile", path: "/shop/mobile" },
    { name: "TV", path: "/shop/tv" },
  ];

  const popularSearchTerms = ["beam", "arc", "sonos one", "sub", "amp", "connect", "roam"];

  return (
    <>
      {/* MAIN NAVBAR */}
      <header className={`navbar ${isScrolled ? "scrolled" : ""}`}>
        <div className="navbar-container">
          {/* LEFT: Logo */}
          <div className="navbar-left">
            <Link to="/" className="logo">
              <span className="logo-text">ElectroHub</span>
              <span className="logo-tagline">The tech hub</span>
            </Link>
          </div>

          {/* MIDDLE: Desktop Navigation */}
          <nav className="navbar-center">
            <ul className="nav-links">
              <li><Link to="/shop" className="nav-link">Shop</Link></li>
              <li><Link to="/speakers" className="nav-link">Speakers</Link></li>
              <li><Link to="/home-theater" className="nav-link">Home Theater</Link></li>
              <li><Link to="/audio-components" className="nav-link">Audio Components</Link></li>
              <li className="has-dropdown">
                <span className="nav-link">Categories</span>
                <div className="dropdown-menu">
                  <div className="dropdown-grid">
                    <div className="dropdown-column">
                      <h4>Categories</h4>
                      {categories.slice(0, 4).map((category) => (
                        <Link key={category.name} to={category.path}>
                          {category.name}
                        </Link>
                      ))}
                    </div>
                    <div className="dropdown-column">
                      <h4>Most Popular</h4>
                      <Link to="/shop/best-sellers">Best Sellers</Link>
                      <Link to="/shop/new-arrivals">New Arrivals</Link>
                      <Link to="/shop/deals">Deals</Link>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </nav>

          {/* RIGHT: Icons & Actions */}
          <div className="navbar-right">
            {/* Search Icon - Opens search overlay on mobile */}
            <div className="nav-icon search-icon" onClick={() => setShowSearch(true)}>
              <FaSearch />
            </div>

            {/* Wishlist with badge */}
            <Link to="/wishlist" className="nav-icon">
              <FaHeart />
              {wishlist.length > 0 && (
                <span className="nav-badge">{wishlist.length}</span>
              )}
            </Link>

            {/* Cart with badge */}
            <Link to="/cart" className="nav-icon">
              <FaShoppingCart />
              {cart.length > 0 && (
                <span className="nav-badge">{cart.length}</span>
              )}
            </Link>

            {/* Login/Profile */}
            <div className="nav-icon profile-icon" onClick={onLoginClick}>
              <FaUser />
            </div>

            {/* Mobile Menu Toggle */}
            <div 
              className="mobile-menu-toggle" 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
            </div>
          </div>
        </div>
      </header>

      {/* MOBILE MENU OVERLAY */}
      {isMobileMenuOpen && (
        <div className="mobile-menu-overlay">
          <div className="mobile-menu-content">
            <div className="mobile-menu-header">
              <h3>Menu</h3>
              <FaTimes 
                className="close-menu" 
                onClick={() => setIsMobileMenuOpen(false)} 
              />
            </div>
            
            <div className="mobile-menu-links">
              <Link to="/" className="mobile-link">Home</Link>
              <Link to="/shop" className="mobile-link">Shop All</Link>
              <Link to="/categories" className="mobile-link">Categories</Link>
              <Link to="/deals" className="mobile-link">Deals</Link>
              <Link to="/support" className="mobile-link">Support</Link>
              <Link to="/about" className="mobile-link">About</Link>
            </div>

            <div className="mobile-categories">
              <h4>Shop by Category</h4>
              {categories.map((category) => (
                <Link 
                  key={category.name} 
                  to={category.path}
                  className="mobile-category-link"
                >
                  {category.name}
                </Link>
              ))}
            </div>

            <div className="mobile-actions">
              <button className="login-btn" onClick={onLoginClick}>
                Log In / Register
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SEARCH OVERLAY */}
      {showSearch && (
        <div className="search-overlay">
          <div className="search-container">
            <div className="search-header">
              <FaSearch className="search-icon-large" />
              <input
                type="text"
                placeholder="Search for products, brands, or categories..."
                className="search-input-large"
                autoFocus
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <FaTimes 
                className="close-search" 
                onClick={() => setShowSearch(false)} 
              />
            </div>

            <div className="search-suggestions">
              <h4>Popular Search Terms</h4>
              <div className="suggestions-grid">
                {popularSearchTerms.map((term) => (
                  <button
                    key={term}
                    className="suggestion-chip"
                    onClick={() => {
                      setSearchQuery(term);
                      setShowSearch(false);
                    }}
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>

            <div className="search-categories">
              <h4>Browse Categories</h4>
              <div className="category-chips">
                {categories.slice(0, 6).map((category) => (
                  <Link
                    key={category.name}
                    to={category.path}
                    className="category-chip"
                    onClick={() => setShowSearch(false)}
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;