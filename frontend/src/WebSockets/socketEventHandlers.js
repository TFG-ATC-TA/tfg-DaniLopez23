import useDataStore from "@/stores/useDataStore";
import useTankStore from "@/stores/useTankStore";

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
    });
  };

  const updateEncoder = (data) => {
    console.log("Encoder data:", data); // Verifica si se recibe el evento correctamente
  
    // Asegúrate de que `data` tenga las propiedades necesarias
    if (data?.tags?.sensor_id && data?.value !== undefined) {
      // Si `data.value` ya es un objeto, agrega el nuevo sensor_id y su valor
      if (typeof data.value === "object" && !Array.isArray(data.value)) {
        data.value = {
          ...data.value, // Mantén los valores existentes
          [data.tags.sensor_id]: data.value[data.tags.sensor_id] || data.value,
        };
      } else {
        // Si `data.value` no es un objeto, inicialízalo como un objeto con el nuevo sensor_id
        data.value = {
          [data.tags.sensor_id]: data.value,
        };
      }
    } else {
      // Si falta información, inicializa `value` como un objeto vacío
      data.value = {};
    }
  
    // Actualiza los datos en el store
    updateEncoderData(data);
  };
  

  return {
    [`encoder`]: updateEncoder,
    [`6_dof_imu`]: updateGyroscopeData,
    [`tank_distance`]: updateMilkQuantity,
    [`tank_temperature_probes`]: updateTankTemperaturesData,
    [`magnetic_switch`]: updateSwitchStatus,
    [`weight`]: updateWeightData,
    [`air_quality`]: updateAirQualityData,
    "last data": (data) => {
      console.log("Received last data:", data); // Verifica si se recibe el evento correctamente
      if (data.encoder) updateEncoder(data.encoder);
      if (data["6_dof_imu"]) updateGyroscopeData(data["6_dof_imu"]);
      if (data.tank_distance) updateMilkQuantity(data.tank_distance);
      if (data.temperature_probe) updateTankTemperaturesData(data.temperature_probe);
      if (data.magnetic_switch) updateSwitchStatus(data.magnetic_switch);
      if (data.weight) updateWeightData(data.weight);
      if (data.air_quality) updateAirQualityData(data.air_quality);
    },
  };
};
