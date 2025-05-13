const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker');
const User = require('../models/User');
const Blog = require('../models/Blog');
const Comment = require('../models/Comment');
const connectDB = require('../config/db');

// Generate fake users
const generateUsers = (count = 50) => {
    const users = [];
    for (let i = 0; i < count; i++) {
        users.push({
            username: faker.internet.userName(),
            email: faker.internet.email(),
            password: faker.internet.password() // Note: In production, this should be properly hashed
        });
    }
    return users;
};

// Generate fake blogs
const generateBlogs = (count = 100) => {
    const blogs = [];
    for (let i = 0; i < count; i++) {
        blogs.push({
            title: faker.lorem.sentence(),
            content: faker.lorem.paragraphs(3),
            url: faker.helpers.slugify(faker.lorem.words(3))
        });
    }
    return blogs;
};

// Generate fake comments
const generateComments = (count = 1000) => {
    const comments = [];
    for (let i = 0; i < count; i++) {
        comments.push({
            content: faker.lorem.paragraph()
        });
    }
    return comments;
};

const seedDatabase = async () => {
    try {
        // Connect to database
        await connectDB();

        // Clear existing data
        await User.deleteMany({});
        await Blog.deleteMany({});
        await Comment.deleteMany({});

        console.log('Cleared existing data');

        // Create users
        const users = generateUsers();
        const createdUsers = await User.insertMany(users);
        console.log(`Created ${createdUsers.length} users`);

        // Create blogs with author references
        const blogs = generateBlogs();
        const blogsWithAuthors = blogs.map(blog => ({
            ...blog,
            author: faker.helpers.arrayElement(createdUsers)._id
        }));
        const createdBlogs = await Blog.insertMany(blogsWithAuthors);
        console.log(`Created ${createdBlogs.length} blogs`);

        // Create comments with user and blog references
        const comments = generateComments();
        const commentsWithRefs = [];
        
        // Process comments in batches to avoid memory issues
        const batchSize = 100;
        for (let i = 0; i < comments.length; i += batchSize) {
            const batch = comments.slice(i, i + batchSize);
            const batchPromises = batch.map(async (comment) => {
                const blog = faker.helpers.arrayElement(createdBlogs);
                const user = faker.helpers.arrayElement(createdUsers);
                
                const createdComment = await Comment.create({
                    ...comment,
                    user: user._id,
                    blog: blog._id
                });

                // Add comment to blog
                await Blog.findByIdAndUpdate(blog._id, {
                    $push: { comments: createdComment._id }
                });

                return createdComment;
            });

            const batchResults = await Promise.all(batchPromises);
            commentsWithRefs.push(...batchResults);
            
            console.log(`Created ${i + batchResults.length} comments...`);
        }

        console.log('Database seeded successfully!');
        console.log(`Total users: ${createdUsers.length}`);
        console.log(`Total blogs: ${createdBlogs.length}`);
        console.log(`Total comments: ${commentsWithRefs.length}`);
        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

// Run the seeder
seedDatabase(); 