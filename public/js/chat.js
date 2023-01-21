const body = document.querySelector("body");
/**
 * Connect to the web socket from the client side
 */
const socket = io();

// Get data from server
socket.on("count", (count) => {
  console.log(count);
});

socket.on("message", (msg) => {
  //   const welcomeHTML = `<h3>${msg}</h3>`;
  //   body.insertAdjacentHTML("afterbegin", welcomeHTML);
  console.log(msg);
});

const btnIncrement = document.querySelector(".increment");
btnIncrement.addEventListener("click", (e) => {
  // Pass client data to server
  socket.emit("increment");
});

document.getElementById("message-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const message = document.querySelector("input").value;
  socket.emit("sendMessage", message);
});
