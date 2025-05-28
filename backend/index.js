import express from 'express'
import dotenv from 'dotenv'
dotenv.config()
import cors from 'cors';
import cookieParser from 'cookie-parser';
import upload from 'express-fileupload'
import { connectDB } from './config/connect.js'
import { errorMiddleware } from './middlewares/error.middleware.js';
import authRouter from './routes/auth.route.js';
import userRouter from './routes/user.route.js';

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
app.use(upload)

app.use('/api/v1/auth/user', authRouter)
app.use('/api/v1/user', userRouter)



app.use(errorMiddleware);






app.listen(PORT, () => {
    console.log(`🚀 Server running on port: ${PORT}`);
    connectDB();
});

// Export app for Vercel
export default app;