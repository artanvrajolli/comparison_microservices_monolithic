require('dotenv').config();
const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker');
const axios = require('axios');
const Blog = require('../models/Blog');
const connectDB = require('../config/db');

// Function to get user IDs from user service or generate dummy IDs
const getUserIds = async () => {
  try {
    console.log('Attempting to fetch users from user service...');
    const response = await axios.get(process.env.USER_SERVICE_URL, { timeout: 3000 });
    if (response.data && response.data.length > 0) {
      console.log(`Successfully fetched ${response.data.length} users from user service`);
      return response.data.map(user => user._id || user.id);
    } else {
      throw new Error('User service returned empty data');
    }
  } catch (error) {
    console.warn('Failed to fetch users from user service:', error.message);
    console.warn('Generating dummy user IDs instead...');
    // Generate 50 random user IDs
    return Array.from({ length: 50 }, () => mongoose.Types.ObjectId().toString());
  }
};

// Function to generate a random blog
const generateBlog = (userIds) => {
  const randomIndex = Math.floor(Math.random() * userIds.length);
  return {
    title: faker.lorem.sentence({ min: 3, max: 10 }),
    content: faker.lorem.paragraphs({ min: 2, max: 5 }),
    author: userIds[randomIndex],
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent()
  };
};

// Seed the database with 1000 blogs
const seedBlogs = async () => {
  try {
    await connectDB();
    console.log('Connected to MongoDB');

    // Get user IDs for reference
    const userIds = await getUserIds();
    console.log(`Got ${userIds.length} user IDs for reference`);
    
    // Clean the database first
    await Blog.deleteMany({});
    console.log('Deleted all existing blogs');
    
    // Generate and insert 1000 blogs
    const blogs = [];
    for (let i = 0; i < 1000; i++) {
      blogs.push(generateBlog(userIds));
      
      // Log progress every 100 blogs
      if ((i + 1) % 100 === 0) {
        console.log(`Generated ${i + 1} blogs`);
      }
    }
    
    await Blog.insertMany(blogs);
    console.log('Successfully seeded 1000 blogs');
    
    // Get and display some sample blogs
    const sampleBlogs = await Blog.find().limit(5);
    console.log('Sample blogs:', sampleBlogs);
    
    console.log('Database seeding completed!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seeder
seedBlogs(); 