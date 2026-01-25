require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');
const connectDB = require('./config/db');

const sampleProducts = [
  {
    name: "Wireless Bluetooth Headphones",
    price: 89.99,
    description: "High-quality wireless headphones with noise cancellation and 30-hour battery life.",
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop",
    rating: 4.5,
    reviews: 124
  },
  {
    name: "Men's Casual T-Shirt",
    price: 24.99,
    description: "Comfortable cotton t-shirt available in multiple colors and sizes.",
    category: "Clothing",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop",
    rating: 4.2,
    reviews: 89
  },
  {
    name: "JavaScript: The Definitive Guide",
    price: 49.99,
    description: "Comprehensive guide to JavaScript programming for beginners and experts.",
    category: "Books",
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w-300&h=300&fit=crop",
    rating: 4.8,
    reviews: 56
  },
  {
    name: "Smart Watch Series 5",
    price: 299.99,
    description: "Advanced smartwatch with health tracking and smartphone connectivity.",
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop",
    rating: 4.7,
    reviews: 203
  },
  {
    name: "Ceramic Coffee Mug Set",
    price: 29.99,
    description: "Set of 4 ceramic mugs with elegant design, microwave and dishwasher safe.",
    category: "Home",
    image: "https://images.unsplash.com/photo-1514228742587-6b1558fcf93a?w=300&h=300&fit=crop",
    rating: 4.4,
    reviews: 42
  },
  {
    name: "Yoga Mat Premium",
    price: 39.99,
    description: "Non-slip yoga mat with carrying strap, perfect for all fitness levels.",
    category: "Sports",
    image: "https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=300&h=300&fit=crop",
    rating: 4.6,
    reviews: 78
  },
  {
    name: "Laptop Backpack",
    price: 59.99,
    description: "Water-resistant backpack with laptop compartment and multiple pockets.",
    category: "Other",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=300&fit=crop",
    rating: 4.3,
    reviews: 67
  },
  {
    name: "Gaming Mouse RGB",
    price: 45.99,
    description: "High-precision gaming mouse with customizable RGB lighting.",
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1527814050087-3793815479db?w=300&h=300&fit=crop",
    inStock: false,
    rating: 4.1,
    reviews: 91
  }
];

const seedDatabase = async () => {
  try {
    await connectDB();
    
    // Clear existing products
    await Product.deleteMany({});
    console.log('Cleared existing products');
    
    // Insert sample products
    await Product.insertMany(sampleProducts);
    console.log('Sample products added successfully');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();