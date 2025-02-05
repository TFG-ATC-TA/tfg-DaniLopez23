require("dotenv").config();

const INFLUX_TOKEN = process.env.INFLUX_TOKEN;
const INFLUX_URL = process.env.INFLUX_URL;
const INFLUX_ORG = process.env.INFLUX_ORG;

module.exports = {
  INFLUX_TOKEN,
  INFLUX_URL,
  INFLUX_ORG,
};
