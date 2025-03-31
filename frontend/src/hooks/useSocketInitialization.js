import { useEffect, useCallback } from "react";
import { createSocket } from "@/webSockets/Socket";
import useSocketStore from "@/stores/useSocketStore";
import useDataStore from "@/stores/useDataStore";

export const useSocketInitialization = () => {
  const { setSocket, setMqttStatus, setWebSocketServerStatus } = useSocketStore((state) => state);
  const {
    updateEncoderData,
    updateGyroscopeData,
    updateMilkQuantityData,
    updateTankTemperaturesData,
    updateSwitchStatus,
    updateWeightData,
    updateAirQualityData,
  } = useDataStore((state) => state);

  const handleSocketError = useCallback(
    (error) => {
      console.error("WebSocket connection error:", error);
      setWebSocketServerStatus({
        status: "error",
        error: error.message || "Unknown error occurred",
      });
    },
    [setWebSocketServerStatus]
  );

  useEffect(() => {
    let socketInstance;
    
    try {
      socketInstance = createSocket();
      console.log("Socket instance created:", socketInstance); // Verifica si el socket se crea
      setSocket(socketInstance);
  
      socketInstance.on("connect", () => {
        console.log("Socket connected"); // Verifica si el socket se conecta
        setWebSocketServerStatus({ status: "connected", error: null });
      });
  
      socketInstance.on("disconnect", (reason) => {
        console.log("Socket disconnected:", reason); // Verifica si el socket se desconecta
        setWebSocketServerStatus({
          status: "disconnected",
          error:
            reason !== "io server disconnect" &&
            reason !== "io client disconnect"
              ? `Disconnected: ${reason}`
              : null,
        });
      });
  
      socketInstance.connect();
    } catch (error) {
      console.error("Error creating socket:", error);
      handleSocketError(error);
    }
    
    const eventHandlers = {
      "encoder": updateEncoderData,
      "6_dof_imu": updateGyroscopeData,
      "tank_distance": updateMilkQuantityData,
      "tank_temperature_probes": updateTankTemperaturesData,
      "magnetic_switch": updateSwitchStatus,
      "weight": updateWeightData,
      "air_quality": updateAirQualityData,
    };

    console.log("Static EventHandlers:", eventHandlers);
    Object.entries(eventHandlers).forEach(([event, handler]) => {
      socketInstance.on(event, handler);
      console.log(`Listening to event: ${event}`);
    });

    return () => {
      if (socketInstance) {
        socketInstance.disconnect();
      }

      Object.entries(eventHandlers).forEach(([event, handler]) => {
        socketInstance.off(event, handler);
      });
      
    };
  }, [setSocket, setWebSocketServerStatus, setMqttStatus, handleSocketError]);
};