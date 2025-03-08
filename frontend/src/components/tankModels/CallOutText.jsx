import { Html } from '@react-three/drei';
import { useState, useEffect } from 'react';

const CallOutText = ({ position, title, value}) => {
  const [visible, setVisible] = useState(true);
  
  // Detectar cuando se abre un modal
  useEffect(() => {
    const checkForModals = () => {
      // Buscar elementos con clase o atributos que indiquen que es un modal abierto
      const openModals = document.querySelectorAll('[role="dialog"], .modal-open, [data-state="open"]');
      setVisible(openModals.length === 0);
    };
    
    // Verificar inicialmente
    checkForModals();
    
    // Observar cambios en el DOM para detectar cuando se abren/cierran modales
    const observer = new MutationObserver(checkForModals);
    observer.observe(document.body, { 
      childList: true, 
      subtree: true,
      attributes: true,
      attributeFilter: ['class', 'data-state', 'role']
    });
    
    // Limpiar observer
    return () => observer.disconnect();
  }, []);

  if (!visible) return null;

  return (
    <Html
      position={position}
      center
      distanceFactor={4}
      occlude
      // Asegurarse de que el portal se renderice en un contenedor con z-index bajo
      portal={{ 
        rootContainer: document.body,
        containerProps: { 
          style: { 
            zIndex: 0,
            pointerEvents: 'none'
          } 
        }
      }}
      // Evitar que el HTML capture eventos del mouse que deberían ir al canvas
      style={{ pointerEvents: 'none' }}
    >
      <div className={`pointer-events-auto`}>
        <div className="flex flex-col items-center justify-center p-2 text-center w-28"> 
          
          {/* Título */}
          <div className="flex items-center text-sm font-semibold text-gray-700 mb-1">
            {title}
          </div>
          
          {/* Valor y Unidad */}
          <div className="text-lg font-bold text-gray-900">
            {value ?? "No Data"} <span className="text-sm text-gray-600"></span>
          </div>

        </div>
      </div>
    </Html>
  );
};

export default CallOutText;