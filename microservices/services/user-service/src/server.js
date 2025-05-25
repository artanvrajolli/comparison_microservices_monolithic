const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const promClient = require('prom-client');
require('dotenv').config();
const connectDB = require('./config/db');

// Import models to ensure they are registered
require('./models');

// Route files
const userRoutes = require('./routes/user');

// Create Express app
const app = express();

// Initialize Prometheus metrics
const collectDefaultMetrics = promClient.collectDefaultMetrics;
collectDefaultMetrics({ timeout: 5000 });

// Create custom metrics
const httpRequestDurationMicroseconds = new promClient.Histogram({
  name: 'user_service_http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds for user service',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.1, 0.5, 1, 2, 5]
});

const userOperationsTotal = new promClient.Counter({
  name: 'user_service_operations_total',
  help: 'Total number of user operations',
  labelNames: ['operation', 'status']
});

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Metrics middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    httpRequestDurationMicroseconds
      .labels(req.method, req.route?.path || req.path, res.statusCode.toString())
      .observe(duration / 1000);
  });
  next();
});

// Metrics endpoint
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', promClient.register.contentType);
  res.end(await promClient.register.metrics());
});

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