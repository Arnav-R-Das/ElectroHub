// create clear-db.js in backend
const mongoose = require('mongoose');
require('dotenv').config();

async function clearDatabase() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    // Clear all collections
    const collections = ['users', 'products', 'carts', 'orders', 'wishlists'];
    
    for (const collection of collections) {
      await mongoose.connection.db.collection(collection).deleteMany({});
      console.log(`Cleared ${collection}`);
    }
    
    console.log('✅ Database cleared!');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

clearDatabase();