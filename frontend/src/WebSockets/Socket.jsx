import { io } from "socket.io-client";

let socket = null;

export const createSocket = (url = import.meta.env.VITE_SOCKET_URL, options = {}) => {
  if (socket) {
    console.warn("Socket ya inicializado. Usando la instancia existente.");
    return socket;
  }

  socket = io(url, {
    autoConnect: false,
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    ...options,
  });

  return socket;
};
