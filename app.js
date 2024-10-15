const express = require("express");
const http = require("http");
const cors = require("cors");
const config = require("./utils/config");
const mongoose = require('mongoose');

const MONGO_URI = config.MONGO_URI;

const farmRouter = require("./controllers/Farm"); 
const tankRouter = require("./controllers/Tank");

const MqttHandler = require("./utils/handlers/MqttHandler");
const WebSocketHandler = require("./utils/handlers/WebSocketHandler");

const app = express();

const dataHandling = require("./utils/dataHandling");

const corsOptions = {
  origin: "http://localhost:5173", // Asegúrate de que esta URL sea la correcta
};

app.use(cors(corsOptions)); // Configura el middleware de CORS
app.use(express.json()); 

mongoose.connect(MONGO_URI).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.log('Error connecting to MongoDB', err);
});

const server = http.createServer(app);
const webSocketHandler = new WebSocketHandler(server);
webSocketHandler.init();

const mqttClient = new MqttHandler();
mqttClient.connect();

app.use("/farms", farmRouter);
app.use("/tanks", tankRouter);

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
