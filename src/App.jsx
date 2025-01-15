import { useSocket } from "./WebSockets/SocketProvider";

import useDataStore from "./Stores/useDataStore";
import Header from "./components/Header";
import DigitalTwin from "./components/DigitalTwin";
import useTankStore from "./Stores/useTankStore";

export default function App() {
  const { serverStatus } = useSocket();
  const { farmData } = useDataStore((state) => state);
  const { selectedTank } = useTankStore((state) => state);
  const {
    encoderData,
    milkQuantityData,
    switchStatus,
    weightData,
    tankTemperaturesData,
    airQualityData,
    selectedData,
  } = useDataStore((state) => state);

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
        selectedTank={selectedTank}
      />
    </div>
  );
}
