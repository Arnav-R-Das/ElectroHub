const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true
  },
  brand: {
    type: String,
    required: [true, 'Brand is required'],
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price must be positive']
  },
  originalPrice: {
    type: Number,
    required: true
  },
  discount: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  detailedDescription: {
    type: String,
    default: ''
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Smartphones', 'Laptops', 'Tablets', 'Audio', 'Wearables', 'TVs & Monitors', 'Cameras', 'Gaming', 'Accessories', 'Home Appliances']
  },
  subcategory: {
    type: String,
    default: ''
  },
  image: {
    type: String,
    required: true
  },
  images: {
    type: [String],
    default: []
  },
  inStock: {
    type: Boolean,
    default: true
  },
  stockQuantity: {
    type: Number,
    default: 100
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviews: {
    type: Number,
    default: 0
  },
  specifications: {
    type: Map,
    of: String,
    default: {}
  },
  features: {
    type: [String],
    default: []
  },
  warranty: {
    type: String,
    default: '1 Year Manufacturer Warranty'
  },
  shipping: {
    type: String,
    default: 'Free Delivery'
  },
  emiAvailable: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  isBestSeller: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Create indexes for better performance
productSchema.index({ category: 1, price: 1 });
productSchema.index({ brand: 1 });
productSchema.index({ isFeatured: 1 });
productSchema.index({ isBestSeller: 1 });

module.exports = mongoose.model('Product', productSchema);