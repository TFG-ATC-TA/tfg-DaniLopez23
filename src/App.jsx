import { useSocket } from './WebSockets/SocketProvider';
import useTankStore from "./Stores/useTankStore";
import useDataStore from "./Stores/useDataStore";
import Header from "./components/Header";
import SensorData from "./components/sensorData/SensorData";
import RealTimeTankModel from "./components/RealTimeTankModel";
import HistoricalTankModel from "./components/HistoricalTankModel";
import TankInformation from "./components/TankInformation";
import SelectedSensorData from "./components/sensorData/SelectedSensorData";
import TankStatus from './components/TankStatus';
import DigitalTwin from './components/DigitalTwin';

export default function App() {
  const { serverStatus } = useSocket();
  const { farmData } = useDataStore((state) => state);

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <Header serverStatus={serverStatus} farmData={farmData} />
      <DigitalTwin />
    </div>
  );
}