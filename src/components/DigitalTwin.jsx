import SensorData from "./SensorData/SensorData";
import TankStatus from "./TankStatus";
import RealTimeTankModel from "./RealTimeTankModel";
import HistoricalTankModel from "./HistoricalTankModel";
import TankInformation from "./TankInformation";
import SelectedSensorData from "./sensorData/SelectedSensorData";

import { Routes, Route, Navigate } from "react-router-dom";

import useTankStore from "@/Stores/useTankStore";
import useDataStore from "@/Stores/useDataStore";
import { useSocket } from "@/WebSockets/SocketProvider";

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

const DigitalTwin = () => {

  const { selectedTank } = useTankStore((state) => state);
  const { serverStatus } = useSocket();

  return (
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
          <Route path="/" element={<Navigate to="/real-time" replace />} />
          <Route
            path="/real-time"
            element={
              <TankModelLayout>
                <RealTimeTankModel />
              </TankModelLayout>
            }
          />
          <Route
            path="/historical"
            element={
              <TankModelLayout>
                <HistoricalTankModel
                />
              </TankModelLayout>
            }
          />
        </Routes>
      </div>
    </div>
  );
};

export default DigitalTwin;
