const topics = require("./topics");
const debug = require("debug")("app:dataHandling");

const parseCommonData = (rawData) => {
  try {
    const dataObject = JSON.parse(rawData);
    return dataObject[dataObject.length - 1];
  } catch (error) {
    debug("Error parsing JSON:", error);
    return null;
  }
};

const getReadableDate = (timestamp) => {
  const date = new Date(timestamp * 1000);
  return date.toLocaleString();
};

const baseStructure = (lastObject) => ({
  measurement: lastObject.measurement,
  tags: lastObject.tags,
  readableDate: getReadableDate(lastObject.timestamp),
  value: {}
});

const getTankTemperaturesData = (rawData) => {
  const lastObject = parseCommonData(rawData);
  if (!lastObject) return null;

  return {
    ...baseStructure(lastObject),
    value: {
      submerged_temperature: lastObject.fields.submerged_temperature,
      surface_temperature: lastObject.fields.surface_temperature,
      over_surface_temperature: lastObject.fields.over_surface_temperature
    }
  };
};

const getGyroscopeData = (rawData) => {
  const lastObject = parseCommonData(rawData);
  if (!lastObject) return null;

  return {
    ...baseStructure(lastObject),
    value: lastObject.fields
  };
};

const getMilkQuantityData = (rawData) => {
  const lastObject = parseCommonData(rawData);
  if (!lastObject) return null;

  return {
    ...baseStructure(lastObject),
    value: lastObject.fields.range,

  };
};

const getAirQualityData = (rawData) => {
  const lastObject = parseCommonData(rawData);
  if (!lastObject) return null;

  return {
    ...baseStructure(lastObject),
    value: lastObject.fields
  };
};

const getWeightData = (rawData) => {
  const lastObject = parseCommonData(rawData);
  if (!lastObject) return null;

  return {
    ...baseStructure(lastObject),
    value: lastObject.fields.value
  };
};

const getMagneticSwitchData = (rawData) => {
  const lastObject = parseCommonData(rawData);
  if (!lastObject) return null;

  return {
    ...baseStructure(lastObject),
    value: lastObject.fields.state
  };
};

const getEncoderData = (rawData) => {
  const lastObject = parseCommonData(rawData);
  if (!lastObject) return null;

  return {
    ...baseStructure(lastObject),
    value: lastObject.fields.rpm
  };
};

const getBoardTemperatureData = (rawData) => {
  const lastObject = parseCommonData(rawData);
  if (!lastObject) return null;

  return {
    ...baseStructure(lastObject),
    value: lastObject.fields.temperature
  };
};

const getBoardStatusData = (rawData) => {
  const lastObject = parseCommonData(rawData);
  if (!lastObject) return null;

  return {
    ...baseStructure(lastObject),
    value: lastObject.fields.status
  };
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
    debug("Topics not initialized");
    return null;
  }

  const topicParts = topic.split("/");
  const topicName = topicParts[topicParts.length - 1];
  const handler = topicHandlers[topicName];

  if (!handler) {
    debug(`No handler for topic: ${topicName}`);
    return null;
  }

  try {
    return handler(rawData);
  } catch (error) {
    debug(`Error processing ${topicName}:`, error);
    return null;
  }
};

module.exports = { processData };