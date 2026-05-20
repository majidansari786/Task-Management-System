# Task Management System - Scalable REST API

A production-ready REST API with role-based access control, JWT authentication, and a React frontend for task management. Built with Node.js, Express, MongoDB, and React.

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [API Documentation](#-api-documentation)
- [Security](#-security)
- [Scalability & Deployment](#-scalability--deployment)
- [Contributing](#-contributing)

## ✨ Features

### Backend
- ✅ **User Authentication**: Secure JWT-based authentication with password hashing
- ✅ **Role-Based Access Control**: Admin and User roles with granular permissions
- ✅ **CRUD Operations**: Full CRUD API for tasks with validation
- ✅ **API Versioning**: RESTful API with v1 versioning
- ✅ **Input Validation**: Comprehensive JOI schema validation
- ✅ **Error Handling**: Centralized error handling middleware
- ✅ **API Documentation**: Swagger/OpenAPI documentation
- ✅ **Security**: Password hashing, JWT tokens, RBAC middleware
- ✅ **Logging**: Structured error logging

### Frontend
- ✅ **Authentication UI**: Login and registration forms
- ✅ **Protected Dashboard**: JWT-protected user dashboard
- ✅ **Task Management**: Create, read, update, delete tasks
- ✅ **Status Filtering**: Filter tasks by status (pending, in_progress, completed)
- ✅ **Responsive Design**: Mobile-friendly UI
- ✅ **Error Handling**: User-friendly error messages

## 🛠 Tech Stack

### Backend
- **Node.js** (v18+): JavaScript runtime
- **Express.js**: Web framework
- **MongoDB**: NoSQL database
- **Mongoose**: ODM for MongoDB
- **JWT**: Token-based authentication
- **Bcryptjs**: Password hashing
- **JOI**: Schema validation
- **Swagger/OpenAPI**: API documentation

### Frontend
- **React** (v18): UI library
- **Axios**: HTTP client
- **CSS3**: Styling with gradients and animations
- **React Router**: Client-side routing (optional for future)

### DevOps
- **Docker**: Containerization
- **Docker Compose**: Multi-container orchestration
- **Nginx**: Reverse proxy and static file serving

## 📁 Project Structure

```
internshala/
├── app.js                           # Main Express application
├── package.json                     # Backend dependencies
├── Dockerfile                       # Backend Docker image
├── docker-compose.yml              # Multi-container setup
├── config/
│   ├── db.js                       # MongoDB connection
│   ├── env.js                      # Environment variables
│   └── swagger.js                  # Swagger configuration
├── middleware/
│   ├── auth.js                     # JWT authentication middleware
│   ├── rbac.js                     # Role-based access control
│   ├── errorHandler.js             # Error handling middleware
│   ├── generateToken.js            # Token generation
│   └── validation.js               # Input validation schemas
├── controllers/
│   ├── user.js                     # User authentication logic
│   └── task.js                     # Task CRUD operations
├── model/
│   ├── User.js                     # User schema
│   └── Task.js                     # Task schema
├── routers/
│   ├── user_auth.js               # Authentication routes
│   └── task.js                     # Task routes
├── frontend/                        # React frontend
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── App.js                  # Main App component
│   │   ├── index.js                # React entry point
│   │   └── components/
│   │       ├── LoginForm.js
│   │       ├── RegisterForm.js
│   │       ├── Dashboard.js
│   │       ├── TaskForm.js
│   │       ├── TaskList.js
│   │       └── TaskCard.js
│   ├── package.json
│   ├── Dockerfile
│   └── nginx.conf
└── README.md                        # This file
```

## 🚀 Getting Started

### Prerequisites
- Node.js v18 or higher
- MongoDB (local or Atlas)
- npm or yarn
- Docker & Docker Compose (optional, for containerized setup)

### Backend Setup

1. **Clone the repository**
```bash
git clone <repository-url>
cd internshala
```

2. **Install dependencies**
```bash
npm install
```

3. **Create .env file in root directory**
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/internshala
SECRET_TOKEN=your_super_secret_key_change_in_production
NODE_ENV=development
```

4. **Start MongoDB**
```bash
# Using Docker
docker run -d -p 27017:27017 -e MONGO_INITDB_ROOT_USERNAME=admin -e MONGO_INITDB_ROOT_PASSWORD=password mongo

# Or if installed locally
mongod
```

5. **Start the backend server**
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

The backend will be available at `http://localhost:3000`

### Frontend Setup

1. **Navigate to frontend directory**
```bash
cd frontend
npm install
```

2. **Start the development server**
```bash
npm start
```

The frontend will be available at `http://localhost:3000` (React dev server)

### Docker Setup (Recommended)

1. **Build and run with Docker Compose**
```bash
docker-compose up --build
```

2. **Access the application**
- Frontend: http://localhost (via Nginx)
- Backend API: http://localhost:3000
- API Docs: http://localhost:3000/api-docs

3. **Stop containers**
```bash
docker-compose down
```

## 📚 API Documentation

### Base URL
```
http://localhost:3000/api/v1
```

### Authentication Endpoints

#### Register User
```http
POST /auth/signup
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass@123"
}
```

**Response (201)**
```json
{
  "message": "User created successfully",
  "user": {
    "_id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "USER"
  },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

#### Login User
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass@123"
}
```

**Response (200)**
```json
{
  "message": "Login successful",
  "user": {
    "_id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "USER"
  },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

### Task Endpoints

#### Create Task (Authenticated)
```http
POST /tasks
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Complete Project",
  "description": "Finish the assignment",
  "status": "pending"
}
```

**Response (201)**
```json
{
  "message": "Task created successfully",
  "task": {
    "_id": "...",
    "title": "Complete Project",
    "description": "Finish the assignment",
    "status": "pending",
    "user": "...",
    "createdAt": "2024-05-20T10:30:00Z"
  }
}
```

#### Get User's Tasks
```http
GET /tasks
Authorization: Bearer <token>
```

**Response (200)**
```json
{
  "tasks": [
    {
      "_id": "...",
      "title": "Complete Project",
      "description": "Finish the assignment",
      "status": "pending",
      "user": "...",
      "createdAt": "2024-05-20T10:30:00Z"
    }
  ],
  "total": 1
}
```

#### Get Single Task
```http
GET /tasks/:id
Authorization: Bearer <token>
```

#### Update Task
```http
PUT /tasks/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated Title",
  "status": "in_progress"
}
```

#### Delete Task
```http
DELETE /tasks/:id
Authorization: Bearer <token>
```

#### Get All Tasks (Admin Only)
```http
GET /tasks/admin/all
Authorization: Bearer <admin-token>
```

### Swagger Documentation
Access interactive API documentation at:
```
http://localhost:3000/api-docs
```

## 🔐 Security

### Password Security
- Passwords are hashed using bcryptjs with salt rounds of 10
- Password validation requires:
  - Minimum 6 characters
  - At least one letter
  - At least one number
  - At least one special character (@$!%*#?&)

### JWT Token
- Tokens are signed with a secret key
- Token expiry is set (configurable)
- Tokens can be sent via:
  - Authorization header: `Bearer <token>`
  - Cookie: `userAccessToken`

### Input Validation
- All inputs are validated using JOI schemas
- Email validation and uniqueness checking
- Task title and description length limits
- Request body size limits

### Authorization
- Role-Based Access Control (RBAC) middleware
- Protected routes require valid JWT tokens
- Admin-only endpoints check user role
- Task ownership verification for non-admin users

## 📈 Scalability & Deployment

### Current Architecture
The application is built with scalability in mind:

1. **Stateless Backend**: Each request is independent, allowing horizontal scaling
2. **Database Abstraction**: MongoDB connection pooling via Mongoose
3. **Middleware-based Architecture**: Modular and reusable components
4. **API Versioning**: Supports multiple API versions (/api/v1, /api/v2, etc.)
5. **Environment Configuration**: Externalized configuration for different environments

### Scalability Strategies

#### 1. **Horizontal Scaling**
- Deploy multiple backend instances behind a load balancer
- Use Docker containers for easy deployment
- Kubernetes can orchestrate containers automatically
- Environment variables allow different configs per instance

```bash
# Example: Running multiple backend instances
docker-compose up --scale backend=3
```

#### 2. **Database Optimization**
- Add MongoDB indexes on frequently queried fields:
  ```javascript
  db.users.createIndex({ email: 1 });
  db.tasks.createIndex({ user: 1, createdAt: -1 });
  ```
- Use database sharding for large datasets
- Consider read replicas for read-heavy workloads

#### 3. **Caching Layer**
- Implement Redis caching for frequently accessed data:
  ```javascript
  // Cache user tasks
  const cacheKey = `tasks:${userId}`;
  const cachedTasks = await redis.get(cacheKey);
  ```
- Cache API responses with appropriate TTL
- Cache session tokens for faster validation

#### 4. **API Gateway Pattern**
- Use API Gateway (Kong, AWS API Gateway, or Nginx) for:
  - Rate limiting
  - Request throttling
  - SSL/TLS termination
  - Load balancing
  - Request logging

#### 5. **Microservices Architecture**
Future evolution to microservices:
```
┌─────────────────────────────────────────┐
│           Load Balancer / API Gateway     │
└────────────────┬────────────────────────┘
        ┌────────┼────────┐
        ▼        ▼        ▼
    ┌────────┐ ┌────────┐ ┌────────┐
    │  Auth  │ │ Tasks  │ │ Users  │
    │Service │ │Service │ │Service │
    └────────┘ └────────┘ └────────┘
        │        │         │
        └────────┼─────────┘
                 ▼
         ┌─────────────────┐
         │  Message Queue  │ (RabbitMQ/Kafka)
         └─────────────────┘
                 │
        ┌────────┼────────┐
        ▼        ▼        ▼
    ┌────────┐ ┌────────┐ ┌────────┐
    │  Cache │ │Database│ │Storage │
    │(Redis) │ │(Mongo) │ │(S3)    │
    └────────┘ └────────┘ └────────┘
```

#### 6. **CDN for Frontend**
- Serve static assets from CDN (CloudFront, CloudFlare)
- Compress assets using gzip/brotli
- Implement browser caching headers
- Minify CSS and JavaScript

#### 7. **Monitoring & Logging**
```javascript
// Implement structured logging
const logger = require('winston');
logger.info('Task created', { userId, taskId, timestamp });

// Implement health checks
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', uptime: process.uptime() });
});
```

#### 8. **Database Connection Pooling**
MongoDB Mongoose already handles connection pooling:
```javascript
mongoose.connect(MONGODB_URI, {
  maxPoolSize: 10,
  minPoolSize: 5
});
```

#### 9. **Batch Operations**
Implement bulk operations for better performance:
```javascript
// Bulk update multiple tasks
await Task.bulkWrite([
  { updateOne: { filter: { status: 'pending' }, update: { status: 'archived' } } }
]);
```

#### 10. **Async Task Processing**
For heavy operations, use message queues:
```javascript
// Queue task deletion
await queue.add({ taskId, userId }, { attempts: 3 });
```

### Deployment Checklist

- [ ] Set production environment variables
- [ ] Enable HTTPS/SSL certificates
- [ ] Configure CORS properly
- [ ] Set up database backups
- [ ] Enable logging and monitoring
- [ ] Configure rate limiting
- [ ] Set up health checks
- [ ] Implement graceful shutdown
- [ ] Configure auto-scaling policies
- [ ] Set up CI/CD pipeline

### Recommended Deployment Platforms

1. **AWS**: EC2, RDS, ElastiCache, CloudFront
2. **Google Cloud**: Compute Engine, Cloud SQL, Cloud Memorystore
3. **Azure**: App Service, Cosmos DB, Azure Redis Cache
4. **DigitalOcean**: App Platform, Managed Databases
5. **Heroku**: Quick deployment (good for prototyping)
6. **Self-hosted**: Kubernetes on any cloud provider

## 📦 Dependencies

### Backend
```json
{
  "express": "^5.2.1",
  "mongoose": "^9.6.2",
  "jsonwebtoken": "^9.0.3",
  "bcryptjs": "^3.0.3",
  "joi": "^17.11.0",
  "dotenv": "^17.4.2",
  "swagger-jsdoc": "^6.2.8",
  "swagger-ui-express": "^5.0.0"
}
```

### Frontend
```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "axios": "^1.6.0"
}
```

## 🐛 Troubleshooting

### MongoDB Connection Error
```
Error: connect ECONNREFUSED
```
**Solution**: Ensure MongoDB is running on port 27017

### CORS Error
```
Access to XMLHttpRequest blocked by CORS policy
```
**Solution**: Update CORS configuration in backend

### Token Invalid
```
Error: Invalid token
```
**Solution**: Ensure token is passed correctly in Authorization header

## 📄 License

MIT License

## 👤 Author

Backend Developer Intern - Internshala Assignment

## 🙏 Acknowledgments

- Internshala for the assignment
- Express.js community
- MongoDB documentation
- React community

---

**Last Updated**: May 20, 2024
**Version**: 1.0.0
