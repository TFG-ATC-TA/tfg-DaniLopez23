import { useEffect, useState } from "react"
import { Activity, HelpCircle, RefreshCw, Loader } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import useTankStore from "@/stores/useTankStore"
import { TANK_STATES } from "@/constants/tankStates"
import { predictRealTimeStates } from "@/services/predictStates"
import useAppDataStore from "@/stores/useAppDataStore"
import useFarmStore from "@/stores/useFarmStore"
import { getBoardIdsFromTank } from "@/services/tank"

const TankStatus = () => {
  const { selectedTank } = useTankStore((state) => state)
  const { mode } = useAppDataStore((state) => state)
  const { selectedFarm } = useFarmStore((state) => state)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [realTimeState, setRealTimeState] = useState(null)

  useEffect(() => {
    handleRefresh()
    const interval = setInterval(() => {
      handleRefresh()
    }, 300000) // 5 minutos
    return () => clearInterval(interval)
  }, [selectedTank, selectedFarm])

  if (!selectedTank) return null

  const handleRefresh = async () => {
    if (mode !== "realtime") return
    if (loading) return
    setLoading(true)
    setError(null)

    const filters = {
      farm: selectedFarm?.broker,
      tank: selectedTank?._id,
      boardIds: getBoardIdsFromTank(selectedTank),
    }

    try {
      if (selectedTank && selectedFarm) {
        const status = await predictRealTimeStates(filters)
        if (status?.states?.length > 0) {
          setRealTimeState(status.states[0].state)
        } else {
          setRealTimeState("NO DATA")
        }
      }
    } catch (err) {
      console.error("Error refreshing tank status:", err)
      setError("Error al actualizar")
      setRealTimeState("NO DATA")
    } finally {
      setLoading(false)
    }
  }

  const tankState = mode === "realtime" && realTimeState ? realTimeState : selectedTank.state || "NO DATA"
  const stateConfig = TANK_STATES[tankState] || TANK_STATES["NO DATA"]
  const { color, text, textColor, bgColor, borderColor } = stateConfig

  return (
    <div className="p-2.5 rounded-md bg-white shadow-sm h-full flex flex-col">
      {/* Header con mejor alineación */}
      <div className="flex items-center justify-between border-b pb-1.5 mb-2">
        <div className="flex items-center gap-1.5">
          <div className="flex-shrink-0 flex items-center justify-center bg-primary/10 p-0.5 rounded-full">
            <Activity className="h-3 w-3 text-primary" />
          </div>
          <p className="text-xs font-medium text-gray-500">Estado</p>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm" className="h-5 w-5 p-0 -mr-0.5" aria-label="Información">
              <HelpCircle className="h-3 w-3 text-gray-400" />
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-xs">
            <DialogHeader>
              <DialogTitle>Información de Estados</DialogTitle>
            </DialogHeader>
            <div className="text-xs space-y-2 mt-2">
              <p>
                <span className="font-medium">Tiempo Real:</span> Actualización automática cada 5 minutos
              </p>
              <p>
                <span className="font-medium">Histórico:</span> Datos del rango de fechas seleccionado
              </p>
              <div className="mt-2 pt-2 border-t">
                <p className="font-medium mb-1">Estado actual: {text}</p>
                <p>
                  {tankState === "MILKING" && "Tanque en proceso de ordeño"}
                  {tankState === "COOLING" && "Tanque enfriando leche"}
                  {tankState === "CLEANING" && "Tanque en proceso de limpieza"}
                  {tankState === "MAINTENANCE" && "Tanque en mantenimiento"}
                  {tankState === "EMPTY TANK" && "Tanque vacío"}
                  {tankState === "NO DATA" && "Sin datos disponibles"}
                </p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Contenido principal con mejor alineación */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <div className="w-2.5 h-2.5 rounded-full mr-1.5" style={{ backgroundColor: color }} />
          <p className="text-xs font-medium text-gray-700 truncate max-w-[100px]">{selectedTank.name}</p>
        </div>

        <Badge
          variant="outline"
          className={cn("py-0.5 px-2 rounded-md border text-[10px] font-medium", textColor, bgColor, borderColor)}
        >
          {text}
        </Badge>
      </div>

      {/* Botón de actualización con mejor alineación */}
      { mode == "realtime"  && (<div className="flex items-center justify-end mt-auto">
        {mode == "realtime" && loading ? (
          <div className="flex items-center justify-center w-full py-0.5">
            <Loader className="h-3 w-3 text-primary animate-spin mr-1.5" />
            <p className="text-[10px] text-gray-500">Actualizando...</p>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center w-full py-0.5">
            <p className="text-[10px] text-red-500">{error}</p>
          </div>
        ) : mode == "realtime" ? (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-6 py-0 px-2 text-[10px] border-dashed"
                  onClick={handleRefresh}
                  disabled={loading}
                >
                  <RefreshCw className="h-2.5 w-2.5 mr-1 text-gray-500" />
                  Actualizar
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="text-xs p-1">
                Actualizar estado del tanque
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : (
          <div className="h-6"></div> // Espacio reservado para mantener la altura consistente
        )}
      </div>)}
    </div>
  )
}

export default TankStatus
