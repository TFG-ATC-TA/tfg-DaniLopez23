import React from 'react';
import { Html, Line, Circle } from '@react-three/drei';

const CallOutText = ({ position, targetPosition, text, radius = 0.1 }) => {
  // Calcular un punto ajustado para que la línea termine en el borde del círculo
  const adjustedTargetPosition = [
    targetPosition[0],
    targetPosition[1],
    targetPosition[2] + radius,  // Ajustamos la Z para que la línea toque el borde
  ];

  // Punto intermedio para hacer dos líneas
  const midPosition = [position[0], adjustedTargetPosition[1], adjustedTargetPosition[2]]; 

  return (
    <>
      {/* Etiqueta flotante con sombra y transparencia */}
      <Html position={position} center>
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
