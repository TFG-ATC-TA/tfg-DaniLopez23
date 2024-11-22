import useDataStore from "@/Stores/useDataStore";

import AirQuality from "./AirQuality";
import MagneticSwitch from "./MagneticSwitch";
import TankTemperatures from "./TankTemperatures";
import MilkQuantity from "./MilkQuantity";
import Encoder from "./Encoder";
import Gyroscope from "./Gyroscope";

const SensorData = ({className}) => {
  const {
    encoderData,
    gyroscopeData,
    milkQuantityData,
    tankTemperaturesData,
    switchStatus,
    weightData,
    airQualityData,
  } = useDataStore((state) => state);

  return (
    <div className={`p-4 ${className}`}>
      <h2 className="text-xl font-bold mb-4">Sensor Data</h2>
      <div className="space-y-4">
        <MilkQuantity milkQuantityData={milkQuantityData} />
        <TankTemperatures tankTemperaturesData={tankTemperaturesData} />
        <MagneticSwitch switchStatus={switchStatus} />
        <Encoder encoderData={encoderData} />
        <Gyroscope gyroscopeData={gyroscopeData} />
        <AirQuality airQualityData={airQualityData} />
      </div>
    </div>
  );
};

export default SensorData;
