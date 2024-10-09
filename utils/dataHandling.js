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
    };

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
  const dataObject = JSON.parse(rawData);

  let lastObject = dataObject[dataObject.length - 1];

  const date = new Date(lastObject.timestamp * 1000);
  const readableDate = date.toLocaleString();

  return rawData;
};

const getWeightData = (rawData) => {
  const dataObject = JSON.parse(rawData);

  let lastObject = dataObject[dataObject.length - 1];

  const date = new Date(lastObject.timestamp * 1000);
  const readableDate = date.toLocaleString();

  const result = {
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
    readableDate: readableDate,
    temperature: lastObject.fields.temperature,
  };
  
  return result;
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
      console.log(`Received ${topic} `);
      processedData = getAirQualityData(rawData);
      break;
    case topics[4]:
      console.log(`Received ${topic} `);
      processedData = getWeightData(rawData);
      break;
    case topics[5]:
      console.log(`Received ${topic} `);
      processedData = getMagneticSwitchData(rawData);
    case topics[6]:
      console.log(`Received ${topic} `);
      processedData = getEncoderData(rawData);
    case topics[7]:
      console.log(`Received ${topic} `);
      processedData = getBoardTemperatureData(rawData);
    case topics[8]:
      console.log(`Received ${topic} `);
      processedData = getBoardStatusData(rawData);
    default:
      console.log("Topic not found");
  }

  return processedData;
};

module.exports = { processData };
