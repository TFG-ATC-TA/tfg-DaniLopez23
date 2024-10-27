import React from 'react';
import { Html } from '@react-three/drei';
import { Thermometer, Wind, Droplets, Gauge } from 'lucide-react';

const DataItem = ({ icon, label, value, unit }) => (
  <div className="flex items-center justify-between mb-1">
    <div className="flex items-center">
      {icon}
      <span className="text-xs ml-1">{label}:</span>
    </div>
    <span className="text-xs font-medium">{value} {unit}</span>
  </div>
);

const CallOutTextAirQuality = ({ position, data }) => {
  return (
    <Html position={position} center distanceFactor={10}>
      <div className="bg-white bg-opacity-80 text-black p-3 rounded-lg shadow-lg backdrop-blur-sm transition-all duration-300 hover:bg-opacity-100 w-64">
        <div className="flex items-center justify-between mb-2">
          <Gauge size={20} className="text-purple-500" />
          <span className="text-sm font-bold">Outside Tank Data</span>
        </div>
        {data ? <div className="space-y-2">
          <div>
            <DataItem icon={<Thermometer size={12} className="text-red-500" />} label="Temperature" value={data.heat_compensated_temperature} unit="°C" />
            <DataItem icon={<Droplets size={12} className="text-blue-500" />} label="Humidity" value={data.heat_compensated_humidity} unit="%" />
            <DataItem icon={<Wind size={12} className="text-green-500" />} label="Pressure" value={data.raw_pressure / 100} unit="hPa" />
          </div>
          <div>
            <DataItem icon={<Gauge size={12} className="text-yellow-500" />} label="IAQ" value={data.iaq} unit="" />
            <DataItem icon={<Gauge size={12} className="text-orange-500" />} label="CO2 Equivalent" value={data.co2_equivalent} unit="ppm" />
            <DataItem icon={<Gauge size={12} className="text-pink-500" />} label="VOC Equivalent" value={data.breath_voc_equivalent} unit="ppm" />
          </div>
          <div>
            <DataItem icon={<Gauge size={12} className="text-indigo-500" />} label="Gas" value={data.raw_gas} unit="" />
            <DataItem icon={<Gauge size={12} className="text-purple-500" />} label="Gas Percentage" value={data.gas_percentage} unit="%" />
          </div>
        </div> : <span className="text-sm">No data available</span>}
      </div>
    </Html>
  );
};

export default CallOutTextAirQuality;