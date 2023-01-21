const http = require("http");
const chalk = require("chalk");
const socketio = require("socket.io");
const app = require("./app");

const server = http.createServer(app);
const io = socketio(server); // Support Web Sockets
const port = process.env.PORT || 3000;

// Set up Server side web socket connection
io.on("connection", (socket) => {
  // Pass data from server to client
  socket.emit("message", "Welcome to the chat app");
  socket.broadcast.emit("message", "A new user has joined!"); //Broadcast to all other connected clients

  //Get data from client
  socket.on("sendMessage", (msg) => {
    io.emit("message", msg); // Notify all the clients
  });

  socket.on("sendLocation", (position) => {
    const locationMsg = `https://www.google.com/maps/@${position.latitude},${position.longitude},12z`;
    io.emit("message", locationMsg);
  });

  socket.on("disconnect", () => {
    io.emit("message", "A user has left!");
  });
});

server.listen(port, () => {
  console.log(chalk.yellow(`Server listening to ${port}...`));
});
