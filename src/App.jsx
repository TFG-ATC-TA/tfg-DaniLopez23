import React, { useState, useEffect } from "react";
import { setupSocketListeners } from "./WebSockets/SetupSocketListeners";
import { socket } from "./webSockets/socket";
import { getFarm } from "./services/farm";
import Header from "./components/Header";
import SensorData from "./components/sensorData/SensorData";
import TankModel from "./components/TankModel";
import TankInformation from "./components/TankInformation";

export default function App() {
  const [milkQuantityData, setMilkQuantityData] = useState(null);
  const [encoderData, setEncoderData] = useState(null);
  const [gyroscopeData, setGyroscopeData] = useState(null);
  const [switchStatus, setSwitchStatus] = useState(null);
  const [tankTemperaturesData, setTankTemperaturesData] = useState(null);
  const [airQualityData, setAirQualityData] = useState(null);
  const [weightData, setWeightData] = useState(null);

  const [farmData, setFarmData] = useState({});
  const [serverStatus, setServerStatus] = useState("connecting");
  const [selectedTank, setSelectedTank] = useState(null);

  useEffect(() => {
    const cleanup = setupSocketListeners(
      socket,
      setEncoderData,
      setGyroscopeData,
      setMilkQuantityData,
      setTankTemperaturesData,
      setSwitchStatus,
      setWeightData,
      setAirQualityData
    );

    socket.on("connect", () => setServerStatus("connected"));
    socket.on("disconnect", () => setServerStatus("disconnected"));

    return () => {
      cleanup();
      socket.off("connect");
      socket.off("disconnect");
    };
  }, []);

  useEffect(() => {
    getFarm().then((data) => {
        const farm = data;
        setFarmData(farm);
        if (farm.equipments && farm.equipments.length > 0) {
          setSelectedTank(farm.equipments[0]);
        }
    });
  }, []);

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <Header 
        farmData={farmData} 
        serverStatus={serverStatus} 
        selectedTank={selectedTank}
        setSelectedTank={setSelectedTank}
      />
      <div className="flex flex-grow overflow-hidden">
        <div className="w-64 bg-white shadow-md overflow-y-auto">
          <SensorData
            milkQuantityData={milkQuantityData}
            tankTemperaturesData={tankTemperaturesData}
            weightData={weightData}
            switchStatus={switchStatus}
            airQualityData={airQualityData}
            encoderData={encoderData}
            gyroscopeData={gyroscopeData}
          />
        </div>
        <div className="flex-grow flex flex-col overflow-hidden">
          <div className="p-4 mb-4">
            <TankInformation selectedTank={selectedTank} />
          </div>
          <div className="flex-grow overflow-auto p-4">
            <TankModel
              farmData={farmData}
              selectedTank={selectedTank}
              milkQuantityData={milkQuantityData}
              encoderData={encoderData}
              gyroscopeData={gyroscopeData}
              switchStatus={switchStatus}
              tankTemperaturesData={tankTemperaturesData}
              weightData={weightData}
              airQualityData={airQualityData}
            />
          </div>
        </div>
      </div>
    </div>
  );
}