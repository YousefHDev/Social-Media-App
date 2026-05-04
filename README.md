
# 📱 Social Media API

A robust, production-ready Social Media Backend API built with **Node.js**, **Express**, **TypeScript**, and **MongoDB**. This API provides complete social media functionality including user authentication, posts, comments, messaging, file uploads, and real-time features.

## 🚀 Features

### 👤 User Management
- User registration & login with JWT authentication
- Email verification
- Profile management (update profile, change password, update email)
- Profile sharing & viewing
- Account freezing/soft delete
- Role-based access control (User, Admin)

### 📝 Posts & Interactions
- Create, read, update, delete posts
- Like/unlike posts
- Share posts
- View post statistics

### 💬 Comments
- Add comments on posts
- Nested/reply comments
- Delete comments

### 💌 Messaging System
- Send private messages to users
- Read/unread message tracking
- View conversations
- Delete messages
- Real-time messaging ready (Socket.io integration)

### 🖼️ File Uploads
- **Local storage** support
- **Cloudinary** integration for cloud storage
- Upload profile images, cover images, and post attachments
- Support for images, documents, videos, and audio files

### 🔒 Security Features
- Password hashing with bcrypt
- JWT token authentication
- Email encryption for sensitive data
- Input validation with Joi
- XSS protection
- Rate limiting
- Helmet.js for security headers

### 📧 Email Services
- Email confirmation on registration
- Password reset emails
- Welcome emails
- Nodemailer integration with Gmail SMTP

### 🛠️ Additional Features
- Pagination for all list endpoints
- Advanced filtering & sorting
- GraphQL support (optional)
- API versioning
- Comprehensive error handling
- Request logging

## 🏗️ Tech Stack

### Backend
- **Runtime**: Node.js
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)

### Storage & Media
- **Local Storage**: Multer
- **Cloud Storage**: Cloudinary

### Email & Communication
- **Email Service**: Nodemailer
- **Email Templates**: HTML/CSS

### Security
- **Password Hashing**: bcryptjs
- **Data Encryption**: CryptoJS
- **Validation**: Joi

### Additional Tools
- **File Uploads**: Multer
- **Environment Variables**: dotenv
- **Logging**: Morgan
- **CORS**: Enabled

## 📂 Project Structure

```
SOCIAL-MEDIA-APP/
├── src/
│   ├── config/              # Configuration files
│   │   └── .env.dev        # Environment variables
│   ├── DB/                  # Database layer
│   │   ├── model/          # Mongoose models
│   │   ├── connection.js   # Database connection
│   │   └── db.service.js   # Database service layer
│   ├── middleware/          # Custom middleware
│   │   ├── auth.middleware.js
│   │   └── validation.middleware.js
│   ├── modules/            # Feature modules
│   │   ├── auth/           # Authentication module
│   │   ├── user/           # User module
│   │   ├── post/           # Post module
│   │   ├── comment/        # Comment module
│   │   └── message/        # Message module
│   ├── uploads/            # Local uploads directory
│   ├── utilities/          # Utility functions
│   │   ├── email/          # Email services
│   │   ├── events/         # Event emitters
│   │   ├── multer/         # File upload handlers
│   │   ├── security/       # Security utilities
│   │   └── Response/       # Response handlers
│   ├── app.controller.js   # Main app configuration
│   └── index.js            # Application entry point
├── uploads/                # Uploaded files storage
├── package.json
├── tsconfig.json
└── README.md
```

## 🔧 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn package manager

### Step 1: Clone the repository
```bash
git clone https://github.com/YousefHDev/social-media-api.git
cd social-media-api
```

### Step 2: Install dependencies
```bash
npm install
```

### Step 3: Configure environment variables
Create a `.env.dev` file in the `config/` directory:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database
DB_URI=mongodb://localhost:27017/socialmedia

# JWT Tokens
TOKEN_SIGNATURE=your_jwt_secret
EMAIL_TOKEN_SIGNATURE=your_email_token_secret

# Email Configuration (Gmail)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
EMAIL_FROM_NAME=Social Media App

# Phone Encryption
PHONE_ENC=your_phone_encryption_key

# Frontend URL
FE_URL=http://localhost:3000

# Cloudinary (Optional)
CLOUD_NAME=your_cloud_name
API_KEY=your_api_key
API_SECRET=your_api_secret
```

### Step 4: Start the server
```bash
# Development mode
npm run dev

# Production mode
npm start
```

### Step 5: Build for production
```bash
npm run build
```

## 📡 API Endpoints

### 🔐 Authentication Routes
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Register new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/confirm-email/:token` | Verify email |
| POST | `/api/auth/forgot-password` | Request password reset |
| POST | `/api/auth/reset-password` | Reset password |
| POST | `/api/auth/refresh-token` | Refresh JWT token |

### 👤 User Routes
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/user/profile` | Get current user profile |
| GET | `/api/user/profile/:userId` | Get user by ID |
| PUT | `/api/user/update-profile` | Update user profile |
| PATCH | `/api/user/update-password` | Change password |
| PATCH | `/api/user/update-email` | Request email update |
| PATCH | `/api/user/reset-email` | Confirm email update |
| PATCH | `/api/user/freeze` | Freeze account |
| DELETE | `/api/user/delete` | Delete account |
| PATCH | `/api/user/profile/image` | Upload profile image |
| PATCH | `/api/user/profile/cover` | Upload cover image |

### 📝 Post Routes
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/post` | Create new post |
| GET | `/api/post` | Get all posts |
| GET | `/api/post/:id` | Get post by ID |
| PUT | `/api/post/:id` | Update post |
| DELETE | `/api/post/:id` | Delete post |
| POST | `/api/post/:id/like` | Like/unlike post |
| POST | `/api/post/:id/share` | Share post |

### 💬 Comment Routes
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/comment` | Add comment |
| PUT | `/api/comment/:id` | Update comment |
| DELETE | `/api/comment/:id` | Delete comment |
| GET | `/api/comment/post/:postId` | Get post comments |

### 💌 Message Routes
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/message/send` | Send message |
| GET | `/api/message` | Get user messages |
| GET | `/api/message/conversation/:userId` | Get conversation |
| PUT | `/api/message/:id/read` | Mark message as read |
| DELETE | `/api/message/:id` | Delete message |

## 🧪 Sample API Requests

### Register User
```bash
POST /api/auth/signup
Content-Type: application/json

{
    "firstName": "Yousef",
    "lastName": "Hesham",
    "email": "yousef@example.com",
    "password": "Password123",
    "confirmPassword": "Password123",
    "phone": "01234567890"
}
```

### Login
```bash
POST /api/auth/login
Content-Type: application/json

{
    "email": "yousef@example.com",
    "password": "Password123"
}
```

### Create Post
```bash
POST /api/post
Authorization: Bearer <your_token>
Content-Type: application/json

{
    "content": "This is my first post!",
    "attachments": ["image_url_here"]
}
```

### Send Message
```bash
POST /api/message/send
Authorization: Bearer <your_token>
Content-Type: application/json

{
    "recipientId": "user_id_here",
    "message": "Hello! How are you?"
}
```

## 🔒 Authentication

All protected routes require a Bearer token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## 📦 Dependencies

### Core Dependencies
- `express` - Web framework
- `mongoose` - MongoDB ODM
- `jsonwebtoken` - JWT authentication
- `bcryptjs` - Password hashing
- `dotenv` - Environment variables

### Security
- `helmet` - Security headers
- `cors` - CORS enabled
- `express-rate-limit` - Rate limiting
- `crypto-js` - Data encryption

### File Uploads
- `multer` - Multipart/form-data handling
- `cloudinary` - Cloud storage

### Email & Validation
- `nodemailer` - Email sending
- `joi` - Input validation

### Development
- `typescript` - TypeScript support
- `nodemon` - Auto-restart during development
- `ts-node` - TypeScript execution

## 🚦 Error Handling

The API returns consistent error responses:

```json
{
    "success": false,
    "message": "Error description",
    "statusCode": 400
}
```

## 📊 Rate Limiting

- Default: 100 requests per 15 minutes
- Auth endpoints: 5 requests per minute

## 🧪 Testing

```bash
# Run tests (if implemented)
npm test

# Run linting
npm run lint
```

## 📈 Performance Optimizations

- Database indexing for faster queries
- Pagination for all list endpoints
- Compression middleware
- Caching strategies implemented
- Optimized file uploads


## 👨‍💻 Author

**Yousef Hesham**
- Backend Developer specializing in Node.js 

- **GitHub**: [@YousefHDev](https://github.com/YousefHDev)
- **LinkedIn**: [Yousef Hesham](https://linkedin.com/in/yousef-hesham-416863319)
- **Email**: adhamh430@gmail.com

## 🙏 Acknowledgments

- Node.js community
- MongoDB team
- All open-source contributors

## 📧 Contact

For questions or support, please email: adhamh430@gmail.com

---

**⭐ If you found this project helpful, please give it a star on GitHub!**


