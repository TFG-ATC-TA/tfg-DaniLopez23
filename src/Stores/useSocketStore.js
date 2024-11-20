// socketStore.js
import create from 'zustand';
import { io } from 'socket.io-client';

const useSocketStore = create((set) => ({
  socket: null,
  connected: false,

  // Conectar al servidor WebSocket
  connect: (url) => {
    const socket = io(url);
    socket.on('connect', () => {
      set({ socket, connected: true });
      console.log('Conectado a WebSocket');
    });
    socket.on('disconnect', () => {
      set({ connected: false });
      console.log('Desconectado de WebSocket');
    });
    socket.onAny((event, ...args) => {
      console.log(`Evento recibido: ${event}`, args);
    });

    set({ socket });
  },

  // Unirse a una room
  joinRoom: (roomName) => {
    const socket = get().socket;
    if (socket) {
      socket.emit('joinRoom', roomName);
      console.log(`Unido a la room: ${roomName}`);
    }
  },

  // Escuchar un evento y pasar los datos al store de sensores
  listenToEvent: (eventName, callback) => {
    const socket = get().socket;
    if (socket) {
      socket.on(eventName, (data) => {
        console.log(`${eventName} recibido:`, data);
        // Llamamos al callback en el store de sensores
        callback(data);
      });
    }
  },
}));

export default useSocketStore;
