import { useState, useEffect, Suspense } from 'react';
import { Canvas } from "@react-three/fiber";
import SensorData from "./SensorData/SensorData";
import TankStatus from "./TankStatus";
import TankInformation from "./TankInformation";
import SelectedSensorData from "./sensorData/SelectedSensorData";
import FilterComponent from './FilterHistoricalData';
import CameraSettings from "./Camera/CameraSettings";
import { Model } from "./tank-models/HorizontalTank2Blades";

import { getHistoricalData } from '@/services/farm';

const TankModelLayout = ({ children }) => {
  return (
    <div className="relative w-full h-full">
      <div className="absolute top-4 left-4 z-10">
        <SelectedSensorData />
      </div>
      {children}
    </div>
  );
};

const DigitalTwin = ({
  encoderData,
  milkQuantityData,
  switchStatus,
  weightData,
  tankTemperaturesData,
  airQualityData,
  selectedData,
  selectedTank,
}) => {
  const realTimeData = {
    encoderData,
    milkQuantityData,
    switchStatus,
    weightData,
    tankTemperaturesData,
    airQualityData,
    selectedData
  };

  const [historicalData, setHistoricalData] = useState(null);
  const [mode, setMode] = useState('realtime');

  const [filters, setFilters] = useState({
    date: null,
    selectedStatus: 'all',
    selectedSensor: 'all',
    showAnomalous: false,
    timeSlider: 0
  });

  useEffect(() => {
    if (mode === 'historical' && filters.date) {
      fetchHistoricalData();
    }
  }, [filters]);

  const fetchHistoricalData = async () => {
    try {
      const data = await getHistoricalData({
        date: filters.date,
        status: filters.selectedStatus,
        sensor: filters.selectedSensor,
        showAnomalous: filters.showAnomalous,
        hour: filters.timeSlider,
        tankId: selectedTank?._id
      });
      setHistoricalData(data);
    } catch (error) {
      console.error('Error fetching historical data:', error);
    }
  };

  const renderTankModel = () => {
    const data = mode === 'realtime' ? realTimeData : historicalData;

    if (mode === 'historical' && !data) {
      return <div className="flex items-center justify-center h-full">Select a date to watch data</div>;
    }

    if (!data) {
      return <div className="flex items-center justify-center h-full">Loading...</div>;
    }

    return (
      <Canvas className="w-full h-full">
        <ambientLight intensity={0.6} />
        <directionalLight position={[-10, -10, -10]} intensity={0.5} />
        <Suspense fallback={null}>
          <group>
            <Model
              encoderData={data.encoderData}
              milkQuantityData={data.milkQuantityData}
              switchStatus={data.switchStatus}
              weightData={data.weightData}
              tankTemperaturesData={data.tankTemperaturesData}
              airQualityData={data.airQualityData}
              selectedData={data.selectedData}
            />
          </group>
          <CameraSettings view={data.selectedData} />
        </Suspense>
      </Canvas>
    );
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="w-64 bg-white shadow-md overflow-auto">
        <SensorData className="w-full" />
      </div>
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-shrink-0 bg-white shadow-md p-4">
          <TankInformation selectedTank={selectedTank} mode={mode} setMode={setMode} />
        </div>
        <div className="flex-1 flex overflow-hidden">
          <TankModelLayout className="flex-1">
            {renderTankModel()}
          </TankModelLayout>
          {mode === 'historical' && (
            <div className="w-64 bg-white shadow-md overflow-auto p-4">
              <FilterComponent 
                filters={filters} 
                setFilters={setFilters}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DigitalTwin;