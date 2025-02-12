const NodeCache = require("node-cache");

// Inicializa la caché sin TTL (tiempo de vida ilimitado por defecto)
const sensorCache = new NodeCache({ stdTTL: 0 });

/**
 * Obtiene todos los datos de los sensores para un boardId dentro de una granja.
 * @param {string} farmId - El ID de la granja.
 * @param {string} boardId - El ID de la placa.
 * @returns {object|null} - Un objeto con los sensores y sus datos o null si no existen.
 */
function getBoardData(farmId, boardId) {
  return sensorCache.get(`${farmId}-${boardId}`) || null;
}

/**
 * Obtiene los datos de múltiples boards dentro de una granja específica.
 * @param {string} farmId - El ID de la granja.
 * @param {string[]} boards - Lista de boardIds.
 * @returns {object} - Objeto con los datos de los sensores por cada board.
 */
function getDataByBoards(farmId, boards) {
  const result = {};

  boards.forEach((boardId) => {
    const boardData = sensorCache.get(`${farmId}-${boardId}`);
    if (boardData) {
      Object.entries(boardData).forEach(([sensorType, sensorData]) => {
        result[`${boardId}-${sensorType}`] = sensorData;
      });
    }
  });

  return result;
}

/**
 * Obtiene los datos de todos los boards dentro de una granja.
 * @param {string} farmId - El ID de la granja.
 * @returns {object} - Datos de todos los sensores de todos los boards de la granja.
 */
function getDataByFarm(farmId) {
  const result = {};
  const allKeys = sensorCache.keys();

  allKeys.forEach((key) => {
    if (key.startsWith(`${farmId}-`)) {
      result[key] = sensorCache.get(key);
    }
  });

  return result;
}

/**
 * Actualiza o agrega el último mensaje de un sensor dentro de una granja y un board específico.
 * @param {string} farmId - El ID de la granja.
 * @param {string} boardId - El ID de la placa.
 * @param {string} sensorType - El tipo de sensor (e.g., temperatura, humedad).
 * @param {any} message - El último mensaje del sensor.
 */
function updateSensorData(farmId, boardId, sensorType, message) {
  const key = `${farmId}-${boardId}`;
  const boardData = sensorCache.get(key) || {};
  boardData[sensorType] = message;
  sensorCache.set(key, boardData);
}

/**
 * Muestra el estado actual de la caché en la consola.
 */
function printCache() {
  console.log("Estado actual de la caché:");
  console.log(
    sensorCache.keys().map((key) => ({
      key,
      data: sensorCache.get(key),
    }))
  );
}

/**
 * Limpia los datos de un board específico dentro de una granja.
 * @param {string} farmId - El ID de la granja.
 * @param {string} boardId - El ID de la placa.
 */
function clearBoardData(farmId, boardId) {
  sensorCache.del(`${farmId}-${boardId}`);
}

/**
 * Limpia todos los datos de una granja específica.
 * @param {string} farmId - El ID de la granja.
 */
function clearFarmData(farmId) {
  const keysToDelete = sensorCache.keys().filter((key) =>
    key.startsWith(`${farmId}-`)
  );
  sensorCache.del(keysToDelete);
}

/**
 * Borra toda la caché.
 */
function clearAllData() {
  sensorCache.flushAll();
}

module.exports = {
  getBoardData,
  getDataByBoards,
  getDataByFarm,
  updateSensorData,
  printCache,
  clearBoardData,
  clearFarmData,
  clearAllData,
};
