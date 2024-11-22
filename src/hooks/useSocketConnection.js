import { useEffect, useState } from 'react';
import { createSocket } from '../WebSockets/Socket';
import useDataStore from '../Stores/useDataStore';
import useTankStore from '../Stores/useTankStore';
import { getFarm } from '../services/farm';

const FARM_ID = "synthetic-farm-1";

export const useSocketConnection = () => {
  const { 
    updateEncoderData,
    updateGyroscopeData,
    updateMilkQuantityData,
    updateTankTemperaturesData,
    updateSwitchStatus,
    updateWeightData,
    updateAirQualityData,
    setFarmData
  } = useDataStore(state => state);
  
  const { setSelectedTank } = useTankStore(state => state);

  const [serverStatus, setServerStatus] = useState("disconnected");

  useEffect(() => {
    const socket = createSocket();

    const setupSocketListeners = () => {
      socket.on("connect", () => {
        //console.log("Connected to server");
        setServerStatus("connected");
      });

      socket.on("disconnect", () => {
        //console.log("Disconnected from server");
        setServerStatus("disconnected");
      });

      socket.on(`${FARM_ID}/encoder`, (data) => {
        //console.log("Encoder data received:", data);
        updateEncoderData(data);
      });
      socket.on(`${FARM_ID}/6_dof_imu`, (data) => {
        //console.log("Gyroscope data received:", data);
        updateGyroscopeData(data);
      });
      socket.on(`${FARM_ID}/tank_distance`, (data) => {
        //console.log("Milk quantity data received:", data);
        updateMilkQuantityData(data);
      });
      socket.on(`${FARM_ID}/tank_temperature_probes`, (data) => {
        //console.log("Tank temperatures data received:", data);
        updateTankTemperaturesData(data);
      });
      socket.on(`${FARM_ID}/magnetic_switch`, (data) => {
        //console.log("Switch status received:", data);
        updateSwitchStatus(data);
      });
      socket.on(`${FARM_ID}/weight`, (data) => {
        //console.log("Weight data received:", data);
        updateWeightData(data);
      });
      socket.on(`${FARM_ID}/air_quality`, (data) => {
        //console.log("Air quality data received:", data);
        updateAirQualityData(data);
      });
    };

    const initializeApp = async () => {
      try {
        const data = await getFarm();
        console.log("Farm data received:", data);
        setFarmData(data);
        setSelectedTank(data.equipments?.[0] || null);
      } catch (error) {
        console.error("Error initializing the application:", error);
      }
    };

    setupSocketListeners();
    initializeApp();
    socket.connect();

    return () => {
      socket.disconnect();
    };
  }, []);

  return { serverStatus };
};