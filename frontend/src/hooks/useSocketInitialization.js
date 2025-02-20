import { useEffect, useCallback } from "react";
import { createSocket } from "@/webSockets/Socket";
import useSocketStore from "@/stores/useSocketStore";
import useFarmStore from "@/stores/useFarmStore";
import useDataStore from "@/stores/useDataStore";
import useTankStore from "@/stores/useTankStore";

export const useSocketInitialization = () => {
  const { socket, setSocket, setMqttStatus, setWebSocketServerStatus } =
    useSocketStore((state) => state);
  const { selectedFarm } = useFarmStore((state) => state);
  const { selectedTank } = useTankStore((state) => state);
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
      setSocket(socketInstance);

      socketInstance.on("connect", () => {
        setWebSocketServerStatus({ status: "connected", error: null });
      });

      socketInstance.on("disconnect", (reason) => {
        setWebSocketServerStatus({
          status: "disconnected",
          error:
            reason !== "io server disconnect" &&
            reason !== "io client disconnect"
              ? `Disconnected: ${reason}`
              : null,
        });
      });

      socketInstance.on("connect_error", handleSocketError);
      socketInstance.on("error", handleSocketError);

      socketInstance.on("mqttStatus", (status) => {
        setMqttStatus({
          status: status.connected ? "connected" : "disconnected",
          error: status.error || null,
        });
      });

      socketInstance.connect();
    } catch (error) {
      handleSocketError(error);
    }

    return () => {
      if (socketInstance) {
        socketInstance.disconnect();
      }
    };
  }, [setSocket, setWebSocketServerStatus, setMqttStatus, handleSocketError]);

  useEffect(() => {

    if (!socket?.connected || !selectedFarm?._id) {
      console.warn("No socket or selected farm");
      return;
    }

    const farmId = selectedFarm.broker;

    const eventHandlers = {
      [`${farmId}/encoder`]: updateEncoderData,
      [`${farmId}/6_dof_imu`]: updateGyroscopeData,
      [`${farmId}/tank_distance`]: updateMilkQuantityData,
      [`${farmId}/tank_temperature_probes`]: updateTankTemperaturesData,
      [`${farmId}/magnetic_switch`]: updateSwitchStatus,
      [`${farmId}/weight`]: updateWeightData,
      [`${farmId}/air_quality`]: updateAirQualityData,
    };
    console.log("EventHandlers (farm_broker):", eventHandlers);
    Object.entries(eventHandlers).forEach(([event, handler]) => {
      socket.on(event, handler);
      console.log(`Listening to event: ${event}`);
    });

    return () => {
      Object.entries(eventHandlers).forEach(([event, handler]) => {
        socket.off(event, handler);
      });
    };
  }, [socket, selectedFarm]);
};
