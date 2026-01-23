require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

// Route files
const productRoutes = require('./routes/productRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Database connection - let's keep it simple for now
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Check if MONGODB_URI is set, if not use local connection
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/electrohub';
    await mongoose.connect(mongoURI);
    console.log('MongoDB Connected Successfully');
  } catch (error) {
    console.error('MongoDB Connection Error:', error.message);
    console.log('Running without database connection...');
  }
};

// Connect to Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mount routers
app.use('/api/products', productRoutes);

// Basic route
app.get('/api', (req, res) => {
  res.json({ 
    message: 'ElectroHub E-commerce API is running',
    version: '1.0.0',
    endpoints: {
      products: '/api/products',
      productsByCategory: '/api/products/category/:category',
      singleProduct: '/api/products/:id'
    }
  });
});

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK',
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API Base URL: http://localhost:${PORT}/api`);
});