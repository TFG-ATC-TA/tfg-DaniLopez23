import { useState } from "react";
import { Wind, ChevronDown, ChevronUp } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const AirQuality = ({ airQualityData }) => {
  const [expanded, setExpanded] = useState(true);
  const { value, tags, readableDate } = airQualityData || {};

  const metrics = [
    { label: "Breath VOC", value: value?.breath_voc_equivalent, unit: "ppb" },
    { label: "CO2 ", value: value?.co2_equivalent, unit: "ppm" },
    { label: "Gas Percentage", value: value?.gas_percentage, unit: "%" },
    { label: "Humidity", value: value?.heat_compensated_humidity, unit: "%" },
    { label: "Temperature", value: value?.heat_compensated_temperature, unit: "°C" },
    { label: "IAQ", value: value?.iaq, unit: "" },
    { label: "Raw Gas", value: value?.raw_gas, unit: "ohm" },
    { label: "Raw Humidity", value: value?.raw_humidity, unit: "%" },
    { label: "Raw Pressure", value: value?.raw_pressure, unit: "Pa" },
    { label: "Raw Temperature", value: value?.raw_temperature, unit: "°C" },
  ];

  const toggleExpanded = () => setExpanded(!expanded);

  return (
    <Card
      className={`transition-all duration-300 ease-in-out overflow-hidden 
      ring-2 ring-blue-200 bg-blue-50/20
      ${expanded ? "w-82 h-auto" : "w-16 h-16 flex items-center justify-center"}`}
    >
      {expanded ? (
        <>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium flex items-center space-x-2">
                <Wind size={16} className="text-blue-500" />
                <span>Air Quality Sensor</span>
              </CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleExpanded}
                className="text-blue-500 hover:bg-transparent"
              >
                <ChevronUp size={18} />
              </Button>
            </div>
          </CardHeader>

          {value ? (
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Board ID:</span>
                    <span className="font-medium">{tags?.board_id || "N/A"}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Last Reading:</span>
                    <span className="font-medium">{readableDate || "N/A"}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {metrics.map(({ label, value, unit }) => (
                    <div key={label} className="bg-blue-100/30 p-2 rounded-md">
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
          ) : (
            <CardContent className="flex items-center justify-center h-24">
              <span className="text-sm text-muted-foreground">No Data Available</span>
            </CardContent>
          )}
        </>
      ) : (
        // Vista colapsada
        <button onClick={toggleExpanded} className="flex flex-col items-center space-y-1">
          <Wind size={20} className="text-blue-500" />
          <ChevronDown size={16} className="text-muted-foreground" />
        </button>
      )}
    </Card>
  );
};

export default AirQuality;