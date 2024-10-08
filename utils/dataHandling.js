const topics = require("./topics");

const TANK_HEIGHT = 4000; // 2000 mm ; 2m

const getTankTemperaturesData = (rawData) => {
  try {
    const dataObject = JSON.parse(rawData);

    let lastObject = dataObject[dataObject.length - 1];

    const date = new Date(lastObject.timestamp * 1000);
    const readableDate = date.toLocaleString();


    const result = {
      readableDate: readableDate,
      submerged_temperature: lastObject.fields.submerged_temperature,
      surface_temperature: lastObject.fields.surface_temperature,
      over_surface_temperature: lastObject.fields.over_surface_temperature,
    }

    console.log("Last object ", lastObject);
    console.log("Result ", result);

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
  try {
    const dataObject = JSON.parse(rawData);

    let lastObject = dataObject[dataObject.length - 1];

    const date = new Date(lastObject.timestamp * 1000);
    const readableDate = date.toLocaleString();

    // Calcula el porcentaje de leche en el tanque
    const milkQuantity = (lastObject.fields.range / TANK_HEIGHT) * 100;

    // Crea el nuevo objeto con readableDate y milkQuantity
    const result = {
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
  return rawData;
};

const getWeightData = (rawData) => {
  return rawData;
};

const processData = (topic, rawData) => {
  let processedData = null;
  switch (topic) {
    case topics[0]:
      console.log(`Received ${topics[0] + topic} `);
      processedData = getGyroscopeData(rawData);
      break;
    case topics[1]:
      console.log(`Received ${topics[1] + topic} `);
      processedData = getTankTemperaturesData(rawData);
      break;
    case topics[2]:
      console.log(`Received ${topics[2] + topic} `);
      processedData = getMilkQuantityData(rawData);
      break;
    case topics[3]:
      console.log(`Received ${topics[3] + topic} `);
      processedData = getAirQualityData(rawData);
      break;
    case topics[4]:
      console.log(`Received ${topics[4] + topic} `);
      processedData = getWeightData(rawData);
      break;
    case topics[5]:
    default:
  }

  return processedData;
};

module.exports = { processData };
