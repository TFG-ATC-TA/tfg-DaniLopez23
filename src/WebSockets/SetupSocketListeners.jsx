export const setupSocketListeners = (
  socket,
  setEncoderData,
  setGyroscopeData,
  setMilkQuantityData,
  setTankTemperaturesData,
  setSwitchStatus,
  setWeightData,
  setAirQualityData
) => {
  const onConnect = () => {
    console.log("Connected to server");
  };

  const onDisconnect = () => {
    console.log("Disconnected from server");
  };

  const onEncoderData = (data) => {
    // console.log(data);
    setEncoderData(data);
  };

  const onGyroscopeData = (data) => {
    // console.log(data);
    setGyroscopeData(data);
  };

  const onMilkQuantityData = (data) => {
    // console.log(data);
    setMilkQuantityData(data);
  };

  const onTankTemperature = (data) => {
    // console.log(data);
    setTankTemperaturesData(data);
  };

  const onWeightData = (data) => {
    // console.log(data);
    setWeightData(data);
  }

  const onSwitch = (data) => {
    // console.log(data);
    setSwitchStatus(data);
  };

  const onAirQualityData = (data) => {
   console.log(data);
    setAirQualityData(data);
  }

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
};
