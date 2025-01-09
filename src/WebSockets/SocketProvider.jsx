import { createContext, useContext, useEffect, useCallback } from "react";
import { createSocket } from "@/WebSockets/Socket";
import useDataStore from "@/Stores/useDataStore";
import useTankStore from "@/Stores/useTankStore";
import { getFarmById } from "@/services/farm";
import useSocketStore from "@/Stores/useSocketStore";

const SocketContext = createContext(null);
const defaultFarmId = "673b5c5ed5c203a653ace69a"
export const useSocket = () => useContext(SocketContext);

export function SocketProvider({ children }) {
  const {
    updateEncoderData,
    updateGyroscopeData,
    updateMilkQuantityData,
    updateTankTemperaturesData,
    updateSwitchStatus,
    updateWeightData,
    updateAirQualityData,
    setFarmData,
  } = useDataStore((state) => state);

  const { setSelectedTank } = useTankStore((state) => state);
  const { socket, serverStatus, setSocket, setServerStatus } = useSocketStore((state) => state);

  const joinRooms = useCallback((boardIds) => {
    if (socket && Array.isArray(boardIds)) {
      socket.emit("selectTank", boardIds);
      socket.emit("request last data", boardIds);
    }
  }, [socket]);

  useEffect(() => {
    const newSocket = createSocket();
    setSocket(newSocket);

    const setupSocketListeners = () => {
      newSocket.on("connect", () => setServerStatus("connected"));
      newSocket.on("disconnect", () => setServerStatus("disconnected"));

      // Register specific event listeners
      newSocket.on("synthetic-farm-1/encoder", updateEncoderData);
      newSocket.on("synthetic-farm-1/6_dof_imu", updateGyroscopeData);
      newSocket.on("synthetic-farm-1/tank_distance", updateMilkQuantityData);
      newSocket.on("synthetic-farm-1/tank_temperature_probes", updateTankTemperaturesData);
      newSocket.on("synthetic-farm-1/magnetic_switch", updateSwitchStatus);
      newSocket.on("synthetic-farm-1/weight", updateWeightData);
      newSocket.on("synthetic-farm-1/air_quality", updateAirQualityData);

      // Handle last data event separately
      newSocket.on("last data", (data) => {
        console.log("Last data received:", data);

        // Update all stores with the last data payload
        if (data.encoder) updateEncoderData(data.encoder);
        if (data["6_dof_imu"]) updateGyroscopeData(data["6_dof_imu"]);
        if (data.tank_distance) updateMilkQuantityData(data.tank_distance);
        if (data.temperature_probe) updateTankTemperaturesData(data.temperature_probe);
        if (data.magnetic_switch) updateSwitchStatus(data.magnetic_switch);
        if (data.weight) updateWeightData(data.weight);
        if (data.air_quality) updateAirQualityData(data.air_quality);
      });
    };

    const initializeApp = async () => {
      try {
        const farmData = await getFarmById(defaultFarmId);
        setFarmData(farmData);

        const firstMilkTank = farmData.equipments.find(
          (tank) => tank.type === "Tanque de leche"
        );
        setSelectedTank(firstMilkTank);

        if (firstMilkTank?.devices) {
          const boardIds = firstMilkTank.devices.map((device) => device.boardId).filter(Boolean);
          joinRooms(boardIds);
        }
      } catch (error) {
        console.error("Error initializing the application:", error);
      }
    };

    initializeApp();
    setupSocketListeners();
    newSocket.connect();

    return () => {
      newSocket.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, serverStatus, joinRooms }}>
      {children}
    </SocketContext.Provider>
  );
}
