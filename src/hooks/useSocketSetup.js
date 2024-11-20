import { useEffect } from "react";
import useSocketStore from "../Stores/useSocketStore";
import useDataStore from "../Stores/useDataStore";

const useSocketSetup = (farmId) => {
  const { connect, disconnect, joinRoom, leaveRoom, onEvent, offEvent } = useSocketStore();
  const {
    updateEncoderData,
    updateGyroscopeData,
    updateMilkQuantityData,
    updateTankTemperaturesData,
    updateSwitchStatus,
    updateWeightData,
    updateAirQualityData,
  } = useDataStore((state) => ({
    updateEncoderData: state.updateEncoderData,
    updateGyroscopeData: state.updateGyroscopeData,
    updateMilkQuantityData: state.updateMilkQuantityData,
    updateTankTemperaturesData: state.updateTankTemperaturesData,
    updateSwitchStatus: state.updateSwitchStatus,
    updateWeightData: state.updateWeightData,
    updateAirQualityData: state.updateAirQualityData,
  }));

  useEffect(() => {

    // Unirse a la room correspondiente al farmId
    joinRoom(farmId);

    // Definir los canales y sus manejadores
    const sensorChannels = [
      { channel: `${farmId}/encoder`, handler: updateEncoderData },
      { channel: `${farmId}/6_dof_imu`, handler: updateGyroscopeData },
      { channel: `${farmId}/milk-quantity`, handler: updateMilkQuantityData },
      { channel: `${farmId}/tank-temperatures`, handler: updateTankTemperaturesData },
      { channel: `${farmId}/switch-status`, handler: updateSwitchStatus },
      { channel: `${farmId}/weight`, handler: updateWeightData },
      { channel: `${farmId}/air-quality`, handler: updateAirQualityData },
    ];

    // Configurar los listeners
    sensorChannels.forEach(({ channel, handler }) => {
      onEvent(channel, handler);
    });

    // Cleanup: eliminar listeners y desconectar
    return () => {
      sensorChannels.forEach(({ channel }) => {
        offEvent(channel);
      });

      // Salir de la room (opcional, si el servidor lo admite)
      leaveRoom(farmId);

      // Desconectar del servidor
      disconnect();
    };
  }, [
    connect,
    disconnect,
    joinRoom,
    leaveRoom,
    onEvent,
    offEvent,
    farmId,
    updateEncoderData,
    updateGyroscopeData,
    updateMilkQuantityData,
    updateTankTemperaturesData,
    updateSwitchStatus,
    updateWeightData,
    updateAirQualityData,
  ]);
};

export default useSocketSetup;
