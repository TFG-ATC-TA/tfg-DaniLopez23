import useDataStore from "@/stores/useDataStore";
import useTankStore from "@/stores/useTankStore";
import { update } from "@react-spring/three";

export const createSocketEventHandlers = () => {
  const {
    updateEncoderData,
    updateGyroscopeData,
    updateMilkQuantityData,
    updateTankTemperaturesData,
    updateSwitchStatus,
    updateWeightData,
    updateAirQualityData,
    updateLastSensorData,
  } = useDataStore.getState(); // Accede a las funciones del store directamente

  const waitForSelectedTank = (callback) => {
    const interval = setInterval(() => {
      const { selectedTank } = useTankStore.getState();
      if (selectedTank) {
        clearInterval(interval); // Detén el intervalo cuando `selectedTank` esté definido
        callback(selectedTank); // Ejecuta la lógica con `selectedTank`
      }
    }, 100); // Verifica cada 100ms
  };

  const updateMilkQuantity = (data) => {
    waitForSelectedTank((selectedTank) => {
      if (selectedTank.height) {
        data.value = (data.value / selectedTank.height) * 100;
        console.log("Milk data percentage", selectedTank.height, data.value);
      } else {
        console.warn("Selected tank does not have a height.");
      }
      updateMilkQuantityData(data);
      updateLastSensorData(data); // Actualiza el último dato recibido
    });
  };

  const updateEncoder = (data) => {
    console.log("Encoder data:", data);

    // Obtén el valor anterior del encoder del store
    const prevEncoder = useDataStore.getState().encoderData?.value || {};

    if (data?.tags?.sensor_id && data?.value !== undefined) {
      // Haz merge con el valor anterior
      data.value = {
        ...prevEncoder,
        [data.tags.sensor_id]: data.value,
      };
    } else {
      data.value = { ...prevEncoder };
    }

    updateEncoderData(data);
    updateLastSensorData(data);
  };

  return {
    [`encoder`]: (data) => {
      updateEncoder(data);
    },
    [`6_dof_imu`]: (data) => {
      updateGyroscopeData(data);
      updateLastSensorData(data); // Actualiza también los últimos datos del sensor
    },
    [`tank_distance`]: (data) => {
      updateMilkQuantity(data);
    },
    [`tank_temperature_probes`]: (data) => {
      updateTankTemperaturesData(data);
      updateLastSensorData(data); // Actualiza también los últimos datos del sensor
    },
    [`magnetic_switch`]: (data) => {
      updateSwitchStatus(data);
      updateLastSensorData(data); // Actualiza también los últimos datos del sensor
    },
    [`weight`]: (data) => {
      updateWeightData(data);
      updateLastSensorData(data); // Actualiza también los últimos datos del sensor
    },
    [`air_quality`]: (data) => {
      updateAirQualityData(data);
      updateLastSensorData(data); // Actualiza también los últimos datos del sensor
    },
    "last data": (data) => {
      console.log("Received last data:", data); // Verifica si se recibe el evento correctamente
      if (data.encoder) updateEncoder(data.encoder);
      if (data["6_dof_imu"]) updateGyroscopeData(data["6_dof_imu"]);
      if (data.tank_distance) updateMilkQuantity(data.tank_distance);
      if (data.temperature_probe)
        updateTankTemperaturesData(data.temperature_probe);
      if (data.magnetic_switch) updateSwitchStatus(data.magnetic_switch);
      if (data.weight) updateWeightData(data.weight);
      if (data.air_quality) updateAirQualityData(data.air_quality);

      updateLastSensorData(data); // Actualiza también los últimos datos del sensor
    },
  };
};
