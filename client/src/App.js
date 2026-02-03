import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Products from './pages/Products';
import Login from './pages/Login';
import Register from './pages/Register';
import Cart from './pages/Cart';
import Orders from './pages/Orders';
import Admin from './pages/Admin';
import PrivateRoute from './components/PrivateRoute';
import SearchResults from './pages/SearchResults';
import Notification from './components/Notification';
import ProductDetails from './pages/ProductDetails';
import AdminProducts from './pages/admin/AdminProducts';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <div className="container">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/search" element={<SearchResults />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/product/:id" element={<ProductDetails />} />
              
              {/* Protected Routes */}
              <Route path="/cart" element={
                <PrivateRoute>
                  <Cart />
                </PrivateRoute>
              } />
              
              <Route path="/orders" element={
                <PrivateRoute>
                  <Orders />
                </PrivateRoute>
              } />
              
              <Route path="/admin" element={
                <PrivateRoute adminOnly={true}>
                  <Admin />
                </PrivateRoute>
              } />

              <Route path="/admin/products" element={
                  <PrivateRoute adminOnly={true}>
                    <AdminProducts />
                  </PrivateRoute>
                } />

            </Routes>
          </div>
          <Notification />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;