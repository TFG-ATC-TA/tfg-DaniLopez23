import React from "react";
import { Wind } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const AirQuality = ({ airQualityData }) => {
  const { airQuality = {}, sensorId, readableDate } = airQualityData || {};

  const metrics = [
    { label: "Breath VOC Equivalent", value: airQuality.breath_voc_equivalent, unit: "ppb" },
    { label: "CO2 Equivalent", value: airQuality.co2_equivalent, unit: "ppm" },
    { label: "Gas Percentage", value: airQuality.gas_percentage, unit: "%" },
    { label: "Humidity", value: airQuality.heat_compensated_humidity, unit: "%" },
    { label: "Temperature", value: airQuality.heat_compensated_temperature, unit: "°C" },
    { label: "IAQ", value: airQuality.iaq, unit: "" },
    { label: "Raw Gas", value: airQuality.raw_gas, unit: "ohm" },
    { label: "Raw Humidity", value: airQuality.raw_humidity, unit: "%" },
    { label: "Raw Pressure", value: airQuality.raw_pressure, unit: "Pa" },
    { label: "Raw Temperature", value: airQuality.raw_temperature, unit: "°C" },
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
              <span className="text-muted-foreground">Sensor ID:</span>
              <span className="font-medium">{sensorId || 'N/A'}</span>
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
                <div className="flex justify-between items-center">
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