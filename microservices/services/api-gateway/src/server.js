const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const proxy = require('express-http-proxy');
const promClient = require('prom-client');
require('dotenv').config();

// Create Express app
const app = express();

// Initialize Prometheus metrics
const collectDefaultMetrics = promClient.collectDefaultMetrics;
collectDefaultMetrics({ timeout: 5000 });

// Create custom metrics
const httpRequestDurationMicroseconds = new promClient.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.1, 0.5, 1, 2, 5]
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
  res.status(200).json({ status: 'UP', service: 'api-gateway' });
});

// Proxy routes
app.use('/api/blogs', proxy(process.env.BLOG_SERVICE_URL, {
  proxyReqPathResolver: (req) => {
    return req.originalUrl.replace('/api/blogs', '/api/blogs');
  }
}));

app.use('/api/users', proxy(process.env.USER_SERVICE_URL, {
  proxyReqPathResolver: (req) => {
    return req.originalUrl.replace('/api/users', '/api/users');
  }
}));

app.use('/api/comments', proxy(process.env.COMMENT_SERVICE_URL, {
  proxyReqPathResolver: (req) => {
    return req.originalUrl.replace('/api/comments', '/api/comments');
  }
}));

// Set port
const PORT = process.env.PORT || 5000;

// Start the server
app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
}); 