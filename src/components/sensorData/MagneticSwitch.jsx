import React, { useState } from "react";
import { ToggleLeft } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const MagneticSwitch = ({ switchStatus }) => {
  const [isSelected, setIsSelected] = useState(false);

  const handleClick = () => {
    setIsSelected(!isSelected);
  };

  return (
    <Card
      className={cn(
        "transition-all duration-300 hover:shadow-lg",
        isSelected && "ring-2 ring-yellow-200"
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
            <ToggleLeft size={16} className="text-yellow-500" />
            <span>Magnetic Switch</span>
          </div>
          <div
            className={cn(
              "w-2 h-2 rounded-full transition-all duration-300",
              isSelected ? "bg-yellow-500" : "bg-gray-300"
            )}
          />
        </CardTitle>
      </CardHeader>
      <p className="text-xs text-muted-foreground mb-2 px-6">
        Last update: {switchStatus?.readableDate || "N/A"}
      </p>
      <CardContent>
        {switchStatus ? (
          <div className="flex items-center justify-center">
            <span
              className={`text-2xl font-bold ${
                switchStatus.status === 0 ? "text-red-500" : "text-green-500"
              }`}
            >
              {switchStatus.status === 0 ? "Closed" : "Opened"}
            </span>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No data available</p>
        )}
      </CardContent>
    </Card>
  );
};

export default MagneticSwitch;
