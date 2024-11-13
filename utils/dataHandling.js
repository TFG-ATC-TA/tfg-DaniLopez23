const farmService = require("../services/farmService");

let topics = null;

const initializeTopics = async () => {
  try {
    topics = await farmService.getTopics();
  } catch (error) {
    console.error("Error initializing topics:", error);
  }
};

initializeTopics();

const TANK_HEIGHT = 4000; // 2000 mm ; 2m

const getTankTemperaturesData = (rawData) => {
  try {
    const dataObject = JSON.parse(rawData);

    let lastObject = dataObject[dataObject.length - 1];

    const date = new Date(lastObject.timestamp * 1000);
    const readableDate = date.toLocaleString();

    const result = {
      measurement: lastObject.measurement,
      tags: lastObject.tags,
      readableDate: readableDate,
      submerged_temperature: lastObject.fields.submerged_temperature,
      surface_temperature: lastObject.fields.surface_temperature,
      over_surface_temperature: lastObject.fields.over_surface_temperature,
    };

    return result;
  } catch (error) {
    console.log(
      "ERROR WHILE PARSING MESSAGE (STRING) TO JSON (OBJECT) : ",
      error
    );
  }
};

const getGyroscopeData = (rawData) => {
  try {
    const dataObject = JSON.parse(rawData);

    let lastObject = dataObject[dataObject.length - 1];

    const date = new Date(lastObject.timestamp * 1000);
    const readableDate = date.toLocaleString();

    const result = {
      measurement: lastObject.measurement,
      tags: lastObject.tags,
      readableDate: readableDate,
      fields: lastObject.fields,
    };

    return result;
  } catch (error) {
    console.log(
      "ERROR WHILE PARSING MESSAGE (STRING) TO JSON (OBJECT) : ",
      error
    );
  }
};

const getMilkQuantityData = (rawData) => {
  try {
    const dataObject = JSON.parse(rawData);

    let lastObject = dataObject[dataObject.length - 1];

    const date = new Date(lastObject.timestamp * 1000);
    const readableDate = date.toLocaleString();

    // Calcula el porcentaje de leche en el tanque
    const milkQuantity = (lastObject.fields.range / TANK_HEIGHT) * 100;

    // Crea el nuevo objeto con readableDate y milkQuantity
    const result = {
      measurement: lastObject.measurement,
      tags: lastObject.tags,
      readableDate: readableDate,
      milkQuantity: milkQuantity,
    };

    return result;
  } catch (error) {
    console.log(
      "ERROR WHILE PARSING MESSAGE (STRING) TO JSON (OBJECT) : ",
      error
    );
  }
};

const getAirQualityData = (rawData) => {
  const dataObject = JSON.parse(rawData);

  let lastObject = dataObject[dataObject.length - 1];

  const date = new Date(lastObject.timestamp * 1000);
  const readableDate = date.toLocaleString();

  result = {
    measurement: lastObject.measurement,  
    tags: lastObject.tags,
    readableDate: readableDate,
    airQuality: lastObject.fields,
  };

  console.log("Air quality data: ", result);

  return result;
};

const getWeightData = (rawData) => {
  const dataObject = JSON.parse(rawData);

  let lastObject = dataObject[dataObject.length - 1];

  const date = new Date(lastObject.timestamp * 1000);
  const readableDate = date.toLocaleString();

  const result = {
    measurement: lastObject.measurement,
    tags: lastObject.tags,
    readableDate: readableDate,
    weight: lastObject.fields.value,
  };

  return result;
};

const getMagneticSwitchData = (rawData) => {
  const dataObject = JSON.parse(rawData);

  let lastObject = dataObject[dataObject.length - 1];

  const date = new Date(lastObject.timestamp * 1000);
  const readableDate = date.toLocaleString();

  const result = {
    measurement: lastObject.measurement,
    tags: lastObject.tags,
    readableDate: readableDate,
    status: lastObject.fields.state,
  };

  return result;
};

const getEncoderData = (rawData) => {
  const dataObject = JSON.parse(rawData);

  let lastObject = dataObject[dataObject.length - 1];

  const date = new Date(lastObject.timestamp * 1000);
  const readableDate = date.toLocaleString();

  const result = {
    measurement: lastObject.measurement,
    tags: lastObject.tags,
    readableDate: readableDate,
    value: lastObject.fields.rpm,
  };

  return result;
};

const getBoardTemperatureData = (rawData) => {
  const dataObject = JSON.parse(rawData);

  let lastObject = dataObject[dataObject.length - 1];

  const date = new Date(lastObject.timestamp * 1000);
  const readableDate = date.toLocaleString();

  const result = {
    measurement: lastObject.measurement,
    tags: lastObject.tags,
    readableDate: readableDate,
    temperature: lastObject.fields.temperature,
  };

  return result;
};

const getBoardStatusData = (rawData) => {
  const dataObject = JSON.parse(rawData);

  let lastObject = dataObject[dataObject.length - 1];

  const date = new Date(lastObject.timestamp * 1000);
  const readableDate = date.toLocaleString();

  const result = {
    measurement: lastObject.measurement,
    tags: lastObject.tags,
    readableDate: readableDate,
    status: lastObject.fields.status,
  };

  return result;
};

// Define a mapping object to associate each topic with its processing function
const topicHandlers = {
  "synthetic-farm-1/6_dof_imu": getGyroscopeData,
  "synthetic-farm-1/tank_temperature_probes": getTankTemperaturesData,
  "synthetic-farm-1/tank_distance": getMilkQuantityData,
  "synthetic-farm-1/air_quality": getAirQualityData,
  "synthetic-farm-1/weight": getWeightData,
  "synthetic-farm-1/magnetic_switch": getMagneticSwitchData,
  "synthetic-farm-1/encoder": getEncoderData,
  "synthetic-farm-1/board_temperature": getBoardTemperatureData,
  "synthetic-farm-1/board_status": getBoardStatusData,
};

const processData = (topic, rawData) => {
  if (!topics) {
    console.log("Topics not initialized yet");
    return null;
  }

  const handler = topicHandlers[topic];
  if (handler) {
    console.log(`Processing... ${handler.name} `);
    return handler(rawData);
  } else {
    console.log("Topic not found");
    return null;
  }
};

module.exports = { processData };
