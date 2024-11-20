import { io } from "socket.io-client";

let socket = null; // Mantén una referencia única a la instancia del socket

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

  // Listeners globales del socket
  socket.on("connect", () => console.log("Conectado al servidor WebSocket"));
  socket.on("disconnect", (reason) => console.log("Desconectado:", reason));
  socket.on("connect_error", (error) => console.error("Error al conectar:", error));

  return socket;
};

export const getSocket = () => {
  if (!socket) {
    throw new Error("Socket no inicializado. Llama a createSocket primero.");
  }
  return socket;
};

export const closeSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
    console.log("Socket desconectado y referencia eliminada.");
  }
};
