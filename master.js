const WebSocket = require("ws");
const ws = new WebSocket("ws://localhost:8080");

ws.onopen = () => {
  console.log("Connected to server");
  ws.send(JSON.stringify({ type: "getMinions" }));
};

ws.onmessage = (event) => {
  const message = JSON.parse(event.data);
  if (message.type === "minionsList") {
    const select = document.getElementById("minion-select");
    select.innerHTML = "";
    const allOption = document.createElement("option");
    allOption.value = "ALL";
    allOption.textContent = "ALL";
    select.appendChild(allOption);
    for (const id of message.minions) {
      const option = document.createElement("option");
      option.value = id;
      option.textContent = id;
      select.appendChild(option);
    }
  } else if (message.type === "response") {
    const responseContainer = document.getElementById("response-container");
    const responseText = `Response from minion ${message.id}: ${message.balance}`;
    const responseElement = document.createElement("p");
    responseElement.textContent = responseText;
    responseContainer.appendChild(responseElement);
  }
};

ws.onclose = () => {
  console.log("Connection closed");
};

ws.onerror = (err) => {
  console.log(`Connection error: ${err.message}`);
};

const sendBtn = document.getElementById("send-btn");
sendBtn.addEventListener("click", () => {
  const selectedMinion = document.getElementById("minion-select").value;
  const requestInput = document.getElementById("request-input").value;
  if (!requestInput) {
    return;
  }
  const message = {
    type: "request",
    target: selectedMinion,
    request: requestInput,
  };
  ws.send(JSON.stringify(message));
});
