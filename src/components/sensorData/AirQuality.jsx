import React from "react"
import { Wind } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

const AirQuality = ({ airQualityData, isSelected, onSelect }) => {

  console.log(airQualityData)
  return (
    <Card
      className={cn(
        "transition-all duration-300 hover:shadow-lg",
        isSelected && "ring-2 ring-blue-200"
      )}
      onClick={onSelect}
      tabIndex={0}
      role="button"
      aria-pressed={isSelected}
    >
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Wind size={16} className="text-blue-500" />
            <span>Air Quality</span>
          </div>
          <div
            className={cn(
              "w-2 h-2 rounded-full transition-all duration-300",
              isSelected ? "bg-blue-500" : "bg-gray-300"
            )}
          />
        </CardTitle>
      </CardHeader>
      <p className="text-xs text-muted-foreground mb-2 px-6">
        Last update: {airQualityData?.readableDate || "N/A"}
      </p>
      <CardContent>
        {airQualityData ? (
          <div className="space-y-2">
            {[
              { label: "Breath VOC Equivalent", value: airQualityData.breath_voc_equivalent, unit: "ppb" },
              { label: "CO2 Equivalent", value: airQualityData.co2_equivalent, unit: "ppm" },
              { label: "Gas Percentage", value: airQualityData.gas_percentage, unit: "%" },
              { label: "Humidity", value: airQualityData.heat_compensated_humidity, unit: "%" },
              { label: "Temperature", value: airQualityData.heat_compensated_temperature, unit: "°C" },
              { label: "IAQ", value: airQualityData.iaq, unit: "" },
              { label: "Raw Gas", value: airQualityData.raw_gas, unit: "ohm" },
              { label: "Raw Humidity", value: airQualityData.raw_humidity, unit: "%" },
              { label: "Raw Pressure", value: airQualityData.raw_pressure, unit: "Pa" },
              { label: "Raw Temperature", value: airQualityData.raw_temperature, unit: "°C" },
            ].map(({ label, value, unit }) => (
              <div key={label} className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">{label}:</span>
                <span className="text-sm font-medium">
                  {value !== undefined ? `${value.toFixed(2)}${unit}` : "N/A"}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No data available</p>
        )}
      </CardContent>
    </Card>
  )
}

export default AirQuality