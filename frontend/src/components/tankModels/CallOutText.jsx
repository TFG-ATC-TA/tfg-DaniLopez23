import { Html } from '@react-three/drei';

const CallOutText = ({ position, title, value}) => {
  return (
    <Html position={position} center distanceFactor={4} occlude>
      <div className="">
        <div className="flex flex-col items-center bg-white/90 rounded-lg shadow-lg p-3 border border-gray-200/50">
          
          {/* Título */}
          <div className="flex items-center text-sm font-semibold text-gray-700 mb-1">
            {title}
          </div>
          
          {/* Valor y Unidad */}
          <div className="text-lg font-bold text-gray-900">
            {value ?? "No Data"} <span className="text-sm text-gray-600"></span>
          </div>
          
          {/* Indicador de posición */}
          <div className="absolute -bottom-[5px] left-1/2 -translate-x-1/2 w-3 h-3 bg-white/90 transform rotate-45 border-b border-r border-gray-200/50"></div>
        </div>
      </div>
    </Html>
  );
};

export default CallOutText;
