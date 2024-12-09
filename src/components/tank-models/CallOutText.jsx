import React from 'react';
import { Html } from '@react-three/drei';

const CallOutText = ({ position, text, icon }) => {
  return (
    <Html
      position={position}
      center
      distanceFactor={5}
    >
      <div className="pointer-events-none">
        <div className="flex items-center space-x-2 px-3 py-2 bg-white bg-opacity-20 rounded-full">
          {icon && <span className="text-white text-opacity-90">{icon}</span>}
          <span className="text-sm font-bold text-black whitespace-nowrap">
            {text}
          </span>
        </div>
      </div>
    </Html>
  );
};

export default CallOutText;