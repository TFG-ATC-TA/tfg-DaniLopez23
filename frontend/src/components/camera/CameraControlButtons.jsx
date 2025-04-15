import { Maximize, Minimize, Bird, MonitorUp, AlignLeft } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import useAppDataStore from "@/stores/useAppDataStore"

const CameraControlButtons = ({ handleViewChange, toggleFullscreen, isFullscreen }) => {
  const [currentView, setCurrentView] = useState("default")

  const { mode, filters } = useAppDataStore((state) => state)

  const toggleView = (view) => {
    // Si la vista actual es la misma que se está solicitando, volver a la vista predeterminada
    if (currentView === view) {
      setCurrentView("default")
      handleViewChange("default")
    } else {
      // De lo contrario, cambiar a la vista solicitada
      setCurrentView(view)
      handleViewChange(view)
    }
  }

  if (mode === "historical" && filters.dateRange === null) {
    return null
  }

  return (
    <div className="absolute bottom-3 right-3 z-50 flex flex-col gap-2 sm:flex-row">
      <TooltipProvider>
        <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-md p-1.5 flex flex-row sm:flex-row gap-1.5">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={currentView === "lateral" ? "default" : "outline"}
                size="icon"
                className={`h-8 w-8 ${currentView === "lateral" ? "bg-gray-200" : "bg-white hover:bg-gray-100"}`}
                onClick={() => toggleView("lateral")}
              >
                <AlignLeft className="h-4 w-4" />
                <span className="sr-only">Vista Lateral</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">
              <p>Vista Lateral</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={currentView === "front" ? "default" : "outline"}
                size="icon"
                className={`h-8 w-8 ${currentView === "front" ? "bg-gray-200" : "bg-white hover:bg-gray-100"}`}
                onClick={() => toggleView("front")}
              >
                <MonitorUp className="h-4 w-4" />
                <span className="sr-only">Vista Frontal</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">
              <p>Vista Frontal</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={currentView === "top" ? "default" : "outline"}
                size="icon"
                className={`h-8 w-8 ${currentView === "top" ? "bg-gray-200" : "bg-white hover:bg-gray-100"}`}
                onClick={() => toggleView("top")}
              >
                <Bird className="h-4 w-4" />
                <span className="sr-only">Vista Zenital</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">
              <p>Vista Zenital</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 bg-white hover:bg-gray-100"
                onClick={toggleFullscreen}
              >
                {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
                <span className="sr-only">{isFullscreen ? "Salir de Pantalla Completa" : "Pantalla Completa"}</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">
              <p>{isFullscreen ? "Salir de Pantalla Completa" : "Pantalla Completa"}</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>
    </div>
  )
}

export default CameraControlButtons
