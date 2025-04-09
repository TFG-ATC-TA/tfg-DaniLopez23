import { RotateCw } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const Encoder = ({ encoderData }) => {
  const { value, tags, readableDate } = encoderData || {};

  return (
    <Card className="ring-2 ring-green-200 bg-green-50/20">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center space-x-2">
          <RotateCw size={16} className="text-green-500" />
          <span>Blades Sensor</span>
        </CardTitle>
      </CardHeader>

      {encoderData ? (
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Board ID:</span>
                <span className="font-medium">{tags?.board_id || "N/A"}</span>
              </div>
              <div className="flex justify-between text-xs space-x-2">
                <span className="text-muted-foreground">Last Reading:</span>
                <span className="font-medium">{readableDate || "N/A"}</span>
              </div>
            </div>

            <div className="bg-green-100/30 p-4 rounded-md">
              <h3 className="text-sm font-medium text-green-600 mb-2">
                Sensor Values
              </h3>
              <div className="space-y-2">
                {value && Object.keys(value).length > 0 ? (
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
      ) : (
        <CardContent className="flex items-center justify-center h-24 text-sm text-muted-foreground">
          No data available
        </CardContent>
      )}
    </Card>
  );
};

export default Encoder;