import React from "react";
import { Thermometer } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const TankTemperatures = ({ tankTemperaturesData }) => {
  const { 
    over_surface_temperature, 
    surface_temperature, 
    submerged_temperature,
    sensorId,
    readableDate
  } = tankTemperaturesData || {};

  return (
    <Card className="ring-2 ring-red-200 bg-red-50/20">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center space-x-2">
          <Thermometer size={16} className="text-red-500" />
          <span>Temperature Sensors</span>
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Sensor ID:</span>
              <span className="font-medium">{sensorId || 'N/A'}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Last Reading:</span>
              <span className="font-medium">{readableDate || 'N/A'}</span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center bg-red-100/30 p-2 rounded-md">
              <span className="text-xs text-muted-foreground">Over Surface:</span>
              <span className="text-sm font-medium text-red-600">
                {over_surface_temperature !== undefined ? 
                  `${over_surface_temperature}°C` : "N/A"}
              </span>
            </div>
            
            <div className="flex justify-between items-center bg-red-100/30 p-2 rounded-md">
              <span className="text-xs text-muted-foreground">On Surface:</span>
              <span className="text-sm font-medium text-red-600">
                {surface_temperature !== undefined ? 
                  `${surface_temperature}°C` : "N/A"}
              </span>
            </div>
            
            <div className="flex justify-between items-center bg-red-100/30 p-2 rounded-md">
              <span className="text-xs text-muted-foreground">Submerged:</span>
              <span className="text-sm font-medium text-red-600">
                {submerged_temperature !== undefined ? 
                  `${submerged_temperature}°C` : "N/A"}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TankTemperatures;