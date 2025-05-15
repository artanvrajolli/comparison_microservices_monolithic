require('dotenv').config();
const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker');
const User = require('../models/User');
const connectDB = require('../config/db');

// Function to generate a random user
const generateUser = () => {
  return {
    username: faker.internet.userName(),
    email: faker.internet.email(),
    createdAt: faker.date.past()
  };
};

// Seed the database with 1000 users
const seedUsers = async () => {
  try {
    await connectDB();
    console.log('Connected to MongoDB');
    
    // Clean the database first
    await User.deleteMany({});
    console.log('Deleted all existing users');
    
    // Generate and insert 1000 users
    const users = [];
    for (let i = 0; i < 1000; i++) {
      users.push(generateUser());
      
      // Log progress every 100 users
      if ((i + 1) % 100 === 0) {
        console.log(`Generated ${i + 1} users`);
      }
    }
    
    await User.insertMany(users);
    console.log('Successfully seeded 1000 users');
    
    // Get and display some sample users
    const sampleUsers = await User.find().limit(5);
    console.log('Sample users:', sampleUsers);
    
    console.log('Database seeding completed!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seeder
seedUsers(); 