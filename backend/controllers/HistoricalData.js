const express = require("express");
const { InfluxDB } = require("@influxdata/influxdb-client");
const config = require("../config/index");
const HistoricalDataRouter = express.Router();
debug = require("debug")("app:controllers:HistoricalData");

// Configuración de InfluxDB
// const token = config.influxDB.INFLUX_TOKEN;
// const org = config.influxDB.INFLUX_ORG;
// const url = config.influxDB.INFLUX_URL;

const token = config.influxDB.LOCAL_INFLUX_TOKEN;
const org = config.influxDB.LOCAL_INFLUX_ORG;
const url = config.influxDB.LOCAL_INFLUX_URL;

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
    // Validación de parámetros
    if (!date) {
      return res.status(400).json({ message: "No date selected." });
    }

    if (!Array.isArray(boardIds) || boardIds.length === 0) {
      return res
        .status(400)
        .json({ message: "Must provide a valid array of board IDs." });
    }

    // Rango de fechas
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);
    const stopDate = new Date(date);
    stopDate.setHours(23, 59, 59, 999);

    if (isNaN(startDate.getTime()) || isNaN(stopDate.getTime())) {
      return res.status(400).json({ message: "Fechas inválidas" });
    }

    const start = startDate.toISOString();
    const stop = stopDate.toISOString();

    // Validación de boardIds
    const validBoardIds = boardIds.filter(
      (id) => typeof id === "string" && id.trim() !== ""
    );

    if (validBoardIds.length === 0) {
      return res
        .status(400)
        .json({ message: "All provided board IDs are invalid." });
    }

    // Query de InfluxDB
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

    // Ejecutar consulta
    const result = await queryApi.collectRows(fluxQuery);

    // Formatear respuesta
    const formattedResult = {};

    result.forEach((row) => {
      const time = new Date(row._time).toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
        timeZone: "UTC",
      });

      const measurement = row._measurement;
      const field = row._field;
      const value = row._value;
      const boardId = row.tags_board_id;
      const sensorId = row.tags_sensor_id;

      // Inicializar hora si no existe
      if (!formattedResult[time]) {
        formattedResult[time] = {};
      }

      // Inicializar lista de sensores para la medición si no existe
      if (!formattedResult[time][measurement]) {
        formattedResult[time][measurement] = [];
      }

      // Buscar si ya existe un objeto con el mismo boardId y sensorId
      let sensorData = formattedResult[time][measurement].find(
        (entry) => entry.board_id === boardId && entry.sensor_id === sensorId
      );

      // Si no existe, creamos uno nuevo
      if (!sensorData) {
        sensorData = {
          values: {},
          board_id: boardId,
          sensor_id: sensorId,
        };
        formattedResult[time][measurement].push(sensorData);
      }

      // Añadir el valor al campo values
      sensorData.values[field] = value;
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
