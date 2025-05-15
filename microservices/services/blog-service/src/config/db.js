const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI;
    await mongoose.connect(mongoURI);
    console.log('Blog Service: MongoDB Connected...');
  } catch (err) {
    console.error('Blog Service: Database connection error:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB; 