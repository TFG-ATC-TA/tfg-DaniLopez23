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

    // Variable para guardar el tanque al que está suscrito el cliente
    let currentTankId = null;

    // Escucha el evento de cambio de tanque
    socket.on("selectTank", (tank) => {
      const tankId = tank.id;
      if (currentTankId !== null && currentTankId !== tankId) {
        // Si el cliente ya está en otro tanque, sale de la room anterior
        socket.leave(currentTankId);
        console.log(`Socket ${socket.id} left room for tank: ${currentTankId}`);
      }

      // El cliente se une a la nueva room correspondiente al tanque seleccionado
      socket.join(tankId);
      currentTankId = tankId; // Actualizamos el tanque actual del cliente
      console.log(`Socket ${socket.id} joined room for tank: ${tankId}`);
    });

    socket.on("disconnect", () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
  });
};

// Función para emitir mensajes solo a la room del tanque seleccionado
const emitToTank = (tankId, event, message) => {
  if(tankId===undefined) {
    console.log("No tank selected");
    return;
  }

  if (io) {
    io.to(tankId).emit(event, { tankId, message });
    console.log(`Emitting to room ${tankId}: ${event}`);
  }
};

module.exports = {
  initializeWebSocket,
  emitToTank,
};
