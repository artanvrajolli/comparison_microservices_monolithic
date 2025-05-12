const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

// Connect to DB
mongoose.connect('mongodb://localhost:27017/comment-service', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Comment Model
const Comment = mongoose.model('Comment', {
    content: String,
    userId: String, // References User Service
    blogId: String, // References Blog Service
    createdAt: { type: Date, default: Date.now }
});

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Routes
app.get('/api/comments', async (req, res) => {
    const comments = await Comment.find();
    res.json(comments);
});

app.get('/api/comments/:id', async (req, res) => {
    const comment = await Comment.findById(req.params.id);
    res.json(comment);
});

const PORT = 4003;
app.listen(PORT, () => {
    console.log(`Comment Service running on port ${PORT}`);
});