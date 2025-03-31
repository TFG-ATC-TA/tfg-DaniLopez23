"use client"

import { useState, useEffect } from "react"
import SensorDataTab from "./sensorData/SensorDataTab"
import TankDate from "./TankDate"
import TankStatus from "./TankStatus"
import DataModeToggle from "./DataModeToogle"
import TimeSeriesSlider from "./TimeSeriesSlider"

import TankModel from "./TankModel"
import HistoricalDataFilter from "./HistoricalDataFilter"
import { getHistoricalData } from "@/services/farm"
import { getBoardIdsFromTank } from "@/services/tank"
import useAppDataStore from "@/stores/useAppDataStore"
import useFarmStore from "@/stores/useFarmStore"
import useTankStore from "@/stores/useTankStore"
import useDataStore from "@/stores/useDataStore"

const DigitalTwin = () => {
  const {
    encoderData,
    milkQuantityData,
    switchStatus,
    weightData,
    tankTemperaturesData,
    airQualityData,
    selectedData,
  } = useDataStore((state) => state)

  const realTimeData = {
    encoderData,
    milkQuantityData,
    switchStatus,
    weightData,
    tankTemperaturesData,
    airQualityData,
    selectedData,
  }

  const [historicalData, setHistoricalData] = useState(null)
  const [error, setError] = useState(null)
  const { selectedFarm } = useFarmStore((state) => state)
  const { filters, mode, setMode } = useAppDataStore((state) => state)
  const { selectedTank } = useTankStore()

  const states = []
  const boardIds = getBoardIdsFromTank(selectedTank)

  const isHistoricalDataFethed = mode === "historical" && filters.dateRange
  // historicalData != "loading" && ADD THIS FOR CORRECT BEHAVIOR
  //!error;

  useEffect(() => {
    if (mode === "historical" && filters.dateRange) {
      fetchHistoricalData()
    }
  }, [filters])

  const fetchHistoricalData = async () => {
    try {
      console.log("Sending filters:", {
        dateRangeFrom: filters.dateRange.from.toISOString(),
        dateRangeTo: filters.dateRange.to.toISOString(),
        boardIds: boardIds,
        farm: selectedFarm.broker,
      });
  
      setHistoricalData("loading");
      const data = await getHistoricalData({
        dateRangeFrom: filters.dateRange.from.toISOString(),
        dateRangeTo: filters.dateRange.to.toISOString(),
        boardIds: boardIds,
        farm: selectedFarm.broker,
      });
      setError(null);
      setHistoricalData(data);
    } catch (error) {
      console.error("Error fetching historical data:", error);
      setHistoricalData(null);
      setError(error);
    }
  };

  return selectedTank ? (
    <div className="flex h-screen overflow-hidden">
      <SensorDataTab mode={mode} historicalData={historicalData} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex flex-wrap md:flex-nowrap gap-1 p-1">
          <div className="flex-grow min-w-[240px] bg-white rounded-lg shadow-sm">
            <TankDate mode={mode} filters={filters} />
          </div>

          <div className="flex-shrink-0 bg-white rounded-lg shadow-sm">
            <DataModeToggle
              isRealTime={mode === "realtime"}
              onToggle={() => setMode(mode === "realtime" ? "historical" : "realtime")}
            />
          </div>

          <div className="flex-shrink-0 bg-white rounded-lg shadow-sm">
            <TankStatus isRealTime={mode === "realtime"} />
          </div>
        </div>

        <div className="flex-1 flex overflow-hidden">
          <div className="flex-1 flex flex-col bg-white rounded-lg shadow-sm overflow-hidden mr-1 ml-1">
            <div className="flex-1 relative">
              <TankModel
                mode={mode}
                realTimeData={realTimeData}
                historicalData={historicalData}
                filters={filters}
                error={error}
                fetchHistoricalData={fetchHistoricalData}
              />
            </div>

            {isHistoricalDataFethed && (
              <div className="px-4 py-3 border-t bg-gray-50">
                <TimeSeriesSlider startDate={filters.dateRange.from} endDate={filters.dateRange.to} states={states} />
              </div>
            )}
          </div>
          <HistoricalDataFilter />
        </div>
      </div>
    </div>
  ) : (
    <div className="flex items-center justify-center h-full text-lg text-muted-foreground">
      <p>No tank selected</p>
    </div>
  )
}

export default DigitalTwin

