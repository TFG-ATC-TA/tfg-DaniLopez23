import { createContext, useContext, useEffect, useState } from "react";
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

  const onEncoderData = (data) => {
    console.log("Encoder data received:", data);
    updateEncoderData(data);
  };

  const onGyroscopeData = (data) => {
    updateGyroscopeData(data);
  };

  const onMilkQuantityData = (data) => {
    console.log("Milk quantity data received:", data);
    updateMilkQuantityData(data);
  };

  const onTankTemperature = (data) => {
    console.log("Tank temperature data received:", data);
    updateTankTemperaturesData(data);
  };

  const onWeightData = (data) => {
    console.log("Weight data received:", data);
    updateWeightData(data);
  };

  const onSwitch = (data) => {
    console.log("Switch data received:", data);
    updateSwitchStatus(data);
  };

  const onAirQualityData = (data) => {
    console.log("Air quality data received:", data);
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
        setFarmData(data);
        setSelectedTank(data.equipments?.[0] || null);
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
  }, []);

  return (
    <SocketContext.Provider value={{ socket, serverStatus }}>
      {children}
    </SocketContext.Provider>
  );
}
