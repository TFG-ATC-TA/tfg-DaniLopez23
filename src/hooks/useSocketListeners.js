import { useEffect, useState, useRef } from "react";

const useSocketListeners = (socket, selectedRoom) => {
  const [encoderData, setEncoderData] = useState(null);
  const [gyroscopeData, setGyroscopeData] = useState(null);
  const [milkQuantityData, setMilkQuantityData] = useState(null);
  const [tankTemperaturesData, setTankTemperaturesData] = useState(null);
  const [switchStatus, setSwitchStatus] = useState(null);
  const [weightData, setWeightData] = useState(null);
  const [airQualityData, setAirQualityData] = useState(null);

  const currentRoom = useRef(null);

  useEffect(() => {
    const setupListeners = () => {
      socket.on("connect", () => {"Conectado al servidor"});
      socket.on("disconnect",  () => {"Desconectado del servidor"});
      socket.on("synthetic-farm-1/encoder", setEncoderData);
      socket.on("synthetic-farm-1/6_dof_imu", setGyroscopeData);
      socket.on("synthetic-farm-1/tank_distance", setMilkQuantityData);
      socket.on("synthetic-farm-1/tank_temperature_probes", setTankTemperaturesData);
      socket.on("synthetic-farm-1/magnetic_switch", setSwitchStatus);
      socket.on("synthetic-farm-1/weight", setWeightData);
      socket.on("synthetic-farm-1/air_quality", setAirQualityData);

      return () => {
        socket.off("connect", () => {"Conectado al servidor"});
        socket.off("disconnect", () => {"Desconectado del servidor"});
        socket.off("synthetic-farm-1/encoder", setEncoderData);
        socket.off("synthetic-farm-1/6_dof_imu", setGyroscopeData);
        socket.off("synthetic-farm-1/tank_distance", setMilkQuantityData);
        socket.off("synthetic-farm-1/tank_temperature_probes", setTankTemperaturesData);
        socket.off("synthetic-farm-1/magnetic_switch", setSwitchStatus);
        socket.off("synthetic-farm-1/weight", setWeightData);
        socket.off("synthetic-farm-1/air_quality", setAirQualityData);
      };
    };

    const cleanupListeners = setupListeners();

    return () => {
      cleanupListeners();
    };
  }, [socket]);

  useEffect(() => {
    // Cambiar room si la selección cambia
    if (currentRoom.current) {
      socket.emit("leaveRoom", currentRoom.current);
    }

    if (selectedRoom) {
      socket.emit("joinRoom", selectedRoom);
      currentRoom.current = selectedRoom;
    }

    return () => {
      if (currentRoom.current) {
        socket.emit("leaveRoom", currentRoom.current);
        currentRoom.current = null;
      }
    };
  }, [socket, selectedRoom]);

  return {
    encoderData,
    gyroscopeData,
    milkQuantityData,
    tankTemperaturesData,
    switchStatus,
    weightData,
    airQualityData,
  };
};

export default useSocketListeners;
