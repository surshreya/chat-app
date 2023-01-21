const http = require("http");
const chalk = require("chalk");
const socketio = require("socket.io");
const app = require("./app");

const server = http.createServer(app);
const io = socketio(server); // Support Web Sockets
const port = process.env.PORT || 3000;

// Set up Server side web socket connection
io.on("connection", () => {
  console.log("New connection...");
});

server.listen(port, () => {
  console.log(chalk.yellow(`Server listening to ${port}...`));
});
