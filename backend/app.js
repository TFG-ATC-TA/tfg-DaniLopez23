const express = require("express");
const http = require("http");
const cors = require("cors");
const config = require("./config/index");
const mongoose = require('mongoose');
const debug = require('debug')('app');
const MONGO_URI = config.mongoDB.MONGO_URI_CLUSTER;

const farmRouter = require("./controllers/Farm"); 
const historicalDataRouter = require("./controllers/HistoricalData");
const equipmentRouter = require("./controllers/Equipment");

const mqttService = require("./services/mqtt");
const webSocketsService = require("./services/webSockets");

const app = express();

const corsOptions = {
  origin: "http://localhost:5173", // Asegúrate de que esta URL sea la correcta
};

app.use(cors(corsOptions)); // Configura el middleware de CORS
app.use(express.json()); 

mongoose.connect(MONGO_URI).then(() => {
  debug('Connected to MongoDB: %s', MONGO_URI);
}).catch((err) => {
  debug('Error connecting to MongoDB: %O', err);
});

const server = http.createServer(app);

mqttService.connect(); 

webSocketsService.initializeWebSocket(server);

app.get("/", (req, res) => {
  res.json({ status: "Healthy" });
});

app.use("/farms", farmRouter);
app.use("/historical-data", historicalDataRouter);
app.use("/equipments", equipmentRouter)

// Establece el manejador para los mensajes entrantes desde MQTT
mqttService.setMessageHandler((farmId, boardId, topic, data) => {
  
  const event = topic.split("/").pop(); // Obtiene el último segmento del topic como evento
  
  webSocketsService.emitToTank(farmId, boardId ,event, data);
});

module.exports = { app, server };
