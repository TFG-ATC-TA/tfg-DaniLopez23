const express = require("express");
const PredictTankStatesRouter = express.Router();
const debug = require("debug")("app:controllers:PredictTankStates");

const { InfluxDB } = require("@influxdata/influxdb-client");
const axios = require("axios");
const TankState = require("../models/TankState");
const config = require("../config/index");

// Configuración de InfluxDB
const token = config.influxDB.INFLUX_TOKEN;
const org = config.influxDB.INFLUX_ORG;
const url = config.influxDB.INFLUX_URL;

// Configuración de InfluxDB Local
// const token = config.influxDB.LOCAL_INFLUX_TOKEN;
// const org = config.influxDB.LOCAL_INFLUX_ORG;
// const url = config.influxDB.LOCAL_INFLUX_URL;

debug("INFLUX CONFIGURATION:", { token, org, url });

const client = new InfluxDB({ url, token });
const queryApi = client.getQueryApi(org);

// Middleware de validación
const validateRequest = (req, res, next) => {
  const { farm, date, boardIds } = req.body;
  if (!farm) return res.status(400).json({ message: "Farm ID inválido." });
  if (!date || isNaN(Date.parse(date)))
    return res.status(400).json({ message: "Fecha no válida." });
  if (!Array.isArray(boardIds) || boardIds.length === 0)
    return res.status(400).json({ message: "Array de board IDs no válido." });

  next();
};

function processData(rawData) {
  // Valor estándar inicial para las temperaturas
  let lastTemps = { surface: 20, overSurface: 20 };
  const processed = [];

  // Ordenar los datos por DateTime
  rawData.sort((a, b) => new Date(a.DateTime) - new Date(b.DateTime));

  rawData.forEach((row) => {
    const newRow = {
      DateTime: row.DateTime,
      AccelX: row.AccelX !== null ? row.AccelX : null,
      SurfaceTemperature: row["Surface temperature (ºC)"] !== null
        ? row["Surface temperature (ºC)"]
        : lastTemps.surface, // Usar el último valor conocido o el estándar
      OverSurfaceTemperature: row["Over surface temperature (ºC)"] !== null
        ? row["Over surface temperature (ºC)"]
        : lastTemps.overSurface, // Usar el último valor conocido o el estándar
    };

    // Actualizar últimos valores conocidos si hay datos de temperatura
    if (row["Surface temperature (ºC)"] !== null) {
      lastTemps.surface = row["Surface temperature (ºC)"];
    }
    if (row["Over surface temperature (ºC)"] !== null) {
      lastTemps.overSurface = row["Over surface temperature (ºC)"];
    }

    // Solo incluir filas con AccelX
    if (newRow.AccelX !== null) {
      processed.push(newRow);
    }
  });

  return processed;
}


PredictTankStatesRouter.post("/", validateRequest, async (req, res) => {
  const { farm, tank, date, boardIds } = req.body;
  debug("Received filters:", { farm, tank, date, boardIds });

  try {
    // Buscar en MongoDB
    const existingData = await TankState.findOne({
      farmId: farm,
      tankId: tank,
      date: new Date(date),
    });
    
    if (existingData){
      debug("Datos encontrados en MongoDB:", existingData);
      return res.status(200).json(existingData);
    }


    debug("Datos no encontrados en MongoDB. Consultando InfluxDB...");

    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);
    const stopDate = new Date(date);
    stopDate.setHours(23, 59, 59, 999);

    if (isNaN(startDate.getTime()) || isNaN(stopDate.getTime()))
      return res.status(400).json({ message: "Fechas inválidas" });

    const start = startDate.toISOString();
    const stop = stopDate.toISOString();

    // Consultar InfluxDB
    // Nueva consulta de InfluxDB optimizada
    const fluxQuery = `
      from(bucket: "${farm}")
        |> range(start: ${start}, stop: ${stop})
        |> filter(fn: (r) => r["_field"] == "fields_accel_x" 
            or r["_field"] == "fields_surface_temperature" 
            or r["_field"] == "fields_over_surface_temperature")
        |> filter(fn: (r) => ${boardIds
          .map((id) => `r["tags_board_id"] == "${id}"`)
          .join(" or ")})
          |> filter(fn: (r) => r["tags_board_id"] == "00" or r["tags_board_id"] == "01" or r["tags_board_id"] == "02")
        |> aggregateWindow(
            every: 5s,
            fn: mean,
            createEmpty: true
        )
        |> fill(usePrevious: true)
        |> pivot(rowKey:["_time"], columnKey: ["_field"], valueColumn: "_value")
        |> keep(columns: ["_time", "fields_accel_x", 
              "fields_surface_temperature", 
              "fields_over_surface_temperature"])
        |> rename(columns: {
            _time: "DateTime",
            fields_accel_x: "AccelX",
            fields_surface_temperature: "Surface temperature (ºC)",
            fields_over_surface_temperature: "Over surface temperature (ºC)"
        })
    `;

    debug("Executing query:", fluxQuery);

    const executeQuery = async (query) => {
      return new Promise((resolve, reject) => {
        const influxData = [];
        queryApi.queryRows(query, {
          next(row, tableMeta) {
            influxData.push(tableMeta.toObject(row));
          },
          error(error) {
            debug("Error en InfluxDB:", error.message);
            reject(new Error("Error en consulta a InfluxDB"));
          },
          complete() {
            debug("Consulta InfluxDB completada");
            resolve(influxData);
          },
        });
      });
    };

    const influxData = await executeQuery(fluxQuery);
    debug("Datos de InfluxDB:", influxData.slice(0, 5)); 

    const processedData = processData(influxData);
    debug("Datos procesados:", processedData.slice(0, 5)); 

    // Enviar a ML-API en el formato requerido
    const payload = {
      data: processedData.map(row => ({
        DateTime: new Date(row.DateTime).toISOString()
        .replace("T", " ") // Reemplazar 'T' por un espacio
        .replace(/\.\d{3}Z$/, "+00:00"), // Eliminar milisegundos y agregar '+00:00'
        AccelX: row.AccelX,
        OverSurfaceTemperature: row["OverSurfaceTemperature"],
        SurfaceTemperature: row["SurfaceTemperature"]
      }))
    };

    debug("Datos procesados para ML-API:", payload.data.slice(0, 5)); 

    // Enviar datos a la API de ML
    try {
      // Enviar a la API de ML
      const response = await axios.post("http://ml-api:8000/predict", payload, );
      debug("Respuesta de ML-API:", response.data);

      // Transformar los intervalos para MongoDB
      const transformedStates = response.data.intervals.map((interval) => ({
        startTime: new Date(interval.inicio).toISOString().substring(11, 16), // Extraer HH:mm
        endTime: new Date(interval.fin).toISOString().substring(11, 16),     // Extraer HH:mm
        state: interval.estado,
      }));

      // Guardar en MongoDB
      const newTankState = await TankState.create({
        farmId: farm,
        tankId: tank,
        date: new Date(date),
        states: transformedStates,
      });

      debug("Predicción guardada en MongoDB");
      return res.status(200).json(newTankState);
    } catch (error) {
      debug("Error en ML-API:", error.message);
      return res
        .status(500)
        .json({ message: "Error en ML-API", error: error.message });
    }
  } catch (error) {
    debug("Error en PredictTankStatesRouter:", error.message);
    return res
      .status(500)
      .json({ message: "Error interno del servidor", error: error.message });
  }
});

module.exports = PredictTankStatesRouter;
