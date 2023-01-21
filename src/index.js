const http = require("http");
const chalk = require("chalk");
const socketio = require("socket.io");
const Filter = require("bad-words");
const app = require("./app");
const {
  generateMessage,
  generateLocationMessage,
} = require("./utils/messages");

const server = http.createServer(app);
const io = socketio(server); // Support Web Sockets
const port = process.env.PORT || 3000;

// Set up Server side web socket connection
io.on("connection", (socket) => {
  //Get data from client
  socket.on("sendMessage", (msg, callback) => {
    const filter = new Filter();

    if (filter.isProfane(msg)) {
      return callback("Profanity not allowed.");
    }

    io.emit("message", generateMessage(msg)); // Notify all the clients
    callback();
  });

  socket.on("sendLocation", (position, callback) => {
    const url = `https://www.google.com/maps/@${position.latitude},${position.longitude},12z`;
    io.emit("location", generateLocationMessage(url));
    callback();
  });

  socket.on("joinRoom", ({ username, room }) => {
    socket.join(room);

    // Pass data from server to client
    socket.emit("message", generateMessage("Welcome to the chat app"));
    socket.broadcast
      .to(room)
      .emit("message", generateMessage(`${username} has joined ${room} chat!`)); //Broadcast to all other connected clients
  });

  socket.on("disconnect", () => {
    io.emit("message", generateMessage("A user has left!"));
  });
});

server.listen(port, () => {
  console.log(chalk.yellow(`Server listening to ${port}...`));
});
