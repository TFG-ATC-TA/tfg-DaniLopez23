import { useEffect, useState } from "react";
import { Activity, HelpCircle, Info, RefreshCw, Loader } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
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
  const [realTimeState, setRealTimeState] = useState(null); // Estado para guardar el estado en tiempo real

  useEffect(() => {
    // Llama a la función de actualización al montar el componente
    handleRefresh();

    // Configura un intervalo para actualizar cada 5 minutos (300,000 ms)
    const interval = setInterval(() => {
      handleRefresh();
    }, 300000); // 5 minutos

    // Limpia el intervalo cuando el componente se desmonta
    return () => clearInterval(interval);
  }, []);

  if (!selectedTank) return null;

  const handleRefresh = async () => {
    setLoading(true);
    setError(null);

    const filters = {
      farm: selectedFarm.broker,
      tank: selectedTank._id,
      boardIds: getBoardIdsFromTank(selectedTank),
    };

    try {
      if (selectedTank) {
        const status = await predictRealTimeStates(filters);
        console.log("Tank status refreshed:", status);

        // Actualiza el estado en tiempo real con los datos obtenidos
        if (status?.states?.length > 0) {
          setRealTimeState(status.states[0].state); // Toma el primer estado de la respuesta
        } else {
          setRealTimeState("NO DATA"); // Si no hay datos, establece "NO DATA"
        }
      }
    } catch (err) {
      console.error("Error refreshing tank status:", err);
      setError("Error al actualizar el estado del tanque.");
      setRealTimeState("NO DATA"); // Si hay un error, establece "NO DATA"
    } finally {
      setLoading(false);
    }
  };

  // Determina el estado del tanque
  const tankState =
    mode === "realtime" && realTimeState
      ? realTimeState // Usa el estado en tiempo real si está disponible
      : selectedTank.state || "NO DATA"; // Usa el estado del tanque o "NO DATA"

  // Obtiene la configuración para este estado
  const stateConfig = TANK_STATES[tankState] || TANK_STATES["NO DATA"];

  // Extrae los valores necesarios
  const { color, text, textColor, bgColor, borderColor } = stateConfig;

  return (
    <div className="relative p-3 rounded-lg bg-white shadow-sm h-full flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between border-b pb-1.5">
        <div className="flex items-center gap-1.5">
          <div
            className="flex-shrink-0 flex items-center justify-center bg-primary/10 p-1 rounded-full"
          >
            <Activity className="h-3.5 w-3.5 text-primary" />
          </div>
          <p className="text-xs font-medium text-gray-500 uppercase">Estado</p>
        </div>

        {/* Botón de Interrogación */}
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm" className="h-4 w-4 p-0">
              <HelpCircle className="h-3 w-3 text-gray-400" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Información de Modos</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <strong className="block text-sm font-medium mb-1">Modo Tiempo Real:</strong>
                <p className="text-sm">
                  En este modo, el estado del tanque se actualiza automáticamente cada 5 minutos con los datos más recientes.
                </p>
              </div>
              <div>
                <strong className="block text-sm font-medium mb-1">Modo Histórico:</strong>
                <p className="text-sm">
                  En este modo, se muestran los datos históricos seleccionados en el rango de fechas configurado.
                </p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Tank Name & Status */}
      <div className="flex flex-col space-y-1.5 mt-1.5">
        <div className="flex items-center">
          <div
            className="w-2.5 h-2.5 rounded-full mr-1.5 flex-shrink-0"
            style={{ backgroundColor: color }}
          />
          <p className="text-xs font-medium text-gray-800 truncate">
            {selectedTank.name}
          </p>
        </div>
        <div className="flex items-center justify-between">
          <Badge
            variant="outline"
            className={cn(
              "py-0.5 px-1.5 rounded-md border text-[10px]",
              textColor,
              bgColor,
              borderColor
            )}
          >
            {text}
          </Badge>

          {/* Botón de Exclamación */}
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm" className="h-4 w-4 p-0">
                <Info className="h-3 w-3 text-gray-400" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Información del Estado</DialogTitle>
              </DialogHeader>
              <div className="mt-4">
                <p className="text-sm">
                  {tankState === "MILKING" && "El tanque está en proceso de ordeño."}
                  {tankState === "COOLING" && "El tanque está enfriando la leche."}
                  {tankState === "CLEANING" && "El tanque está en proceso de limpieza."}
                  {tankState === "MAINTENANCE" && "El tanque está en mantenimiento."}
                  {tankState === "EMPTY TANK" && "El tanque está vacío."}
                  {tankState === "NO DATA" && "No hay datos disponibles sobre el estado del tanque."}
                </p>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Loader or Error */}
        {loading ? (
          <div className="flex items-center justify-center mt-2">
            <Loader className="h-5 w-5 text-gray-400 animate-spin" />
            <p className="text-xs text-gray-500 ml-2">Actualizando...</p>
          </div>
        ) : error ? (
          <p className="text-xs text-red-500 mt-2">{error}</p>
        ) : null}

        {/* Botón de Actualizar */}
        {mode == "realtime" && (<TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-5 w-5 p-0"
                onClick={handleRefresh}
                disabled={loading}
              >
                <RefreshCw className="h-3.5 w-3.5 text-gray-400 hover:text-gray-600 transition-colors" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Actualizar estado del tanque</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>)}
      </div>
    </div>
  );
};

export default TankStatus;