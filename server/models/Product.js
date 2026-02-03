const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  brand: {
    type: String,
    default: 'Generic'
  },
  image: {
    type: String,
    default: 'https://via.placeholder.com/400'
  },
  stock: {
    type: Number,
    default: 0
  },
  discount: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  ratings: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  }
}, {
  timestamps: true
});

// Virtual for discounted price
productSchema.virtual('discountedPrice').get(function() {
  return Math.round(this.price * (100 - this.discount) / 100);
});

module.exports = mongoose.model('Product', productSchema);