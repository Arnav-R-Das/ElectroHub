const express = require('express');
const Wishlist = require('../models/Wishlist');
const Product = require('../models/Product');
const { auth } = require('../middleware/auth');
const router = express.Router();

// Get wishlist
router.get('/', auth, async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user.userId })
      .populate('products');
    
    if (!wishlist) {
      return res.json({ products: [] });
    }
    
    res.json(wishlist);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add to wishlist
router.post('/', auth, async (req, res) => {
  try {
    const { productId } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    let wishlist = await Wishlist.findOne({ user: req.user.userId });

    if (!wishlist) {
      wishlist = new Wishlist({
        user: req.user.userId,
        products: [productId]
      });
    } else {
      // Check if product already in wishlist
      if (!wishlist.products.includes(productId)) {
        wishlist.products.push(productId);
      }
    }

    await wishlist.save();
    await wishlist.populate('products');
    
    res.json(wishlist);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Remove from wishlist
router.delete('/:productId', auth, async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user.userId });

    if (!wishlist) {
      return res.status(404).json({ message: 'Wishlist not found' });
    }

    wishlist.products = wishlist.products.filter(
      id => id.toString() !== req.params.productId
    );

    await wishlist.save();
    await wishlist.populate('products');
    
    res.json(wishlist);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;