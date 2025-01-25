import { useEffect } from "react";
import { createSocket } from "@/WebSockets/Socket";
import { createSocketEventHandlers } from "@/WebSockets/socketEventHandlers";
import useSocketStore from "@/Stores/useSocketStore";

export const useSocketInitialization = () => {
  const { setSocket, setServerStatus, setMqttStatus } = useSocketStore((state) => state);

  useEffect(() => {
    const socket = createSocket();
    setSocket(socket);

    const eventHandlers = createSocketEventHandlers();

    const setupSocketListeners = () => {
      socket.on("connect", () => setServerStatus("connected"));
      socket.on("disconnect", () => setServerStatus("disconnected"));
      socket.on("mqttStatus", (e) => setMqttStatus(e));
      // Registrar eventos dinámicamente
      Object.entries(eventHandlers).forEach(([event, handler]) => {
        socket.on(event, handler);
      });
    };

    setupSocketListeners();
    socket.connect();

    return () => {
      socket.disconnect();
    };
  }, [setSocket, setServerStatus, setMqttStatus]);
};
