import useDataStore from "./Stores/useDataStore";
import Header from "./components/Header";
import DigitalTwin from "./components/DigitalTwin";
import ErrorDisplay from "./components/ErrorDisplay";
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
  
  const { serverStatus } = useSocketStore((state) => state);
  
  const {error, retryInitialization} = useFarmInitialization();

  const { farmData } = useFarmStore((state) => state);

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <ErrorDisplay
          title="Failed to load farm data"
          message={error}
          onRetry={retryInitialization}
        />
      </div>
    )
  }

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
