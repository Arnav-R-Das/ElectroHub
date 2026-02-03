const express = require('express');
const router = express.Router(); // ← THIS LINE WAS MISSING!
const Product = require('../models/Product');
const { auth, admin } = require('../middleware/auth');

// Search products
router.get('/search', async (req, res) => {
  try {
    console.log('Search query received:', req.query);
    
    const { q, category, brand, minPrice, maxPrice, sort } = req.query;
    
    // Build query object
    const query = {};
    
    // Text search (search in multiple fields)
    if (q && q.trim() !== '') {
      query.$or = [
        { name: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { brand: { $regex: q, $options: 'i' } },
        { category: { $regex: q, $options: 'i' } }
      ];
    }
    
    // Category filter
    if (category && category !== 'all' && category !== 'undefined') {
      query.category = category;
    }
    
    // Brand filter
    if (brand && brand !== 'all' && brand !== 'undefined') {
      query.brand = brand;
    }
    
    // Price range filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    
    // Sort options
    let sortOptions = { createdAt: -1 };
    if (sort) {
      switch (sort) {
        case 'price-low':
          sortOptions = { price: 1 };
          break;
        case 'price-high':
          sortOptions = { price: -1 };
          break;
        case 'rating':
          sortOptions = { ratings: -1 };
          break;
        case 'newest':
          sortOptions = { createdAt: -1 };
          break;
        case 'discount':
          sortOptions = { discount: -1 };
          break;
        case 'popular':
          sortOptions = { ratings: -1, discount: -1 };
          break;
      }
    }
    
    console.log('Final query:', query);
    
    // Execute query
    const products = await Product.find(query)
      .sort(sortOptions)
      .limit(100);
    
    // Get unique values for filters
    const [brands, categories] = await Promise.all([
      Product.distinct('brand'),
      Product.distinct('category')
    ]);
    
    res.json({
      success: true,
      products,
      filters: {
        brands: brands.filter(b => b).sort(),
        categories: categories.filter(c => c).sort()
      },
      total: products.length,
      query: req.query
    });
    
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Search failed', 
      error: error.message 
    });
  }
});

// GET /api/products/search/suggestions?q=query
router.get('/search/suggestions', async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q || q.trim().length < 2) {
      return res.json([]);
    }
    
    const suggestions = await Product.find({
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { brand: { $regex: q, $options: 'i' } },
        { category: { $regex: q, $options: 'i' } }
      ]
    })
    .select('name brand category image price discount stock')
    .limit(8)
    .lean();
    
    // Format suggestions
    const formatted = suggestions.map(product => ({
      ...product,
      discountedPrice: product.discount > 0 
        ? Math.round(product.price * (100 - product.discount) / 100)
        : product.price
    }));
    
    res.json(formatted);
  } catch (error) {
    console.error('Suggestions error:', error);
    res.json([]);
  }
});

// Get all products (Public)
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single product (Public)
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create product (Admin only)
router.post('/', auth, admin, async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update product (Admin only)
router.put('/:id', auth, admin, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete product (Admin only)
router.delete('/:id', auth, admin, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;