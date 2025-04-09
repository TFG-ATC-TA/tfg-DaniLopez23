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
import { Loader2 } from "lucide-react"
import useTankStates from "@/hooks/useTankStates"

const DigitalTwin = () => {
  const { selectedFarm } = useFarmStore((state) => state)
  const { filters, mode, setMode, setFilters } = useAppDataStore((state) => state)
  const { selectedTank } = useTankStore()
  const [prevDateRange, setPrevDateRange] = useState(null)
  const [prevSelectedDate, setPrevSelectedDate] = useState(null)
  const [selectedTime, setSelectedTime] = useState(null)
  const [isSensorsVisible, setIsSensorsVisible] = useState(true)
  const [isFiltersVisible, setIsFiltersVisible] = useState(true)
  const boardIds = getBoardIdsFromTank(selectedTank)

  // LOGICA FETCH ESTADOS TANQUES
  const { tankStates, tankStatesLoading, tankStatesError, fetchTankStates, retryFetchTankStates } = useTankStates({
    filters,
    boardIds,
    selectedFarm,
    selectedTank,
  })

  // Efecto para hacer fetch cuando cambia selectedDate
  useEffect(() => {
    if (mode === "historical" && filters.selectedDate) {
      const currentSelectedDate = filters.selectedDate?.getTime()
      const prevDate = prevSelectedDate?.getTime()

      // Solo si la fecha seleccionada ha cambiado realmente o es la primera carga
      if (currentSelectedDate !== prevDate) {
        fetchTankStates()
        setPrevSelectedDate(filters.selectedDate)
      }
    }
  

  }, [filters.selectedDate, fetchTankStates, mode, prevSelectedDate])

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

  // Handler for time selection from the slider
  const handleTimeSelectionChange = (timeString) => {
    setSelectedTime(timeString)
  }

  if (!selectedTank) {
    return (
      <div className="flex items-center justify-center h-full text-lg text-muted-foreground">
        <p>No tank selected</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Barra superior con TankDate, DataModeToggle y TankStatus */}
      <div className="flex flex-wrap md:flex-nowrap gap-2 p-2 z-10">
        {/* DataModeToggle y TankStatus mantienen su tamaño hasta que no quepan */}
        <div className="w-[220px] min-w-[220px] order-2 md:order-2">
          <DataModeToggle
            isRealTime={mode === "realtime"}
            onToggle={() => setMode(mode === "realtime" ? "historical" : "realtime")}
          />
        </div>

        <div className="w-[220px] min-w-[220px] order-3 md:order-3">
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
        <div className={isSensorsVisible ? "block" : "hidden"}>
          <SensorDataTab
            mode={mode}
            boardIds={boardIds}
            selectedFarm={selectedFarm}
            onToggleVisibility={(visible) => setIsSensorsVisible(visible)}
            selectedTime={selectedTime}
          />
        </div>

        {/* Botón para mostrar sensores cuando están ocultos */}
        {!isSensorsVisible && (
          <div className="absolute left-0 top-1/4 z-30">
            <button
              onClick={() => setIsSensorsVisible(true)}
              className="h-auto py-3 px-2 rounded-l-none shadow-md flex flex-col gap-2 bg-white border border-l-0 text-primary"
            >
              <span className="text-xs font-medium">Sensores</span>
            </button>
          </div>
        )}

        {/* Modelo 3D (centro) */}
        <div className="flex-1 flex flex-col bg-white rounded-lg shadow-sm overflow-hidden m-1">
          <div className="flex-1 relative">
            <TankModel
              mode={mode}
              filters={filters}
              boardIds={boardIds}
              selectedFarm={selectedFarm}
              selectedTime={selectedTime}
              onTimeSelected={handleTimeSelectionChange}
            />
          </div>

          {/* Time Series Slider Container - Always visible in historical mode with date range */}
          {mode === "historical" && filters.dateRange && (
            <div className="px-4 py-3 border-t bg-gray-50 min-h-[140px]">
              {tankStatesLoading ? (
                <div className="flex items-center justify-center h-[100px]">
                  <Loader2 className="h-5 w-5 animate-spin text-primary mr-2" />
                  <span className="text-sm text-muted-foreground">Loading tank states...</span>
                </div>
              ) : tankStatesError ? (
                <div className="flex items-center justify-center h-[100px]">
                  <div className="text-center">
                    <p className="text-sm text-red-500 mb-2">Error loading tank states</p>
                    <button
                      onClick={retryFetchTankStates}
                      className="px-3 py-1 text-sm bg-primary text-white rounded-md hover:bg-primary/90"
                    >
                      Try Again
                    </button>
                  </div>
                </div>
              ) : tankStates ? (
                <TimeSeriesSlider
                  startDate={filters.dateRange.from}
                  endDate={filters.dateRange.to}
                  tankStateData={tankStates}
                  onTimeSelected={handleTimeSelectionChange}
                />
              ) : (
                <div className="h-[100px]">
                  <div className="text-center mb-2">
                    <p className="text-sm text-muted-foreground">No tank state data available for the selected date</p>
                  </div>
                  <TimeSeriesSlider
                    startDate={filters.dateRange.from}
                    endDate={filters.dateRange.to}
                    onTimeSelected={handleTimeSelectionChange}
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Panel de filtros históricos (a la derecha) */}
        <div className={mode === "historical" && isFiltersVisible ? "block" : "hidden"}>
          <HistoricalDataFilter onToggleVisibility={(visible) => setIsFiltersVisible(visible)} />
        </div>

        {/* Botón para mostrar filtros cuando están ocultos */}
        {mode === "historical" && !isFiltersVisible && (
          <div className="absolute right-0 top-1/4 z-30">
            <button
              onClick={() => setIsFiltersVisible(true)}
              className="h-auto py-3 px-2 rounded-r-none shadow-md flex flex-col gap-2 bg-white border border-r-0 text-primary"
            >
              <span className="text-xs font-medium">Filtros</span>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default DigitalTwin
