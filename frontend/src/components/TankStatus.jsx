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

  useEffect(() => {
    setError(null);
    handleRefresh();
  }, [mode]);

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
          selectedTank.state = status.states[0].state;
        } else {
          setRealTimeState("NO DATA");
          selectedTank.state = "NO DATA";
        }
      }
    } catch (err) {
      console.error("Error refreshing tank status:", err);
      setError(err.message || "Error al actualizar");
      setRealTimeState("NO DATA");
      selectedTank.state = "NO DATA";
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
      {/* Header with help */}
      <div className="flex items-center justify-between border-b pb-2 mb-3">
        <div className="flex items-center gap-2">
          <span className="flex items-center justify-center bg-primary/10 p-1 rounded-full">
            <Activity className="h-4 w-4 text-primary" />
          </span>
          <span className="text-sm font-semibold text-gray-700">STATUS</span>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 p-0"
              aria-label="Information"
            >
              <HelpCircle className="h-4 w-4 text-gray-400" />
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-xs">
            <DialogHeader>
              <DialogTitle>State information</DialogTitle>
            </DialogHeader>
            <div className="text-xs space-y-2 mt-2">
              <p>
                <span className="font-medium">Real Time:</span> Automatic
                refresh every 5 minutes
              </p>
              <p>
                <span className="font-medium">Historical: </span> State from
                data selected on date range
              </p>
              <div className="mt-2 pt-2 border-t">
                <p className="font-medium mb-1">Current state: {text}</p>
                <p>
                  {tankState === "MILKING" && "Tank in milking process"}
                  {tankState === "COOLING" && "Tank cooling milk"}
                  {tankState === "CLEANING" && "Tank in cleaning process"}
                  {tankState === "MAINTENANCE" && "Tank under maintenance"}
                  {tankState === "EMPTY TANK" && "Tank is empty"}
                  {tankState === "NO DATA" && "No data available"}
                </p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Main body: indicator, name, label and inline button */}
      <div className="flex items-center gap-3 w-full">
        <span
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: color }}
        />
        <span className="text-sm font-medium text-gray-800 truncate max-w-[110px]">
          {selectedTank.name}
        </span>
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
        {mode === "realtime" && (
          <div className="flex items-center ml-auto gap-2">
            {loading ? (
              <span className="flex items-center gap-1 text-xs text-gray-500">
                <Loader className="h-4 w-4 animate-spin text-primary" />
                Updating...
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
                      Update
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="text-xs p-1">
                    Update tank state
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        )}
      </div>
      {/* Error below if exists */}
      {error && !loading && (
        <div className="flex items-center mt-2">
          <span className="text-xs text-red-500">{error}</span>
        </div>
      )}
    </div>
  );
};

export default TankStatus;
