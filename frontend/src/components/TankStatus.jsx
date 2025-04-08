import { Activity, HelpCircle, Info } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import useTankStore from "@/stores/useTankStore"
import useAppDataStore from "@/stores/useAppDataStore"
import { TANK_STATES } from "@/constants/tankStates"
const TankStatus = () => {
  const { selectedTank } = useTankStore()
  const { mode } = useAppDataStore()

  if (!selectedTank) return null

  // Get the tank state or default to NO DATA
  const tankState = selectedTank.state || "NO DATA"

  // Get the configuration for this state
  const stateConfig = TANK_STATES[tankState] || TANK_STATES["NO DATA"]

  // Extract the values we need
  const { color, text, textColor, bgColor, borderColor } = stateConfig

  return (
    <div className="relative p-3 rounded-lg bg-white shadow-sm h-full flex flex-col justify-between">
      {/* Header - Simplificado */}
      <div className="flex items-center justify-between border-b pb-1.5">
        <div className="flex items-center gap-1.5">
          <div className="flex-shrink-0 flex items-center justify-center bg-primary/10 p-1 rounded-full">
            <Activity className="h-3.5 w-3.5 text-primary" />
          </div>
          <p className="text-xs font-medium text-gray-500 uppercase">Estado</p>
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" className="h-4 w-4 p-0">
                <HelpCircle className="h-3 w-3 text-gray-400" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Muestra el estado actual del tanque seleccionado</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Tank Name & Status - Compacto */}
      <div className="flex flex-col space-y-1.5 mt-1.5">
        <div className="flex items-center">
          <div className="w-2.5 h-2.5 rounded-full mr-1.5 flex-shrink-0" style={{ backgroundColor: color }} />
          <p className="text-xs font-medium text-gray-800 truncate">{selectedTank.name}</p>
        </div>
        <div className="flex items-center justify-between">
          <Badge
            variant="outline"
            className={cn("py-0.5 px-1.5 rounded-md border text-[10px]", textColor, bgColor, borderColor)}
          >
            {text}
          </Badge>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" className="h-4 w-4 p-0">
                  <Info className="h-3 w-3 text-gray-400" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  {tankState === "MILKING" && "El tanque está en proceso de ordeño"}
                  {tankState === "COOLING" && "El tanque está enfriando la leche"}
                  {tankState === "CLEANING" && "El tanque está en proceso de limpieza"}
                  {tankState === "MAINTENANCE" && "El tanque está en mantenimiento"}
                  {tankState === "EMPTY TANK" && "El tanque está vacío"}
                  {tankState === "NO DATA" && "No hay datos disponibles sobre el estado del tanque"}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </div>
  )
}

export default TankStatus
