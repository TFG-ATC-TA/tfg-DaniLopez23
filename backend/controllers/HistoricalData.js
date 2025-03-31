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
  const { farm, dateRangeFrom, dateRangeTo, boardIds } = req.body;
  debug("Received filters:", { farm, dateRangeFrom, dateRangeTo, boardIds });

  try {
    // Validate parameters
    if (!dateRangeFrom || !dateRangeTo) {
      return res.status(400).json({ message: "No date selected." });
    }

    if (!Array.isArray(boardIds) || boardIds.length === 0) {
      return res
        .status(400)
        .json({ message: "Must provide a valid array of board IDs." });
    }

    const startDate = new Date(dateRangeFrom);
    const stopDate = new Date(dateRangeTo);

    if (isNaN(startDate.getTime()) || isNaN(stopDate.getTime())) {
      return res.status(400).json({ message: "Fechas inválidas" });
    }

    const start = startDate.toISOString();
    const stop = stopDate.toISOString();

    // Filter invalid values in boardIds
    const validBoardIds = boardIds.filter(
      (id) => typeof id === "string" && id.trim() !== ""
    );

    if (validBoardIds.length === 0) {
      return res
        .status(400)
        .json({ message: "All provided board IDs are invalid." });
    }

    // Construct Flux query with valid IDs
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

    // Execute query
    const result = await queryApi.collectRows(fluxQuery);

    debug("Query result:", result);

    // Process and format the results
    const formattedResult = result.map((row) => ({
      time: row._time,
      value: row._value,
      boardId: row.board_id,
      // Add any other fields you need from the row
    }));

    return res.status(200).json(formattedResult);
  } catch (error) {
    debug("Error executing query:", error);
    return res
      .status(500)
      .json({ message: "Error executing query", error: error.message });
  }
});

module.exports = HistoricalDataRouter;
