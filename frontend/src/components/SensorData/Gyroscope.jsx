import { useState } from "react";
import { Compass, ChevronDown, ChevronUp } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const Gyroscope = ({ gyroscopeData }) => {
  const [expanded, setExpanded] = useState(true);
  const { value, readableDate } = gyroscopeData || {};
  const hasSensorValues = value && Object.keys(value).length > 0;

  const toggleExpanded = () => setExpanded(!expanded);

  return (
    <Card
      className={cn(
        `transition-all duration-300 ease-in-out overflow-hidden 
         ring-2 ring-purple-200 bg-purple-50/20
         ${expanded ? "w-64 h-auto" : "w-16 h-16 flex items-center justify-center"}`
      )}
    >
      {expanded ? (
        <>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium flex items-center space-x-2">
                <Compass size={20} className="text-purple-500" />
                <span>Gyroscope Sensor</span>
              </CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleExpanded}
                className="text-purple-500 hover:bg-transparent"
              >
                <ChevronUp size={18} />
              </Button>
            </div>
          </CardHeader>

          <CardContent>
            <div className="space-y-4">
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Last Reading:</span>
                  <span className="font-medium">{readableDate || "N/A"}</span>
                </div>
              </div>

              <div className="bg-purple-100/30 p-4 rounded-md">
                <h3 className="text-sm font-medium text-purple-600 mb-2">Gyroscope (rad/s)</h3>
                <div className="grid grid-cols-3 gap-4 text-center mb-4">
                  {["gyro_x", "gyro_y", "gyro_z"].map((axis) => (
                    <div key={axis} className="flex flex-col items-center">
                      <span className="text-xs font-medium uppercase">{axis.slice(-1)}</span>
                      <span className="text-lg font-bold text-black">
                        {value?.[axis]?.toFixed(2) || "0.00"}
                      </span>
                      <span className="text-xs text-muted-foreground">rad/s</span>
                    </div>
                  ))}
                </div>

                <h3 className="text-sm font-medium text-purple-600 mb-2">Accelerometer (m/s²)</h3>
                <div className="grid grid-cols-3 gap-4 text-center">
                  {["accel_x", "accel_y", "accel_z"].map((axis) => (
                    <div key={axis} className="flex flex-col items-center">
                      <span className="text-xs font-medium uppercase">{axis.slice(-1)}</span>
                      <span className="text-lg font-bold text-black">
                        {value?.[axis]?.toFixed(2) || "0.00"}
                      </span>
                      <span className="text-xs text-muted-foreground">m/s²</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </>
      ) : (
        // Vista colapsada
        <button onClick={toggleExpanded} className="flex flex-col items-center space-y-1">
          <Compass size={20} className="text-purple-500" />
          <ChevronDown size={16} className="text-muted-foreground" />
        </button>
      )}
    </Card>
  );
};

export default Gyroscope;
