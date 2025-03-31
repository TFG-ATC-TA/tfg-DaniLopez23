// services/websockets.js
const socketIo = require("socket.io");
const cacheData = require("./cache");
const debug = require('debug')('app:websockets');

let io; 

const initializeWebSocket = (server) => {
  io = socketIo(server, {
    cors: {
      origin: "http://localhost:5173", // Cambia esta URL si es necesario
    },
  });

  io.on("connection", (socket) => {
    debug(`New client connected: ${socket.id}`)
    // Escucha el evento de cambio de tanque
    let currentRooms = new Set(); // Almacena las rooms a las que está conectado el socket

    socket.on("selectTank", (farmId, boards) => {
      debug(`Client ${socket.id} selected Farm-Tank: ${farmId}/[${boards}]`);
      if (!farmId) {
        debug("Invalid input for selectFarmAndTank. Expected farmId.");
        return;
      }

      if (!boards) {
        debug("Invalid boardIds format. Expected an array.");
        return;
      }

      const newRooms = new Set(boards.map((boardId) => `${farmId}/${boardId}`));

      // Salir de las rooms que ya no están en los nuevos boardIds
      for (const room of currentRooms) {
        if (!newRooms.has(room)) {
          socket.leave(room);
          debug(`Socket ${socket.id} left room: ${room}`);
        }
      }

      // Unirse a las nuevas rooms
      for (const room of newRooms) {
        if (!currentRooms.has(room)) {
          socket.join(room);
          debug(`Socket ${socket.id} joined room: ${room}`);
        }
      }

      // Actualizar las rooms actuales
      currentRooms = newRooms;
    });

    socket.on("requestLastData", (farmId, boards) => {

      if (!boards) {
        debug('Invalid boardIds format. Expected an array.');
        return;
      }

      const data = cacheData.getDataByBoards(farmId, boards);
      socket.emit("last data", data);

    })

    socket.on("reconnectMQTT", () => {
      debug("Manually Reconnecting MQTT...");
    });


    socket.on("disconnect", () => {
      debug(`Client disconnected: ${socket.id}`);
    });
  });
};

// Función para emitir mensajes solo a la room del tanque seleccionado
const emitToTank = (farmId, boardId, event, data) => {
  
  if (!farmId) {
    debug("Invalid input for emitToTank. Expected farmId.");
    return;
  }
  
  if (!boardId) {
    debug("No tank selected");
    return;
  }

  if (io) {
    io.to(`${farmId}/${boardId}`).emit(event, data);
    debug(`Emitting to room ${farmId}/${boardId}: ${event}`);
  }
};

const emitToAll = (event, data) => {
  if (io) {
    io.emit(event, data);
  }
};

module.exports = {
  initializeWebSocket,
  emitToTank,
  emitToAll,
};
