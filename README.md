# mern-social-media-chat-application



### 🚀 RESTful API Endpoints

The backend of this social media provides API endpoints for managing:

- 🧑 User 
    - From backend directory you can api's for user to 

- 🔐 Authentication
    - login 
    - registration with welcome email
    - change password
    - recovery password
    - login histroy

- 📕 Posts
    - create posts
    - other users can like, share, save any post

- ✉ Messages
    - real time chat with other users
    - user can send text or file with other user privately
---

## 🛠 Technologies Used
**Frontend:**
- React.js (with Hooks)
- Axios (API integration)
- Redux (state management)
- TailwindCss (UI Components)
- HTML5/CSS3 (Responsive Design)

**Backend:**
- Node.js
- Express.js
- MongoDB (Database)
- Mongoose (ODM)
- CORS (Cross-Origin Resource Sharing)


## 🚀 Installation & Setup
Clone repository:
```
git clone  
```
### Backend Setup:
```
cd backend
npm install 
npm run dev
```
### Frontend Setup:
```
cd frontend
npm install
npm run dev
```


# Social Media API Documentation

## 🔐 Auth API/End Points

| No. | Title          | Method | Base URL Like on Localhost | Route                     | isLogedin |
|-----|----------------|--------|----------------------------|---------------------------|-----------|
| 1   | Register User  | POST   | `http://localhost:3001`    | `/api/v1/auth/user/register` | false     |
| 2   | Login User     | POST   | `http://localhost:3001`    | `/api/v1/auth/user/login`    | false     |
| 3   | Test Client    | GET    | `http://localhost:3001`    | `/api/v1/auth/user/test`     | false     |

## 👥 User API/End Points

| No. | Title                      | Method  | Base URL Like on Localhost | Route                          | isLogedin |
|-----|----------------------------|---------|----------------------------|--------------------------------|-----------|
| 1   | Get All Users              | GET     | `http://localhost:3001`    | `/api/v1/user/users`           | true      |
| 2   | Get User Profile           | GET     | `http://localhost:3001`    | `/api/v1/user/:id`             | false     |
| 3   | Edit Profile               | PATCH   | `http://localhost:3001`    | `/api/v1/user/:id`             | true      |
| 4   | Follow/Unfollow User       | GET     | `http://localhost:3001`    | `/api/v1/user/follow-unfollow/:id` | true      |
| 5   | Update Profile Picture     | POST    | `http://localhost:3001`    | `/api/v1/user/upload/user-dp`  | true      |
| 6   | Get User Posts             | GET     | `http://localhost:3001`    | `/api/v1/user/:id/posts`       | false     |
| 7   | Get User Bookmarks         | GET     | `http://localhost:3001`    | `/api/v1/user/:id/bookmarks`   | true      |

## 📝 Posts API/End Points

| No. | Title                      | Method  | Base URL Like on Localhost | Route                          | isLogedin |
|-----|----------------------------|---------|----------------------------|--------------------------------|-----------|
| 1   | Create Post                | POST    | `http://localhost:3001`    | `/api/post/`                   | true      |
| 2   | Get All Posts              | GET     | `http://localhost:3001`    | `/api/post/all-posts`          | false     |
| 3   | Get Following Posts        | GET     | `http://localhost:3001`    | `/api/post/following-posts`    | true      |
| 4   | Get Single Post            | GET     | `http://localhost:3001`    | `/api/post/:id`                | false     |
| 5   | Update Post                | PATCH   | `http://localhost:3001`    | `/api/post/:id`                | true      |
| 6   | Delete Post                | DELETE  | `http://localhost:3001`    | `/api/post/:id`                | true      |
| 7   | Like/Dislike Post          | PUT     | `http://localhost:3001`    | `/api/post/like-dislike/:id`   | true      |
| 8   | Bookmark Post              | GET     | `http://localhost:3001`    | `/api/post/:id/add-bookmark`   | true      |

## 💬 Comments API/End Points

| No. | Title              | Method  | Base URL Like on Localhost | Route                  | isLogedin |
|-----|--------------------|---------|----------------------------|------------------------|-----------|
| 1   | Create Comment     | POST    | `http://localhost:3001`    | `/api/comment/:id`     | true      |
| 2   | Get Comments       | GET     | `http://localhost:3001`    | `/api/comment/:id`     | false     |
| 3   | Delete Comment     | DELETE  | `http://localhost:3001`    | `/api/comment/:id`     | true      |

## ✉️ Messages API/End Points

| No. | Title                      | Method  | Base URL Like on Localhost | Route                          | isLogedin |
|-----|----------------------------|---------|----------------------------|--------------------------------|-----------|
| 1   | Get Conversations          | GET     | `http://localhost:3001`    | `/api/message/conversations`   | true      |
| 2   | Send Message               | POST    | `http://localhost:3001`    | `/api/message/:receiverId`     | true      |
| 3   | Get Messages               | GET     | `http://localhost:3001`    | `/api/message/:receiverId`     | true      |

---

# Detailed API Endpoint Section

## 🔐 Auth API

### 🔹 User Registration
**POST** /api/v1/auth/user/register

#### 📥 Request Body:
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "securepassword123"
}
```

## [ TODO: Complete detailed api endpoint section ]

🔗 **Live Demo**: currently not avilable yet

📧 **Contact**: naumanalin865@gmail.com | <a href="https://noumanali.vercel.app/" target="_blank" rel="noopener noreferrer">My Portfolio</a>