import { useEffect, useRef } from "react";
import { createSocket } from "../WebSockets/Socket";

const useSocket = ({ url, roomId, listeners = {} }) => {
  const socketRef = useRef(null); // Referencia al socket para mantener consistencia

  useEffect(() => {
    // Crear y conectar el socket si no está inicializado
    const socket = createSocket(url);
    socketRef.current = socket;

    socket.connect();

    // Unirse a la room especificada
    if (roomId) {
      socket.emit("joinRoom", roomId, () => {
        console.log(`Joined room: ${roomId}`);
      });
    }

    // Registrar listeners
    Object.entries(listeners).forEach(([event, handler]) => {
      socket.on(event, handler);
    });

    // Cleanup al desmontar
    return () => {
      // Salir de la room
      if (roomId) {
        socket.emit("leaveRoom", roomId, () => {
          console.log(`Left room: ${roomId}`);
        });
      }

      // Remover listeners
      Object.keys(listeners).forEach((event) => {
        socket.off(event);
      });

      // Desconectar el socket si es necesario
      socket.disconnect();
    };
  }, [url, roomId, listeners]);

  // Función para cambiar de room dinámicamente
  const switchRoom = (newRoomId) => {
    const socket = socketRef.current;
    if (socket) {
      if (roomId) {
        socket.emit("leaveRoom", roomId, () => {
          console.log(`Left room: ${roomId}`);
        });
      }
      socket.emit("joinRoom", newRoomId, () => {
        console.log(`Joined new room: ${newRoomId}`);
      });
    }
  };

  return {
    socket: socketRef.current, // Devuelve la referencia del socket
    switchRoom,                // Permite cambiar de room dinámicamente
  };
};

export default useSocket;
