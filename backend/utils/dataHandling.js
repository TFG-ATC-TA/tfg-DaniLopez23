const topics = require("./topics");
const debug = require("debug")("app:dataHandling");
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
    debug(
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
    debug(
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

const topicHandlers = {
  "6_dof_imu": getGyroscopeData,
  "tank_temperature_probes": getTankTemperaturesData,
  "tank_distance": getMilkQuantityData,
  "air_quality": getAirQualityData,
  "weight": getWeightData,
  "magnetic_switch": getMagneticSwitchData,
  "encoder": getEncoderData,
  "board_temperature": getBoardTemperatureData,
  "board_status": getBoardStatusData,
};

const processData = (topic, rawData) => {

  if (!topics) {
    debug("Topics not initialized yet");
    return null;
  }

  const topicParts = topic.split("/");
  const topicName = topicParts[topicParts.length - 1];
  const handler = topicHandlers[topicName];

  if (handler) {
    return handler(rawData);
  } else {
    debug("Topic not found");
    return null;
  }
};

module.exports = { processData };
