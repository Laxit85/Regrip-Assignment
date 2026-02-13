# Task Management Backend

A production-ready Task Management API built with Node.js, Express, PostgreSQL, and Prisma ORM. Features OTP-based authentication, JWT tokens, Redis caching, and comprehensive security measures.

### 🔗 Hosted Backend URL
https://regrip-backend-vv7f.onrender.com/

### 📚 API Documentation (Swagger)
https://regrip-backend-vv7f.onrender.com//docs

## 🚀 Tech Stack

- **Runtime**: Node.js (ES Modules)
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT (Access + Refresh Tokens)
- **OTP Storage**: Redis
- **Email Service**: Nodemailer
- **Documentation**: Swagger UI
- **Logging**: Winston
- **Security**: Helmet, express-rate-limit
- **Validation**: Joi

## 📁 Project Structure

```
regrip-task-backend/
│
├── src/
│   ├── config/
│   │   ├── db.js              # Prisma client configuration
│   │   ├── redis.js           # Redis client configuration
│   │   └── logger.js          # Winston logger configuration
│   │
│   ├── controllers/
│   │   ├── auth.controller.js # Authentication logic
│   │   └── task.controller.js # Task CRUD operations
│   │
│   ├── middleware/
│   │   ├── auth.middleware.js      # JWT authentication
│   │   ├── rateLimit.middleware.js # Rate limiting
│   │   ├── validate.middleware.js  # Input validation
│   │   └── error.middleware.js     # Global error handling
│   │
│   ├── routes/
│   │   ├── auth.routes.js # Authentication routes
│   │   └── task.routes.js # Task management routes
│   │
│   ├── services/
│   │   ├── otp.service.js      # OTP generation and verification
│   │   ├── token.service.js    # JWT token management
│   │   └── activity.service.js # Activity logging
│   │
│   ├── utils/
│   │   └── response.js # Response utility functions
│   │
│   └── app.js # Express app configuration
│
├── prisma/
│   └── schema.prisma # Database schema
│
├── server.js         # Server entry point
├── package.json      # Dependencies and scripts
├── swagger.yaml      # API documentation
├── .env.example      # Environment variables template
└── README.md         # This file
```

## 🗄️ Database Schema

### User Model
- `id`: UUID (Primary Key)
- `email`: String (Unique)
- `isVerified`: Boolean
- `refreshToken`: String (Hashed)
- `createdAt`: DateTime

### Task Model
- `id`: UUID (Primary Key)
- `title`: String
- `description`: String (Optional)
- `status`: Enum (pending, completed)
- `userId`: UUID (Foreign Key)
- `createdAt`: DateTime

### Activity Model
- `id`: UUID (Primary Key)
- `type`: String
- `message`: String
- `userId`: UUID (Foreign Key, Optional)
- `createdAt`: DateTime

## 🔐 Authentication Flow

1. **Send OTP**: User provides email → OTP generated and sent via email
2. **Verify OTP**: User enters OTP → Verified against Redis store
3. **Token Issuance**: Upon successful verification:
   - Access Token (15 minutes)
   - Refresh Token (7 days, hashed in DB)
4. **Token Refresh**: Use refresh token to get new access token (rotation implemented)
5. **Logout**: Clear refresh token from database

## 📡 API Endpoints

### Authentication
- `POST /api/auth/send-otp` - Send OTP to email
- `POST /api/auth/verify-otp` - Verify OTP and get tokens
- `POST /api/auth/refresh-token` - Refresh access token
- `POST /api/auth/logout` - Logout user

### Tasks
- `POST /api/tasks` - Create new task
- `GET /api/tasks` - Get all user tasks
- `PATCH /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v16+)
- PostgreSQL
- Redis
- npm or yarn

### 1. Clone and Install
```bash
git clone <repository-url>
cd regrip-task-backend
npm install
```

### 2. Environment Setup
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
PORT=5000
NODE_ENV=development
DATABASE_URL="postgresql://username:password@localhost:5432/task_management_db"
JWT_SECRET=your_jwt_secret_here
JWT_REFRESH_SECRET=your_refresh_secret_here
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
REDIS_URL=redis://localhost:6379
```

### 3. Database Setup
```bash
# Generate Prisma client
npm run prisma:generate

# Run database migrations
npm run prisma:migrate

# (Optional) Open Prisma Studio
npm run prisma:studio
```

### 4. Start the Server
```bash
# Development mode (with auto-restart)
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:5000`

## 📚 API Documentation

Access Swagger documentation at: `http://localhost:5000/docs`

## 🔒 Security Features

- **Helmet**: Security headers
- **Rate Limiting**:
  - OTP endpoints: 5 requests per 15 minutes
  - General APIs: 100 requests per 15 minutes
- **Input Validation**: Joi schemas for all inputs
- **Authentication**: JWT with refresh token rotation
- **Authorization**: Strict user-based access control
- **Error Handling**: Centralized error middleware
- **Logging**: Comprehensive activity and security logging

## 🧪 Testing

### Authentication Flow
```bash
# 1. Send OTP
curl -X POST http://localhost:5000/api/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com"}'

# 2. Verify OTP (use OTP from email/logs)
curl -X POST http://localhost:5000/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "otp": "123456"}'

# 3. Use access token for authenticated requests
curl -X GET http://localhost:5000/api/tasks \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Task Operations
```bash
# Create task
curl -X POST http://localhost:5000/api/tasks \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title": "My Task", "description": "Task description"}'

# Get tasks
curl -X GET http://localhost:5000/api/tasks \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"

# Update task
curl -X PATCH http://localhost:5000/api/tasks/TASK_ID \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status": "completed"}'

# Delete task
curl -X DELETE http://localhost:5000/api/tasks/TASK_ID \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## 🚀 Deployment (Render)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Create Render Web Service**
   - Connect your GitHub repository
   - Set build command: `npm install && npx prisma generate`
   - Set start command: `npm start`
   - Add environment variables from `.env`

3. **Database Setup**
   - Use Render PostgreSQL or external PostgreSQL
   - Run migrations: `npx prisma migrate deploy`

4. **Redis Setup**
   - Use Render Redis or external Redis service

## 📝 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `PORT` | Server port | No (defaults to 5000) |
| `NODE_ENV` | Environment mode | No (defaults to development) |
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `JWT_SECRET` | JWT signing secret | Yes |
| `JWT_REFRESH_SECRET` | Refresh token signing secret | Yes |
| `EMAIL_HOST` | SMTP host | Yes |
| `EMAIL_PORT` | SMTP port | Yes |
| `EMAIL_USER` | SMTP username | Yes |
| `EMAIL_PASS` | SMTP password/app password | Yes |
| `REDIS_URL` | Redis connection URL | No (defaults to localhost) |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

