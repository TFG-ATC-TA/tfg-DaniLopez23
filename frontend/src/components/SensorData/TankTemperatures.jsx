import { useState } from "react";
import { Thermometer, ChevronDown, ChevronUp } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const TankTemperatures = ({ tankTemperaturesData }) => {
  const [expanded, setExpanded] = useState(true);

  const { value, tags, readableDate } = tankTemperaturesData || {};
  const over = value?.over_surface_temperature;
  const surface = value?.surface_temperature;
  const submerged = value?.submerged_temperature;

  const toggleExpanded = () => setExpanded(!expanded);

  return (
    <Card
      className={`transition-all duration-300 ease-in-out overflow-hidden
        ring-2 ring-red-200 bg-red-50/20 
        ${expanded ? "w-64 h-auto" : "w-16 h-16 flex items-center justify-center"}`}
    >
      {expanded ? (
        <>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium flex items-center space-x-2">
                <Thermometer size={20} className="text-red-500" />
                <span>Temperature Sensors</span>
              </CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleExpanded}
                className="text-red-500 hover:bg-transparent"
              >
                <ChevronUp size={18} />
              </Button>
            </div>
          </CardHeader>

          { tankTemperaturesData ? <CardContent>
            <div className="space-y-4">
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Board ID:</span>
                  <span className="font-medium">{tags?.board_id || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Last Reading:</span>
                  <span className="font-medium">{readableDate || "N/A"}</span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center bg-red-100/30 p-2 rounded-md">
                  <span className="text-xs text-muted-foreground">Over Surface:</span>
                  <span className="text-sm font-medium text-red-600">
                    {over !== undefined ? `${over}°C` : "N/A"}
                  </span>
                </div>
                <div className="flex justify-between items-center bg-red-100/30 p-2 rounded-md">
                  <span className="text-xs text-muted-foreground">On Surface:</span>
                  <span className="text-sm font-medium text-red-600">
                    {surface !== undefined ? `${surface}°C` : "N/A"}
                  </span>
                </div>
                <div className="flex justify-between items-center bg-red-100/30 p-2 rounded-md">
                  <span className="text-xs text-muted-foreground">Submerged:</span>
                  <span className="text-sm font-medium text-red-600">
                    {submerged !== undefined ? `${submerged}°C` : "N/A"}
                  </span>
                </div>
              </div>
            </div>
          </CardContent> :
            <CardContent className="flex items-center justify-center h-full">
              <span className="text-sm text-muted-foreground">No data available</span>
            </CardContent>
          }
        </>
      ) : (
        // Vista colapsada: solo icono y botón
        <button onClick={toggleExpanded} className="flex flex-col items-center space-y-1">
          <Thermometer size={20} className="text-red-500" />
          <ChevronDown size={16} className="text-muted-foreground" />
        </button>
      )}
    </Card>
  );
};

export default TankTemperatures;
