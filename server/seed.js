require('dotenv').config();
const mongoose = require('mongoose');

const sampleProducts = [
  {
    name: "Wireless Bluetooth Headphones",
    price: 89.99,
    description: "High-quality wireless headphones with noise cancellation and 30-hour battery life.",
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
    rating: 4.5,
    reviews: 124
  },
  {
    name: "Men's Casual T-Shirt",
    price: 24.99,
    description: "Comfortable cotton t-shirt available in multiple colors and sizes.",
    category: "Clothing",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop",
    rating: 4.2,
    reviews: 89
  },
  {
    name: "JavaScript: The Definitive Guide",
    price: 49.99,
    description: "Comprehensive guide to JavaScript programming for beginners and experts.",
    category: "Books",
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=400&fit=crop",
    rating: 4.8,
    reviews: 56
  },
  {
    name: "Smart Watch Series 5",
    price: 299.99,
    description: "Advanced smartwatch with health tracking and smartphone connectivity.",
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop",
    rating: 4.7,
    reviews: 203
  }
];

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/electrohub';
    await mongoose.connect(mongoURI);
    console.log('Connected to MongoDB');
    
    // Get Product model
    const Product = require('./src/models/Product');
    
    // Clear existing products
    await Product.deleteMany({});
    console.log('Cleared existing products');
    
    // Insert sample products
    await Product.insertMany(sampleProducts);
    console.log('Sample products added successfully');
    
    // Count products
    const count = await Product.countDocuments();
    console.log(`Total products in database: ${count}`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();