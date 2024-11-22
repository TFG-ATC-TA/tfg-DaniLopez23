// services/websockets.js
const socketIo = require("socket.io");

let io;

const initializeWebSocket = (server) => {
  io = socketIo(server, {
    cors: {
      origin: "http://localhost:5173", // Cambia esta URL si es necesario
    },
  });

  io.on("connection", (socket) => {
    console.log(`New client connected: ${socket.id}`);

    // Escucha el evento de cambio de tanque
    let currentRooms = new Set(); // Almacena las rooms a las que está conectado el socket

    socket.on("selectTank", (boardIds) => {
      if (!Array.isArray(boardIds)) {
        console.error("Invalid boardIds format. Expected an array.");
        return;
      }

      const newRooms = new Set(boardIds);

      // Salir de las rooms que ya no están en los nuevos boardIds
      for (const room of currentRooms) {
        if (!newRooms.has(room)) {
          socket.leave(room);
          console.log(`Socket ${socket.id} left room: ${room}`);
        }
      }

      // Unirse a las nuevas rooms
      for (const room of newRooms) {
        if (!currentRooms.has(room)) {
          socket.join(room);
          console.log(`Socket ${socket.id} joined room: ${room}`);
        }
      }

      // Actualizar las rooms actuales
      currentRooms = newRooms;
    });

    socket.on("disconnect", () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
  });
};

// Función para emitir mensajes solo a la room del tanque seleccionado
const emitToTank = (boardId, event, data) => {
  if (boardId === undefined) {
    console.log("No tank selected");
    return;
  }

  if (io) {
    io.to(boardId).emit(event, data);
    console.log(`Emitting to room ${boardId}: ${event}`);
  }
};

const emitToAll = (event, data) => {
  if (io) {
    io.emit(event, data);
    console.log(`Emitting to all: ${event}`);
  }
};

module.exports = {
  initializeWebSocket,
  emitToTank,
  emitToAll,
};
