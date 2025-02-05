import React from 'react';
import { Html } from '@react-three/drei';

const CallOutText = ({ position, text, icon }) => {
  return (
    <Html
      position={position}
      center
      distanceFactor={5}
      occlude
    >
      <div className="pointer-events-none">
        <div className="flex items-center bg-white/90 rounded-lg shadow-lg p-2 border border-gray-200/50">
          
          {/* Texto */}
          <span className="text-sm font-medium text-gray-800 pr-1">
            {text}
          </span>
          
          {/* Indicador */}
          <div className="absolute -bottom-[5px] left-1/2 -translate-x-1/2 w-3 h-3 bg-white/90 transform rotate-45 border-b border-r border-gray-200/50"></div>
        </div>
      </div>
    </Html>
  );
};

export default CallOutText;