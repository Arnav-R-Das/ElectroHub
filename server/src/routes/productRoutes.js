const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// @route   GET /api/products
// @desc    Get all products (with optional category filter)
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    let query = {};
    
    if (category && category !== 'All') {
      query.category = category;
    }
    
    const products = await Product.find(query).sort({ createdAt: -1 });
    
    // If no products in database, return sample data
    if (products.length === 0) {
      console.log('No products found in database, returning sample data');
      return res.json(getSampleProducts());
    }
    
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error.message);
    
    // In case of database error, return sample data
    res.json(getSampleProducts());
  }
});

// @route   GET /api/products/:id
// @desc    Get single product by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ 
        success: false,
        message: 'Product not found' 
      });
    }
    
    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error.message);
    
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ 
        success: false,
        message: 'Invalid product ID format' 
      });
    }
    
    res.status(500).json({ 
      success: false,
      message: 'Server error',
      error: error.message 
    });
  }
});

// @route   GET /api/products/category/:category
// @desc    Get products by category
// @access  Public
router.get('/category/:category', async (req, res) => {
  try {
    const products = await Product.find({ 
      category: req.params.category 
    }).sort({ createdAt: -1 });
    
    if (products.length === 0) {
      // Return sample data filtered by category
      const sampleProducts = getSampleProducts();
      const filtered = sampleProducts.filter(
        p => p.category === req.params.category
      );
      return res.json(filtered);
    }
    
    res.json(products);
  } catch (error) {
    console.error('Error fetching products by category:', error.message);
    
    // Return filtered sample data
    const sampleProducts = getSampleProducts();
    const filtered = sampleProducts.filter(
      p => p.category === req.params.category
    );
    res.json(filtered);
  }
});

// Helper function to provide sample data if database is not available
function getSampleProducts() {
  return [
    {
      _id: '1',
      name: "Wireless Bluetooth Headphones",
      price: 89.99,
      description: "High-quality wireless headphones with noise cancellation and 30-hour battery life.",
      category: "Electronics",
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
      inStock: true,
      rating: 4.5,
      reviews: 124,
      createdAt: new Date('2024-01-15')
    },
    {
      _id: '2',
      name: "Men's Casual T-Shirt",
      price: 24.99,
      description: "Comfortable cotton t-shirt available in multiple colors and sizes.",
      category: "Clothing",
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop",
      inStock: true,
      rating: 4.2,
      reviews: 89,
      createdAt: new Date('2024-01-20')
    },
    {
      _id: '3',
      name: "JavaScript: The Definitive Guide",
      price: 49.99,
      description: "Comprehensive guide to JavaScript programming for beginners and experts.",
      category: "Books",
      image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=400&fit=crop",
      inStock: true,
      rating: 4.8,
      reviews: 56,
      createdAt: new Date('2024-01-10')
    },
    {
      _id: '4',
      name: "Smart Watch Series 5",
      price: 299.99,
      description: "Advanced smartwatch with health tracking and smartphone connectivity.",
      category: "Electronics",
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop",
      inStock: true,
      rating: 4.7,
      reviews: 203,
      createdAt: new Date('2024-01-05')
    },
    {
      _id: '5',
      name: "Ceramic Coffee Mug Set",
      price: 29.99,
      description: "Set of 4 ceramic mugs with elegant design, microwave and dishwasher safe.",
      category: "Home",
      image: "https://images.unsplash.com/photo-1514228742587-6b1558fcf93a?w=400&h=400&fit=crop",
      inStock: true,
      rating: 4.4,
      reviews: 42,
      createdAt: new Date('2024-01-18')
    },
    {
      _id: '6',
      name: "Yoga Mat Premium",
      price: 39.99,
      description: "Non-slip yoga mat with carrying strap, perfect for all fitness levels.",
      category: "Sports",
      image: "https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=400&h=400&fit=crop",
      inStock: true,
      rating: 4.6,
      reviews: 78,
      createdAt: new Date('2024-01-12')
    },
    {
      _id: '7',
      name: "Gaming Mouse RGB",
      price: 45.99,
      description: "High-precision gaming mouse with customizable RGB lighting.",
      category: "Electronics",
      image: "https://images.unsplash.com/photo-1527814050087-3793815479db?w=400&h=400&fit=crop",
      inStock: false,
      rating: 4.1,
      reviews: 91,
      createdAt: new Date('2024-01-08')
    }
  ];
}

module.exports = router;