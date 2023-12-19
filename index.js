const express = require("express");
const http = require("http");
const https = require("https");
const socketIO = require("socket.io");
const fs = require("fs");
const mongoose = require("./config/mongoose");
const Message = require("./models/mesaage");

const clubSocketMap = {};

const app = express();
const path = require("path");
// const server = http.createServer(app);

const PORT = process.env.PORT;
let server;
try {
  const options = {
    key: fs.readFileSync("./privkey.pem"),
    cert: fs.readFileSync("./cert.pem"),
  };
  server = https.createServer(options, app);
  server.listen(PORT, () => {
    console.log("HTTPS server listening on port " + PORT);
  });
} catch (err) {
  server = app.listen(PORT, function () {
    console.log("Listening on " + PORT);
  });
}
const io = socketIO(server, { cors: { origin: "*" } });
io.on("connection", (socket) => {
  console.log("����ڰ� ����Ǿ����ϴ�.");

  socket.on("join club", (clubId, clubMemberId) => {
    clubSocketMap[clubId] = clubSocketMap[clubId] || {};
    clubSocketMap[clubId][clubMemberId] = socket;

    socket.join(clubId);
  });

  socket.on("chat message", async (data) => {
    console.log(`=====================`);
    console.log(data);
    console.log(`=====================`);
    const { clubId, clubMemberId, text, nickname } = data;

    const newMessage = new Message({
      clubId,
      clubMemberId,
      text,
      nickname,
      timestamp: Date.now(),
    });

    try {
      await newMessage.save();
      console.log("message MongoDB save");
    } catch (error) {
      console.error("message MongoDB save error:", error);
    }

    io.emit("chat message", data);
  });

  socket.on("get messages", async (clubId) => {
    try {
      const messages = await Message.find({ clubId }).sort({ timestamp: 1 });
      socket.emit("all messages", messages);
    } catch (error) {
      console.error("MongoDB���� �޽����� �������� �� ���� �߻�:", error);
    }
  });

  socket.on("message read", async ({ messageId, clubMemberId }) => {
    try {
      const updatedMessage = await Message.findByIdAndUpdate(
        messageId,
        { $addToSet: { readBy: clubMemberId } },
        { new: true }
      );

      if (!updatedMessage) {
        console.error("�޽����� ã�� �� �����ϴ�.");
        return;
      }

      // ������Ʈ�� �޽����� �ٽ� ����
      io.to(updatedMessage.clubId).emit("chat message", updatedMessage);
    } catch (error) {
      console.error("�޽��� ���� ���� ������Ʈ �� ���� �߻�:", error);
    }
  });
});

// server.listen(PORT, () => {
//   console.log(`������ http://localhost:${PORT}���� ���� ���Դϴ�.`);
// });
