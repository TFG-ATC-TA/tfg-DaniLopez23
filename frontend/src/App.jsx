import useDataStore from "./stores/useDataStore";
import Header from "./components/Header";
import DigitalTwin from "./components/DigitalTwin";
import useSocketStore from "./stores/useSocketStore";
import useFarmStore from "./stores/useFarmStore";

import { useSocketInitialization } from "./hooks/useSocketInitialization";
import { useFarmInitialization } from "./hooks/useFarmInitialization";

export default function App() {

  const {
    encoderData,
    milkQuantityData,
    switchStatus,
    weightData,
    tankTemperaturesData,
    airQualityData,
    selectedData,
  } = useDataStore((state) => state);

  useSocketInitialization();
    
  useFarmInitialization();

  const { selectedFarm } = useFarmStore((state) => state);
  
  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <Header farmData={selectedFarm} />
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
