const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const proxy = require('express-http-proxy');
require('dotenv').config();

// Create Express app
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

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