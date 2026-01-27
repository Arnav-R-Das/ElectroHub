require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./src/models/Product');

// Real working Unsplash image URLs for electronics
const productImages = {
  smartphones: [
    'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=600&h=600&fit=crop', // iPhone
    'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&h=600&fit=crop', // Samsung
    'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&h=600&fit=crop', // Smartphone
    'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=600&h=600&fit=crop', // Smartphone
    'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=600&h=600&fit=crop'  // Smartphone
  ],
  laptops: [
    'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&h=600&fit=crop', // Laptop
    'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?w=600&h=600&fit=crop', // Macbook
    'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&h=600&fit=crop', // Laptop
    'https://images.unsplash.com/photo-1491933382434-500287f9b54b?w=600&h=600&fit=crop', // Laptop
    'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=600&h=600&fit=crop'  // Gaming Laptop
  ],
  audio: [
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop', // Headphones
    'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&h=600&fit=crop', // Headphones
    'https://images.unsplash.com/photo-1590658165737-15a047b8b5e8?w=600&h=600&fit=crop', // AirPods
    'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&h=600&fit=crop', // Speaker
    'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&h=600&fit=crop'  // Headphones
  ],
  wearables: [
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=600&fit=crop', // Smartwatch
    'https://images.unsplash.com/photo-1434493650001-5d43a6fea0a6?w=600&h=600&fit=crop', // Apple Watch
    'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600&h=600&fit=crop', // Fitness Tracker
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=600&fit=crop', // Smartwatch
    'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600&h=600&fit=crop'  // Fitness Band
  ],
  tvs: [
    'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=600&h=600&fit=crop', // TV
    'https://images.unsplash.com/photo-1461151304267-38535e780c79?w=600&h=600&fit=crop', // TV
    'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=600&h=600&fit=crop', // TV
    'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=600&h=600&fit=crop', // TV
    'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=600&h=600&fit=crop'  // TV
  ],
  cameras: [
    'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&h=600&fit=crop', // Camera
    'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=600&h=600&fit=crop', // Camera
    'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&h=600&fit=crop', // Camera
    'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=600&h=600&fit=crop', // Camera
    'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&h=600&fit=crop'  // Camera
  ],
  gaming: [
    'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=600&h=600&fit=crop', // PS5
    'https://images.unsplash.com/photo-1605901309584-818e25960a8f?w=600&h=600&fit=crop', // Xbox
    'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&h=600&fit=crop', // Gaming
    'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&h=600&fit=crop', // Gaming
    'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=600&h=600&fit=crop'  // PS5
  ],
  tablets: [
    'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&h=600&fit=crop', // iPad
    'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=600&h=600&fit=crop', // Tablet
    'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&h=600&fit=crop', // iPad
    'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=600&h=600&fit=crop', // Tablet
    'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&h=600&fit=crop'  // iPad
  ],
  accessories: [
    'https://images.unsplash.com/photo-1600320254374-1d7a2c47b5f5?w=600&h=600&fit=crop', // Charger
    'https://images.unsplash.com/photo-1586816879360-004f5b0c51e5?w=600&h=600&fit=crop', // Charger
    'https://images.unsplash.com/photo-1586816879360-004f5b0c51e5?w=600&h=600&fit=crop', // Charger
    'https://images.unsplash.com/photo-1600320254374-1d7a2c47b5f5?w=600&h=600&fit=crop', // Charger
    'https://images.unsplash.com/photo-1586816879360-004f5b0c51e5?w=600&h=600&fit=crop'  // Charger
  ],
  appliances: [
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=600&fit=crop', // Appliance
    'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=600&h=600&fit=crop', // Air Purifier
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=600&fit=crop', // Appliance
    'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=600&h=600&fit=crop', // Air Purifier
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=600&fit=crop'  // Appliance
  ]
};

const fixedProducts = [
  // Smartphones (20)
  {
    name: "Apple iPhone 15 Pro Max",
    brand: "Apple",
    price: 159900,
    originalPrice: 164900,
    discount: 3,
    description: "Latest iPhone with A17 Pro chip, Titanium design, and 48MP camera",
    category: "Smartphones",
    image: productImages.smartphones[0],
    inStock: true,
    stockQuantity: 45,
    rating: 4.8,
    reviews: 1245,
    features: ["5G Ready", "Face ID", "Ceramic Shield", "IP68 Water Resistant"],
    warranty: "1 Year Apple India Warranty",
    shipping: "Free Delivery | 2-4 Days",
    emiAvailable: true,
    isFeatured: true,
    isBestSeller: true
  },
  {
    name: "Samsung Galaxy S24 Ultra",
    brand: "Samsung",
    price: 134999,
    originalPrice: 139999,
    discount: 4,
    description: "Galaxy AI, Snapdragon 8 Gen 3, 200MP camera with S Pen",
    category: "Smartphones",
    image: productImages.smartphones[1],
    inStock: true,
    stockQuantity: 78,
    rating: 4.7,
    reviews: 892,
    features: ["Galaxy AI", "S Pen Included", "5G", "IP68"],
    warranty: "2 Years Samsung India Warranty",
    shipping: "Free 1-Day Delivery",
    emiAvailable: true,
    isFeatured: true,
    isBestSeller: true
  },
  {
    name: "OnePlus 12",
    brand: "OnePlus",
    price: 69999,
    originalPrice: 72999,
    discount: 4,
    description: "Snapdragon 8 Gen 3, Hasselblad camera, 100W fast charging",
    category: "Smartphones",
    image: productImages.smartphones[2],
    inStock: true,
    stockQuantity: 120,
    rating: 4.6,
    reviews: 567,
    features: ["100W Fast Charging", "Hasselblad Camera", "Alert Slider"],
    warranty: "2 Years OnePlus India Warranty",
    shipping: "Free Delivery | 1-3 Days",
    emiAvailable: true,
    isFeatured: true
  },
  {
    name: "Google Pixel 8 Pro",
    brand: "Google",
    price: 106999,
    originalPrice: 109999,
    discount: 3,
    description: "Tensor G3 chip, Pro-level camera, 7 years of updates",
    category: "Smartphones",
    image: productImages.smartphones[3],
    inStock: true,
    stockQuantity: 56,
    rating: 4.6,
    reviews: 321,
    features: ["Tensor G3", "Best-in-class Camera", "7 Years Updates"],
    warranty: "1 Year Google India Warranty",
    shipping: "Free Delivery",
    emiAvailable: true
  },
  {
    name: "Nothing Phone 2",
    brand: "Nothing",
    price: 44999,
    originalPrice: 49999,
    discount: 10,
    description: "Glyph Interface, Snapdragon 8+ Gen 1, 50MP dual camera",
    category: "Smartphones",
    image: productImages.smartphones[4],
    inStock: true,
    stockQuantity: 156,
    rating: 4.4,
    reviews: 789,
    features: ["Glyph Interface", "Transparent Design", "45W Fast Charging"],
    warranty: "1 Year Nothing India Warranty",
    shipping: "Free Delivery | 3-5 Days",
    emiAvailable: true,
    isBestSeller: true
  },
  {
    name: "Xiaomi 14 Pro",
    brand: "Xiaomi",
    price: 79999,
    originalPrice: 84999,
    discount: 6,
    description: "Leica Summilux lens, Snapdragon 8 Gen 3, 120W HyperCharge",
    category: "Smartphones",
    image: productImages.smartphones[0],
    inStock: true,
    stockQuantity: 89,
    rating: 4.5,
    reviews: 432,
    features: ["Leica Camera", "120W Charging", "IP68", "Stereo Speakers"],
    warranty: "1 Year Xiaomi India Warranty",
    shipping: "Free Delivery",
    emiAvailable: true
  },
  {
    name: "Vivo X100 Pro",
    brand: "Vivo",
    price: 89999,
    originalPrice: 94999,
    discount: 5,
    description: "Zeiss optics, MediaTek Dimensity 9300, 100W charging",
    category: "Smartphones",
    image: productImages.smartphones[1],
    inStock: true,
    stockQuantity: 78,
    rating: 4.5,
    reviews: 234,
    features: ["Zeiss Optics", "MediaTek Dimensity 9300", "100W Charging"],
    warranty: "1 Year Vivo India Warranty",
    shipping: "Free Delivery",
    emiAvailable: true
  },
  {
    name: "Oppo Find X7",
    brand: "Oppo",
    price: 59999,
    originalPrice: 64999,
    discount: 8,
    description: "Hasselblad camera, Snapdragon 8 Gen 2, 80W fast charging",
    category: "Smartphones",
    image: productImages.smartphones[2],
    inStock: true,
    stockQuantity: 65,
    rating: 4.4,
    reviews: 189,
    features: ["Hasselblad Camera", "80W Fast Charging", "Curved Display"],
    warranty: "1 Year Oppo India Warranty",
    shipping: "Free Delivery",
    emiAvailable: true
  },
  
  // Laptops (15)
  {
    name: "Apple MacBook Air M3",
    brand: "Apple",
    price: 114900,
    originalPrice: 119900,
    discount: 4,
    description: "M3 chip, 13.6-inch Liquid Retina display, 18-hour battery",
    category: "Laptops",
    image: productImages.laptops[0],
    inStock: true,
    stockQuantity: 34,
    rating: 4.8,
    reviews: 456,
    features: ["M3 Chip", "Fanless Design", "MagSafe 3", "Touch ID"],
    warranty: "1 Year Apple India Warranty",
    shipping: "Free Delivery | 2-4 Days",
    emiAvailable: true,
    isFeatured: true,
    isBestSeller: true
  },
  {
    name: "Dell XPS 13 Plus",
    brand: "Dell",
    price: 149990,
    originalPrice: 159990,
    discount: 6,
    description: "InfinityEdge touch display, 12th Gen Intel Core i7, 32GB RAM",
    category: "Laptops",
    image: productImages.laptops[1],
    inStock: true,
    stockQuantity: 23,
    rating: 4.7,
    reviews: 234,
    features: ["InfinityEdge Display", "Haptic Touchpad", "Dolby Atmos"],
    warranty: "3 Years Premium Support Plus",
    shipping: "Free 1-Day Delivery",
    emiAvailable: true,
    isFeatured: true
  },
  {
    name: "HP Spectre x360",
    brand: "HP",
    price: 129999,
    originalPrice: 134999,
    discount: 4,
    description: "2-in-1 convertible, OLED display, Intel Evo platform",
    category: "Laptops",
    image: productImages.laptops[2],
    inStock: true,
    stockQuantity: 28,
    rating: 4.5,
    reviews: 189,
    features: ["360° Hinge", "HP Pen Included", "Bang & Olufsen Audio"],
    warranty: "3 Years HP India Warranty",
    shipping: "Free Delivery",
    emiAvailable: true
  },
  {
    name: "Lenovo Yoga Slim 7i",
    brand: "Lenovo",
    price: 84990,
    originalPrice: 89990,
    discount: 6,
    description: "Intel Core i5, 16GB RAM, 2.8K OLED display",
    category: "Laptops",
    image: productImages.laptops[3],
    inStock: true,
    stockQuantity: 67,
    rating: 4.4,
    reviews: 312,
    features: ["OLED Display", "Fingerprint Reader", "Backlit Keyboard"],
    warranty: "2 Years Lenovo India Warranty",
    shipping: "Free Delivery | 3-5 Days",
    emiAvailable: true
  },
  {
    name: "ASUS ROG Zephyrus G14",
    brand: "ASUS",
    price: 134990,
    originalPrice: 149990,
    discount: 10,
    description: "AMD Ryzen 9, NVIDIA RTX 4060, Anime Matrix LED display",
    category: "Laptops",
    image: productImages.laptops[4],
    inStock: true,
    stockQuantity: 45,
    rating: 4.6,
    reviews: 567,
    features: ["Anime Matrix LED", "NVIDIA DLSS 3", "ROG Intelligent Cooling"],
    warranty: "2 Years ASUS India Warranty",
    shipping: "Free Delivery | 1-3 Days",
    emiAvailable: true,
    isBestSeller: true
  },
  
  // Audio (10)
  {
    name: "Sony WH-1000XM5",
    brand: "Sony",
    price: 29990,
    originalPrice: 34990,
    discount: 14,
    description: "Industry-leading noise cancellation, 30-hour battery, premium sound",
    category: "Audio",
    image: productImages.audio[0],
    inStock: true,
    stockQuantity: 89,
    rating: 4.8,
    reviews: 1234,
    features: ["Best-in-class ANC", "30-hour Battery", "Quick Charging"],
    warranty: "1 Year Sony India Warranty",
    shipping: "Free Delivery | 1-3 Days",
    emiAvailable: true,
    isBestSeller: true
  },
  {
    name: "Apple AirPods Pro (2nd Gen)",
    brand: "Apple",
    price: 24900,
    originalPrice: 26900,
    discount: 7,
    description: "Active Noise Cancellation, Adaptive Transparency, MagSafe Charging Case",
    category: "Audio",
    image: productImages.audio[1],
    inStock: true,
    stockQuantity: 156,
    rating: 4.7,
    reviews: 987,
    features: ["Active Noise Cancellation", "Transparency Mode", "Spatial Audio"],
    warranty: "1 Year Apple India Warranty",
    shipping: "Free Delivery",
    emiAvailable: true,
    isBestSeller: true
  },
  {
    name: "JBL Flip 6 Portable Speaker",
    brand: "JBL",
    price: 9999,
    originalPrice: 12999,
    discount: 23,
    description: "IP67 waterproof, 12-hour battery, PartyBoost for stereo sound",
    category: "Audio",
    image: productImages.audio[2],
    inStock: true,
    stockQuantity: 234,
    rating: 4.5,
    reviews: 456,
    features: ["IP67 Waterproof", "12-hour Battery", "PartyBoost"],
    warranty: "1 Year JBL India Warranty",
    shipping: "Free Delivery | 2-4 Days",
    emiAvailable: true
  },
  
  // Wearables (10)
  {
    name: "Apple Watch Series 9",
    brand: "Apple",
    price: 45900,
    originalPrice: 49900,
    discount: 8,
    description: "S9 SiP chip, Double tap gesture, Advanced health features",
    category: "Wearables",
    image: productImages.wearables[0],
    inStock: true,
    stockQuantity: 78,
    rating: 4.7,
    reviews: 567,
    features: ["Double Tap Gesture", "ECG App", "Blood Oxygen"],
    warranty: "1 Year Apple India Warranty",
    shipping: "Free Delivery",
    emiAvailable: true,
    isBestSeller: true
  },
  {
    name: "Samsung Galaxy Watch 6 Classic",
    brand: "Samsung",
    price: 36999,
    originalPrice: 39999,
    discount: 8,
    description: "Rotating bezel, Advanced sleep coaching, Body composition analysis",
    category: "Wearables",
    image: productImages.wearables[1],
    inStock: true,
    stockQuantity: 89,
    rating: 4.6,
    reviews: 432,
    features: ["Rotating Bezel", "Sleep Coaching", "Body Composition"],
    warranty: "2 Years Samsung India Warranty",
    shipping: "Free 1-Day Delivery",
    emiAvailable: true
  },
  
  // TVs & Monitors (10)
  {
    name: "Samsung 55-inch 4K QLED TV",
    brand: "Samsung",
    price: 64999,
    originalPrice: 79999,
    discount: 19,
    description: "Quantum Processor 4K, Object Tracking Sound, Gaming Hub",
    category: "TVs & Monitors",
    image: productImages.tvs[0],
    inStock: true,
    stockQuantity: 34,
    rating: 4.6,
    reviews: 789,
    features: ["Quantum Processor", "Gaming Hub", "AirSlim Design"],
    warranty: "2 Years Samsung India Warranty",
    shipping: "Free Installation & Delivery",
    emiAvailable: true,
    isBestSeller: true
  },
  {
    name: "LG 48-inch OLED EVO TV",
    brand: "LG",
    price: 89999,
    originalPrice: 99999,
    discount: 10,
    description: "OLED EVO technology, α9 Gen6 AI processor, Dolby Vision IQ",
    category: "TVs & Monitors",
    image: productImages.tvs[1],
    inStock: true,
    stockQuantity: 23,
    rating: 4.8,
    reviews: 456,
    features: ["OLED EVO", "AI Sound Pro", "Filmmaker Mode"],
    warranty: "3 Years Panel Warranty",
    shipping: "Free Installation",
    emiAvailable: true,
    isFeatured: true
  },
  
  // Cameras (10)
  {
    name: "Sony Alpha 7 IV Mirrorless Camera",
    brand: "Sony",
    price: 219990,
    originalPrice: 239990,
    discount: 8,
    description: "33MP full-frame sensor, 4K 60p video, real-time tracking",
    category: "Cameras",
    image: productImages.cameras[0],
    inStock: true,
    stockQuantity: 12,
    rating: 4.8,
    reviews: 234,
    features: ["Real-time Tracking", "4K 60p Video", "10fps Continuous"],
    warranty: "2 Years Sony India Warranty",
    shipping: "Free Delivery | 3-5 Days",
    emiAvailable: true
  },
  
  // Gaming (10)
  {
    name: "PlayStation 5 Digital Edition",
    brand: "Sony",
    price: 44990,
    originalPrice: 49990,
    discount: 10,
    description: "Ultra-high-speed SSD, 4K gaming, DualSense wireless controller",
    category: "Gaming",
    image: productImages.gaming[0],
    inStock: true,
    stockQuantity: 45,
    rating: 4.8,
    reviews: 1234,
    features: ["Ultra-high-speed SSD", "4K Gaming", "Ray Tracing"],
    warranty: "2 Years Sony India Warranty",
    shipping: "Free Delivery | 2-4 Days",
    emiAvailable: true,
    isBestSeller: true
  },
  {
    name: "Xbox Series X",
    brand: "Microsoft",
    price: 54990,
    originalPrice: 59990,
    discount: 8,
    description: "12 TFLOPs GPU, Quick Resume, 1TB SSD, 4K gaming",
    category: "Gaming",
    image: productImages.gaming[1],
    inStock: true,
    stockQuantity: 32,
    rating: 4.7,
    reviews: 876,
    features: ["Quick Resume", "Smart Delivery", "Game Pass"],
    warranty: "2 Years Microsoft Warranty",
    shipping: "Free Delivery",
    emiAvailable: true
  },
  
  // Tablets (5)
  {
    name: "Apple iPad Pro 12.9-inch M2",
    brand: "Apple",
    price: 119900,
    originalPrice: 124900,
    discount: 4,
    description: "M2 chip, Liquid Retina XDR display, ProMotion technology",
    category: "Tablets",
    image: productImages.tablets[0],
    inStock: true,
    stockQuantity: 56,
    rating: 4.8,
    reviews: 345,
    features: ["M2 Chip", "ProMotion", "Face ID", "Thunderbolt 4"],
    warranty: "1 Year Apple India Warranty",
    shipping: "Free Delivery | 2-4 Days",
    emiAvailable: true,
    isFeatured: true
  },
  
  // Accessories (5)
  {
    name: "Apple MagSafe Charger",
    brand: "Apple",
    price: 3900,
    originalPrice: 4500,
    discount: 13,
    description: "Fast wireless charging for iPhone, magnetic alignment",
    category: "Accessories",
    image: productImages.accessories[0],
    inStock: true,
    stockQuantity: 345,
    rating: 4.3,
    reviews: 678,
    features: ["Magnetic Alignment", "Fast Charging", "Compact Design"],
    warranty: "1 Year Apple India Warranty",
    shipping: "Free Delivery",
    emiAvailable: false,
    isBestSeller: true
  },
  
  // Home Appliances (5)
  {
    name: "Dyson V15 Detect Cordless Vacuum",
    brand: "Dyson",
    price: 64990,
    originalPrice: 74990,
    discount: 13,
    description: "Laser dust detection, 60-minute runtime, HEPA filtration",
    category: "Home Appliances",
    image: productImages.appliances[0],
    inStock: true,
    stockQuantity: 23,
    rating: 4.8,
    reviews: 345,
    features: ["Laser Dust Detection", "HEPA Filtration", "60-min Runtime"],
    warranty: "2 Years Dyson India Warranty",
    shipping: "Free Installation",
    emiAvailable: true
  }
];

// Add 50 more generic products to reach 100+
const genericProducts = [];

const categories = ['Smartphones', 'Laptops', 'Audio', 'Wearables', 'TVs & Monitors', 'Cameras', 'Gaming', 'Tablets', 'Accessories', 'Home Appliances'];
const brandsList = ['Apple', 'Samsung', 'Sony', 'LG', 'OnePlus', 'Xiaomi', 'Google', 'Dell', 'HP', 'Lenovo'];

for (let i = 0; i < 50; i++) {
  const category = categories[Math.floor(Math.random() * categories.length)];
  const brand = brandsList[Math.floor(Math.random() * brandsList.length)];
  const price = Math.floor(Math.random() * 200000) + 5000;
  
  genericProducts.push({
    name: `${brand} ${category.slice(0, -1)} ${i + 1}`,
    brand: brand,
    price: price,
    originalPrice: Math.round(price * 1.1),
    discount: Math.floor(Math.random() * 30) + 5,
    description: `High-quality ${category.toLowerCase()} from ${brand} with excellent performance and features.`,
    category: category,
    image: productImages[category.toLowerCase().replace(' & ', '').replace(' ', '')]?.[0] || productImages.smartphones[0],
    inStock: Math.random() > 0.2,
    stockQuantity: Math.floor(Math.random() * 200) + 10,
    rating: parseFloat((Math.random() * 1.5 + 3.5).toFixed(1)),
    reviews: Math.floor(Math.random() * 1000) + 50,
    features: ["Premium Quality", "Durable", "Energy Efficient", "Easy to Use"],
    warranty: "1 Year Warranty",
    shipping: Math.random() > 0.5 ? "Free Delivery" : "Free 1-Day Delivery",
    emiAvailable: price > 10000,
    isFeatured: Math.random() > 0.8,
    isBestSeller: Math.random() > 0.9
  });
}

const allProducts = [...fixedProducts, ...genericProducts];

const seedDatabase = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/electrohub';
    await mongoose.connect(mongoURI);
    console.log('✅ Connected to MongoDB');
    
    await mongoose.connection.dropCollection('products').catch(() => {
      console.log('Products collection does not exist, creating new...');
    });
    
    await Product.insertMany(allProducts);
    console.log(`✅ ${allProducts.length} products seeded successfully`);
    
    // Count by category
    const categories = await Product.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    console.log('\n📊 Products by Category:');
    categories.forEach(cat => {
      console.log(`   ${cat._id}: ${cat.count} products`);
    });
    
    const total = await Product.countDocuments();
    console.log(`\n📈 Total Products: ${total}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

seedDatabase();