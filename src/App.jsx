import useDataStore from "./Stores/useDataStore";
import Header from "./components/Header";
import DigitalTwin from "./components/DigitalTwin";

import useSocketStore from "./Stores/useSocketStore";

import { useSocketInitialization } from "./hooks/useSocketInitialization";
import { useFarmInitialization } from "./hooks/useFarmInitialization";

export default function App() {

  const {
    farmData,
    encoderData,
    milkQuantityData,
    switchStatus,
    weightData,
    tankTemperaturesData,
    airQualityData,
    selectedData,
    updateEncoderData,
    updateGyroscopeData,
    updateMilkQuantityData,
    updateTankTemperaturesData,
    updateSwitchStatus,
    updateWeightData,
    updateAirQualityData,
  } = useDataStore((state) => state);

  const { serverStatus, joinRooms } = useSocketStore((state) => state);

  useSocketInitialization();

  // Inicializar la granja
  useFarmInitialization(joinRooms);

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <Header serverStatus={serverStatus} farmData={farmData} />
      <DigitalTwin
        encoderData={encoderData}
        milkQuantityData={milkQuantityData}
        switchStatus={switchStatus}
        weightData={weightData}
        tankTemperaturesData={tankTemperaturesData}
        airQualityData={airQualityData}
        selectedData={selectedData}
      />
    </div>
  );
}
