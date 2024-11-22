import { io } from "socket.io-client";

let socket = null;

export const createSocket = (url = "http://localhost:3001", options = {}) => {
  if (socket) {
    console.warn("Socket ya inicializado. Usando la instancia existente.");
    return socket;
  }

  // Crear nueva instancia de Socket.IO
  socket = io(url, {
    autoConnect: false,
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    ...options,
  });

  return socket;
};
