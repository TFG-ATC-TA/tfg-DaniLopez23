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

  try {
    // Validar los parámetros
    if (!date) {
      return res
        .status(400)
        .json({ message: "No se ha seleccionado ninguna fecha." });
    }

    if (!Array.isArray(boardIds) || boardIds.length === 0) {
      return res
        .status(400)
        .json({ message: "Debe proporcionar un array válido de IDs de placas." });
    }

    // Filtrar valores no válidos en boardIds
    const validBoardIds = boardIds.filter((id) => typeof id === "string" && id.trim() !== "");
    if (validBoardIds.length === 0) {
      return res
        .status(400)
        .json({ message: "Todos los IDs de placas proporcionados son inválidos." });
    }

    // Formatear fecha y hora
    const dateString = new Date(date).toISOString().split("T")[0]; // "YYYY-MM-DD"
    const startTime = `${dateString}T${String(hour).padStart(2, "0")}:00:00Z`;
    const endTime = `${dateString}T${String(hour + 1).padStart(2, "0")}:00:00Z`;

    // Construir consulta Flux con IDs válidos
    const fluxQuery = `
      from(bucket: "synthetic-farm-1")
      |> range(start: ${startTime}, stop: ${endTime})
      |> filter(fn: (r) => ${validBoardIds.map((id) => `r.tags_board_id == "${id}"`).join(" or ")})
      |> aggregateWindow(every: 1m, fn: mean, createEmpty: false)
      |> yield(name: "mean")
    `;

    console.log("Ejecutando consulta:", fluxQuery);

    // Ejecutar consulta
    const result = [];
    const rows = queryApi.iterateRows(fluxQuery);
    for await (const { _time, _value, tags_board_id } of rows) {
      result.push({ time: _time, value: _value, boardId: tags_board_id });
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error("Error ejecutando consulta:", error);
    return res
      .status(500)
      .json({ message: "Error ejecutando consulta", error: error.message });
  }
});

module.exports = HistoricalDataRouter;
