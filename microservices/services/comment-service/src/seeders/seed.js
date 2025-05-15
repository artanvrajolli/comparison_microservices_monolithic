require('dotenv').config();
const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker');
const axios = require('axios');
const Comment = require('../models/Comment');
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

// Function to get blog IDs from blog service or generate dummy IDs
const getBlogIds = async () => {
  try {
    console.log('Attempting to fetch blogs from blog service...');
    const response = await axios.get(process.env.BLOG_SERVICE_URL, { timeout: 3000 });
    if (response.data && response.data.length > 0) {
      console.log(`Successfully fetched ${response.data.length} blogs from blog service`);
      return response.data.map(blog => blog._id || blog.id);
    } else {
      throw new Error('Blog service returned empty data');
    }
  } catch (error) {
    console.warn('Failed to fetch blogs from blog service:', error.message);
    console.warn('Generating dummy blog IDs instead...');
    // Generate 50 random blog IDs
    return Array.from({ length: 50 }, () => mongoose.Types.ObjectId().toString());
  }
};

// Function to generate a random comment
const generateComment = (userIds, blogIds) => {
  const randomUserIndex = Math.floor(Math.random() * userIds.length);
  const randomBlogIndex = Math.floor(Math.random() * blogIds.length);
  
  return {
    content: faker.lorem.paragraph(),
    userId: userIds[randomUserIndex],
    blogId: blogIds[randomBlogIndex],
    createdAt: faker.date.past()
  };
};

// Seed the database with 1000 comments
const seedComments = async () => {
  try {
    await connectDB();
    console.log('Connected to MongoDB');

    // Get user and blog IDs for reference
    const userIds = await getUserIds();
    console.log(`Got ${userIds.length} user IDs for reference`);
    
    const blogIds = await getBlogIds();
    console.log(`Got ${blogIds.length} blog IDs for reference`);
    
    // Clean the database first
    await Comment.deleteMany({});
    console.log('Deleted all existing comments');
    
    // Generate and insert 1000 comments
    const comments = [];
    for (let i = 0; i < 1000; i++) {
      comments.push(generateComment(userIds, blogIds));
      
      // Log progress every 100 comments
      if ((i + 1) % 100 === 0) {
        console.log(`Generated ${i + 1} comments`);
      }
    }
    
    await Comment.insertMany(comments);
    console.log('Successfully seeded 1000 comments');
    
    // Get and display some sample comments
    const sampleComments = await Comment.find().limit(5);
    console.log('Sample comments:', sampleComments);
    
    console.log('Database seeding completed!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seeder
seedComments(); 