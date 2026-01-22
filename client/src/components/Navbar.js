import React, { useState } from "react";
import { FaSearch, FaHeart, FaShoppingCart, FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useShop } from "../context/ShopContext";
import "./Navbar.css";

function Navbar({ onLoginClick }) {
  const { cart, wishlist, setSearchQuery } = useShop();
  const [showSearch, setShowSearch] = useState(false);

  return (
    <header className="navbar">
      {/* TOP BAR */}
      <div className="navbar-top">
        <div className="logo">ElectroHub</div>

        <nav className="top-links">
          <Link to="/">Home</Link>
          <Link to="/shop">Shop</Link>
          <Link to="/about">About</Link>
        </nav>

        <div className="nav-icons">
          {/* SEARCH */}
          <div className="search-wrapper">
            <FaSearch
              className="icon"
              onClick={() => setShowSearch(!showSearch)}
            />

            {showSearch && (
              <input
                type="text"
                placeholder="Search products..."
                className="search-input"
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            )}
          </div>

          {/* WISHLIST */}
          <Link to="/wishlist" className="icon-wrapper">
            <FaHeart className="icon" />
            {wishlist.length > 0 && (
              <span className="count">{wishlist.length}</span>
            )}
          </Link>

          {/* CART */}
          <Link to="/cart" className="icon-wrapper">
            <FaShoppingCart className="icon" />
            {cart.length > 0 && (
              <span className="cart-count">{cart.length}</span>
            )}
          </Link>

          {/* PROFILE */}
          <div className="profile" onClick={onLoginClick}>
            <FaUser className="icon" />
          </div>
        </div>
      </div>

      {/* BOTTOM BAR */}
      <nav className="navbar-bottom">
        <Link to="/shop">Shop All</Link>
        <Link to="/shop">Computers</Link>
        <Link to="/shop">Tablets</Link>
        <Link to="/shop">Cameras</Link>
        <Link to="/shop">Audio</Link>
        <Link to="/shop">Mobile</Link>
        <Link to="/shop">TV</Link>
      </nav>
    </header>
  );
}

export default Navbar;
