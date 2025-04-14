"use client"

import { useEffect, useState, useRef } from "react"
import { Canvas } from "@react-three/fiber"
import useTankStore from "@/stores/useTankStore"
import SelectedSensorData from "./sensorData/SelectedSensorData"
import CameraSettings from "./camera/CameraSettings"
import { HorizontalTank2Blades } from "./tankModels/horizontal/HorizontalTank2Blades"
import { HorizontalTank1Blade } from "./tankModels/horizontal/HorizontalTank1Blade"
import { VerticalTank1Blade } from "./tankModels/vertical/VerticalTank1Blade"
import { Button } from "./ui/button"
import { Suspense } from "react"
import { Loader2 } from "lucide-react"
import useDataStore from "@/stores/useDataStore"
import CameraControlButtons from "./camera/CameraControlButtons"

const TankModel = ({
  mode,
  filters,
  selectedTime,
  handleTimeSelected,
  selectedHistoricalData,
  historicalData,
  error,
  fetchHistoricalData,
}) => {
  const { selectedTank } = useTankStore((state) => state)
  const [currentView, setCurrentView] = useState("default")
  const [isFullscreen, setIsFullscreen] = useState(false)
  const tankContainerRef = useRef(null)

  // Get real-time data directly in this component
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

  // Organize real-time data
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

  // Log when selectedTime changes
  useEffect(() => {
    if (selectedTime) {
      handleTimeSelected(selectedTime)
    }
  }, [selectedTime, handleTimeSelected])

  // Sincronizar la vista con selectedData
  useEffect(() => {
    if (selectedData) {
      // Cambiar la vista basada en selectedData
      setCurrentView(selectedData)
    } else {
      setCurrentView("default")
    }
  }, [selectedData])

  const handleViewChange = (view) => {
    setCurrentView(view) // Actualizar la vista desde los botones
  }

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  // Use the appropriate data source based on mode
  const data = mode === "realtime" ? realTimeData : selectedHistoricalData || historicalData
  console.log("TankModel: Data being used", data)

  const renderTankModel = () => {
    // Case 1: Historical mode but no date range selected
    if (mode === "historical" && !filters.dateRange) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="text-center p-6 bg-gray-50 rounded-lg border border-gray-200 max-w-md">
            <h3 className="text-lg font-medium text-gray-700 mb-2">No Date Selected</h3>
            <p className="text-gray-500">Please select a date range to view historical data for this tank.</p>
          </div>
        </div>
      )
    }

    // Case 2: Historical mode and data is loading
    if (mode === "historical" && historicalData === "loading") {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="text-center p-6 bg-gray-50 rounded-lg border border-gray-200 max-w-md">
            <Loader2 className="h-8 w-8 text-primary animate-spin mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-700 mb-2">Loading Data</h3>
            <p className="text-gray-500">Retrieving historical data for the selected time period...</p>
          </div>
        </div>
      )
    }

    // Case 3: Historical mode and there was an error
    if (mode === "historical" && error) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="text-center p-6 bg-gray-50 rounded-lg border border-gray-200 max-w-md">
            <h3 className="text-lg font-medium text-red-600 mb-2">Error Loading Data</h3>
            <p className="text-gray-500 mb-4">
              We could not retrieve the historical data. Please try again or select a different time period.
            </p>
            <Button onClick={fetchHistoricalData} className="bg-primary hover:bg-primary/90">
              Try Again
            </Button>
          </div>
        </div>
      )
    }

    // Case 4: Historical mode but no data available (not loading, no error)
    if (mode === "historical" && !historicalData) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="text-center p-6 bg-gray-50 rounded-lg border border-gray-200 max-w-md">
            <h3 className="text-lg font-medium text-gray-700 mb-2">No Data Available</h3>
            <p className="text-gray-500 mb-4">There is no historical data available for the selected time period.</p>
            <Button onClick={fetchHistoricalData} className="bg-primary hover:bg-primary/90">
              Refresh
            </Button>
          </div>
        </div>
      )
    }

    // Function to select the appropriate tank model based on tank type and number of blades
    const selectTankDisplayType = (tankType, numberBlades) => {
      if (tankType === "horizontal" && numberBlades == 2) {
        return (
          <HorizontalTank2Blades
            encoderData={data?.encoderData}
            milkQuantityData={data?.milkQuantityData}
            switchStatus={data?.switchStatus}
            weightData={data?.weightData}
            tankTemperaturesData={data?.tankTemperaturesData}
            airQualityData={data?.airQualityData}
            selectedData={selectedData}
          />
        )
      } else if (tankType === "vertical") {
        return (
          <VerticalTank1Blade
            encoderData={data?.encoderData}
            milkQuantityData={data?.milkQuantityData}
            switchStatus={data?.switchStatus}
            weightData={data?.weightData}
            tankTemperaturesData={data?.tankTemperaturesData}
            airQualityData={data?.airQualityData}
            selectedData={selectedData}
          />
        )
      } else {
        return (
          <HorizontalTank1Blade
            encoderData={data?.encoderData}
            milkQuantityData={data?.milkQuantityData}
            switchStatus={data?.switchStatus}
            weightData={data?.weightData}
            tankTemperaturesData={data?.tankTemperaturesData}
            airQualityData={data?.airQualityData}
            selectedData={selectedData}
          />
        )
      }
    }

    // Render the 3D tank model
    return (
      <Canvas className="w-full h-full">
        <ambientLight intensity={0.6} />
        <directionalLight position={[-10, -10, -10]} intensity={0.5} />
        <Suspense fallback={null}>
          <group>{selectTankDisplayType(selectedTank?.display, selectedTank?.blades)}</group>
          <CameraSettings view={currentView} tankDisplay={selectedTank?.display} />
        </Suspense>
      </Canvas>
    )
  }

  return (
    <div
      ref={tankContainerRef}
      className={`bg-white relative transition-all duration-300 ${
        isFullscreen ? "fixed top-0 left-0 w-screen h-screen z-50" : "w-full h-full"
      }`}
    >
      {/* Only show sensor data overlay when in realtime mode or when historical data is loaded */}
      {(mode === "realtime" || (historicalData && historicalData !== "loading" && !error)) && (
        <>
          <div className="absolute top-4 left-4 z-10">
            <SelectedSensorData
              encoderData={data?.encoderData}
              milkQuantityData={data?.milkQuantityData}
              switchStatus={data?.switchStatus}
              weightData={data?.weightData}
              tankTemperaturesData={data?.tankTemperaturesData}
              airQualityData={data?.airQualityData}
              selectedData={selectedData}
              gyroscopeData={data?.gyroscopeData}
            />
          </div>
        </>
      )}
      {renderTankModel()}
      <CameraControlButtons
        handleViewChange={handleViewChange}
        toggleFullscreen={toggleFullscreen}
        isFullscreen={isFullscreen}
      />
    </div>
  )
}

export default TankModel
