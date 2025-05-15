const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');

// Import models to ensure they are registered
require('./models');

// Route files
const commentRoutes = require('./routes/comment');

// Create Express app
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', service: 'comment-service' });
});

// Mount routers
app.use('/api/comments', commentRoutes);

// Set port
const PORT = process.env.PORT || 5003;

// Function to start the server
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Comment Service running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start comment service:', error);
    process.exit(1);
  }
};

// Start the server
startServer(); 