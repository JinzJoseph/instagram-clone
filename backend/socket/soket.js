import { Server } from "socket.io";
import express from "express";
import http from "http";
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});
const usersoket = {};

export const getReciverSocketId = (id) => {
  return usersoket[id];
};
io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  if (userId) {
    usersoket[userId] = socket.id;
    console.log("userId " + userId + " " + "socketId" + " " + socket.id);
  }
  io.emit("getOnlineUser", Object.keys(usersoket));

  socket.on("disconnect", () => {
    if (userId) {
      delete usersoket[userId];
    }
    io.emit("getOnlineUser", Object.keys(usersoket));
  });
});

export { app, server, io };
