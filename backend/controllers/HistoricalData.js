const express = require("express");
const { InfluxDB } = require("@influxdata/influxdb-client");
const config = require("../config/index");
const HistoricalDataRouter = express.Router();
debug = require("debug")("app:controllers:HistoricalData");

// Configuración local de InfluxDB
// const token = config.influxDB.LOCAL_INFLUX_TOKEN;
// const org = config.influxDB.LOCAL_INFLUX_ORG;
// const url = config.influxDB.LOCAL_INFLUX_URL;

// Configuración de InfluxDB lactokeeper
const token = config.influxDB.INFLUX_TOKEN
const org = config.influxDB.INFLUX_ORG;
const url = config.influxDB.INFLUX_URL;

debug("InfluxDB Configuration: ", {
  token,
  org,
  url,
});

const client = new InfluxDB({ url, token });
const queryApi = client.getQueryApi(org);

// Ruta para obtener datos históricos
HistoricalDataRouter.post("/", async (req, res) => {
  const { farm, date, boardIds } = req.body;
  debug("Received filters:", { farm, date, boardIds });

  try {
    if (!date) {
      return res.status(400).json({ message: "No date selected." });
    }

    if (!Array.isArray(boardIds) || boardIds.length === 0) {
      return res
        .status(400)
        .json({ message: "Must provide a valid array of board IDs." });
    }

    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);
    const stopDate = new Date(date);
    stopDate.setHours(23, 59, 59, 999);

    if (isNaN(startDate.getTime()) || isNaN(stopDate.getTime())) {
      return res.status(400).json({ message: "Fechas inválidas" });
    }

    const start = startDate.toISOString();
    const stop = stopDate.toISOString();

    const validBoardIds = boardIds.filter(
      (id) => typeof id === "string" && id.trim() !== ""
    );

    if (validBoardIds.length === 0) {
      return res
        .status(400)
        .json({ message: "All provided board IDs are invalid." });
    }

    const fluxQuery = `
      from(bucket: "${farm}")
        |> range(start: ${start}, stop: ${stop})
        |> filter(fn: (r) => r["_measurement"] == "6_dof_imu" or r["_measurement"] == "air_quality" or r["_measurement"] == "encoder" or r["_measurement"] == "magnetic_switch" or r["_measurement"] == "tank_distance" or r["_measurement"] == "weight" or r["_measurement"] == "temperature_probe")
        |> filter(fn: (r) => ${validBoardIds
          .map((id) => `r["tags_board_id"] == "${id}"`)
          .join(" or ")})
        |> aggregateWindow(every: 15m, fn: mean, createEmpty: false)
        |> yield(name: "mean")
    `;

    debug("Executing query:", fluxQuery);

    const result = await queryApi.collectRows(fluxQuery);

    const formattedResult = {};

    result.forEach((row) => {
      const time = new Date(row._time).toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
        timeZone: "UTC",
      });

      const {
        _measurement: measurement,
        _field: field,
        _value: value,
        tags_board_id: boardId,
        tags_sensor_id: sensorId,
        ...tags
      } = row;

      // Determine the key for the formatted result based on the measurement
      const measurementMap = {
        '6_dof_imu': 'gyroscopeData',
        'air_quality': 'airQualityData',
        'encoder': 'encoderData',
        'magnetic_switch': 'switchStatus',
        'tank_distance': 'milkQuantityData',
        'weight': 'weightData',
        'temperature_probe': 'tankTemperaturesData'
      };
      
      const key = measurementMap[measurement] || measurement;

      if (!formattedResult[time]) {
        formattedResult[time] = {};
      }

      if (!formattedResult[time][key]) {
        formattedResult[time][key] = {
          measurement,
          tags: {
            board_id: boardId,
            sensor_id: sensorId,
            ...tags,
          },
          readableDate: new Date(row._time).toLocaleString("en-US", {
            timeZone: "UTC",
          }),
          value: measurement === "6_dof_imu" ? {} : value, // Initialize value as an object for gyroscope data
          sensorData: {},
        };
      }

      // Add sensor-specific data
      if (!formattedResult[time][key].sensorData[sensorId]) {
        formattedResult[time][key].sensorData[sensorId] = {};
      }

      if (measurement === "6_dof_imu") {
        // For gyroscope data, store multiple fields in the value
        formattedResult[time][key].value[field] = value;
        formattedResult[time][key].sensorData[sensorId][field] = value;
      } else {
        // For other measurements, store a single value
        formattedResult[time][key].sensorData[sensorId] = { value };
      }
    });

    return res.status(200).json(formattedResult);
  } catch (error) {
    debug("Error executing query:", error);
    return res
      .status(500)
      .json({ message: "Error executing query", error: error.message });
  }
});

module.exports = HistoricalDataRouter;