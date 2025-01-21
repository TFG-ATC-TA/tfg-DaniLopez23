const express = require("express");
const { InfluxDB } = require("@influxdata/influxdb-client");
const config = require("../config/index");
const HistoricalDataRouter = express.Router();

// Configuración de InfluxDB
const token = config.influxDB.INFLUX_TOKEN;
const org = config.influxDB.INFLUX_ORG;
const bucket = "synthetic-farm-1";
const url = config.influxDB.INFLUX_URL;

const client = new InfluxDB({ url, token });
const queryApi = client.getQueryApi(org);

console.log("token:", token);
console.log("org:", org);
console.log("bucket:", bucket);
console.log("url:", url);

// Ruta para obtener datos históricos
HistoricalDataRouter.post("/", async (req, res) => {
  const { date, hour, boardIds } = req.body;
  console.log(req.body);
  try {
    // Validate parameters
    if (!date) {
      return res.status(400).json({ message: "No date selected." });
    }

    if (!Array.isArray(boardIds) || boardIds.length === 0) {
      return res
        .status(400)
        .json({ message: "Must provide a valid array of board IDs." });
    }

    // Filter invalid values in boardIds
    const validBoardIds = boardIds.filter(
      (id) => typeof id === "string" && id.trim() !== ""
    );
    if (validBoardIds.length === 0) {
      return res
        .status(400)
        .json({ message: "All provided board IDs are invalid." });
    }

    const selectedDate = new Date(date); // Esto ya es correcto
    const startTime = new Date(selectedDate.setUTCHours(hour, 0, 0, 0));
    const endTime = new Date(selectedDate.setUTCHours(hour + 1, 0, 0, 0));

    // Construct Flux query with valid IDs
    const fluxQuery = `
      from(bucket: "synthetic-farm-1")
        |> range(start: ${startTime.toISOString()}, stop: ${endTime.toISOString()})
        |> filter(fn: (r) => ${validBoardIds
          .map((id) => `r.board_id == "${id}"`)
          .join(" or ")})
        |> aggregateWindow(every: 1m, fn: mean, createEmpty: false)
        |> yield(name: "mean")
    `;

    console.log("Executing query:", fluxQuery);

    // Execute query
    const result = await queryApi.collectRows(fluxQuery);

    // Process and format the results
    const formattedResult = result.map((row) => ({
      time: row._time,
      value: row._value,
      boardId: row.board_id,
      // Add any other fields you need from the row
    }));

    return res.status(200).json(formattedResult);
  } catch (error) {
    console.error("Error executing query:", error);
    return res
      .status(500)
      .json({ message: "Error executing query", error: error.message });
  }
});

module.exports = HistoricalDataRouter;
