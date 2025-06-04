import { useEffect, useState } from "react";
import { Activity, HelpCircle, RefreshCw, Loader } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import useTankStore from "@/stores/useTankStore";
import { TANK_STATES } from "@/constants/tankStates";
import { predictRealTimeStates } from "@/services/predictStates";
import useAppDataStore from "@/stores/useAppDataStore";
import useFarmStore from "@/stores/useFarmStore";
import { getBoardIdsFromTank } from "@/services/tank";

const TankStatus = () => {
  const { selectedTank } = useTankStore((state) => state);
  const { mode } = useAppDataStore((state) => state);
  const { selectedFarm } = useFarmStore((state) => state);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [realTimeState, setRealTimeState] = useState(null);

  useEffect(() => {
    handleRefresh();
    const interval = setInterval(() => {
      handleRefresh();
    }, 300000); // 5 minutos
    return () => clearInterval(interval);
    // eslint-disable-next-line
  }, [selectedTank, selectedFarm]);

  if (!selectedTank) return null;

  const handleRefresh = async () => {
    if (mode !== "realtime") return;
    if (loading) return;
    setLoading(true);
    setError(null);

    const filters = {
      farm: selectedFarm?.broker,
      tank: selectedTank?._id,
      boardIds: getBoardIdsFromTank(selectedTank),
    };

    try {
      if (selectedTank && selectedFarm) {
        const status = await predictRealTimeStates(filters);
        if (status?.states?.length > 0) {
          setRealTimeState(status.states[0].state);
        } else {
          setRealTimeState("NO DATA");
        }
      }
    } catch (err) {
      console.error("Error refreshing tank status:", err);
      setError("Error al actualizar");
      setRealTimeState("NO DATA");
    } finally {
      setLoading(false);
    }
  };

  const tankState =
    mode === "realtime" && realTimeState
      ? realTimeState
      : selectedTank.state || "NO DATA";
  const stateConfig = TANK_STATES[tankState] || TANK_STATES["NO DATA"];
  const { color, text, textColor, bgColor, borderColor } = stateConfig;

  return (
    <div className="p-3 rounded-lg bg-white shadow-sm h-full flex flex-col border border-muted-foreground/10">
      {/* Header con ayuda */}
      <div className="flex items-center justify-between border-b pb-2 mb-3">
        <div className="flex items-center gap-2">
          <span className="flex items-center justify-center bg-primary/10 p-1 rounded-full">
            <Activity className="h-4 w-4 text-primary" />
          </span>
          <span className="text-sm font-semibold text-gray-700">Estado</span>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 p-0"
              aria-label="Información"
            >
              <HelpCircle className="h-4 w-4 text-gray-400" />
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

      {/* Cuerpo principal: indicador, nombre, etiqueta y botón en línea */}
      <div className="flex items-center gap-3 w-full">
        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
        <span className="text-sm font-medium text-gray-800 truncate max-w-[110px]">{selectedTank.name}</span>
        <Badge
          variant="outline"
          className={cn(
            "py-0.5 px-2 rounded-md border text-xs font-semibold",
            textColor,
            bgColor,
            borderColor
          )}
        >
          {text}
        </Badge>
        <div className="flex items-center ml-auto gap-2">
          {loading ? (
            <span className="flex items-center gap-1 text-xs text-gray-500">
              <Loader className="h-4 w-4 animate-spin text-primary" />
              Actualizando...
            </span>
          ) : (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 py-0 px-3 text-xs border-dashed"
                    onClick={handleRefresh}
                    disabled={loading}
                  >
                    <RefreshCw className="h-4 w-4 mr-1 text-gray-500" />
                    Actualizar
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="text-xs p-1">
                  Actualizar estado del tanque
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </div>
      {/* Error debajo si existe */}
      {error && !loading && (
        <div className="flex items-center mt-2">
          <span className="text-xs text-red-500">{error}</span>
        </div>
      )}
    </div>
  );
};

export default TankStatus;