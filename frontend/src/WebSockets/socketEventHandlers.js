import useDataStore from "@/stores/useDataStore";

export const createSocketEventHandlers = () => {
  const {
    updateEncoderData,
    updateGyroscopeData,
    updateMilkQuantityData,
    updateTankTemperaturesData,
    updateSwitchStatus,
    updateWeightData,
    updateAirQualityData,
  } = useDataStore.getState(); // Accede a las funciones del store directamente

  return {
    [`encoder`]: updateEncoderData,
    [`6_dof_imu`]: updateGyroscopeData,
    [`tank_distance`]: updateMilkQuantityData,
    [`tank_temperature_probes`]: updateTankTemperaturesData,
    [`magnetic_switch`]: updateSwitchStatus,
    [`weight`]: updateWeightData,
    [`air_quality`]: updateAirQualityData,
    "last data": (data) => {
      console.log("Received last data:", data); // Verifica si se recibe el evento correctamente
      if (data.encoder) updateEncoderData(data.encoder);
      if (data["6_dof_imu"]) updateGyroscopeData(data["6_dof_imu"]);
      if (data.tank_distance) updateMilkQuantityData(data.tank_distance);
      if (data.temperature_probe) updateTankTemperaturesData(data.temperature_probe);
      if (data.magnetic_switch) updateSwitchStatus(data.magnetic_switch);
      if (data.weight) updateWeightData(data.weight);
      if (data.air_quality) updateAirQualityData(data.air_quality);
    },
  };
};
