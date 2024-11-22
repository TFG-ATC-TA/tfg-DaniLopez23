import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { createSocket } from "@/WebSockets/Socket";
import useDataStore from "@/Stores/useDataStore";
import useTankStore from "@/Stores/useTankStore";
import { getFarm } from "@/services/farm";

const FARM_ID = "synthetic-farm-1";

const SocketContext = createContext(null);

export const useSocket = () => useContext(SocketContext);

export function SocketProvider({ children }) {
  const [socket, setSocket] = useState(null);
  const [serverStatus, setServerStatus] = useState("disconnected");
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

  const joinRooms = useCallback((boardIds) => {
    if (socket && Array.isArray(boardIds)) {
      socket.emit("selectTank", boardIds);
    }
  }, [socket]);

  const onEncoderData = (data) => {
    console.log("Encoder data received:", data.tags.board_id);
    updateEncoderData(data);
  };

  const onGyroscopeData = (data) => {
    console.log("Gyroscope data received:", data.tags.board_id);
    updateGyroscopeData(data);
  };

  const onMilkQuantityData = (data) => {
    console.log("Milk quantity data received:", data.tags.board_id);
    updateMilkQuantityData(data);
  };

  const onTankTemperature = (data) => {
    console.log("Tank temperatures data received:", data.tags.board_id);
    updateTankTemperaturesData(data);
  };

  const onWeightData = (data) => {
    console.log("Weight data received:", data.tags.board_id);
    updateWeightData(data);
  };

  const onSwitch = (data) => {
    console.log("Switch status received:", data.tags.board_id);
    updateSwitchStatus(data);
  };

  const onAirQualityData = (data) => {
    console.log("Air quality data received:", data.tags.board_id);
    updateAirQualityData(data);
  };

  useEffect(() => {
    const newSocket = createSocket();
    setSocket(newSocket);

    const setupSocketListeners = () => {
      newSocket.on("connect", () => {
        console.log("Connected to server");
        setServerStatus("connected");
      });

      newSocket.on("disconnect", () => {
        console.log("Disconnected from server");
        setServerStatus("disconnected");
      });

      newSocket.on(`${FARM_ID}/encoder`, onEncoderData);
      newSocket.on(`${FARM_ID}/6_dof_imu`, onGyroscopeData);
      newSocket.on(`${FARM_ID}/tank_distance`, onMilkQuantityData);
      newSocket.on(`${FARM_ID}/tank_temperature_probes`, onTankTemperature);
      newSocket.on(`${FARM_ID}/magnetic_switch`, onSwitch);
      newSocket.on(`${FARM_ID}/weight`, onWeightData);
      newSocket.on(`${FARM_ID}/air_quality`, onAirQualityData);
    };

    const initializeApp = async () => {
      try {
        const data = await getFarm();
        console.log("Farm data received:", data);
        setFarmData(data);
        const firstMilkTank = data.equipments.find(
          (tank) => tank.type === "Tanque de leche"
        );
        setSelectedTank(firstMilkTank);

        if (firstMilkTank && firstMilkTank.devices) {
          const boardIds = firstMilkTank.devices.map(device => device.boardId).filter(Boolean);
          joinRooms(boardIds);
          console.log("Joining rooms for boards:", boardIds);
        }
      } catch (error) {
        console.error("Error initializing the application:", error);
      }
    };

    setupSocketListeners();
    initializeApp();
    newSocket.connect();

    return () => {
      newSocket.disconnect();
    };
  }, [setFarmData, setSelectedTank, joinRooms]);

  return (
    <SocketContext.Provider value={{ socket, serverStatus, joinRooms }}>
      {children}
    </SocketContext.Provider>
  );
}