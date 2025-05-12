const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Service URLs
const USER_SERVICE = 'http://localhost:4001';
const BLOG_SERVICE = 'http://localhost:4002';
const COMMENT_SERVICE = 'http://localhost:4003';

// Proxy routes
app.use('/api/users', async (req, res) => {
    try {
        const response = await axios({
            method: req.method,
            url: `${USER_SERVICE}${req.originalUrl}`,
            data: req.body
        });
        res.json(response.data);
    } catch (error) {
        res.status(error.response?.status || 500).json(error.response?.data || { error: 'Service unavailable' });
    }
});

app.use('/api/blogs', async (req, res) => {
    try {
        const response = await axios({
            method: req.method,
            url: `${BLOG_SERVICE}${req.originalUrl}`,
            data: req.body
        });
        res.json(response.data);
    } catch (error) {
        res.status(error.response?.status || 500).json(error.response?.data || { error: 'Service unavailable' });
    }
});

app.use('/api/comments', async (req, res) => {
    try {
        const response = await axios({
            method: req.method,
            url: `${COMMENT_SERVICE}${req.originalUrl}`,
            data: req.body
        });
        res.json(response.data);
    } catch (error) {
        res.status(error.response?.status || 500).json(error.response?.data || { error: 'Service unavailable' });
    }
});

// Aggregated endpoint
app.get('/api/blogs-with-details', async (req, res) => {
    try {
        // Get all blogs
        const blogsResponse = await axios.get(`${BLOG_SERVICE}/api/blogs`);
        const blogs = blogsResponse.data;

        // Enrich each blog with author and comments
        const enrichedBlogs = await Promise.all(blogs.map(async blog => {
            // Get author details
            const authorResponse = await axios.get(`${USER_SERVICE}/api/users/${blog.authorId}`);
            const author = authorResponse.data;

            // Get all comments for this blog
            const commentsResponse = await axios.get(`${COMMENT_SERVICE}/api/comments`);
            const allComments = commentsResponse.data;
            const blogComments = allComments.filter(c => c.blogId === blog._id);

            // Enrich each comment with user details
            const enrichedComments = await Promise.all(blogComments.map(async comment => {
                const userResponse = await axios.get(`${USER_SERVICE}/api/users/${comment.userId}`);
                return {
                    ...comment,
                    user: userResponse.data
                };
            }));

            return {
                ...blog._doc,
                author,
                comments: enrichedComments
            };
        }));

        res.json(enrichedBlogs);
    } catch (error) {
        console.error('Aggregation error:', error);
        res.status(500).json({ error: 'Failed to aggregate data' });
    }
});

const PORT = 4000;

app.listen(PORT, () => {
    console.log(`API Gateway running on port ${PORT}`);
});