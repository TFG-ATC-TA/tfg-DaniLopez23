import useDataStore from "@/Stores/useDataStore";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Thermometer, Droplet, ToggleLeft, Compass, Gauge, Weight, Wind } from 'lucide-react';

const SensorData = ({isRealTime, historicalData}) => {
  const { setSelectedData, selectedData } = useDataStore((state) => state);
  console.log(historicalData, isRealTime);
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
    <div className="p-4 w-full">
      <h2 className="text-lg font-semibold mb-4 px-2 text-foreground">Sensor Data</h2>
      { (isRealTime || (historicalData && historicalData != "loading"))  && (<div className="flex flex-col gap-2">
        {sensors.map((sensor) => (
          <Button
            key={sensor.name}
            onClick={() => handleCardSelect(sensor.name)}
            variant="ghost"
            className={cn(
              "h-14 justify-between px-4 rounded-xl transition-all",
              "hover:bg-accent/50 hover:shadow-sm",
              "border hover:border-primary/30",
              selectedData === sensor.name && 
              "bg-primary/10 border-primary/30 shadow-sm ring-1 ring-primary/20"
            )}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <sensor.icon size={20} className="text-primary" />
              </div>
              <span className="font-medium text-foreground">{sensor.name}</span>
            </div>
            <div className={cn(
              "w-2.5 h-2.5 rounded-full border-2 transition-colors",
              selectedData === sensor.name ? 
                "bg-primary border-primary" : 
                "bg-transparent border-muted-foreground/30"
            )} />
          </Button>
        ))}
      </div>)}
    </div>
  );
};

export default SensorData;