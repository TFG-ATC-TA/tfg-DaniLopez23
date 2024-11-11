import React from "react";
import { Html } from "@react-three/drei";
import { Thermometer } from "lucide-react";

const CallOutTextTemperatures = ({
  position,
  overSurface,
  onSurface,
  underSurface,
}) => {
  return (
    <Html position={position} center distanceFactor={10}>
      <div className="bg-white bg-opacity-80 text-black p-3 rounded-lg shadow-lg backdrop-blur-sm transition-all duration-300 hover:bg-opacity-100 w-50">
        <div className="flex items-center mb-2 space-x-2">
          <Thermometer size={30} className="text-red-500" />
          <span className="text-sm font-bold">Milk Temperatures</span>
        </div>
        <div className="space-y-1">
          {overSurface ? (
            <div className="flex justify-between">
              <span className="text-xs">Over Surface:</span>
              <span className="text-xs font-medium">{overSurface}°C</span>
            </div>
          ) : (
            <span className="text-xs">No data available</span>
          )}
          {onSurface ? (
            <div className="flex justify-between">
              <span className="text-xs">On Surface:</span>
              <span className="text-xs font-medium">{onSurface}°C</span>
            </div>
          ) : (
            <span className="text-xs">No data available</span>
          )}
          {underSurface ? (
            <div className="flex justify-between">
              <span className="text-xs">Under Surface:</span>
              <span className="text-xs font-medium">{underSurface}°C</span>
            </div>
          ) : (
            <span className="text-xs">No data available</span>
          )}
        </div>
      </div>
    </Html>
  );
};

export default CallOutTextTemperatures;
