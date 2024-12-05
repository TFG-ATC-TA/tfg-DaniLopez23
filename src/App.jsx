import { useSocket } from './WebSockets/SocketProvider';
import useTankStore from "./Stores/useTankStore";
import useDataStore from "./Stores/useDataStore";
import Header from "./components/Header";
import SensorData from "./components/sensorData/SensorData";
import TankModel from "./components/TankModel";
import TankInformation from "./components/TankInformation";
import SelectedSensorData from "./components/sensorData/SelectedSensorData";

export default function App() {
  const { serverStatus } = useSocket();
  const { selectedTank } = useTankStore((state) => state);
  const { farmData } = useDataStore((state) => state);

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <Header serverStatus={serverStatus} farmData={farmData} />
      <div className="flex flex-grow overflow-hidden p-4 gap-4">
        <div className="w-1/4 bg-white shadow-md rounded-lg overflow-auto">
          <SensorData className="w-full" />
        </div>
        <div className="w-3/4 flex flex-col gap-4">
          <div className="bg-white shadow-md rounded-lg p-4">
            <TankInformation />
          </div>
          <div className="flex-grow bg-white shadow-md rounded-lg relative">
            <div className="absolute top-4 left-4 z-10">
              <SelectedSensorData />
            </div>
            <TankModel farmData={farmData} selectedTank={selectedTank} />
          </div>
        </div>
      </div>
    </div>
  );
}