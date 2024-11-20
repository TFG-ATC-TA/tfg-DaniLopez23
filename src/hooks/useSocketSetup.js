import { useEffect } from "react";
import useSocketStore from "../Stores/useSocketStore";
import useDataStore from "../Stores/useDataStore";
import useTankStore from "@/Stores/useTankStore";
const useSocketSetup = (farmId) => {
  const { stopListeningToEvent, joinRoom, listenToEvent, connected } = useSocketStore((state) => state);
  const {
    updateEncoderData,
    updateGyroscopeData,
    updateMilkQuantityData,
    updateTankTemperaturesData,
    updateSwitchStatus,
    updateWeightData,
    updateAirQualityData,
  } = useDataStore((state) => state);

  const {selectedTank} = useTankStore((state) => state);

  useEffect(() => {
    if (!connected) {
      console.log("Esperando conexión al servidor WebSocket...");
      return;
    }

    // Si hay un `farmId`, se une a la room correspondiente
    if (farmId && selectedTank) {
      // Unirse a la room actual
      joinRoom("00");
      // Configurar listeners para los eventos específicos de la room
      listenToEvent(`${farmId}/encoder`, updateEncoderData);
      listenToEvent(`${farmId}/6-dof-imu`, updateGyroscopeData);
      listenToEvent(`${farmId}/tank_distance`, updateMilkQuantityData);
      listenToEvent(`${farmId}/tank_temperature_probes`, updateTankTemperaturesData);
      listenToEvent(`${farmId}/magnetic_switch`, updateSwitchStatus);
      listenToEvent(`${farmId}/weight`, updateWeightData);
      listenToEvent(`${farmId}/air_quality`, updateAirQualityData);
    }

    // Limpieza de listeners cuando el `farmId` cambia o el componente se desmonta
    return () => {
      if (farmId) {
        // Eliminar los listeners específicos de la `room`
        stopListeningToEvent(`${farmId}/encoder`);
        stopListeningToEvent(`${farmId}/6-dof-imu`);
        stopListeningToEvent(`${farmId}/tank_distance`);
        stopListeningToEvent(`${farmId}/tank_temperature_probes`);
        stopListeningToEvent(`${farmId}/magnetic_switch`);
        stopListeningToEvent(`${farmId}/weight`);
        stopListeningToEvent(`${farmId}/air_quality`);

        console.log(`Limpieza de eventos para farmId: ${farmId}`);
      }
    };
  }, [
    farmId,
    selectedTank,
    connected,
    joinRoom,
    listenToEvent,
    stopListeningToEvent,
    updateAirQualityData,
    updateEncoderData,
    updateGyroscopeData,
    updateMilkQuantityData,
    updateSwitchStatus,
    updateTankTemperaturesData,
    updateWeightData,
  ]);

};

export default useSocketSetup;
