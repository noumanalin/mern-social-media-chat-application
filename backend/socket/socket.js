// socket.js
import http from 'http';
import { Server } from 'socket.io';

let io;

const userSocketMap = new Map(); // userId => socketId

export const getReceiverSocketId = (recipientId) => {
  return userSocketMap.get(recipientId);
};

export const setupSocket = (app) => {
  const server = http.createServer(app);

  io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST", "PATCH", "DELETE"],
      credentials: true
    }
  });


  // {client} = socket have client information
  io.on("connection", (socket) => {
    // console.log("A New User has Connected " + socket.id)
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

  return server;
};

export { io };
