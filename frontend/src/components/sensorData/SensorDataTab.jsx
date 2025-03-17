import { useState } from "react";
import { Activity, Radio } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import SensorInfoItem from "./SensorInfoItem";
import { CircleX } from "lucide-react";

const SensorDataTab = ({ historicalData, mode }) => {
  const [isSensorsTabVisible, setIsSensorsTabVisible] = useState(true);

  // If sensors tab is collapsed, show only the toggle button
  if (!isSensorsTabVisible) {
    return (
      <div className="p-2 flex items-start justify-center h-full">
        <Button
          variant="ghost"
          onClick={() => setIsSensorsTabVisible(true)}
          className="h-auto p-3 flex flex-col gap-2 text-primary hover:bg-primary/10"
        >
          <Activity className="h-5 w-5 rotate-90" />
          <span className="text-xs font-medium">Sensores</span>
        </Button>
      </div>
    );
  }

  // Otherwise, show the full sensors panel
  return (
    <div className="w-full md:w-80 max-w-full h-full flex flex-col bg-white rounded-lg border shadow-sm overflow-hidden">
  <div className="sticky top-0 z-10 bg-white border-b p-4">
    <div className="flex justify-between items-center gap-2">
      <div className="flex items-center gap-2">
        <Radio className="h-5 w-5 text-primary" />
        <h3 className="text-base md:text-lg font-semibold truncate">
          Datos de Sensores
        </h3>
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
    <SensorInfoItem
      historicalData={historicalData}
      isRealTime={mode === "realtime"}
    />
  </div>
</div>
  );
};

export default SensorDataTab;
