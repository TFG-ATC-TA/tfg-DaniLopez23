"use client"

import { useState, useEffect } from "react"
import SensorDataTab from "./sensorData/SensorDataTab"
import TankDate from "./TankDate"
import TankStatus from "./TankStatus"
import DataModeToggle from "./DataModeToogle"
import TimeSeriesSlider from "./TimeSeriesSlider"
import TankModel from "./TankModel"
import HistoricalDataFilter from "./HistoricalDataFilter"
import { getBoardIdsFromTank } from "@/services/tank"
import useAppDataStore from "@/stores/useAppDataStore"
import useFarmStore from "@/stores/useFarmStore"
import useTankStore from "@/stores/useTankStore"
import useDataStore from "@/stores/useDataStore"
import { Loader2 } from "lucide-react"
import useHistoricalData from "@/hooks/useHistoricalData"
import useTankStates from "@/hooks/useTankStates"

const DigitalTwin = () => {
  const {
    encoderData,
    milkQuantityData,
    switchStatus,
    weightData,
    tankTemperaturesData,
    airQualityData,
    selectedData,
    gyroscopeData,
  } = useDataStore((state) => state)

  const realTimeData = {
    encoderData,
    milkQuantityData,
    switchStatus,
    weightData,
    tankTemperaturesData,
    airQualityData,
    selectedData,
    gyroscopeData,
  }

  const { selectedFarm } = useFarmStore((state) => state)
  const { filters, mode, setMode, setFilters } = useAppDataStore((state) => state)
  const { selectedTank } = useTankStore()
  const [prevDateRange, setPrevDateRange] = useState(null)
  const [prevSelectedDate, setPrevSelectedDate] = useState(null)
  const [selectedTime, setSelectedTime] = useState(null)
  const [isSensorsVisible, setIsSensorsVisible] = useState(true)
  const [isFiltersVisible, setIsFiltersVisible] = useState(true)

  const boardIds = getBoardIdsFromTank(selectedTank)

  // LOGICA FETCH DATOS HISTORICOS
  const { historicalData, selectedHistoricalData, error, fetchHistoricalData, handleTimeSelected } = useHistoricalData({
    filters,
    boardIds,
    selectedFarm,
    selectedTime,
  })

  // LOGICA FETCH ESTADOS TANQUES
  const { tankStates, tankStatesLoading, tankStatesError, fetchTankStates, retryFetchTankStates } = useTankStates({
    filters,
    boardIds,
    selectedFarm,
    selectedTank,
  })

  // Show the time series slider if:
  // 1. We're in historical mode
  // 2. We have a date range selected
  // 3. Historical data is available and not in a loading or error state
  const shouldShowTimeSeriesSlider =
    mode === "historical" && filters.dateRange && historicalData && historicalData !== "loading" && !error

  // Efecto para hacer fetch cuando cambia selectedDate
  useEffect(() => {
    if (mode === "historical" && filters.selectedDate) {
      const currentSelectedDate = filters.selectedDate?.getTime()
      const prevDate = prevSelectedDate?.getTime()

      // Solo si la fecha seleccionada ha cambiado realmente o es la primera carga
      if (currentSelectedDate !== prevDate) {
        fetchHistoricalData()
        fetchTankStates()
        setPrevSelectedDate(filters.selectedDate)
      }
    }
  }, [filters.selectedDate, fetchHistoricalData, fetchTankStates, mode, prevSelectedDate])

  // Efecto para detectar cambios en el rango de fechas
  useEffect(() => {
    if (mode === "historical" && filters.dateRange) {
      const currentRangeFrom = filters.dateRange.from?.getTime()
      const prevRangeFrom = prevDateRange?.from?.getTime()

      // Solo si el rango ha cambiado realmente
      if (currentRangeFrom !== prevRangeFrom) {
        // Si no hay selectedDate o si selectedDate no está dentro del nuevo rango,
        // establecer selectedDate al primer día del rango
        if (
          !filters.selectedDate ||
          filters.selectedDate.getTime() < filters.dateRange.from.getTime() ||
          filters.selectedDate.getTime() > filters.dateRange.to.getTime()
        ) {
          setFilters({
            ...filters,
            selectedDate: filters.dateRange.from,
          })
        }

        setPrevDateRange(filters.dateRange)
      }
    }
  }, [mode, filters.dateRange, prevDateRange, setFilters, filters])

  if (!selectedTank) {
    return (
      <div className="flex items-center justify-center h-full text-lg text-muted-foreground">
        <p>No tank selected</p>
      </div>
    )
  }

  // Verificar si los paneles laterales están visibles
  const isSensorTabVisible = document.querySelector('[data-sensor-tab="visible"]') !== null
  const isFilterTabVisible = mode === "historical" && document.querySelector('[data-filter-tab="visible"]') !== null

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Barra superior con TankDate, DataModeToggle y TankStatus */}
      <div className="flex flex-wrap md:flex-nowrap gap-2 p-2 z-10">
        {/* DataModeToggle y TankStatus mantienen su tamaño hasta que no quepan */}
        <div className="w-[200px] min-w-[200px] order-2 md:order-2">
          <DataModeToggle
            isRealTime={mode === "realtime"}
            onToggle={() => setMode(mode === "realtime" ? "historical" : "realtime")}
          />
        </div>

        <div className="w-[200px] min-w-[200px] order-3 md:order-3">
          <TankStatus isRealTime={mode === "realtime"} />
        </div>

        {/* TankDate es el primero en encogerse */}
        <div className="w-full md:flex-1 order-1 md:order-1">
          <TankDate mode={mode} filters={filters} />
        </div>
      </div>

      {/* Contenedor principal del modelo y paneles laterales */}
      <div className="flex-1 flex overflow-hidden">
        {/* Panel de sensores (a la izquierda) */}
        <div data-sensor-tab={isSensorTabVisible ? "visible" : "hidden"}>
          <SensorDataTab
            mode={mode}
            historicalData={selectedHistoricalData || historicalData}
            isLoading={mode === "historical" && historicalData === "loading"}
            error={error}
          />
        </div>

        {/* Modelo 3D (centro) */}
        <div className="flex-1 flex flex-col bg-white rounded-lg shadow-sm overflow-hidden m-1">
          <div className="flex-1 relative">
            <TankModel
              mode={mode}
              realTimeData={realTimeData}
              historicalData={selectedHistoricalData || historicalData}
              filters={filters}
              error={error}
              fetchHistoricalData={fetchHistoricalData}
            />
          </div>

          {shouldShowTimeSeriesSlider && (
            <div className="px-4 py-3 border-t bg-gray-50">
              {tankStatesLoading ? (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="h-5 w-5 animate-spin text-primary mr-2" />
                  <span className="text-sm text-muted-foreground">Loading tank states...</span>
                </div>
              ) : tankStates ? (
                <TimeSeriesSlider
                  startDate={filters.dateRange.from}
                  endDate={filters.dateRange.to}
                  tankStateData={tankStates}
                  onTimeSelected={handleTimeSelected}
                />
              ) : (
                <div className="flex items-center justify-center py-4">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-2">
                      No tank state data available for the selected date
                    </p>
                    <TimeSeriesSlider
                      startDate={filters.dateRange.from}
                      endDate={filters.dateRange.to}
                      onTimeSelected={handleTimeSelected}
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Panel de filtros históricos (a la derecha) */}
        <div data-filter-tab={isFiltersVisible ? "visible" : "hidden"}>
          <HistoricalDataFilter />
        </div>
      </div>
    </div>
  )
}

export default DigitalTwin

