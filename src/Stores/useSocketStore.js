import { create } from "zustand";
import { createSocket, closeSocket, getSocket } from "../WebSockets/Socket";

const useSocketStore = create((set) => ({
  socket: null,
  connected: false,

  connect: (url, options) => {
    const socket = createSocket(url, options);
    socket.connect();
    set({ socket, connected: true });
  },

  disconnect: () => {
    closeSocket();
    set({ socket: null, connected: false });
  },

  joinRoom: (roomName) => {
    const socket = getSocket();
    if (socket) {
      socket.emit("joinRoom", roomName);
      console.log(`Unido a la room: ${roomName}`);
    }
  },

  leaveRoom: (roomName) => {
    const socket = getSocket();
    if (socket) {
      socket.emit("leaveRoom", roomName);
      console.log(`Saliendo de la room: ${roomName}`);
    }
  },

  listenToEvent: (eventName, callback) => {
    const socket = getSocket();
    if (socket) {
      socket.on(eventName, callback);
      console.log(`Escuchando evento: ${eventName}`);
    }
  },

  stopListeningToEvent: (eventName) => {
    const socket = getSocket();
    if (socket) {
      socket.off(eventName);
    }
  },
  
}));

export default useSocketStore;
