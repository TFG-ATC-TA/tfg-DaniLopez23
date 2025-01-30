import { useState, useEffect, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import SensorData from "./SensorData/SensorData";
import TankStatus from "./TankStatus";
import DataModeToggle from "./DataModeToogle";
import SelectedSensorData from "./sensorData/SelectedSensorData";
import TimeSeriesSlider from "./TimeSeriesSlider";
import FilterComponent from "./FilterHistoricalData";
import CameraSettings from "./Camera/CameraSettings";
import { Model } from "./tank-models/HorizontalTank2Blades";
import { OrbitControls } from "@react-three/drei";
import { Button } from "./ui/button";

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
    { date: new Date("2025-01-24T17:00:00"), label: "Project End" },
  ];

  const [historicalData, setHistoricalData] = useState(null);
  const [error, setError] = useState(null);

  const { mode, setMode } = useFarmStore((state) => state);
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
      setHistoricalData("loading");
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
      setHistoricalData(null);
      setError(error);
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

    if (mode === "historical" && historicalData === "loading") {
      return (
        <div className="flex items-center justify-center h-full text-lg text-gray-500">
          Loading historical data...
        </div>
      );
    }

    if (mode === "historical" && error) {
      return (
        <div className="flex flex-col items-center justify-center h-full p-4 text-center">
          <p className="text-lg text-gray-500 mb-4">
            Error loading historical data. Please try again later.
          </p>
          <Button
            variant="outline"
            onClick={fetchHistoricalData} // Asegúrate de implementar la función fetchData
            className="mt-2"
          >
            Try Again
          </Button>
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

  return selectedTank ? (
    <div className="flex h-screen overflow-hidden bg-muted/40">
      <div className="w-64 bg-background shadow-lg border-r overflow-auto">
        <SensorData />
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header section - modificado */}
        <div className="flex items-center justify-between p-4 bg-background border-b">
          <div className="flex items-center gap-4">
            <DataModeToggle
              isRealTime={mode === "realtime"}
              onToggle={() =>
                setMode(mode === "realtime" ? "historical" : "realtime")
              }
              className="bg-background shadow-sm border"
            />
          </div>
          <TankStatus />
        </div>

        {/* Main content - modificado */}
        <div className="flex-1 flex overflow-hidden gap-1 p-2 pt-0 h-[calc(100vh-140px)]">
          {/* Model container - modificado */}
          <div className="flex-1 flex flex-col bg-background rounded-xl shadow-sm border overflow-hidden">
            <TankModelLayout className="flex-1">
              {renderTankModel()}
            </TankModelLayout>

            {mode === "historical" &&
              filters.dateRange &&
              historicalData != "loading" &&
              !error && (
                <div className="px-4 py-3 border-t">
                  <TimeSeriesSlider
                    startDate={filters.dateRange.from}
                    endDate={filters.dateRange.to}
                    states={states}
                  />
                </div>
              )}
          </div>

          {/* Filters panel - modificado */}
          {mode === "historical" && (
            <div className="w-96 bg-background rounded-xl shadow-sm border overflow-hidden flex flex-col">
              <FilterComponent filters={filters} setFilters={setFilters} />
            </div>
          )}
        </div>
      </div>
    </div>
  ) : (
    <div className="flex items-center justify-center h-full text-lg text-muted-foreground">
      <div className="flex items-center gap-2">
        <span className="text-2xl">⛽</span>
        <p>No tank selected</p>
      </div>
    </div>
  );
};

export default DigitalTwin;
