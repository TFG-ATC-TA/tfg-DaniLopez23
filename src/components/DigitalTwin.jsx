import { useState, useEffect, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import SensorData from "./SensorData/SensorData";
import TankStatus from "./TankStatus";
import TankInformation from "./TankInformation";
import SelectedSensorData from "./sensorData/SelectedSensorData";
import FilterComponent from "./FilterHistoricalData";
import CameraSettings from "./Camera/CameraSettings";
import { Model } from "./tank-models/HorizontalTank2Blades";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

import { getHistoricalData } from "@/services/farm";

import useTankStore from '@/Stores/useTankStore';
import { getBoardIdsFromTank } from '@/services/tank';
import useFarmStore from "@/Stores/useFarmStore";

const TankModelLayout = ({ children }) => {
  return (
    <div className="relative w-full h-full">
      <div className="absolute top-4 left-4 z-10">
        <SelectedSensorData />
      </div>
      {children}
    </div>
  );
};

const DigitalTwin = ({
  encoderData,
  milkQuantityData,
  switchStatus,
  weightData,
  tankTemperaturesData,
  airQualityData,
  selectedData,
}) => {
  
  const realTimeData = {
    encoderData,
    milkQuantityData,
    switchStatus,
    weightData,
    tankTemperaturesData,
    airQualityData,
    selectedData,
  };

  const [historicalData, setHistoricalData] = useState(null);
  const { mode } = useFarmStore((state) => state);
  const { selectedTank } = useTankStore();

  const [filters, setFilters] = useState({
    selectedStatus: "all",
    selectedSensor: "all",
    showAnomalous: false,
    timeSlider: 0,
  });


  const boardIds = getBoardIdsFromTank(selectedTank);

  useEffect(() => {
    if (mode === "historical" && filters.date) {
      fetchHistoricalData();
    }
  }, [filters]);

  const fetchHistoricalData = async () => {
    try {
      const data = await getHistoricalData({
        date: new Date(Date.UTC(filters.date.getFullYear(), filters.date.getMonth(), filters.date.getDate())),
        boardIds: boardIds,
        status: filters.selectedStatus,
        sensor: filters.selectedSensor,
        showAnomalous: filters.showAnomalous,
        hour: filters.timeSlider,
        tankId: selectedTank?._id,
      });
      setHistoricalData(data);
    } catch (error) {
      console.error("Error fetching historical data:", error);
    }
  };

  const renderTankModel = () => {
    const data = mode === "realtime" ? realTimeData : historicalData;

    if (mode === "historical" && !filters.date) {
      return (
        <div className="flex items-center justify-center h-full text-lg text-gray-500">
          Select a date to view historical data
        </div>
      );
    }

    return (
      <Canvas className="w-full h-full">
        <ambientLight intensity={0.6} />
        <directionalLight position={[-10, -10, -10]} intensity={0.5} />
        <Suspense fallback={null}>
          <group>
            <Model
              encoderData={data?.encoderData}
              milkQuantityData={data?.milkQuantityData}
              switchStatus={data?.switchStatus}
              weightData={data?.weightData}
              tankTemperaturesData={data?.tankTemperaturesData}
              airQualityData={data?.airQualityData}
              selectedData={data?.selectedData}
            />
          </group>
          <CameraSettings view={data?.selectedData} />
        </Suspense>
      </Canvas>
    );
  };

  const formatTime = (value) => {
    const hours = value;
    return `${hours.toString().padStart(2, '0')}:00`;
  };
  return (
    selectedTank ? (
      <div className="flex h-screen overflow-hidden">
        <div className="w-64 bg-white shadow-md overflow-auto">
          <SensorData className="w-full" />
        </div>
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-shrink-0 p-4 pb-2 flex items-start gap-2">
            <div className="flex-grow">
              <TankInformation selectedTank={selectedTank} />
            </div>
            <div className="w-80">
              <TankStatus />
            </div>
          </div>
          <div className="flex-1 flex overflow-hidden">
            <div className="flex-1 flex flex-col">
              <TankModelLayout className="flex-1">
                {renderTankModel()}
              </TankModelLayout>
              {mode === "historical" && filters.date && (
                <div className="px-4 py-2">
                  <Label
                    htmlFor="time-slider"
                    className="block text-sm font-medium mb-1"
                  >
                    Time: {formatTime(filters.timeSlider)}
                  </Label>
                  <Slider
                    id="time-slider"
                    min={0}
                    max={23}
                    step={1}
                    value={[filters.timeSlider]}
                    onValueChange={(value) =>
                      setFilters((prev) => ({ ...prev, timeSlider: value[0] }))
                    }
                  />
                </div>
              )}
            </div>
            {mode === "historical" && (
              <div className="w-80 flex flex-col h-full">
                <div className="flex-1 overflow-hidden">
                  <FilterComponent filters={filters} setFilters={setFilters} />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    ) : (
      <div className="flex items-center justify-center h-full text-lg text-gray-500">
        No tank selected. Please select a tank to view its data.
      </div>
    )
  );
};

export default DigitalTwin;