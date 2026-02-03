import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import SearchBar from './SearchBar';
import './Navbar.css';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <div className="navbar-logo">
          <Link to="/" className="logo-link">
            <span className="logo-icon">👨‍💻</span>
            <span className="logo-text">ElectroHub</span>
          </Link>
        </div>

        {/* Search Bar */}
        <div className="navbar-search">
          <SearchBar />
        </div>

        {/* Navigation Links */}
        <div className="navbar-links">
          <ul className="nav-menu">
            <li><Link to="/" className="nav-link">Home</Link></li>
            <li><Link to="/products" className="nav-link">Products</Link></li>
            
            {user ? (
              <>
                <li className="nav-dropdown">
                  <span className="nav-link user-menu">
                    👤 {user.name}
                  </span>
                  <div className="dropdown-menu">
                    <Link to="/profile" className="dropdown-item">My Profile</Link>
                    <Link to="/orders" className="dropdown-item">My Orders</Link>
                    <Link to="/wishlist" className="dropdown-item">Wishlist</Link>
                    <Link to="/cart" className="dropdown-item">Cart</Link>
                    {isAdmin && <Link to="/admin" className="dropdown-item admin">Admin Panel</Link>}
                    <hr className="dropdown-divider" />
                    <button onClick={handleLogout} className="dropdown-item logout">
                      Logout
                    </button>
                  </div>
                </li>
              </>
            ) : (
              <>
                <li><Link to="/login" className="nav-link">Login</Link></li>
                <li><Link to="/register" className="nav-link register">Register</Link></li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;