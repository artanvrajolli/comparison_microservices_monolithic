const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');
const { register, httpRequestDurationMicroseconds, httpRequestCounter } = require('./utils/metrics');

// Import models to ensure they are registered
require('./models');

// Route files
const commentRoutes = require('./routes/comment');

// Create Express app
const app = express();

// Middleware for metrics
app.use((req, res, next) => {
  const start = Date.now();
  
  // Record the end of the request and calculate duration
  res.on('finish', () => {
    const duration = Date.now() - start;
    httpRequestDurationMicroseconds
      .labels(req.method, req.path, res.statusCode)
      .observe(duration / 1000); // Convert to seconds
    
    httpRequestCounter
      .labels(req.method, req.path, res.statusCode)
      .inc();
  });
  
  next();
});

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', service: 'comment-service' });
});

// Prometheus metrics endpoint
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
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