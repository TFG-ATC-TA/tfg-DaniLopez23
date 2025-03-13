import { useState } from "react";
import { Activity } from "lucide-react";
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
    <div className="w-64 overflow-hidden flex flex-col">
      <Card className="w-full h-full shadow-sm border overflow-hidden">
        <CardHeader className="sticky z-10 border-b p-">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Datos de Sensores
            </CardTitle>
            <div className="flex justify-end items-center p-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsSensorsTabVisible(false)}
                className="h-8 w-8 p-0 text-primary hover:bg-primary/10"
              >
                <CircleX className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0 overflow-y-auto">
          <SensorInfoItem
            historicalData={historicalData}
            isRealTime={mode === "realtime"}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default SensorDataTab;
