import { useEffect, useState } from "react";
import useTankStore from "./Stores/useTankStore";
import { createSocket } from "./WebSockets/Socket";
import { getFarm } from "./services/farm";
import Header from "./components/Header";
import SensorData from "./components/sensorData/SensorData";
import TankModel from "./components/TankModel";
import TankInformation from "./components/TankInformation";
import { setupSocketListeners } from "./WebSockets/SetupSocketListeners";

const FARM_ID = "synthetic-farm-1";
const socket = createSocket();

export default function App() {
  const { selectedTank, setSelectedTank } = useTankStore((state) => state);

  const [farmData, setFarmData] = useState({});
  const [serverStatus, setServerStatus] = useState("disconnected");

  // Obtener datos iniciales de la granja
  useEffect(() => {
    const initializeApp = async () => {
      try {
        const data = await getFarm();
        setFarmData(data);
        setSelectedTank(data.equipments?.[0] || null); // Seleccionar tanque inicial
      } catch (error) {
        console.error("Error al inicializar la aplicación:", error);
      }
    };

    initializeApp();
  }, [setSelectedTank]);

  setupSocketListeners(socket);

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <Header serverStatus={serverStatus} farmData={farmData} />
      <div className="flex flex-grow overflow-hidden">
        <div className="w-64 bg-white shadow-md overflow-y-auto">
          <SensorData />
        </div>
        <div className="flex-grow flex flex-col overflow-hidden">
          <div className="p-4 mb-4">
            <TankInformation />
          </div>
          <div className="flex-grow overflow-auto p-4">
            <TankModel farmData={farmData} selectedTank={selectedTank} />
          </div>
        </div>
      </div>
    </div>
  );
}
