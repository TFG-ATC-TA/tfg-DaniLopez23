const topics = require("./topics");

const getTankTemperatureData = (rawData) => {};

const getGyroscopeData = (rawData) => {
  try {
    const dataObject = JSON.parse(rawData);

    let lastObject = dataObject[dataObject.length - 1];

    const date = new Date(lastObject.timestamp * 1000);
    const readableDate = date.toLocaleString(); 

    lastObject.readableDate = readableDate;

    return lastObject;

  } catch (error) {
    console.log(
      "ERROR WHILE PARSING MESSAGE (STRING) TO JSON (OBJECT) : ",
      error
    );
  }
};

const getMilkQuantityData = (rawData) => {
  return rawData;
};

const getAirQualityData = (rawData) => {
  return rawData;
};

const processData = (topic, rawData) => {
  let processedData = null;
  switch (topic) {
    case topics[0]:
      console.log(`Received ${typeof rawData} `);
      processedData = getGyroscopeData(rawData);
      break;
    case topics[1]:
      console.log(`Received ${topics[1] + topic} `);
      processedData = getTankTemperatureData(rawData);
      break;
    case topics[2]:
      console.log(`Received ${topics[2] + topic} `);
      processedData = getMilkQuantityData(rawData);
      break;
    case topics[3]:
      console.log(`Received ${topics[3] + topic} `);
      processedData = getAirQualityData(rawData);
      break;
    default:
  }

  return processedData;
};

module.exports = { processData };
