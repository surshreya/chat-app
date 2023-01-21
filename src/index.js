const http = require("http");
const chalk = require("chalk");
const socketio = require("socket.io");
const app = require("./app");

const server = http.createServer(app);
const io = socketio(server); // Support Web Sockets
const port = process.env.PORT || 3000;

// Set up Server side web socket connection
let count = 0;
io.on("connection", (socket) => {
  console.log("New connection...");

  // Pass data from server to client
  socket.emit("count", count);
  socket.emit("message", "Welcome");

  //Get data from client
  socket.on("increment", () => {
    count++;
    io.emit("count", count); // Notify all the clients
  });

  socket.on("sendMessage", (msg) => {
    io.emit("message", msg);
  });
});

server.listen(port, () => {
  console.log(chalk.yellow(`Server listening to ${port}...`));
});
