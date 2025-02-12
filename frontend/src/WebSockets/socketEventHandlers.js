import useDataStore from "@/stores/useDataStore";
import useFarmStore from "@/stores/useFarmStore";


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

  const {farm} = useFarmStore.getState(); 
  const farmId = farm?.id;
  return {
    [`${farmId}/encoder`]: updateEncoderData,
    [`${farmId}/6_dof_imu`]: updateGyroscopeData,
    [`${farmId}/tank_distance`]: updateMilkQuantityData,
    [`${farmId}/tank_temperature_probes`]: updateTankTemperaturesData,
    [`${farmId}/magnetic_switch`]: updateSwitchStatus,
    [`${farmId}/weight`]: updateWeightData,
    [`${farmId}/air_quality`]: updateAirQualityData,
    "lastData": (data) => {
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
