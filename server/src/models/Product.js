const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Check if MONGODB_URI is set in environment
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/electrohub';
    
    const conn = await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    console.log(`Database: ${conn.connection.name}`);
    
    return conn;
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    console.error('Please check your MongoDB connection and try again.');
    console.log('You can:');
    console.log('1. Set MONGODB_URI in .env file');
    console.log('2. Install MongoDB locally: https://docs.mongodb.com/manual/installation/');
    console.log('3. Use MongoDB Atlas: https://www.mongodb.com/cloud/atlas');
    
    // Don't exit process in development, allow server to run
    console.log('Server will continue running in development mode...');
    
    return null;
  }
};

module.exports = connectDB;