const WebSocket = require("ws");

const ws = new WebSocket("ws://localhost:8080");

ws.on("open", () => {
  console.log("Connected to server");
});

ws.on("message", (data) => {
  const message = JSON.parse(data);
  if (message.type === "response") {
    console.log(
      `Received response from minion ${message.id}: ${message.balance}`
    );
  }
});

ws.on("close", () => {
  console.log("Connection closed");
});

ws.on("error", (err) => {
  console.log(`Connection error: ${err.message}`);
});
