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
    { date: new Date("2025-01-05T08:00:00"), label: "Work Start" },
    { date: new Date("2025-01-05T12:30:00"), label: "Lunch Break" },
    { date: new Date("2025-01-05T17:00:00"), label: "Work End" },
    { date: new Date("2025-01-06T09:00:00"), label: "Project Start" },
    { date: new Date("2025-01-06T13:00:00"), label: "Lunch Break" },
    { date: new Date("2025-01-06T17:30:00"), label: "Project End" },
    { date: new Date("2025-01-07T08:00:00"), label: "Work Start" },
    { date: new Date("2025-01-07T12:00:00"), label: "Meeting" },
    { date: new Date("2025-01-07T15:00:00"), label: "Work End" },
    { date: new Date("2025-01-08T09:30:00"), label: "Work Start" },
    { date: new Date("2025-01-08T12:30:00"), label: "Lunch Break" },
    { date: new Date("2025-01-08T16:30:00"), label: "Work End" },
    { date: new Date("2025-01-09T08:00:00"), label: "Project Start" },
    { date: new Date("2025-01-09T12:00:00"), label: "Lunch Break" },
    { date: new Date("2025-01-09T17:00:00"), label: "Project End" },
    { date: new Date("2025-01-10T08:30:00"), label: "Work Start" },
    { date: new Date("2025-01-10T13:00:00"), label: "Lunch Break" },
    { date: new Date("2025-01-10T17:00:00"), label: "Work End" },
    { date: new Date("2025-01-11T09:00:00"), label: "Project Start" },
    { date: new Date("2025-01-11T12:30:00"), label: "Lunch Break" },
    { date: new Date("2025-01-11T17:00:00"), label: "Project End" },
    { date: new Date("2025-01-12T08:30:00"), label: "Work Start" },
    { date: new Date("2025-01-12T12:00:00"), label: "Meeting" },
    { date: new Date("2025-01-12T16:00:00"), label: "Work End" },
    { date: new Date("2025-01-13T08:00:00"), label: "Work Start" },
    { date: new Date("2025-01-13T12:30:00"), label: "Lunch Break" },
    { date: new Date("2025-01-13T17:30:00"), label: "Work End" },
    { date: new Date("2025-01-14T08:30:00"), label: "Project Start" },
    { date: new Date("2025-01-14T12:00:00"), label: "Lunch Break" },
    { date: new Date("2025-01-14T17:00:00"), label: "Project End" },
    { date: new Date("2025-01-15T09:00:00"), label: "Work Start" },
    { date: new Date("2025-01-15T12:30:00"), label: "Lunch Break" },
    { date: new Date("2025-01-15T16:30:00"), label: "Work End" },
    { date: new Date("2025-01-16T09:30:00"), label: "Project Start" },
    { date: new Date("2025-01-16T12:00:00"), label: "Lunch Break" },
    { date: new Date("2025-01-16T17:30:00"), label: "Project End" },
    { date: new Date("2025-01-17T08:00:00"), label: "Work Start" },
    { date: new Date("2025-01-17T12:30:00"), label: "Lunch Break" },
    { date: new Date("2025-01-17T17:00:00"), label: "Work End" },
    { date: new Date("2025-01-18T09:00:00"), label: "Project Start" },
    { date: new Date("2025-01-18T12:00:00"), label: "Lunch Break" },
    { date: new Date("2025-01-18T17:30:00"), label: "Project End" },
    { date: new Date("2025-01-19T08:30:00"), label: "Work Start" },
    { date: new Date("2025-01-19T12:30:00"), label: "Lunch Break" },
    { date: new Date("2025-01-19T17:00:00"), label: "Work End" },
    { date: new Date("2025-01-20T09:00:00"), label: "Project Start" },
    { date: new Date("2025-01-20T12:00:00"), label: "Lunch Break" },
    { date: new Date("2025-01-20T17:30:00"), label: "Project End" },
    { date: new Date("2025-01-21T08:30:00"), label: "Work Start" },
    { date: new Date("2025-01-21T12:00:00"), label: "Lunch Break" },
    { date: new Date("2025-01-21T17:00:00"), label: "Work End" },
    { date: new Date("2025-01-22T09:00:00"), label: "Project Start" },
    { date: new Date("2025-01-22T12:30:00"), label: "Lunch Break" },
    { date: new Date("2025-01-22T17:00:00"), label: "Project End" },
    { date: new Date("2025-01-23T08:00:00"), label: "Work Start" },
    { date: new Date("2025-01-23T12:00:00"), label: "Lunch Break" },
    { date: new Date("2025-01-23T17:30:00"), label: "Work End" },
    { date: new Date("2025-01-24T08:00:00"), label: "Project Start" },
    { date: new Date("2025-01-24T12:30:00"), label: "Lunch Break" },
    { date: new Date("2025-01-24T17:00:00"), label: "Project End" }
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
