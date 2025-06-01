require("dotenv").config();

const MONGO_URL_CLUSTER = process.env.MONGO_URL_CLUSTER
const MONGO_URL_LOCAL_DEV = process.env.MONGO_URL_LOCAL_DEV
const MONGO_URL_LOCAL_PROD = process.env.MONGO_URL_LOCAL_PROD 


module.exports = {
  MONGO_URL_CLUSTER,
  MONGO_URL_LOCAL_DEV,
  MONGO_URL_LOCAL_PROD
};
