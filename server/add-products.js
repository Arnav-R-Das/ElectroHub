const mongoose = require('mongoose');
require('dotenv').config();
const Product = require('./models/Product');

const sampleProducts = [
  // Smartphones
  {
    name: "iPhone 15 Pro",
    description: "Latest Apple iPhone with A17 Pro chip, Titanium design",
    price: 134900,
    category: "Smartphones",
    image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&auto=format&fit=crop",
    brand: "Apple",
    stock: 45,
    discount: 5,
    ratings: 4.7
  },
  {
    name: "Samsung Galaxy S24",
    description: "AI-powered smartphone with advanced camera",
    price: 79999,
    category: "Smartphones",
    image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w-800&auto=format&fit=crop",
    brand: "Samsung",
    stock: 38,
    discount: 8,
    ratings: 4.6
  },
  {
    name: "OnePlus 12",
    description: "Snapdragon 8 Gen 3, 100W charging",
    price: 64999,
    category: "Smartphones",
    image: "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=800&auto=format&fit=crop",
    brand: "OnePlus",
    stock: 120,
    discount: 10,
    ratings: 4.5
  },
  {
    name: "Nothing Phone 2",
    description: "Glyph Interface, Snapdragon 8+ Gen 1",
    price: 44999,
    category: "Smartphones",
    image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&auto=format&fit=crop",
    brand: "Nothing",
    stock: 85,
    discount: 12,
    ratings: 4.3
  },
  // Laptops
  {
    name: "MacBook Air M3",
    description: "Apple Silicon M3 chip, 13.6-inch display",
    price: 114900,
    category: "Laptops",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop",
    brand: "Apple",
    stock: 25,
    discount: 0,
    ratings: 4.8
  },
  {
    name: "Dell XPS 13",
    description: "Intel Core i7, 13.4-inch InfinityEdge",
    price: 149990,
    category: "Laptops",
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&auto=format&fit=crop",
    brand: "Dell",
    stock: 18,
    discount: 12,
    ratings: 4.4
  },
  {
    name: "HP Pavilion Gaming",
    description: "AMD Ryzen 5, NVIDIA RTX 3050, 16GB RAM",
    price: 64990,
    category: "Laptops",
    image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&auto=format&fit=crop",
    brand: "HP",
    stock: 65,
    discount: 15,
    ratings: 4.2
  },
  {
    name: "Asus ROG Zephyrus G14",
    description: "AMD Ryzen 9, RTX 4060, 14-inch QHD+",
    price: 154990,
    category: "Laptops",
    image: "https://images.unsplash.com/photo-1600861194947-7e2d6e093d0f?w=800&auto=format&fit=crop",
    brand: "Asus",
    stock: 12,
    discount: 8,
    ratings: 4.7
  },
  // Audio
  {
    name: "Sony WH-1000XM5",
    description: "Industry-leading noise cancellation",
    price: 29990,
    category: "Audio",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop",
    brand: "Sony",
    stock: 85,
    discount: 7,
    ratings: 4.7
  },
  {
    name: "Apple AirPods Pro",
    description: "Active Noise Cancellation, Transparency mode",
    price: 24900,
    category: "Audio",
    image: "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=800&auto=format&fit=crop",
    brand: "Apple",
    stock: 150,
    discount: 5,
    ratings: 4.6
  },
  {
    name: "boAt Airdopes 141",
    description: "42hr playtime, ENx tech, IPX4 water resistant",
    price: 1299,
    category: "Audio",
    image: "https://images.unsplash.com/photo-1589003077984-894e133dabab?w=800&auto=format&fit=crop",
    brand: "boAt",
    stock: 500,
    discount: 35,
    ratings: 4.3
  },
  {
    name: "JBL Flip 6",
    description: "IP67 waterproof, 12hr battery, PartyBoost",
    price: 9999,
    category: "Audio",
    image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop",
    brand: "JBL",
    stock: 95,
    discount: 18,
    ratings: 4.5
  },
  // Gaming
  {
    name: "PlayStation 5",
    description: "Ultra-high speed SSD, 4K/120fps gaming",
    price: 54990,
    category: "Gaming",
    image: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=800&auto=format&fit=crop",
    brand: "Sony",
    stock: 35,
    discount: 0,
    ratings: 4.7
  },
  {
    name: "Xbox Series X",
    description: "4K gaming at 120 FPS, 1TB SSD",
    price: 52999,
    category: "Gaming",
    image: "https://images.unsplash.com/photo-1621259182978-fbf8321e7d6d?w=800&auto=format&fit=crop",
    brand: "Microsoft",
    stock: 28,
    discount: 5,
    ratings: 4.6
  },
  {
    name: "Nintendo Switch OLED",
    description: "7-inch OLED screen, Enhanced audio, 64GB storage",
    price: 36990,
    category: "Gaming",
    image: "https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=800&auto=format&fit=crop",
    brand: "Nintendo",
    stock: 42,
    discount: 10,
    ratings: 4.5
  },
  // Wearables
  {
    name: "Apple Watch Series 9",
    description: "S9 chip, Double tap gesture, ECG app",
    price: 41900,
    category: "Wearables",
    image: "https://images.unsplash.com/photo-1434493650001-5d43a6fea0a6?w=800&auto=format&fit=crop",
    brand: "Apple",
    stock: 75,
    discount: 3,
    ratings: 4.7
  },
  {
    name: "Samsung Galaxy Watch 6",
    description: "Sleep coaching, Body composition, GPS",
    price: 29999,
    category: "Wearables",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop",
    brand: "Samsung",
    stock: 60,
    discount: 12,
    ratings: 4.5
  },
  {
    name: "Mi Smart Band 7",
    description: "1.62-inch AMOLED, SpO2 monitor, 14-day battery",
    price: 2999,
    category: "Wearables",
    image: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&auto=format&fit=crop",
    brand: "Xiaomi",
    stock: 350,
    discount: 25,
    ratings: 4.2
  },
  // Cameras
  {
    name: "Canon EOS R50",
    description: "24.2MP APS-C, 4K video, Dual Pixel AF",
    price: 69995,
    category: "Cameras",
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop",
    brand: "Canon",
    stock: 25,
    discount: 15,
    ratings: 4.6
  },
  {
    name: "Sony Alpha 7 IV",
    description: "33MP full-frame, 4K 60p, Real-time Eye AF",
    price: 234990,
    category: "Cameras",
    image: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&auto=format&fit=crop",
    brand: "Sony",
    stock: 8,
    discount: 5,
    ratings: 4.8
  },
  // Tablets
  {
    name: "iPad Air",
    description: "M1 chip, 10.9-inch Liquid Retina, 5G support",
    price: 59900,
    category: "Tablets",
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&auto=format&fit=crop",
    brand: "Apple",
    stock: 40,
    discount: 5,
    ratings: 4.7
  },
  {
    name: "Samsung Galaxy Tab S9",
    description: "Dynamic AMOLED 2X, S Pen included, IP68",
    price: 84999,
    category: "Tablets",
    image: "https://images.unsplash.com/photo-1561154464-82e9adf32764?w=800&auto=format&fit=crop",
    brand: "Samsung",
    stock: 30,
    discount: 7,
    ratings: 4.6
  },
  // Smart Home
  {
    name: "Amazon Echo Dot",
    description: "Smart speaker with Alexa, Motion detection",
    price: 5499,
    category: "Smart Home",
    image: "https://images.unsplash.com/photo-1589003077984-894e133dabab?w=800&auto=format&fit=crop",
    brand: "Amazon",
    stock: 200,
    discount: 20,
    ratings: 4.3
  },
  {
    name: "Google Nest Hub",
    description: "7-inch smart display with Google Assistant",
    price: 7999,
    category: "Smart Home",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&auto=format&fit=crop",
    brand: "Google",
    stock: 85,
    discount: 10,
    ratings: 4.4
  },
  // Monitors
  {
    name: "Samsung Odyssey G5",
    description: "32-inch QHD, 144Hz, 1ms, Curved Gaming",
    price: 24999,
    category: "Monitors",
    image: "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=800&auto=format&fit=crop",
    brand: "Samsung",
    stock: 42,
    discount: 10,
    ratings: 4.4
  },
  {
    name: "LG UltraGear",
    description: "27-inch 4K Nano IPS, 144Hz, HDR600",
    price: 44999,
    category: "Monitors",
    image: "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?w=800&auto=format&fit=crop",
    brand: "LG",
    stock: 22,
    discount: 8,
    ratings: 4.5
  }
];

async function addProducts() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');

    // Clear existing products (optional)
    await Product.deleteMany({});
    console.log('Old products cleared');

    // Add products
    await Product.insertMany(sampleProducts);
    console.log(`✅ ${sampleProducts.length} products added with images!`);

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

addProducts();