import useDataStore from "./Stores/useDataStore";
import Header from "./components/Header";
import DigitalTwin from "./components/DigitalTwin";
import useSocketStore from "./Stores/useSocketStore";
import useFarmStore from "./Stores/useFarmStore";

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

  const { farmData, serverStatus } = useFarmStore((state) => state);

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <Header serverStatus={serverStatus} webSocketServerStatus={webSocketServerStatus} mqttStatus={mqttStatus} farmData={farmData} />
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
