import { Card, CardContent } from "@/components/ui/card";

const AirQualityLegend = ({ temperature, humidity }) => {
  const getTemperatureColor = (temp) => {
    const t = Math.max(0, Math.min(40, temp)) / 40;
    const r = Math.round(t * 255);
    const b = Math.round((1 - t) * 255);
    return `rgb(${r}, 0, ${b})`;
  };

  const getParticleSize = (hum) => {
    return 10 * (1 + (hum - 50) / 100);
  };

  return (
    <Card className="w-64">
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold mb-4">Air Quality Legend</h3>
        
        <div className="mb-4">
          <h4 className="text-sm font-medium mb-2">Temperature</h4>
          <div className="flex items-center justify-between">
            <span className="text-xs">Cold (0°C)</span>
            <span className="text-xs">Hot (40°C)</span>
          </div>
          <div className="h-4 w-full bg-gradient-to-r from-blue-500 to-red-500 rounded"></div>
          <div className="mt-1 flex justify-center items-center">
            <div 
              className="w-4 h-4 rounded-full mr-2" 
              style={{ backgroundColor: getTemperatureColor(temperature) }}
            ></div>
            <span className="text-xs">Current: {temperature}°C</span>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium mb-2">Humidity</h4>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs">Dry (0%)</span>
            <span className="text-xs">Wet (100%)</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full border border-gray-300"></div>
            <div className="flex-grow mx-2 h-1 bg-gray-200"></div>
            <div className="w-8 h-8 rounded-full border border-gray-300"></div>
          </div>
          <div className="mt-2 flex justify-center items-center">
            <div 
              className="rounded-full mr-2" 
              style={{ 
                width: `${getParticleSize(humidity)}px`, 
                height: `${getParticleSize(humidity)}px`,
                backgroundColor: 'gray' 
              }}
            ></div>
            <span className="text-xs">Current: {humidity}%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AirQualityLegend;