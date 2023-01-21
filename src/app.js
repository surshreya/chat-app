//Importing core modules
const path = require("path");
const http = require("http");

//Importing external dependencies
const express = require("express");
const Filter = require("bad-words");
const socketio = require("socket.io");

const {
  generateMessage,
  generateLocationMessage,
} = require("./utils/messages");
const {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom,
} = require("./utils/users");

const app = express();
const server = http.createServer(app);
const io = socketio(server); // Support Web Sockets

const publicDirPath = path.join(__dirname, "../public");
app.use(express.static(publicDirPath));

// Set up Server side web socket connection
io.on("connection", (socket) => {
  //Get data from client

  socket.on("joinRoom", ({ username, room }, callback) => {
    const { error, user } = addUser({ id: socket.id, username, room });

    if (error) {
      return callback(error);
    }
    socket.join(user.room);

    // Pass data from server to client
    socket.emit("message", generateMessage("Welcome to the chat app"));
    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        generateMessage(`${user.username} has joined ${room} chat!`)
      ); //Broadcast to all other connected clients

    callback();
  });

  socket.on("sendMessage", (msg, callback) => {
    const user = getUser(socket.id);
    const filter = new Filter();

    if (filter.isProfane(msg)) {
      return callback("Profanity not allowed.");
    }

    io.to(user.room).emit("message", generateMessage(msg)); // Notify all the clients
    callback();
  });

  socket.on("sendLocation", (position, callback) => {
    const user = getUser(socket.id);
    const url = `https://www.google.com/maps/@${position.latitude},${position.longitude},12z`;
    io.to(user.room).emit("location", generateLocationMessage(url));
    callback();
  });

  socket.on("disconnect", () => {
    const user = removeUser(socket.id);

    if (user) {
      io.to(user.room).emit(
        "message",
        generateMessage(`${user.username} has left ${user.room}!`)
      );
    }
  });
});

module.exports = server;
