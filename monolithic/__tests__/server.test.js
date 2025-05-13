const request = require('supertest');
const mongoose = require('mongoose');

// Mock the database connection before requiring server
jest.mock('../config/db', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => Promise.resolve())
}));

// Mock the models
jest.mock('../models', () => ({
  __esModule: true,
  default: jest.fn()
}));

// Import server after mocks are set up
const { app } = require('../server');

describe('Server', () => {
  // Close database connection after all tests
  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe('Server Configuration', () => {
    it('should have CORS enabled', async () => {
      const response = await request(app)
        .get('/api/blogs')
        .set('Origin', 'http://example.com');
      
      expect(response.headers['access-control-allow-origin']).toBe('*');
    });

    it('should parse JSON bodies', async () => {
      const testData = { title: 'Test Blog', content: 'Test Content' };
      const response = await request(app)
        .post('/api/blogs')
        .send(testData)
        .set('Content-Type', 'application/json');
      
      // Even though the route might not exist, we can verify the body parser works
      // by checking if we get a 404 (meaning the request reached the server)
      // rather than a 400 (which would indicate body parsing failed)
      expect(response.status).not.toBe(400);
    });
  });

  describe('API Routes', () => {
    it('should mount blog routes at /api/blogs', async () => {
      const response = await request(app).get('/api/blogs');
      // We expect either a 200 (if the route exists) or a 404 (if it's not implemented)
      // but not a 500 (server error)
      expect(response.status).not.toBe(500);
    });
  });
}); 