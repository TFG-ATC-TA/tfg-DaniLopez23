import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Thermometer, Droplet, Scale, Activity, Milk } from "lucide-react";
import AirQuality from "./SensorData/AirQuality";
import MagneticSwitch from "./SensorData/MagneticSwitch";
import TankTemperatures from "./SensorData/TankTemperatures";
import MilkQuantity from "./SensorData/MilkQuantity";
import Encoder from "./SensorData/Encoder";
import Gyroscope from "./SensorData/Gyroscope";

const SensorData = ({ className, milkQuantityData, tankTemperaturesData, switchStatus, airQualityData, encoderData}) => {
  console.log(tankTemperaturesData)
  return (
    <div className={`p-4 ${className}`}>
      <h2 className="text-xl font-bold mb-4">Sensor Data</h2>
      <div className="space-y-4">
        <MilkQuantity milkQuantityData={milkQuantityData} />
        <TankTemperatures tankTemperaturesData={tankTemperaturesData} />
        <MagneticSwitch switchStatus={switchStatus} />
        <Encoder encoderData={encoderData} />
        <Gyroscope switchStatus={switchStatus} />
        <AirQuality airQualityData={airQualityData}/>
      </div>
    </div>
  );
};

export default SensorData;