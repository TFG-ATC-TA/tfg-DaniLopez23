const express = require("express");
const { InfluxDB } = require("@influxdata/influxdb-client");
const config = require("../config/index");
const TankStateRouter = express.Router();

// Configuración de InfluxDB
const token = config.influxDB.INFLUX_TOKEN;
const org = config.influxDB.INFLUX_ORG;
const url = config.influxDB.INFLUX_URL;


const client = new InfluxDB({ url, token });
const queryApi = client.getQueryApi(org);


TankStateRouter.post("/predict", async (req, res) => {

    // 1. Construir query con los datos de entrada
    const { dateRangeFrom, dateRangeTo, boardIds, farm } = req.body;

    const validBoardIds = boardIds.filter(
      (id) => typeof id === "string" && id.trim() !== ""
    );

    if (validBoardIds.length === 0) {
      return res
        .status(400)
        .json({ message: "All provided board IDs are invalid." });
    }

    // 2. Construir query Flux con los IDs válidos. La query debe devolver mínimo 1200 datos de cada segundo para poder hacer la petición a la api de prediccion de estado
    const fluxQuery = `
      from(bucket: "${farm}")
        |> range(start: ${dateRangeFrom}, stop: ${dateRangeTo})
        |> filter(fn: (r) => ${validBoardIds
          .map((id) => `r.board_id == "${id}"`)
          .join(" or ")})
        |> aggregateWindow(every: 1m, fn: mean, createEmpty: false)
        |> yield(name: "mean")
        |> limit(n: 1200)
    `;

    // 3. Ejecutar query
    const result = await queryApi.collectRows(fluxQuery);

    // 4. Procesar y formatear los resultados. Tienen que enviarse con el formato CSV: DateTime, AccelX, OverSurfaceTemperature, SurfaceTemperature
    const formattedResults = result.map((r) => {
      return `${r._time},${r._value.AccelX},${r._value.OverSurfaceTemperature},${r._value.SurfaceTemperature}`;
    });

    // 5. Hacer petición a la API de predicción de estado
    const predictionUrl = "testURL"
    const predictionResponse = await fetch(predictionUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formattedResults),
    });

    // 6. Enviar respuesta
    const predictionData = await predictionResponse.json();
    res.json(predictionData);

});
