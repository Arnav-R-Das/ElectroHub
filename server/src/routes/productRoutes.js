const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// @route   GET /api/products
// @desc    Get all products with filters
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { 
      category, 
      brand, 
      minPrice, 
      maxPrice, 
      search,
      sort = 'newest',
      limit = 100,  // Increase from 50 to 100
      page = 1
    } = req.query;

    let query = {};
    let sortOption = {};

    // Category filter - fix category names to match frontend
    if (category && category !== 'All') {
      // Map frontend category names to database category names
      const categoryMap = {
        'Smartphones': 'Smartphones',
        'Laptops': 'Laptops',
        'Tablets': 'Tablets',
        'Audio': 'Audio',
        'Wearables': 'Wearables',
        'TVs & Monitors': 'TVs & Monitors',
        'Cameras': 'Cameras',
        'Gaming': 'Gaming',
        'Accessories': 'Accessories',
        'Home Appliances': 'Home Appliances'
      };
      
      if (categoryMap[category]) {
        query.category = categoryMap[category];
      } else {
        query.category = category;
      }
    }

    // Brand filter
    if (brand && brand !== 'All') {
      query.brand = { $regex: brand, $options: 'i' };
    }

    // Price range filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Search filter
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } }
      ];
    }

    // Sorting options
    switch (sort) {
      case 'price-low':
        sortOption = { price: 1 };
        break;
      case 'price-high':
        sortOption = { price: -1 };
        break;
      case 'rating':
        sortOption = { rating: -1 };
        break;
      case 'popular':
        sortOption = { reviews: -1 };
        break;
      case 'discount':
        sortOption = { discount: -1 };
        break;
      case 'newest':
      default:
        sortOption = { createdAt: -1 };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Execute query with increased limit
    const products = await Product.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(parseInt(limit));

    const totalProducts = await Product.countDocuments(query);

    // If no products found, return all products
    if (products.length === 0 && Object.keys(query).length === 0) {
      const allProducts = await Product.find().sort(sortOption).limit(100);
      return res.json({
        success: true,
        count: allProducts.length,
        total: await Product.countDocuments(),
        page: 1,
        pages: 1,
        products: allProducts
      });
    }

    res.json({
      success: true,
      count: products.length,
      total: totalProducts,
      page: parseInt(page),
      pages: Math.ceil(totalProducts / parseInt(limit)),
      products
    });

  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching products'
    });
  }
});

// @route   GET /api/products/category/:category
// @desc    Get products by category
// @access  Public
router.get('/category/:category', async (req, res) => {
  try {
    const { sort = 'newest', limit = 100 } = req.query;
    let sortOption = {};

    // Map category names
    const categoryMap = {
      'smartphones': 'Smartphones',
      'laptops': 'Laptops',
      'tablets': 'Tablets',
      'audio': 'Audio',
      'wearables': 'Wearables',
      'tvs-monitors': 'TVs & Monitors',
      'cameras': 'Cameras',
      'gaming': 'Gaming',
      'accessories': 'Accessories',
      'home-appliances': 'Home Appliances'
    };

    const dbCategory = categoryMap[req.params.category.toLowerCase()] || req.params.category;

    switch (sort) {
      case 'price-low':
        sortOption = { price: 1 };
        break;
      case 'price-high':
        sortOption = { price: -1 };
        break;
      case 'rating':
        sortOption = { rating: -1 };
        break;
      default:
        sortOption = { createdAt: -1 };
    }

    const products = await Product.find({ 
      category: dbCategory 
    })
    .sort(sortOption)
    .limit(parseInt(limit));

    const count = await Product.countDocuments({ category: dbCategory });

    res.json({
      success: true,
      count: products.length,
      total: count,
      category: req.params.category,
      products
    });
  } catch (error) {
    console.error('Error fetching products by category:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/products/brands/all
// @desc    Get all unique brands
// @access  Public
router.get('/brands/all', async (req, res) => {
  try {
    const brands = await Product.distinct('brand');
    res.json({
      success: true,
      brands: brands.filter(brand => brand).sort() // Remove null/undefined and sort
    });
  } catch (error) {
    console.error('Error fetching brands:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/products/featured/featured
// @desc    Get featured products
// @access  Public
router.get('/featured/featured', async (req, res) => {
  try {
    const featuredProducts = await Product.find({ isFeatured: true })
      .sort({ createdAt: -1 })
      .limit(20); // Increase from 10 to 20

    const bestSellers = await Product.find({ isBestSeller: true })
      .sort({ rating: -1 })
      .limit(20); // Increase from 10 to 20

    res.json({
      success: true,
      featured: featuredProducts,
      bestSellers: bestSellers
    });
  } catch (error) {
    console.error('Error fetching featured products:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/products/search/:keyword
// @desc    Search products
// @access  Public
router.get('/search/:keyword', async (req, res) => {
  try {
    const keyword = req.params.keyword;
    
    const products = await Product.find({
      $or: [
        { name: { $regex: keyword, $options: 'i' } },
        { brand: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } },
        { category: { $regex: keyword, $options: 'i' } }
      ]
    })
    .sort({ createdAt: -1 })
    .limit(50); // Increase from 20 to 50

    res.json({
      success: true,
      count: products.length,
      keyword,
      products
    });
  } catch (error) {
    console.error('Error searching products:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;