import React, { useState } from "react";
import { Thermometer } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const TankTemperatures = ({ tankTemperaturesData }) => {
  const [isSelected, setIsSelected] = useState(false);
  const { overSurface, onSurface, underSurface } = tankTemperaturesData || {};

  const handleClick = () => {
    setIsSelected(!isSelected);
  };

  return (
    <Card
      className={cn(
        "transition-all duration-300 hover:shadow-lg",
        isSelected && "ring-2 ring-red-200"
      )}
      onClick={handleClick}
      onMouseLeave={() => !isSelected && setIsSelected(false)}
      tabIndex={0}
      role="button"
      aria-pressed={isSelected}
    >
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Thermometer size={16} className="text-red-500" />
            <span>Milk Temperatures</span>
          </div>
          <div
            className={cn(
              "w-2 h-2 rounded-full transition-all duration-300",
              isSelected ? "bg-red-500" : "bg-gray-300"
            )}
          />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground">Over Surface:</span>
            <span className="text-sm font-medium">
              {overSurface !== undefined ? `${overSurface}°C` : "No data"}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground">On Surface:</span>
            <span className="text-sm font-medium">
              {onSurface !== undefined ? `${onSurface}°C` : "No data"}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground">Under Surface:</span>
            <span className="text-sm font-medium">
              {underSurface !== undefined ? `${underSurface}°C` : "No data"}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TankTemperatures;
