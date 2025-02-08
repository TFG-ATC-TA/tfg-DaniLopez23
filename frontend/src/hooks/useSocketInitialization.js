import { useEffect, useCallback } from "react";
import { createSocket } from "@/webSockets/Socket";
import { createSocketEventHandlers } from "@/webSockets/socketEventHandlers";
import useSocketStore from "@/stores/useSocketStore";

export const useSocketInitialization = () => {
  const { 
    setSocket, 
    setMqttStatus, 
    setWebSocketServerStatus, 
  } = useSocketStore((state) => state);

  const handleSocketError = useCallback((error) => {
    console.error("WebSocket connection error:", error);
    setWebSocketServerStatus({ 
      status: "error", 
      error: error.message || "Unknown error occurred" 
    });
  }, [setWebSocketServerStatus]);

  const setupSocketListeners = useCallback((socket) => {
    socket.on("connect", () => {
      setWebSocketServerStatus({ status: "connected", error: null });
    });

    socket.on("disconnect", (reason) => {
      if (reason === "io server disconnect" || reason === "io client disconnect") {
        setWebSocketServerStatus({ status: "disconnected", error: null });
      } else {
        setWebSocketServerStatus({ 
          status: "disconnected", 
          error: `Disconnected: ${reason}` 
        });
      }
    });

    socket.on("connect_error", (error) => {
      handleSocketError(error);
    });

    socket.on("error", (error) => {
      handleSocketError(error);
    });

    socket.on("mqttStatus", (status) => {
      setMqttStatus({
        status: status.connected ? "connected" : "disconnected",
        error: status.error || null
      });
    });

    const eventHandlers = createSocketEventHandlers();
    Object.entries(eventHandlers).forEach(([event, handler]) => {
      socket.on(event, handler);
    });
  }, [setWebSocketServerStatus, setMqttStatus, handleSocketError]);

  useEffect(() => {
    let socket;

    try {
      socket = createSocket();
      setSocket(socket);
      setupSocketListeners(socket);
      socket.connect();
    } catch (error) {
      handleSocketError(error);
    }

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [setSocket, setupSocketListeners, handleSocketError]);
};