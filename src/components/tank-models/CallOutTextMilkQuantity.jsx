import React from 'react';
import { Html } from '@react-three/drei';
import { Droplet } from 'lucide-react';

const CallOutTextMilkQuantity = ({ position, quantity }) => {
  const percentage = Math.min(100, Math.max(0, quantity));
  const fillHeight = `${percentage}%`;

  return (
    <Html position={position} center distanceFactor={10}>
      <div className="bg-white bg-opacity-80 text-black p-3 rounded-lg shadow-lg backdrop-blur-sm transition-all duration-300 hover:bg-opacity-100 w-40">
        <div className="flex items-center mb-2 space-x-2">
          <Droplet size={20} className="text-blue-500" />
          <span className="text-sm font-bold">Milk Quantity</span>
        </div>
        <div className="relative h-24 bg-gray-200 rounded-md overflow-hidden">
          <div 
            className="absolute bottom-0 left-0 right-0 bg-blue-500 transition-all duration-500 ease-in-out"
            style={{ height: fillHeight }}
          ></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-lg font-bold text-black">{percentage.toFixed(2)}%</span>
          </div>
        </div>
        <div className="mt-2 text-xs text-center text-gray-600">
          Current milk level
        </div>
      </div>
    </Html>
  );
};

export default CallOutTextMilkQuantity;