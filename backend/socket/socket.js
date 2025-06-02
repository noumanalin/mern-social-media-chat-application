import http from 'http';
import express from 'express';
import { Server } from 'socket.io';

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST", "PATCH", "DELETE"],
        credentials: true
    }
});

const userSocketMap = new Map(); // userId => socketId

export const getReceiverSocketId = (recipientId) => {
    return userSocketMap.get(recipientId);
};

io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;

    if (userId && userId !== 'undefined') {
        userSocketMap.set(userId, socket.id);
        console.log(`User connected: ${userId} (Socket: ${socket.id})`);
    }

    io.emit("getOnlineUsers", Array.from(userSocketMap.keys()));

    socket.on("disconnect", () => {
        if (userId) {
            userSocketMap.delete(userId);
            console.log(`User disconnected: ${userId}`);
            io.emit("getOnlineUsers", Array.from(userSocketMap.keys()));
        }
    });
});

export { io, server, app };
