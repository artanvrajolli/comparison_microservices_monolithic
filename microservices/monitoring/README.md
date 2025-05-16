# Monitoring Setup with Grafana and Prometheus

This directory contains the configuration for monitoring your microservices using Grafana and Prometheus.

## Components

1. **Prometheus** - Collects metrics from services and stores them as time-series data
2. **Grafana** - Visualizes the metrics collected by Prometheus in dashboards

## Usage

The monitoring services are automatically started with your application when running:

```bash
npm start
```

or 

```bash
docker-compose up
```

## Accessing the Monitoring Tools

- **Grafana**: http://localhost:3000 
  - Username: admin
  - Password: admin

- **Prometheus**: http://localhost:9090

## Adding Metrics to Other Services

To add Prometheus metrics to other services, follow these steps:

1. Install the Prometheus client library in your service:
   ```bash
   npm install prom-client --save
   ```

2. Create a metrics utility file similar to the one in the comment service:
   ```js
   const client = require('prom-client');
   
   // Create a Registry to register the metrics
   const register = new client.Registry();
   
   // Add default metrics
   client.collectDefaultMetrics({
     register,
     prefix: 'service_name_'
   });
   
   // Add custom metrics as needed
   
   module.exports = { register, /* other metrics */ };
   ```

3. Add the metrics middleware and endpoint to your service's main file.

## Customizing Dashboards

You can create and customize dashboards directly in the Grafana UI. The changes will be saved automatically.

For more advanced customization, modify the JSON files in the `grafana/provisioning/dashboards` directory.

## Metrics Available

The following metrics are collected by default:

- HTTP request duration
- HTTP request count
- Node.js process metrics (memory, CPU, etc.)
- Custom application metrics

## Adding More Services to Prometheus

To monitor additional services or databases, add them to the `prometheus.yml` configuration file in the `scrape_configs` section. 