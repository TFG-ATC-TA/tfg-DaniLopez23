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

// Ruta para obtener datos históricos
HistoricalDataRouter.post("/", async (req, res) => {
  const { date, hour, boardIds } = req.body;
    
  try {
    // Validar los parámetros
    if (!boardIds) {
      return res.status(400).json({ message: "Faltan parámetros obligatorios en el cuerpo de la solicitud." });
    }

    if (!date) {
      return res.status(200).json({ message: "No se ha seleccionado ninguna fecha." });
    }

    const dateString = new Date(date).toISOString().split("T")[0]; // "YYYY-MM-DD"
    const startTime = `${dateString}T${hour}:00:00Z`;
    const endTime = `${dateString}T${hour + 1}:00:00Z`;

    const boardIdFilter = boardIds.map(id => `"${id}"`).join(", ");

    // Construir consulta Flux
    const fluxQuery = `
      from(bucket: "${bucket}")
        |> range(start: ${startTime}, stop: ${endTime})
        |> filter(fn: (r) => r.tags_board_id in [${boardIdFilter}])
        |> aggregateWindow(every: 1m, fn: mean, createEmpty: false)
        |> yield(name: "mean")
    `;

    console.log("Ejecutando consulta:", fluxQuery);

    // Ejecutar consulta
    const result = [];
    const rows = queryApi.iterateRows(fluxQuery);
    for await (const { _time, _value, _measurement, tags_board_id } of rows) {
      result.push({ time: _time, value: _value, measurement: _measurement, boardId: tags_board_id });
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error("Error ejecutando consulta:", error);
    return res.status(500).json({ message: "Error ejecutando consulta", error: error.message });
  }
});

module.exports = HistoricalDataRouter;
