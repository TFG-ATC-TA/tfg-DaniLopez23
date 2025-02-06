import { FARM_ID } from "@/config/config";
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
    [`${FARM_ID}/encoder`]: updateEncoderData,
    [`${FARM_ID}/6_dof_imu`]: updateGyroscopeData,
    [`${FARM_ID}/tank_distance`]: updateMilkQuantityData,
    [`${FARM_ID}/tank_temperature_probes`]: updateTankTemperaturesData,
    [`${FARM_ID}/magnetic_switch`]: updateSwitchStatus,
    [`${FARM_ID}/weight`]: updateWeightData,
    [`${FARM_ID}/air_quality`]: updateAirQualityData,
    "last data": (data) => {
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
