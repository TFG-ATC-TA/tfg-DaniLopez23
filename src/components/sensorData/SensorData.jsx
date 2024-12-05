import useDataStore from "@/Stores/useDataStore";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Thermometer, Droplet, ToggleLeft, Compass, Gauge, Weight, Wind } from 'lucide-react';

const SensorData = ({ className }) => {
  const { setSelectedData, selectedData } = useDataStore((state) => state);

  const sensors = [
    { name: "MilkQuantity", icon: Droplet },
    { name: "TankTemperatures", icon: Thermometer },
    { name: "MagneticSwitch", icon: ToggleLeft },
    { name: "Encoder", icon: Gauge },
    { name: "Gyroscope", icon: Compass },
    { name: "Weight", icon: Weight },
    { name: "AirQuality", icon: Wind }
  ];

  const handleCardSelect = (cardName) => {
    if (cardName === selectedData) {
      setSelectedData(null);
    } else {
      setSelectedData(cardName);
    }
  };

  return (
    <div className={`p-4 ${className}`}>
      <h2 className="text-xl font-bold mb-4">Sensor Data</h2>
      <div className="flex flex-col space-y-2">
        {sensors.map((sensor) => (
          <Button
            key={sensor.name}
            onClick={() => handleCardSelect(sensor.name)}
            variant="outline"
            className={cn(
              "flex items-center justify-between w-full px-4 py-2 h-12",
              selectedData === sensor.name && "ring-2 ring-blue-500"
            )}
          >
            <div className="flex items-center gap-2">
              <sensor.icon size={16} className="text-blue-500" />
              <span>{sensor.name}</span>
            </div>
            <div
              className={cn(
                "w-3 h-3 rounded-full border border-blue-500 transition-all duration-300",
                selectedData === sensor.name ? "bg-blue-500" : "bg-transparent"
              )}
            />
          </Button>
        ))}
      </div>
    </div>
  );
};

export default SensorData;