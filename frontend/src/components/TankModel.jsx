import { Canvas } from "@react-three/fiber";
import useTankStore from "@/stores/useTankStore";
import SelectedSensorData from "./sensorData/SelectedSensorData";
import CameraSettings from "./camera/CameraSettings";
import { HorizontalTank2Blades } from "./tankModels/horizontal/HorizontalTank2Blades";
import { HorizontalTank1Blade } from "./tankModels/horizontal/HorizontalTank1Blade";
import { VerticalTank1Blade } from "./tankModels/vertical/VerticalTank1Blade";
import { Button } from "./ui/button";
import { Suspense } from "react";
import { Loader2 } from 'lucide-react';
import AirQualityLegend from "./sensorData/AirQualityLegend";

const TankModel = ({
  mode,
  realTimeData,
  historicalData,
  filters,
  error,
  fetchHistoricalData,
}) => {
  const { selectedTank } = useTankStore((state) => state);


  const renderTankModel = () => {
    const data = mode === "realtime" ? realTimeData : historicalData;
    const selectedData = realTimeData.selectedData
    if (mode === "historical" && !filters.dateRange) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="text-center p-6 bg-gray-50 rounded-lg border border-gray-200 max-w-md">
            <h3 className="text-lg font-medium text-gray-700 mb-2">No Date Selected</h3>
            <p className="text-gray-500">
              Please select a date range to view historical data for this tank.
            </p>
          </div>
        </div>
      );
    }

    if (mode === "historical" && historicalData === "loading") {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="text-center p-6 bg-gray-50 rounded-lg border border-gray-200 max-w-md">
            <Loader2 className="h-8 w-8 text-primary animate-spin mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-700 mb-2">Loading Data</h3>
            <p className="text-gray-500">
              Retrieving historical data for the selected time period...
            </p>
          </div>
        </div>
      );
    }
    
    if (mode === "historical" && error) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="text-center p-6 bg-gray-50 rounded-lg border border-gray-200 max-w-md">
            <h3 className="text-lg font-medium text-red-600 mb-2">Error Loading Data</h3>
            <p className="text-gray-500 mb-4">
              We couldn't retrieve the historical data. Please try again or select a different time period.
            </p>
            <Button
              onClick={fetchHistoricalData}
              className="bg-primary hover:bg-primary/90"
            >
              Try Again
            </Button>
          </div>
        </div>
      );
    }

    const selectTankDisplayType = (tankType, numberBlades) => {
      if (tankType === "horizontal" && numberBlades == 2) {
        return (
          <HorizontalTank2Blades
            encoderData={data?.encoderData}
            milkQuantityData={data?.milkQuantityData}
            switchStatus={data?.switchStatus}
            weightData={data?.weightData}
            tankTemperaturesData={data?.tankTemperaturesData}
            airQualityData={data?.airQualityData}
            selectedData={selectedData}
          />
        );
      } else if (tankType === "vertical") {
        return (
          <VerticalTank1Blade
            encoderData={data?.encoderData}
            milkQuantityData={data?.milkQuantityData}
            switchStatus={data?.switchStatus}
            weightData={data?.weightData}
            tankTemperaturesData={data?.tankTemperaturesData}
            airQualityData={data?.airQualityData}
            selectedData={selectedData}
          />
        );
      } else {
        return (
          <HorizontalTank1Blade
            encoderData={data?.encoderData}
            milkQuantityData={data?.milkQuantityData}
            switchStatus={data?.switchStatus}
            weightData={data?.weightData}
            tankTemperaturesData={data?.tankTemperaturesData}
            airQualityData={data?.airQualityData}
            selectedData={selectedData}
          />
        );
      }
    };
    
    return (
      <Canvas className="w-full h-full">
        <ambientLight intensity={0.6} />
        <directionalLight position={[-10, -10, -10]} intensity={0.5} />
        <Suspense fallback={null}>
          <group>
            {selectTankDisplayType(selectedTank?.display, selectedTank?.blades)}
          </group>
          <CameraSettings view={selectedData} />
        </Suspense>
      </Canvas>
    );
  };

  return (
    <div className="w-full h-full bg-white">
      {(mode === "realtime" ||
        (historicalData && historicalData !== "loading")) && (
        <>
          <div className="absolute top-4 left-4 z-10">
            <SelectedSensorData />
          </div>
          {/* <div className="absolute top-4 right-4 z-10">
            <AirQualityLegend
              particleCount={1000}
              humidity={10}
              temperature={20}
            />
          </div> */}
        </>
      )}
      {renderTankModel()}
    </div>
  );
};

export default TankModel;