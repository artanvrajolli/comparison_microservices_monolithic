# Microservices Blog Application

This is a microservices-based blog application with the following components:

- API Gateway: Routes requests to the appropriate service
- Blog Service: Manages blog posts
- User Service: Manages user accounts
- Comment Service: Manages comments on blogs
- MongoDB: Database for each service

## Project Structure

```
├── services/
│   ├── api-gateway/
│   ├── blog-service/
│   ├── user-service/
│   └── comment-service/
└── docker-compose.yml
```

## Running with Docker Compose

1. Install Docker and Docker Compose if you haven't already.
2. Clone this repository.
3. Build and start the services:

```bash
# first 
npm install

# then
docker-compose up --build
```

4. The API Gateway will be accessible at http://localhost:5000.

## Data Seeding

The project includes seeders to populate the databases with sample data:

1. To seed all services with 1000 records each, run:

```bash
npm run seed
```

This will seed:
- 1000 users in the user service
- 1000 blog posts in the blog service
- 1000 comments in the comment service

To seed individual services:

```bash
cd services/user-service && npm run seed
cd services/blog-service && npm run seed
cd services/comment-service && npm run seed
```

**Note**: Ensure that MongoDB is running before seeding data. If you're running the seeders locally (outside Docker), update the `.env` files in each service to point to your local MongoDB instance.

## Service Endpoints

### API Gateway (http://localhost:5000)

- `/api/blogs` - Routes to Blog Service
- `/api/users` - Routes to User Service
- `/api/comments` - Routes to Comment Service

### Blog Service (http://localhost:5001)

- GET `/api/blogs` - Get all blogs
- GET `/api/blogs/:id` - Get blog by ID
- POST `/api/blogs` - Create a new blog
- PUT `/api/blogs/:id` - Update a blog
- DELETE `/api/blogs/:id` - Delete a blog

### User Service (http://localhost:5002)

- GET `/api/users` - Get all users
- GET `/api/users/:id` - Get user by ID
- POST `/api/users` - Create a new user
- PUT `/api/users/:id` - Update a user
- DELETE `/api/users/:id` - Delete a user

### Comment Service (http://localhost:5003)

- GET `/api/comments` - Get all comments
- GET `/api/comments/blog/:blogId` - Get comments by blog ID
- GET `/api/comments/:id` - Get comment by ID
- POST `/api/comments` - Create a new comment
- PUT `/api/comments/:id` - Update a comment
- DELETE `/api/comments/:id` - Delete a comment

## Environment Variables

Each service has its own `.env` file with the following variables:

### API Gateway
- `PORT`: The port on which the API Gateway runs
- `BLOG_SERVICE_URL`: URL of the Blog Service
- `USER_SERVICE_URL`: URL of the User Service
- `COMMENT_SERVICE_URL`: URL of the Comment Service

### Blog Service
- `PORT`: The port on which the Blog Service runs
- `MONGODB_URI`: MongoDB connection URI
- `USER_SERVICE_URL`: URL of the User Service
- `COMMENT_SERVICE_URL`: URL of the Comment Service

### User Service
- `PORT`: The port on which the User Service runs
- `MONGODB_URI`: MongoDB connection URI
- `BLOG_SERVICE_URL`: URL of the Blog Service
- `COMMENT_SERVICE_URL`: URL of the Comment Service

### Comment Service
- `PORT`: The port on which the Comment Service runs
- `MONGODB_URI`: MongoDB connection URI
- `USER_SERVICE_URL`: URL of the User Service
- `BLOG_SERVICE_URL`: URL of the Blog Service 