import { useEffect, useState } from "react";
import useSocketStore from "./Stores/useSocketStore";
import useTankStore from "./Stores/useTankStore";
import useSocketSetup from "./hooks/useSocketSetup";
import { getFarm } from "./services/farm";
import Header from "./components/Header";
import SensorData from "./components/sensorData/SensorData";
import TankModel from "./components/TankModel";
import TankInformation from "./components/TankInformation";

const FARM_ID = "synthetic-farm-1";

export default function App() {

  const { selectedTank, setSelectedTank } = useTankStore((state) => (state));

  const [farmData, setFarmData] = useState({});
  const serverStatus = "connected";

  // Inicializar conexión del socket y obtener datos de la granja
  useEffect(() => {
    const initializeApp = async () => {
      try {
        const data = await getFarm(); // Obtener datos de la granja
        setFarmData(data);
        setSelectedTank(data.equipments?.[0] || null); // Seleccionar el primer tanque por defecto
      } catch (error) {
        console.error("App initialization error:", error);
      }
    };

    initializeApp();

    // Cleanup: desconectar socket al desmontar componente
    return () => {
      disconnect();
    };
  }, [setSelectedTank]);

  // Configurar listeners del socket para datos del tanque
  useSocketSetup(FARM_ID);

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
