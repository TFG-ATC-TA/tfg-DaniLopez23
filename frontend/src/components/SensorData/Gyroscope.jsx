import { Compass } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const Gyroscope = ({ gyroscopeData, isSelected, onSelect }) => {


  return (
    <Card
      className={cn(
        "transition-all duration-300 hover:shadow-lg",
        isSelected && "ring-2 ring-purple-200"
      )}
      onClick={onSelect}
      tabIndex={0}
      role="button"
      aria-pressed={isSelected}
    >
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Compass size={16} className="text-purple-500" />
            <span>Gyroscope Data</span>
          </div>
          <div
            className={cn(
              "w-2 h-2 rounded-full transition-all duration-300",
              isSelected ? "bg-purple-500" : "bg-gray-300"
            )}
          />
        </CardTitle>
      </CardHeader>
      <p className="text-xs text-muted-foreground mb-2 px-6">
        Last update: {gyroscopeData?.readableDate || "N/A"}
      </p>
      <CardContent>
        {gyroscopeData ? (
          <div className="grid grid-cols-3 gap-4 text-center">
            {["gyro_x", "gyro_y", "gyro_z"].map((axis) => (
              <div key={axis} className="flex flex-col items-center">
                <span className="text-xs font-medium uppercase">{axis.slice(-1)}</span>
                <span className="text-lg font-bold text-black">
                  {gyroscopeData.value[axis]?.toFixed(2) || "0.00"}
                </span>
                <span className="text-xs text-muted-foreground">rad/s</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No data available</p>
        )}
      </CardContent>
    </Card>
  );
};

export default Gyroscope;
