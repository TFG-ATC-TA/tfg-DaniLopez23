import { useSocket } from './WebSockets/SocketProvider';
import useTankStore from "./Stores/useTankStore";
import useDataStore from "./Stores/useDataStore";
import { Routes, Route, Navigate } from 'react-router-dom';
import Header from "./components/Header";
import SensorData from "./components/sensorData/SensorData";
import RealTimeTankModel from "./components/RealTimeTankModel";
import HistoricalTankModel from "./components/HistoricalTankModel";
import TankInformation from "./components/TankInformation";
import SelectedSensorData from "./components/sensorData/SelectedSensorData";
import TankStatus from './components/TankStatus';

const TankModelLayout = ({ children }) => {
  return (
    <div className="flex-grow bg-white shadow-md rounded-lg relative">
      <div className="absolute top-4 left-4 z-10">
        <SelectedSensorData />
      </div>
      {children}
    </div>
  );
};

export default function App() {
  const { serverStatus } = useSocket();
  const { selectedTank } = useTankStore((state) => state);
  const { farmData } = useDataStore((state) => state);

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <Header serverStatus={serverStatus} farmData={farmData} />
      <div className="flex flex-grow overflow-hidden p-2 gap-2">
        <div className="w-64 bg-white shadow-md rounded-lg overflow-auto">
          <SensorData className="w-full" />
        </div>
        <div className="flex-1 flex flex-col gap-2">
          <div className="flex gap-2">
            <div className="flex-1 bg-white shadow-md rounded-lg p-2">
              <TankInformation />
            </div>
            <div className="w-1/5 bg-white shadow-md rounded-lg p-4">
              <TankStatus status={selectedTank?.status || "Working"} />
            </div>
          </div>
          <Routes>
            <Route 
              path="/" 
              element={
                <Navigate to="/real-time" replace />
              } 
            />
            <Route 
              path="/real-time" 
              element={
                <TankModelLayout>
                  <RealTimeTankModel 
                    farmData={farmData} 
                    selectedTank={selectedTank} 
                  />
                </TankModelLayout>
              } 
            />
            <Route 
              path="/historical" 
              element={
                <TankModelLayout>
                  <HistoricalTankModel 
                    farmData={farmData} 
                    selectedTank={selectedTank} 
                  />
                </TankModelLayout>
              } 
            />
          </Routes>
        </div>
      </div>
    </div>
  );
}