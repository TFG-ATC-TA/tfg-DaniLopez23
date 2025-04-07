require("dotenv").config();

const MONGO_URL_CLUSTER = process.env.MONGO_URL_CLUSTER
const MONGO_URL_LOCAL = process.env.MONGO_URL_LOCAL

module.exports = {
  MONGO_URL_CLUSTER,
  MONGO_URL_LOCAL,
};
