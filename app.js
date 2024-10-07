const express = require("express");
const http = require("http");
const cors = require("cors");

const MqttHandler = require("./utils/handlers/MqttHandler");
const WebSocketHandler = require("./utils/handlers/WebSocketHandler");

const app = express();

const dataHandling = require("./utils/dataHandling");

const corsOptions = {
  origin: "http://localhost:5173", // Asegúrate de que esta URL sea la correcta
};

app.use(cors(corsOptions)); // Configura el middleware de CORS

const server = http.createServer(app);
const webSocketHandler = new WebSocketHandler(server);
webSocketHandler.init();

const mqttClient = new MqttHandler();
mqttClient.connect();


// Establece el manejador para los mensajes entrantes
mqttClient.onMessage((topic, message) => {

  const processedData = dataHandling.processData(topic, message); // Procesar los datos

  webSocketHandler.emit(topic, processedData); // Emitir a todos los clientes
});

// Desconectar el cliente MQTT cuando el servidor se cierra
process.on("SIGINT", () => {
  mqttClient.disconnect();
  server.close(() => {
    console.log("Server closed");
    process.exit(0);
  });
});

module.exports = { app, server };
