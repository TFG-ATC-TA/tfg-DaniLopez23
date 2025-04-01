"use client"

import { useState, useEffect, useCallback, useRef } from "react"
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
  const { filters, mode, setMode, setFilters } = useAppDataStore((state) => state)
  const { selectedTank } = useTankStore()
  const [prevDateRange, setPrevDateRange] = useState(null)
  const [prevSelectedDate, setPrevSelectedDate] = useState(null)
  const isInitialMount = useRef(true)

  const states = []
  const boardIds = getBoardIdsFromTank(selectedTank)

  const isHistoricalDataFethed = mode === "historical" && filters.dateRange && historicalData != "loading" && !error;

  const fetchHistoricalData = useCallback(async () => {
    try {
      // Determinar la fecha a usar (selectedDate o el primer día del rango)
      const dateToUse = filters.selectedDate || (filters.dateRange ? filters.dateRange.from : null);
      
      if (!dateToUse) {
        console.warn("No date available for fetching historical data");
        return;
      }
      
      console.log("Sending filters:", {
        selectedDate: dateToUse,
        boardIds: boardIds,
        farm: selectedFarm.broker,
      });
  
      setHistoricalData("loading");
      const data = await getHistoricalData({
        date: dateToUse,
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
  }, [filters.selectedDate, filters.dateRange, boardIds, selectedFarm?.broker]);
  
  // Efecto para detectar cambios en el rango de fechas
  useEffect(() => {
    // Evitar la ejecución en el montaje inicial
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    
    if (mode === "historical" && filters.dateRange) {
      const currentRangeFrom = filters.dateRange.from?.getTime();
      const prevRangeFrom = prevDateRange?.from?.getTime();
      
      // Solo si el rango ha cambiado realmente
      if (currentRangeFrom !== prevRangeFrom) {
        // Si no hay selectedDate o si selectedDate no está dentro del nuevo rango,
        // establecer selectedDate al primer día del rango
        if (!filters.selectedDate || 
            filters.selectedDate.getTime() < filters.dateRange.from.getTime() ||
            filters.selectedDate.getTime() > filters.dateRange.to.getTime()) {
          
          console.log("Setting selectedDate to first day of range");
          setFilters({
            ...filters,
            selectedDate: filters.dateRange.from
          });
        }
        
        setPrevDateRange(filters.dateRange);
      }
    }
  }, [mode, filters.dateRange, prevDateRange, setFilters, filters]);
  
  // Efecto para hacer fetch cuando cambia selectedDate
  useEffect(() => {
    if (mode === "historical" && filters.selectedDate) {
      const currentSelectedDate = filters.selectedDate?.getTime();
      const prevDate = prevSelectedDate?.getTime();
      
      // Solo si la fecha seleccionada ha cambiado realmente o es la primera carga
      if (currentSelectedDate !== prevDate || isInitialMount.current) {
        console.log("Selected date changed, fetching data");
        fetchHistoricalData();
        setPrevSelectedDate(filters.selectedDate);
        
        if (isInitialMount.current) {
          isInitialMount.current = false;
        }
      }
    }
  }, [filters.selectedDate, fetchHistoricalData, mode, prevSelectedDate]);

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