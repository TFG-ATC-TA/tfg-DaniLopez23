const express = require("express");
const http = require("http");
const cors = require("cors");
const config = require("./config/index");
const mongoose = require('mongoose');

const MONGO_URI = config.mongoDB.MONGO_URI_LOCAL;

const farmRouter = require("./controllers/Farm"); 
const historicalDataRouter = require("./controllers/HistoricalData");

const mqttService = require("./services/mqtt");
const webSocketsService = require("./services/webSockets");

const app = express();

const corsOptions = {
  origin: "http://localhost:5173", // Asegúrate de que esta URL sea la correcta
};

app.use(cors(corsOptions)); // Configura el middleware de CORS
app.use(express.json()); 

mongoose.connect(MONGO_URI).then(() => {
  console.log('Connected to MongoDB :' + MONGO_URI);
}).catch((err) => {
  console.log('Error connecting to MongoDB', err);
});

const server = http.createServer(app);

webSocketsService.initializeWebSocket(server);

mqttService.connect(); 

app.use("/farms", farmRouter);
app.use("/historical-data", historicalDataRouter);
// Establece el manejador para los mensajes entrantes desde MQTT
mqttService.onMessage((boardId, topic, data) => {
  // webSocketsService.emitToAll(topic, data);
  
  webSocketsService.emitToTank(boardId ,topic, data);
});

module.exports = { app, server };
