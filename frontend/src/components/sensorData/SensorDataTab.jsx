import { useState } from "react"
import { Activity, Radio, Loader2, CircleX } from "lucide-react"
import { Button } from "@/components/ui/button"
import SensorInfoItem from "./SensorInfoItem"
import useDataStore from "@/stores/useDataStore"

const SensorDataTab = ({ mode, selectedHistoricalData, historicalData, error}) => {
  const [isSensorsTabVisible, setIsSensorsTabVisible] = useState(true)

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


  // Si el panel está oculto, solo mostrar el botón flotante
  if (!isSensorsTabVisible) {
    return (
      <div className="absolute left-0 top-2/4 z-20">
        <Button
          variant="secondary"
          onClick={() => setIsSensorsTabVisible(true)}
          className="h-auto py-3 px-2 rounded-l-none shadow-md flex flex-col gap-2 bg-white border-l-0 z-10" 
        >
          <Activity className="h-5 w-5" />
          <span className="text-xs font-medium">Sensores</span>
        </Button>
      </div>
    )
  }

  // Determine what data to display
  const dataToDisplay = mode === "historical" ? selectedHistoricalData || historicalData : realTimeData
  const isLoading = mode === "historical" && historicalData === "loading"

  // Si el panel está visible, mostrarlo como parte del layout normal
  return (
    <div className="w-80 h-full flex flex-col bg-white rounded-lg border shadow-sm overflow-hidden">
      <div className="sticky top-0 z-10 bg-white border-b p-4">
        <div className="flex justify-between items-center gap-2">
          <div className="flex items-center gap-2">
            <Radio className="h-5 w-5 text-primary" />
            <h3 className="text-base md:text-lg font-semibold truncate">Datos de Sensores</h3>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsSensorsTabVisible(false)}
            className="h-9 w-9 p-0 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
          >
            <CircleX className="h-4 w-4" />
            <span className="sr-only">Cerrar panel</span>
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="h-6 w-6 animate-spin text-primary mr-2" />
            <span className="text-sm text-muted-foreground">Loading sensor data...</span>
          </div>
        ) : error && mode === "historical" ? (
          <div className="text-center p-4">
            <p className="text-sm text-red-500 mb-2">Error loading sensor data</p>
          </div>
        ) : (
          <SensorInfoItem historicalData={dataToDisplay} isRealTime={mode === "realtime"} />
        )}
      </div>
    </div>
  )
}

export default SensorDataTab
