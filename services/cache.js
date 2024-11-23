const NodeCache = require("node-cache");

// Initialize the cache with optional TTL (default: no expiration)
const sensorCache = new NodeCache({ stdTTL: 0 });

/**
 * Get all sensor data for a given boardId.
 * @param {string} boardId - The ID of the board.
 * @returns {object|null} - An object containing sensor types and their latest messages, or null if the boardId doesn't exist.
 */
function getBoardData(boardId) {
  return sensorCache.get(boardId) || null;
}

function getDataByBoards(boards) {
    const result = {};
  
    boards.forEach((boardId) => {
      const boardData = sensorCache.get(boardId);
      console.log("boardData", boardData);
      if (boardData) {
        Object.entries(boardData).forEach(([sensorType, sensorData]) => {
          // Si el sensorType ya existe, sobrescribimos con los últimos datos
          result[sensorType] = sensorData;
        });
      }
    });
  
    return result;
  }
  


/**
 * Update or add the latest message for a specific sensorType on a given boardId.
 * @param {string} boardId - The ID of the board.
 * @param {string} sensorType - The type of the sensor (e.g., temperature, humidity).
 * @param {any} message - The latest message for the sensor.
 */
function updateSensorData(boardId, sensorType, message) {
  const boardData = sensorCache.get(boardId) || {};
  boardData[sensorType] = message;
  sensorCache.set(boardId, boardData);
}

/**
 * Print the current state of the cache in the desired structure.
 */
function printCache() {
  console.log("Current Cache State:");
  console.log(sensorCache.keys().map((key) => ({
    boardId: key,
    data: sensorCache.get(key),
  })));
}

/**
 * Clear the cache for a specific boardId.
 * @param {string} boardId - The ID of the board to clear.
 */
function clearBoardData(boardId) {
  sensorCache.del(boardId);
}

/**
 * Clear all cache entries.
 */
function clearAllData() {
  sensorCache.flushAll();
}

module.exports = {
  getBoardData,
  updateSensorData,
  printCache,
  clearBoardData,
  clearAllData,
  getDataByBoards
};
