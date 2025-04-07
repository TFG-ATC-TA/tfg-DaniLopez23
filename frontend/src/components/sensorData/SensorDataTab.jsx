"use client"

import { useState } from "react"
import { Activity, Radio } from "lucide-react"
import { Button } from "@/components/ui/button"
import SensorInfoItem from "./SensorInfoItem"
import { CircleX } from "lucide-react"

const SensorDataTab = ({ historicalData, mode }) => {
  const [isSensorsTabVisible, setIsSensorsTabVisible] = useState(true)

  // Si el panel está oculto, solo mostrar el botón flotante
  if (!isSensorsTabVisible) {
    return (
      <div className="absolute left-0 top-1/4 z-30">
        <Button
          variant="secondary"
          onClick={() => setIsSensorsTabVisible(true)}
          className="h-auto py-3 px-2 rounded-l-none shadow-md flex flex-col gap-2 bg-white border-l-0"
        >
          <Activity className="h-5 w-5" />
          <span className="text-xs font-medium">Sensores</span>
        </Button>
      </div>
    )
  }

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
        <SensorInfoItem historicalData={historicalData} isRealTime={mode === "realtime"} />
      </div>
    </div>
  )
}

export default SensorDataTab

