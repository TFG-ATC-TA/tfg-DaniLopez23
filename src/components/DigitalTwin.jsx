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
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { CalendarIcon } from "lucide-react";
import { getHistoricalData } from "@/services/farm";
import { format } from "date-fns";
import { es } from "date-fns/locale";
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
    /* ... tus estados existentes ... */
  ];

  const [historicalData, setHistoricalData] = useState(null);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(new Date());

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

  const getDisplayDate = () => {
    if (mode === "historical") {
      if (filters.dateRange) {
        const from = format(filters.dateRange.from, "d 'de' MMMM yyyy", { locale: es });
        const to = format(filters.dateRange.to, "d 'de' MMMM yyyy", { locale: es });
        return from === to ? from : `${from} - ${to}`;
      }
      return "Selecciona un rango de fechas";
    }
    return format(lastUpdate, "d 'de' MMMM yyyy, HH:mm:ss", { locale: es });
  };


  const formattedDate = format(Date.now(), "d 'de' MMMM yyyy, EEEE HH:mm", { locale: es });

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
            onClick={fetchHistoricalData}
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
    <div className="flex h-screen overflow-hidden ">
      <div className="w-64 bg-background pt-1 shadow-lg border-r overflow-auto">
        <SensorData />
      </div>

      <div className="flex-1 flex flex-col overflow-hidden ">
        <div className="flex items-center justify-between gap-1 p-4 bg-background shadow-sm border overflow-hidden">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-4">
              <Card className="w-90 shadow-sm rounded-2xl">
                <CardContent className="flex items-center justify-start gap-3 p-5">
                  <div className="flex items-center justify-center bg-gray-300/70 p-2 rounded-full">
                    <CalendarIcon className="text-gray-600 w-7 h-7" />
                  </div>
                  <p className="text-lg font-semibold text-gray-700 capitalize">
                    {formattedDate}
                  </p>
                </CardContent>
              </Card>
            </div>

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

        <div className="flex-1 flex overflow-hidden gap-1 p-0 h-[calc(100vh-140px)]">
          <div className="flex-1 flex flex-col bg-background shadow-sm border overflow-hidden">
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

          {mode === "historical" && (
            <div className="w-80 bg-background overflow-hidden flex flex-col">
              <FilterComponent 
                filters={filters} 
                setFilters={setFilters}  // Añade padding interno consistente
              />
            </div>)}
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
