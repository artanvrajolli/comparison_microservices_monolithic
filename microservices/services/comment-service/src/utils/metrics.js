const client = require('prom-client');

// Create a Registry to register the metrics
const register = new client.Registry();

// Add a default label to all metrics
client.collectDefaultMetrics({
  register,
  prefix: 'comment_service_'
});

// Create custom metrics
const httpRequestDurationMicroseconds = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.01, 0.05, 0.1, 0.5, 1, 2, 5]
});

const httpRequestCounter = new client.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code']
});

// Register the metrics
register.registerMetric(httpRequestDurationMicroseconds);
register.registerMetric(httpRequestCounter);

module.exports = {
  register,
  httpRequestDurationMicroseconds,
  httpRequestCounter
}; 