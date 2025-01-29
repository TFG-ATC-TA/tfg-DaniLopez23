import { useState, useEffect, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import SensorData from "./SensorData/SensorData";
import TankStatus from "./TankStatus";
import TankInformation from "./TankInformation";
import SelectedSensorData from "./sensorData/SelectedSensorData";
import TimeSeriesSlider from "./TimeSeriesSlider";
import FilterComponent from "./FilterHistoricalData";
import CameraSettings from "./Camera/CameraSettings";
import { Model } from "./tank-models/HorizontalTank2Blades";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

import { getHistoricalData } from "@/services/farm";

import useTankStore from "@/Stores/useTankStore";
import { getBoardIdsFromTank } from "@/services/tank";
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

  const states = [
    { date: new Date("2025-01-24T09:00:00"), label: "Work Start" },
    { date: new Date("2025-01-24T12:30:00"), label: "Lunch Break" },
    { date: new Date("2025-01-24T17:00:00"), label: "Work End" },
    { date: new Date("2025-01-25T10:00:00"), label: "Weekend Project" },
    { date: new Date("2025-01-25T15:30:00"), label: "Exercise" },
    { date: new Date("2025-01-26T10:30:00"), label: "Working" },
    { date: new Date("2025-01-26T12:00:00"), label: "Working" },
    { date: new Date("2025-01-26T14:30:00"), label: "Meeting" },
    { date: new Date("2025-01-26T18:00:00"), label: "Working" },
    { date: new Date("2025-01-27T09:00:00"), label: "Work Start" },
    { date: new Date("2025-01-27T11:00:00"), label: "Meeting" },
    { date: new Date("2025-01-27T14:00:00"), label: "Meeting" },
    { date: new Date("2025-01-27T17:00:00"), label: "Work End" },
    { date: new Date("2025-01-28T09:00:00"), label: "Project Start" },
    { date: new Date("2025-01-28T12:30:00"), label: "Lunch Break" },
    { date: new Date("2025-01-28T17:30:00"), label: "Project End" },
    { date: new Date("2025-01-29T09:00:00"), label: "Work Start" },
    { date: new Date("2025-01-29T15:00:00"), label: "Presentation" },
    { date: new Date("2025-01-29T17:00:00"), label: "Work End" },
  ];

  const [historicalData, setHistoricalData] = useState(null);
  const { mode } = useFarmStore((state) => state);
  const { selectedTank } = useTankStore();

  const [filters, setFilters] = useState({
    dateRange: null,
    selectedStatus: "all",
    selectedSensor: "all",
    showAnomalous: false,
    timeSlider: 0,
  });

  const boardIds = getBoardIdsFromTank(selectedTank);

  useEffect(() => {
    if (mode === "historical" && filters.dateRange) {
      fetchHistoricalData();
    }
  }, [filters]);

  const fetchHistoricalData = async () => {
    try {
      const data = await getHistoricalData({
        dateRangeFrom: filters.dateRange.from.toISOString(),
        dateRangeTo: filters.dateRange.to.toISOString(),
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

    if (mode === "historical" && !filters.dateRange) {
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
    return `${hours.toString().padStart(2, "0")}:00`;
  };

  return selectedTank ? (
    <div className="flex h-screen overflow-hidden">
      <div className="w-64 bg-white shadow-md overflow-auto">
        <SensorData className="w-full" />
      </div>
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-shrink-0 p-4 pb-2 flex items-start gap-2">
          <div className="flex-grow">
            <TankInformation selectedTank={selectedTank} setFilters={setFilters} filters={filters}/>
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
            {mode === "historical" && filters.dateRange && (
              <div className="px-4 py-2">
                <TimeSeriesSlider
                  startDate={filters.dateRange.from}
                  endDate={filters.dateRange.to}
                  states={states}
                />
              </div>
            )}
          </div>
          {mode === "historical" && (
            <div className="w-80">
              <FilterComponent filters={filters} setFilters={setFilters}/>
            </div>
          )}
        </div>
      </div>
    </div>
  ) : (
    <div className="flex items-center justify-center h-full text-lg text-gray-500">
      No tank selected. Please select a tank to view its data.
    </div>
  );
};

export default DigitalTwin;
