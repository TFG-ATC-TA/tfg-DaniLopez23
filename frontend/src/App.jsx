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
  
  const { webSocketServerStatus, mqttStatus } = useSocketStore((state) => state);
  
  useFarmInitialization();

  const { selectedFarm, serverStatus } = useFarmStore((state) => state);
  
  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <Header serverStatus={serverStatus} webSocketServerStatus={webSocketServerStatus} mqttStatus={mqttStatus} farmData={selectedFarm} />
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
