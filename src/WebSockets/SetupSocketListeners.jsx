import { useEffect } from "react";
import useDataStore from "@/Stores/useDataStore";

export const setupSocketListeners = (socket) => {
  const { 
    updateEncoderData,
    updateGyroscopeData,
    updateMilkQuantityData,
    updateTankTemperaturesData,
    updateSwitchStatus,
    updateWeightData,
    updateAirQualityData,
  } = useDataStore((store) => store);

  useEffect(() => {
    const onConnect = () => {
      console.log("Connected to server");
    };

    const onDisconnect = () => {
      console.log("Disconnected from server");
    };

    const onEncoderData = (data) => {
      updateEncoderData(data);
    };

    const onGyroscopeData = (data) => {
      updateGyroscopeData(data);
    };

    const onMilkQuantityData = (data) => {
      updateMilkQuantityData(data);
    };

    const onTankTemperature = (data) => {
      updateTankTemperaturesData(data);
    };

    const onWeightData = (data) => {
      updateWeightData(data);
    };

    const onSwitch = (data) => {
      updateSwitchStatus(data);
    };

    const onAirQualityData = (data) => {
      updateAirQualityData(data);
    };

    // Conectarse a los eventos del WebSocket
    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("synthetic-farm-1/encoder", onEncoderData);
    socket.on("synthetic-farm-1/6_dof_imu", onGyroscopeData);
    socket.on("synthetic-farm-1/tank_distance", onMilkQuantityData);
    socket.on("synthetic-farm-1/tank_temperature_probes", onTankTemperature);
    socket.on("synthetic-farm-1/magnetic_switch", onSwitch);
    socket.on("synthetic-farm-1/weight", onWeightData);
    socket.on("synthetic-farm-1/air_quality", onAirQualityData);

    return () => {
      // Función de limpieza para desuscribirse de los eventos
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("synthetic-farm-1/encoder", onEncoderData);
      socket.off("synthetic-farm-1/6_dof_imu", onGyroscopeData);
      socket.off("synthetic-farm-1/tank_distance", onMilkQuantityData);
      socket.off("synthetic-farm-1/tank_temperature_probes", onTankTemperature);
      socket.off("synthetic-farm-1/magnetic_switch", onSwitch);
      socket.off("synthetic-farm-1/weight", onWeightData);
      socket.off("synthetic-farm-1/air_quality", onAirQualityData);
    };
  }, [socket]); // El efecto depende del socket

};
