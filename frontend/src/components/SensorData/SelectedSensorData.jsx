import useDataStore from "@/Stores/useDataStore";
import AirQuality from "../sensorData/AirQuality";
import MagneticSwitch from "../sensorData/MagneticSwitch";
import TankTemperatures from "../sensorData/TankTemperatures";
import MilkQuantity from "../sensorData/MilkQuantity";
import Encoder from "../sensorData/Encoder";
import Gyroscope from "../sensorData/Gyroscope";
import Weight from "../sensorData/Weight";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Thermometer, Droplet, ToggleLeft, Compass, Gauge, WeightIcon, Wind } from 'lucide-react';

const SelectedSensorData = () => {
  const {
    selectedData,
    encoderData,
    gyroscopeData,
    milkQuantityData,
    tankTemperaturesData,
    switchStatus,
    weightData,
    airQualityData,
  } = useDataStore((state) => state);

  const renderSelectedComponent = () => {
    switch (selectedData) {
      case "MilkQuantity":
        return <MilkQuantity milkQuantityData={milkQuantityData} isSelected={true} />;
      case "TankTemperatures":
        return <TankTemperatures tankTemperaturesData={tankTemperaturesData} isSelected={true} />;
      case "MagneticSwitch":
        return <MagneticSwitch switchStatus={switchStatus} isSelected={true} />;
      case "Encoder":
        return <Encoder encoderData={encoderData} isSelected={true} />;
      case "Gyroscope":
        return <Gyroscope gyroscopeData={gyroscopeData} isSelected={true} />;
      case "Weight":
        return <Weight weightData={weightData} isSelected={true} />;
      case "AirQuality":
        return <AirQuality airQualityData={airQualityData} isSelected={true} />;
      default:
        return null;
    }
  };

  const getIcon = () => {
    switch (selectedData) {
      case "MilkQuantity": return Droplet;
      case "TankTemperatures": return Thermometer;
      case "MagneticSwitch": return ToggleLeft;
      case "Encoder": return Gauge;
      case "Gyroscope": return Compass;
      case "Weight": return WeightIcon;
      case "AirQuality": return Wind;
      default: return null;
    }
  };

  if (!selectedData) return null;

  return (
    <>{renderSelectedComponent()}</>
  );
};

export default SelectedSensorData;