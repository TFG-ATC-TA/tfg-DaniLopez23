import { useState } from "react";
import { RotateCw, ChevronDown, ChevronUp } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Encoder = ({ encoderData }) => {
  const [expanded, setExpanded] = useState(true);

  const { value, tags, readableDate } = encoderData || {};
  const hasSensorValues = value && Object.keys(value).length > 0;

  const toggleExpanded = () => setExpanded(!expanded);

  return (
    <Card
      className={`transition-all duration-300 ease-in-out overflow-hidden 
      ring-2 ring-green-200 bg-green-50/20
      ${expanded ? "w-64 h-auto" : "w-16 h-16 flex items-center justify-center"}`}
    >
      {expanded ? (
        <>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium flex items-center space-x-2">
                <RotateCw size={20} className="text-green-500" />
                <span>Blades Sensor</span>
              </CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleExpanded}
                className="text-green-500 hover:bg-transparent"
              >
                <ChevronUp size={18} />
              </Button>
            </div>
          </CardHeader>

          <CardContent>
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

              <div className="bg-green-100/30 p-4 rounded-md">
                <h3 className="text-sm font-medium text-green-600 mb-2">
                  Sensor Values
                </h3>
                <div className="space-y-2">
                  {hasSensorValues ? (
                    Object.entries(value).map(([sensorId, sensorValue]) => (
                      <div
                        key={sensorId}
                        className="flex justify-between text-sm bg-white p-2 rounded-md shadow-sm"
                      >
                        <span className="text-muted-foreground">Sensor {sensorId}:</span>
                        <span className="font-medium text-green-600">{sensorValue} rad/s</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-muted-foreground">
                      No sensor data available
                    </p>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </>
      ) : (
        // Vista colapsada
        <button onClick={toggleExpanded} className="flex flex-col items-center space-y-1">
          <RotateCw size={20} className="text-green-500" />
          <ChevronDown size={16} className="text-muted-foreground" />
        </button>
      )}
    </Card>
  );
};

export default Encoder;
