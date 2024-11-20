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
  const { connect, disconnect } = useSocketStore((state) => state);
  const { selectedTank, setSelectedTank } = useTankStore((state) => state);
  const [farmData, setFarmData] = useState({});
  const serverStatus = "connected";

  // Configurar conexión global del WebSocket
  useEffect(() => {
    connect("http://localhost:3001");

    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  // Cargar datos de la granja y configurar el tanque seleccionado por defecto
  useEffect(() => {
    getFarm().then((data) => {
      setFarmData(data);
      if (data.equipments && data.equipments.length > 0) {
        setSelectedTank(data.equipments[0]); // Seleccionar el primer tanque por defecto
      }
    });
  }, [setSelectedTank]);

  // Inicializar escucha de datos según el tanque seleccionado
  useSocketSetup(FARM_ID);

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <Header serverStatus={serverStatus} farmData={farmData}/>
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
