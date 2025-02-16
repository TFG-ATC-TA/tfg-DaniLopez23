import { useState, useEffect, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import SensorData from "./sensorData/SensorData";
import TankStatus from "./TankStatus";
import DataModeToggle from "./DataModeToogle";
import SelectedSensorData from "./sensorData/SelectedSensorData";
import TimeSeriesSlider from "./TimeSeriesSlider";
import FilterComponent from "./FilterHistoricalData";
import CameraSettings from "./camera/CameraSettings";
import { HorizontalTank2Blades } from "./tankModels/horizontal/HorizontalTank2Blades";
import { HorizontalTank1Blade } from "./tankModels/horizontal/HorizontalTank1Blade";
import { Button } from "./ui/button";
import { CalendarIcon, Activity, Sliders } from "lucide-react";
import { getHistoricalData } from "@/services/farm";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import useTankStore from "@/stores/useTankStore";
import { getBoardIdsFromTank } from "@/services/tank";
import useFarmStore from "@/stores/useFarmStore";
import { VerticalTank1Blade } from "./tankModels/vertical/VerticalTank1Blade";
import AirQualityLegend from "./sensorData/AirQualityLegend";

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
  const [isSensorsVisible, setIsSensorsVisible] = useState(true);
  const [isFiltersVisible, setIsFiltersVisible] = useState(true);
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
        const from = format(filters.dateRange.from, "d MMMM yyyy, EEEE HH:mm", {
          locale: es,
        });
        const to = format(filters.dateRange.to, "d MMMM yyyy, EEEE HH:mm", {
          locale: es,
        });
        return from === to ? from : `${from} - ${to}`;
      }
      return "Selecciona un rango de fechas";
    }
    return format(lastUpdate, "d MMMM yyyy, EEEE HH:mm", { locale: es });
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
            onClick={fetchHistoricalData}
            className="mt-2"
          >
            Try Again
          </Button>
        </div>
      );
    }

    const selectTankDisplayType = (tankType, numberBlades) => {
      console.log(tankType, numberBlades);
      if (tankType === "horizontal" && numberBlades == 2) {
        return (
          <HorizontalTank2Blades
            encoderData={data?.encoderData}
            milkQuantityData={data?.milkQuantityData}
            switchStatus={data?.switchStatus}
            weightData={data?.weightData}
            tankTemperaturesData={data?.tankTemperaturesData}
            airQualityData={data?.airQualityData}
            selectedData={data?.selectedData}
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
            selectedData={data?.selectedData}
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
            selectedData={data?.selectedData}
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
            {/* <HorizontalTank2Blades
              encoderData={data?.encoderData}
              milkQuantityData={data?.milkQuantityData}
              switchStatus={data?.switchStatus}
              weightData={data?.weightData}
              tankTemperaturesData={data?.tankTemperaturesData}
              airQualityData={data?.airQualityData}
              selectedData={data?.selectedData}
            /> */}
            {/* <HorizontalTank1Blade /> */}
            {/* <VerticalTank1Blade /> */}
            {selectTankDisplayType(selectedTank?.display, selectedTank?.blades)}
          </group>
          <CameraSettings view={data?.selectedData} />
        </Suspense>
      </Canvas>
    );
  };

  return selectedTank ? (
    <div className="flex h-screen overflow-hidden ">
      {isSensorsVisible ? (
        <div className="w-64 bg-background pt-1 shadow-lg border-r overflow-auto">
          <SensorData
            historicalData={historicalData}
            isRealTime={mode === "realtime"}
            onToggle={() => setIsSensorsVisible(false)}
          />
        </div>
      ) : (
        <div className="border-r p-2 flex items-start justify-center h-full">
          <Button
            variant="ghost"
            onClick={() => setIsSensorsVisible(true)}
            className="h-auto p-3 flex flex-col gap-2 text-primary hover:bg-primary/10"
          >
            <Activity className="h-5 w-5 rotate-90" />
            <span className="text-xs font-medium">Sensores</span>
          </Button>
        </div>
      )}

      <div className="flex-1 flex flex-col overflow-hidden ">
        <div className="flex items-center justify-between gap-1 p-4 bg-background shadow-sm border overflow-hidden">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-4 border-r pr-4">
              <div className="flex items-center justify-center bg-gray-300/70 p-2 rounded-full">
                <CalendarIcon className="text-gray-600 w-7 h-7" />
              </div>
              <p className="text-lg font-semibold text-gray-700 capitalize">
                {getDisplayDate()}
              </p>
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
            <div className="relative w-full h-full">
              {(mode === "realtime" ||
                (historicalData && historicalData != "loading")) && (
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
            {/* 
            {mode === "historical" &&
              filters.dateRange &&(
                <div className="px-4 py-3 border-t">
                  <TimeSeriesSlider
                    startDate={filters.dateRange.from}
                    endDate={filters.dateRange.to}
                    states={states}
                  />
                </div>
              )} */}
          </div>

          {mode === "historical" && isFiltersVisible ? (
            <div className="w-80 overflow-hidden flex flex-col">
              <FilterComponent
                filters={filters}
                setFilters={setFilters}
                onToggle={() => setIsFiltersVisible(false)}
              />
            </div>
          ) : mode === "historical" ? (
            <div className="p-2 flex items-start justify-center h-full">
              <Button
                variant="ghost"
                onClick={() => setIsFiltersVisible(true)}
                className="h-auto p-3 flex flex-col gap-2 text-primary hover:bg-primary/10"
              >
                <Sliders className="h-5 w-5 rotate-90" />
                <span className="text-xs font-medium">Filtros</span>
              </Button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  ) : (
    <div className="flex items-center justify-center h-full text-lg text-muted-foreground">
      <p>No tank selected</p>
    </div>
  );
};

export default DigitalTwin;
