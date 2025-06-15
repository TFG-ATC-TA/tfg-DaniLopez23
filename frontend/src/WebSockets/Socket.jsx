import { io } from "socket.io-client";

let socket = null;

export const createSocket = () => {
  if (socket) {
    console.warn("Socket ya inicializado. Usando la instancia existente.");
    return socket;
  }

  socket = io('', {  // Sin URL - usa el host actual
    path: '/socket.io',  // Coincide con el proxy
    autoConnect: false,
    transports: ['websocket', 'polling']  // Opcional: prioridad
  });

  return socket;
};
