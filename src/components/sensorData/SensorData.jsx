import { useState } from "react";
import useDataStore from "@/Stores/useDataStore";
import AirQuality from "./AirQuality";
import MagneticSwitch from "./MagneticSwitch";
import TankTemperatures from "./TankTemperatures";
import MilkQuantity from "./MilkQuantity";
import Encoder from "./Encoder";
import Gyroscope from "./Gyroscope";
import Weight from "./Weight";

const SensorData = ({ className }) => {
  const {
    encoderData,
    gyroscopeData,
    milkQuantityData,
    tankTemperaturesData,
    switchStatus,
    weightData,
    airQualityData,
    setSelectedData,
    selectedData,
  } = useDataStore((state) => state);

  const handleCardSelect = (cardName) => {

    if (cardName === selectedData) {
      setSelectedData(null);
      return
    }

    setSelectedData(cardName);
  };

  return (
    <div className={`p-4 ${className}`}>
      <h2 className="text-xl font-bold mb-4">Sensor Data</h2>
      <div className="space-y-4">
        <MilkQuantity
          milkQuantityData={milkQuantityData}
          isSelected={selectedData === "MilkQuantity"}
          onSelect={() => handleCardSelect("MilkQuantity")}
        />
        <TankTemperatures
          tankTemperaturesData={tankTemperaturesData}
          isSelected={selectedData === "TankTemperatures"}
          onSelect={() => handleCardSelect("TankTemperatures")}
        />
        <MagneticSwitch
          switchStatus={switchStatus}
          isSelected={selectedData === "MagneticSwitch"}
          onSelect={() => handleCardSelect("MagneticSwitch")}
        />
        <Encoder
          encoderData={encoderData}
          isSelected={selectedData === "Encoder"}
          onSelect={() => handleCardSelect("Encoder")}
        />
        <Gyroscope
          gyroscopeData={gyroscopeData}
          isSelected={selectedData === "Gyroscope"}
          onSelect={() => handleCardSelect("Gyroscope")}
        />
        <Weight
          weightData={weightData}
          isSelected={selectedData === "Weight"}
          onSelect={() => handleCardSelect("Weight")}
        />
        <AirQuality
          airQualityData={airQualityData}
          isSelected={selectedData === "AirQuality"}
          onSelect={() => handleCardSelect("AirQuality")}
        />
      </div>
    </div>
  );
};

export default SensorData;
