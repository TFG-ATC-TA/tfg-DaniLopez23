import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Thermometer, Droplet, Scale, Activity, Milk } from "lucide-react";

import AirQuality from "./AirQuality";
import MagneticSwitch from "./MagneticSwitch";
import TankTemperatures from "./TankTemperatures";
import MilkQuantity from "./MilkQuantity";
import Encoder from "./Encoder";
import Gyroscope from "./Gyroscope";

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