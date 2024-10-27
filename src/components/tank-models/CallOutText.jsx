import React from 'react';
import { Html } from '@react-three/drei';

const CallOutText = ({ position, text }) => {
  return (
    <Html position={position} prepend  center transform={false} distanceFactor={3}>
      <div style={{ 
        padding: '5px 30px', // Más ancho para un diseño alargado
        backgroundColor: 'rgba(235, 233, 233, 0.2)', 
        color: '#000000', 
        borderRadius: '5px',
        fontSize: '16px', // Tamaño de letra más pequeño
        fontFamily: 'Arial, sans-serif',
        fontWeight: 'bold',
        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.3)', 
        textAlign: 'Center'
      }}>
        {text}
      </div>
    </Html>
  );
};

export default CallOutText;
