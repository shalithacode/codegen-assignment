const WebSocket = require("ws");

const wss = new WebSocket.Server({ port: 8080 });
console.log("Server started on port 8080");

const minions = new Set();
const responses = new Map();

wss.on("connection", (ws) => {
  console.log("New client connected");

  // add new client to minions set
  minions.add(ws);

  // send initial message to client with its ID
  ws.send(
    JSON.stringify({
      type: "client_id",
      id: ws._socket.remoteAddress + ":" + ws._socket.remotePort,
    })
  );

  ws.on("message", (message) => {
    console.log(`Received message: ${message}`);

    try {
      const parsedMsg = JSON.parse(message);

      // handle request message from master client
      if (parsedMsg.type === "request") {
        const targetId = parsedMsg.target;
        const responseMsg = { type: "response", balance: getBalance() };

        // send response message to target client
        minions.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            const clientId =
              client._socket.remoteAddress + ":" + client._socket.remotePort;
            if (clientId === targetId || targetId === "ALL") {
              client.send(JSON.stringify(responseMsg));
              responses.set(clientId, responseMsg.balance);
            }
          }
        });
      }
    } catch (error) {
      console.error(`Error parsing message: ${error}`);
    }
  });

  ws.on("close", () => {
    console.log("Client disconnected");

    // remove client from minions set
    minions.delete(ws);

    // remove client's response from responses map
    const clientId = ws._socket.remoteAddress + ":" + ws._socket.remotePort;
    responses.delete(clientId);
  });
});

// function to calculate balance based on client ID
function getBalance() {
  const clientId =
    [...minions].find((client) => client.readyState === WebSocket.OPEN)._socket
      .remoteAddress +
    ":" +
    [...minions].find((client) => client.readyState === WebSocket.OPEN)._socket
      .remotePort;
  switch (clientId) {
    case "127.0.0.1:8081":
      return 10;
    case "127.0.0.1:8082":
      return 20;
    case "127.0.0.1:8083":
      return 30;
    default:
      return 0;
  }
}
