const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

// Connect to DB
mongoose.connect('mongodb://localhost:27017/user-service', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// User Model
const User = mongoose.model('User', {
    username: String,
    email: String,
    createdAt: { type: Date, default: Date.now }
});

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Routes
app.get('/api/users', async (req, res) => {
    const users = await User.find();
    res.json(users);
});

app.get('/api/users/:id', async (req, res) => {
    const user = await User.findById(req.params.id);
    res.json(user);
});

const PORT = 4001;
app.listen(PORT, () => {
    console.log(`User Service running on port ${PORT}`);
});