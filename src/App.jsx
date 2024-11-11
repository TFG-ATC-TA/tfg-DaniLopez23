import React, { useState, useEffect } from "react";
import { setupSocketListeners } from "./WebSockets/SetupSocketListeners";
import { socket } from "./webSockets/socket";
import { getFarm } from "./services/farm";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import TankInformation from "./components/TankInformation";
import TankModel from "./components/TankModel";

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
      if (Array.isArray(data) && data.length > 0) {
        const farm = data[0];
        setFarmData(farm);
        if (farm.tanks && farm.tanks.length > 0) {
          setSelectedTank(farm.tanks[0]);
        }
      } else {
        console.error("No data found");
      }
    });
  }, []);

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <Header farmData={farmData} serverStatus={serverStatus} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          className="w-64 bg-white shadow-md"
          farmData={farmData}
          selectedTank={selectedTank}
          setSelectedTank={setSelectedTank}
        />
        <div className="flex flex-col flex-1 overflow-hidden">
          <div className="p-4">
            <TankInformation
              selectedTank={selectedTank}
              className="mb-4"
            />
          </div>
          <div className="flex-1 overflow-hidden">
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