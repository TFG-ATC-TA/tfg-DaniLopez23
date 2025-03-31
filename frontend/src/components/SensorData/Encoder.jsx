import React from "react";
import { RotateCw } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const Encoder = ({ encoderData }) => {
  const { value, sensorId, readableDate } = encoderData || {};
  return (
    <Card className="ring-2 ring-green-200 bg-green-50/20">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center space-x-2">
          <RotateCw size={16} className="text-green-500" />
          <span>Rotation Sensor</span>
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

          <div className="flex flex-col items-center justify-center bg-green-100/30 p-4 rounded-md">
            <div className="text-3xl font-bold text-green-600">
              {value || '0'}
              <span className="text-lg ml-1">rad/s</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Angular velocity measurement
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Encoder;