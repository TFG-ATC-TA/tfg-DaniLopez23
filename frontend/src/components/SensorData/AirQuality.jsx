import React from "react";
import { Wind } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const AirQuality = ({ airQualityData }) => {
  const { value, tags, readableDate } = airQualityData || {};

  const metrics = [
    { label: "Breath VOC", value: value.breath_voc_equivalent, unit: "ppb" },
    { label: "CO2 ", value: value.co2_equivalent, unit: "ppm" },
    { label: "Gas Percentage", value: value.gas_percentage, unit: "%" },
    { label: "Humidity", value: value.heat_compensated_humidity, unit: "%" },
    { label: "Temperature", value: value.heat_compensated_temperature, unit: "°C" },
    { label: "IAQ", value: value.iaq, unit: "" },
    { label: "Raw Gas", value: value.raw_gas, unit: "ohm" },
    { label: "Raw Humidity", value: value.raw_humidity, unit: "%" },
    { label: "Raw Pressure", value: value.raw_pressure, unit: "Pa" },
    { label: "Raw Temperature", value: value.raw_temperature, unit: "°C" },
  ];

  return (
    <Card className="ring-2 ring-blue-200 bg-white">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center space-x-2">
          <Wind size={16} className="text-blue-500" />
          <span>Air Quality Sensor</span>
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Board ID:</span>
              <span className="font-medium">{tags?.board_id || 'N/A'}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Last Reading:</span>
              <span className="font-medium">{readableDate || 'N/A'}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {metrics.map(({ label, value, unit }) => (
              <div 
                key={label}
                className="bg-blue-100/30 p-2 rounded-md"
              >
                <div className="flex justify-between items-center space-x-1">
                  <span className="text-xs text-muted-foreground">{label}</span>
                  <span className="text-sm font-medium text-blue-600">
                    {value !== undefined ? `${value.toFixed(2)} ${unit}` : "N/A"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AirQuality;