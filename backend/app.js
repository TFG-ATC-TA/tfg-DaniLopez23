const express = require("express");
const http = require("http");
const cors = require("cors");
const config = require("./config/index");
const mongoose = require('mongoose');
const debug = require('debug')('app');

const MONGO_URI = config.mongoDB.MONGO_URL_LOCAL;
console.log("Mongo URI: ", MONGO_URI); // Verifica que la URI sea correcta

const farmRouter = require("./controllers/Farm"); 
const historicalDataRouter = require("./controllers/HistoricalData");
const equipmentRouter = require("./controllers/Equipment");
const predictTankStatesRouter = require("./controllers/PredictTankState");
const mqttService = require("./services/mqtt");
const webSocketsService = require("./services/webSockets");

const app = express();

const corsOptions = {
  origin: "http://localhost:5173", // Asegúrate de que esta URL sea la correcta
};

app.use(cors(corsOptions)); // Configura el middleware de CORS
app.use(express.json()); 

mongoose.connect(MONGO_URI, {
}).then(() => {
  console.log('Connected to MongoDB: %s', MONGO_URI);
}).catch((err) => {
  console.log('Error connecting to MongoDB: %O', err);
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
app.use("/predict", predictTankStatesRouter);

// Establece el manejador para los mensajes entrantes desde MQTT
mqttService.setMessageHandler((farmId, boardId, topic, data) => {
  
  const event = topic.split("/").pop(); // Obtiene el último segmento del topic como evento
  
  webSocketsService.emitToTank(farmId, boardId ,event, data);
});

module.exports = { app, server };
