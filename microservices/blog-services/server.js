const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

// Connect to DB
mongoose.connect('mongodb://localhost:27017/blog-service', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Blog Model
const Blog = mongoose.model('Blog', {
    title: String,
    content: String,
    url: { type: String, unique: true },
    authorId: String, // References User Service
    comments: [String], // References Comment Service
    createdAt: { type: Date, default: Date.now }
});

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Routes
app.get('/api/blogs', async (req, res) => {
    const blogs = await Blog.find();
    res.json(blogs);
});

app.get('/api/blogs/:id', async (req, res) => {
    const blog = await Blog.findById(req.params.id);
    res.json(blog);
});

const PORT = 4002;
app.listen(PORT, () => {
    console.log(`Blog Service running on port ${PORT}`);
});