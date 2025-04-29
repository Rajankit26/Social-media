# 🚀 Social Media Backend App

A full-featured and scalable backend server for a social media application, built using **Node.js**, **Express**, and **MongoDB**. This backend supports user authentication, posts, likes, comments, follows, and profile management — with media uploads (images, videos, documents) via **Cloudinary**.


---

## 📌 Features

✅ JWT-based Authentication & Authorization  
✅ Create, Update, Delete Posts (with text, images, video, docs)  
✅ Add, Edit, Delete Comments  
✅ Like & Unlike Posts (1 like per user per post)  
✅ Follow & Unfollow Users  
✅ Upload Profile Picture & Cover Photo via Cloudinary  
✅ Secure API with middleware for route protection  
✅ MongoDB schema relationships using Mongoose  
✅ Centralized error handling and async error catcher  
✅ Clean, modular project structure

---

## 🛠️ Tech Stack

- **Node.js** & **Express.js** – Backend Framework
- **MongoDB + Mongoose** – NoSQL Database
- **JWT** – Authentication
- **Cloudinary** – Media Uploads (Images, Videos)
- **Multer** – Middleware for handling multipart form-data
- **dotenv** – Manage environment variables
- **bcryptjs** – Password hashing
- **Postman** – API testing

---

---

## ⚙️ Getting Started

### 1️⃣ Clone the Repository**
git clone https://github.com/your-username/social-media-backend.git
cd social-media-backend

### 2️⃣ Install Dependencies
npm install

### 3️⃣ Create a .env File
PORT=5000  
MONGODB_URI=your_mongodb_connection_string  
JWT_SECRET=your_jwt_secret_key  

CLOUDINARY_CLOUD_NAME=your_cloudinary_name  
CLOUDINARY_API_KEY=your_cloudinary_api_key  
CLOUDINARY_API_SECRET=your_cloudinary_api_secret  

### 4️⃣ Start the Server
npm run dev

Server will run at: http://localhost:5000

### 🔄 API Endpoints Overview

🔸 Auth Routes
| Method | Endpoint             | Description         |
|--------|----------------------|---------------------|
| POST   | /api/users/signup  | Register a new user |
| POST   | /api/users/login   | Login and get token |

🔸 User Profile
| Method | Endpoint                        | Description               |
|--------|----------------------------------|---------------------------|
| GET    | /api/users/profile            | Get logged-in user's data |
| PUT    | /api/users/profile-picture    | Upload profile picture    |
| PUT    | /api/users/cover-picture      | Upload cover photo        |
| POST   | /api/users/:id/follow         | Follow a user             |
| POST   | /api/users/:id/unfollow       | Unfollow a user  

🔸 Posts
| Method | Endpoint            | Description              |
|--------|---------------------|--------------------------|
| POST   | /api/posts        | Create a new post        |
| GET    | /api/posts/:id    | Get a single post        |
| PUT    | /api/posts/:id    | Edit a post              |
| DELETE | /api/posts/:id    | Delete a post            |
         |
🔸 Comments
| Method | Endpoint                                     | Description              |
|--------|----------------------------------------------|--------------------------|
| POST   | /api/posts/:postId/comments               | Add a comment            |
| PUT    | /api/posts/:postId/comments/:commentId    | Edit a comment           |
| DELETE | /api/posts/:postId/comments/:commentId    | Delete a comment         |

🔸 Likes
| Method | Endpoint               | Description      |
|--------|------------------------|------------------|
| POST   | /api/posts/:postId/like | Like/Unlike a post |


### 🔐 Authentication
Use JWT token for protected routes. Pass it in the Authorization header as:
Bearer <your_token>

### 🧪 Testing
Use Postman to test all endpoints. Make sure to attach JWT token to secured routes.
