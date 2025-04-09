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
  const { farm, date, boardIds, tank } = req.body;
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
        _field: rawField,
        _value: rawValue,
        tags_board_id: boardId,
        tags_sensor_id: sensorId,
        ...tags
      } = row;
    
      // Redondear el valor a 2 decimales
      const value = parseFloat(rawValue.toFixed(2));
    
      // Limpiar el nombre del campo eliminando el prefijo "fields_"
      const field = rawField.startsWith("fields_") ? rawField.replace("fields_", "") : rawField;
    
      // Determine the key for the formatted result based on the measurement
      const measurementMap = {
        '6_dof_imu': 'gyroscopeData',
        'air_quality': 'airQualityData',
        'encoder': 'encoderData',
        'magnetic_switch': 'switchStatus',
        'tank_distance': 'milkQuantityData',
        'weight': 'weightData',
        'temperature_probe': 'tankTemperaturesData',
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
          value: {}, // Initialize as an object to handle multiple fields
        };
      }
    
      // Handle specific cases for weight and encoder
      if (measurement === "weight" || measurement === "encoder") {
        if (typeof formattedResult[time][key].value !== "object") {
          formattedResult[time][key].value = {};
        }
        formattedResult[time][key].value[sensorId] = value;
      } else if (measurement === "tank_distance") {
        // Only include the "range" field for milkQuantityData and apply the calculation
        if (field === "range" && tank?.height) {
          formattedResult[time][key].value = (value / tank.height) * 100;
        }
      } else {
        // For other measurements, store multiple fields in the value object
        formattedResult[time][key].value[field] = value;
      }
    });
    
    // Post-process to handle cases where only one field exists
    Object.keys(formattedResult).forEach((time) => {
      Object.keys(formattedResult[time]).forEach((key) => {
        const valueObj = formattedResult[time][key].value;
    
        // If there's only one field, convert the value object to a single value
        const fields = Object.keys(valueObj);
        if (fields.length === 1) {
          formattedResult[time][key].value = valueObj[fields[0]];
        }
      });
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