require('dotenv').config()

const PORT = process.env.PORT || 3001
const INFLUX_TOKEN = process.env.INFLUX_TOKEN
const INFLUX_URL = process.env.INFLUX_URL
const INFLUX_ORG = process.env.INFLUX_ORG
const MQTT_HOST = process.env.MQTT_HOST
const MQTT_PORT = process.env.MQTT_PORT
const MQTT_USERNAME = process.env.MQTT_USERNAME
const MQTT_PASSWORD = process.env.MQTT_PASSWORD

const MONGO_URI = process.env.MONGO_URL

module.exports = {
  PORT,
  INFLUX_TOKEN,
  INFLUX_URL,
  INFLUX_ORG,
  MQTT_HOST,
  MQTT_PORT,
  MQTT_USERNAME,
  MQTT_PASSWORD,
  MONGO_URI
}