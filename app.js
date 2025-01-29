const express = require('express');
const HealthCheck = require('./models/healthCheck');
const sequelize = require('./config/database');

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware to parse the request body
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded


// Middleware to check for payload in the request body
app.use('/healthz', (req, res, next) => {
  if (Object.keys(req.body).length > 0) {
    return res.status(400).send();
  }
  next();
});

// Health check route
app.get('/healthz', async (req, res) => {
  try {
    // Set headers for no caching before the response is sent
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('X-Content-Type-Options', 'nosniff');

    // Insert a new health check record into the database
    await HealthCheck.create({});
    res.status(200).send();  // Success
  } catch (error) {
    console.error('Database error:', error);
    res.status(503).send();  // Service unavailable
  }
});

// Handle 405 Method Not Allowed for non-GET requests on /healthz
app.all('/healthz', (req, res) => {
  if (req.method !== 'GET') {
    return res.status(405).send();  // Respond with 405 for unsupported methods
  }
});

// Start the server and sync the database
const startServer = async () => {
  try {
    await sequelize.authenticate();  // Test DB connection
    console.log('Database connection successful.');

    // Sync the models (create table if it doesn’t exist)
    await sequelize.sync();  // Will automatically create the table if it doesn't exist
    console.log('Database tables synchronized.');

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

startServer();
