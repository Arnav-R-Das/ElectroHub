import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Landing from "./components/Landing";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Shop from "./components/Shop";
import Cart from "./components/Cart";
import Wishlist from "./components/Wishlist";
import About from "./components/About"; // ✅ Import About

function App() {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  return (
    <Router>
      {/* SAME HEADER FOR ALL PAGES */}
      <Navbar onLoginClick={() => setShowLogin(true)} />

      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/about" element={<About />} /> {/* ✅ This line */}
      </Routes>

      {/* LOGIN MODAL */}
      {showLogin && (
        <Login
          onClose={() => setShowLogin(false)}
          onSignup={() => {
            setShowLogin(false);
            setShowSignup(true);
          }}
        />
      )}

      {/* SIGNUP MODAL */}
      {showSignup && (
        <Signup onClose={() => setShowSignup(false)} />
      )}
    </Router>
  );
}

export default App;
