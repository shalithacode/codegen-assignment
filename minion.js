const WebSocket = require("ws");

const ws = new WebSocket("ws://localhost:8080");

ws.on("open", function () {
  console.log("Connected to server");
});

ws.on("message", function (data) {
  console.log(`Received message: ${data}`);
  const request = JSON.parse(data);

  if (request.type === "balance") {
    let clientId = request.clientId;
    let balance = 0;

    if (clientId === "client1") {
      balance = 10;
    } else if (clientId === "client2") {
      balance = 20;
    } else if (clientId === "client3") {
      balance = 30;
    }

    const response = {
      type: "balance",
      clientId: clientId,
      balance: balance,
    };

    ws.send(JSON.stringify(response));
    console.log(`Sent response: ${JSON.stringify(response)}`);
  }
});

ws.on("close", function () {
  console.log("Disconnected from server");
});
