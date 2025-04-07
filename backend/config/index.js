require("dotenv").config();

const mqttConfig = require("./mqtt");
const influxDBConfig = require("./influxDB");
const websocketConfig = require("./webSockets");
const mongoDBConfig = require("./mongoDB");

module.exports = {
  mlApi: process.env.ML_API_URL,
  port: process.env.PORT || 3000,
  mqtt: mqttConfig,
  influxDB: influxDBConfig,
  websocket: websocketConfig,
  mongoDB: mongoDBConfig,
};
