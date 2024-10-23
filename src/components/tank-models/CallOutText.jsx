import React from 'react';
import { Html } from '@react-three/drei';

const CallOutText = ({ position, text}) => {
  return (
    <>
      <Html 
        position={position} 
        center 
        occlude 
        transform={false} 
        distanceFactor={5}
      >
        <div style={{ 
          padding: '5px 15px', 
          backgroundColor: 'rgba(235, 233, 233, 0.2)', // Fondo translúcido
          color: '#000000', 
          border: '1px solid #000000',
          borderRadius: '5px',
          fontSize: '14px',
          fontFamily: 'Arial, sans-serif',
          fontWeight: 'bold',
          boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.3)', // Sombra sutil
          textAlign: 'center'
        }}>
          {text}
        </div>
      </Html>
    </>
  );
};

export default CallOutText;
