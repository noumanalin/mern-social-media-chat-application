import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { connectDB } from './config/connect.js';
import { errorMiddleware } from './middleware/error.middleware.js';
import authRouter from './routes/auth.route.js';
import userRouter from './routes/user.route.js';
import postRouter from './routes/post.routes.js';
import commentRouter from './routes/comment.route.js';
import messageRouter from './routes/message.route.js';
import { setupSocket } from './socket/socket.js'; 

const app = express();

const PORT = process.env.PORT || 3001;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

// middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: [FRONTEND_URL, "http://localhost:5173"],
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  credentials: true
}));

// routes
app.use('/api/v1/auth/user', authRouter);
app.use('/api/v1/user', userRouter);
app.use('/api/post', postRouter);
app.use('/api/comment', commentRouter);
app.use('/api/message', messageRouter);

// test route
app.get("/", (req, res) => {
  res.status(200).json({ success: true, message: "Guten Tag?" });
});

// error middleware
app.use(errorMiddleware);

// setupSocket returns server with socket.io + express combined
const server = setupSocket(app);

// start server
server.listen(PORT, () => {
  console.log(`🚀 Server running on port: ${PORT}`);
  connectDB();
});

// export app for Vercel
export default app;


// ============================================================================================
// test on mobile phone
// npm run dev -- --host=0.0.0.0

// Press Win + R, type cmd hit Enter ipconfig

// Find this line:

// IPv4 Address. . . . . . . . . . . : 192.168.43.36

// http://192.168.43.36:3000/api/v1/auth/user/test

// server must be running with host set to 0.0.0.0
// app.listen(3000, '0.0.0.0', () => {
//   console.log("Server running on port 3000");
// });
// ============================================================================================
