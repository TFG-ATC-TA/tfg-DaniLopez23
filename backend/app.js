const express = require("express");
const http = require("http");
const cors = require("cors");
const config = require("./config/index");
const mongoose = require('mongoose');
const debug = require('debug')('app');

const isProd = process.env.NODE_ENV === 'production';
console.log('Running in production mode:', isProd);
const MONGO_URI = isProd ? config.mongoDB.MONGO_URL_LOCAL_PROD : config.mongoDB.MONGO_URL_LOCAL_DEV;
console.log('Using MongoDB URI:', MONGO_URI);

const farmRouter = require("./controllers/Farm"); 
const historicalDataRouter = require("./controllers/HistoricalData");
const equipmentRouter = require("./controllers/Equipment");
const predictTankStatesRouter = require("./controllers/PredictTankState");
const mqttService = require("./services/mqtt");
const webSocketsService = require("./services/webSockets");

const app = express();

const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
      ? 'http://frontend' 
      : 'http://localhost:5173',
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
