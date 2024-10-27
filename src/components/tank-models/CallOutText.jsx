import React from 'react';
import { Html } from '@react-three/drei';

const CallOutText = ({ position, text, icon }) => {
  return (
    <Html position={position} center distanceFactor={5}>
      <div className="flex items-center space-x-2 bg-white bg-opacity-80 text-black px-3 py-2 rounded-full shadow-lg backdrop-blur-sm transition-all duration-300 hover:bg-opacity-100">
        {icon && <span className="text-primary">{icon}</span>}
        <span className="text-sm font-medium whitespace-nowrap">{text}</span>
      </div>
    </Html>
  );
};

export default CallOutText;