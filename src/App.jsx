import { useSocket } from './WebSockets/SocketProvider';
import useTankStore from "./Stores/useTankStore";
import useDataStore from "./Stores/useDataStore";
import Header from "./components/Header";
import SensorData from "./components/sensorData/SensorData";
import TankModel from "./components/TankModel";
import TankInformation from "./components/TankInformation";

export default function App() {
  const { serverStatus } = useSocket();
  const { selectedTank } = useTankStore((state) => state);
  const { farmData } = useDataStore((state) => state);

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