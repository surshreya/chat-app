/**
 * Connect to the web socket from the client side
 */
const socket = io();

// Elements
const body = document.querySelector("body");
const messageForm = document.querySelector("#message-form");
const messageFormInput = document.querySelector(".message-input");
const messageFormBtn = document.querySelector("#message-btn");
const sendLocationBtn = document.querySelector("#send-location");
const messages = document.querySelector("#messages");
const sidebar = document.querySelector("#sidebar");

// Templates
const messageTemplate = document.querySelector("#message-template").innerHTML;
const locationTemplate = document.querySelector("#location-template").innerHTML;
const sidebarTemplate = document.querySelector("#sidebar-template").innerHTML;

const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

// Get data from server
socket.on("message", (msg) => {
  const html = Mustache.render(messageTemplate, {
    message: msg.text,
    username: msg.username,
    createdAt: moment(msg.createdAt).format("h:mm a"),
  });
  messages.insertAdjacentHTML("beforeend", html);
});

socket.on("location", (msg) => {
  const html = Mustache.render(locationTemplate, {
    url: msg.url,
    username: msg.username,
    createdAt: moment(msg.createdAt).format("h:mm a"),
  });
  messages.insertAdjacentHTML("beforeend", html);
});

socket.on("roomData", ({ room, users }) => {
  const html = Mustache.render(sidebarTemplate, { room, users });
  sidebar.innerHTML = html;
});

messageForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const message = messageFormInput.value;

  // Disable SEND button
  messageFormBtn.setAttribute("disabled", "disabled");
  messageFormInput.value = "";
  socket.emit("sendMessage", message, (error) => {
    //Enable SEND button
    messageFormBtn.removeAttribute("disabled");
    messageFormInput.focus();

    if (error) {
      console.log(error);
      return;
    }
    console.log("The message was delivered!");
  });
});

sendLocationBtn.addEventListener("click", () => {
  if (!navigator.geolocation) {
    return alert("Please turn on location sharing.");
  }

  sendLocationBtn.setAttribute("disabled", "disabled");

  navigator.geolocation.getCurrentPosition((position) => {
    const { latitude, longitude } = position.coords;
    socket.emit("sendLocation", { latitude, longitude }, () => {
      sendLocationBtn.removeAttribute("disabled");
      console.log("Location shared");
    });
  });
});

socket.emit("joinRoom", { username, room }, (error) => {
  if (error) {
    alert(error);
    location.href = "/";
  }
});
