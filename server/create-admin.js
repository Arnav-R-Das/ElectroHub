const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const User = require('./models/User');

const Admins = [
  {
    name: "Arnav Das",
    email: "arnav@gmail.com",
    password: "admin123",
    role: "admin"
  },
  {
    name: "Aastha",
    email: "aastha@gmail.com",
    password: "admin123",
    role: "admin"
  }
];

async function createUsers() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    for (const userData of Admins) {
      const existingUser = await User.findOne({ email: userData.email });
      
      if (!existingUser) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        
        const user = new User({
          name: userData.name,
          email: userData.email,
          password: hashedPassword,
          role: userData.role
        });
        
        await user.save();
        console.log(`✅ ${userData.role.toUpperCase()}: ${userData.name} (${userData.email})`);
        console.log(`   Password: ${userData.password}`);
      } else {
        console.log(`ℹ️  User already exists: ${userData.email}`);
      }
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

createUsers();