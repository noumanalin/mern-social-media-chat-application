import express from 'express'
import dotenv from 'dotenv'
dotenv.config()
import cors from 'cors';
import cookieParser from 'cookie-parser';
// import upload from 'express-fileupload'
import { connectDB } from './config/connect.js'
import { errorMiddleware } from './middleware/error.middleware.js';
import authRouter from './routes/auth.route.js';
import userRouter from './routes/user.route.js';
import postRouter from './routes/post.routes.js'

const PORT = process.env.PORT || 3001;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173/";

// connectDB();


const app = express()

// middlewares
app.use(express.urlencoded({extended:true}))
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: [FRONTEND_URL, "http://localhost:5174"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}))
// app.use(upload)

app.use('/api/v1/auth/user', authRouter)
app.use('/api/v1/user', userRouter)
app.use('/api/post', postRouter)



app.use(errorMiddleware);






app.listen(PORT, () => {
    console.log(`🚀 Server running on port: ${PORT}`);
    connectDB();
});

// Export app for Vercel
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
