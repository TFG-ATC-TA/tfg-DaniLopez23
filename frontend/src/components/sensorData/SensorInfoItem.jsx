import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import useDataStore from "@/stores/useDataStore"
import { Thermometer, Droplet, ToggleLeft, Compass, Gauge, Weight, Wind } from "lucide-react"

const SensorInfoItem = ({ isRealTime, historicalData }) => {
  const { setSelectedData, selectedData } = useDataStore((state) => state)

  const sensors = [
    { name: "MilkQuantity", icon: Droplet },
    { name: "TankTemperatures", icon: Thermometer },
    { name: "MagneticSwitch", icon: ToggleLeft },
    { name: "Encoder", icon: Gauge },
    { name: "Gyroscope", icon: Compass },
    { name: "Weight", icon: Weight },
    { name: "AirQuality", icon: Wind },
  ]

  const handleCardSelect = (cardName) => {
    setSelectedData(cardName === selectedData ? null : cardName)
  }

  return (
    <div className="w-full p-2">
      

      {isRealTime || historicalData ? (
        <div className="flex flex-col gap-2 p-2 pt-0">
          {sensors.map((sensor) => (
            <Button
              key={sensor.name}
              onClick={() => handleCardSelect(sensor.name)}
              variant="ghost"
              className={cn(
                "h-14 justify-between px-4 rounded-xl transition-all",
                "hover:bg-accent/50 hover:shadow-sm",
                "border hover:border-primary/30",
                selectedData === sensor.name && "bg-primary/10 border-primary/30 shadow-sm ring-1 ring-primary/20",
              )}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <sensor.icon size={20} className="text-primary" />
                </div>
                <span className="font-medium text-foreground">{sensor.name}</span>
              </div>
              <div
                className={cn(
                  "w-2.5 h-2.5 rounded-full border-2 transition-colors",
                  selectedData === sensor.name
                    ? "bg-primary border-primary"
                    : "bg-transparent border-muted-foreground/30",
                )}
              />
            </Button>
          ))}
        </div>
      ) : (
        <div className="flex text-sm p-4 text-muted-foreground">
          <p>Select a date to view historical data</p>
        </div>
      )}
    </div>
  )
}

export default SensorInfoItem

