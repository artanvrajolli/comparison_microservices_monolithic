const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');

// Import models to ensure they are registered
require('./models');

// Route files
const userRoutes = require('./routes/user');

// Create Express app
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', service: 'user-service' });
});

// Mount routers
app.use('/api/users', userRoutes);

// Set port
const PORT = process.env.PORT || 5002;

// Function to start the server
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`User Service running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start user service:', error);
    process.exit(1);
  }
};

// Start the server
startServer(); 