// services/mqtt.js
const mqtt = require("mqtt");
const config = require("../config/index");
const topics = require("../config/topics");
const dataHandling = require("../utils/dataHandling");
const dataCache = require("./cache");

const url = `mqtts://${config.mqtt.MQTT_HOST}:${config.mqtt.MQTT_PORT}`;

let mqttClient = null;
let messageHandler = null;

// Conecta al broker MQTT
const connect = () => {
  mqttClient = mqtt.connect(url, {
    username: config.mqtt.MQTT_USERNAME,
    password: config.mqtt.MQTT_PASSWORD,
    rejectUnauthorized: false, // REMOVE THIS FOR PRODUCTION PURPOSE
  });

  mqttClient.on("error", (err) => {
    console.error("MQTT Connection Error:", err);
    mqttClient.end();
  });

  mqttClient.on("connect", () => {
    console.log("MQTT client connected " + url);

    mqttClient.subscribe(topics, (err) => {
      if (err) {
        console.error("MQTT Subscription Error:", err);
      } else {
        console.log("Subscribed to topics");
      }
    });
  });

  mqttClient.on("message", (topic, message) => {

    if (topic === "tank_temperature_probes") {
      console.log(`Received message from topic: ${topic}`);
    }
    // Procesa los datos del mensaje
    const processedData = dataHandling.processData(topic, message); // Procesar el mensaje

    const boardId = processedData.tags.board_id; // Suponiendo que el mensaje contiene el board-id

    const sensorType = processedData.measurement; // Suponiendo que el mensaje contiene el tipo de sensor

    if (boardId && sensorType) {
      // Actualizar la caché con el último mensaje del sensor
      dataCache.updateSensorData(boardId, sensorType, processedData);
    }

    if (messageHandler) {
      messageHandler(boardId, topic, processedData);
    }
  });

  mqttClient.on("close", () => {
    console.log("MQTT client disconnected");
  });
};

// Establece el callback para manejar mensajes
const onMessage = (handler) => {
  messageHandler = handler;
};

// Desconecta del broker MQTT
const disconnect = () => {
  if (mqttClient) {
    mqttClient.end();
    console.log("MQTT client disconnected manually");
  }
};

module.exports = {
  connect,
  onMessage,
  disconnect,
};
