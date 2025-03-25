require("dotenv").config();

const INFLUX_TOKEN = process.env.INFLUX_TOKEN;
const INFLUX_URL = process.env.INFLUX_URL;
const INFLUX_ORG = process.env.INFLUX_ORG;

const LOCAL_INFLUX_TOKEN = process.env.LOCAL_INFLUX_TOKEN;  
const LOCAL_INFLUX_URL = process.env.LOCAL_INFLUX_URL;
const LOCAL_INFLUX_ORG = process.env.LOCAL_INFLUX_ORG;

module.exports = {
  INFLUX_TOKEN,
  INFLUX_URL,
  INFLUX_ORG,
  LOCAL_INFLUX_TOKEN,
  LOCAL_INFLUX_URL,
  LOCAL_INFLUX_ORG
};
