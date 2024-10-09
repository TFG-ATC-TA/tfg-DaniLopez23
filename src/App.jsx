import React, { useState, Suspense, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Plane } from "@react-three/drei";
import "./App.css";

import VerticalTankModel2Pales from "./components/tank-models/VerticalTankModel2Pales";
import HorizontalTankModel2Blades from "./components/tank-models/HorizontalTankModel2Blades";

import TankTemperatures from "./components/sensorData/TankTemperatures";
import Gyroscope from "./components/sensorData/Gyroscope";
import MilkQuantity from "./components/sensorData/MilkQuantity";
import MagneticSwitch from "./components/sensorData/MagneticSwitch";
import Encoder from "./components/sensorData/Encoder";

import { setupSocketListeners } from "./WebSockets/SetupSocketListeners";
import { socket } from "./webSockets/socket";

function App() {

  const [encoderData, setEncoderData] = useState(null);
  const [gyroscopeData, setGyroscopeData] = useState(null);
  const [milkQuantityData, setMilkQuantityData] = useState(0);
  const [tankTemperaturesData, setTankTemperaturesData] = useState(0);
  const [switchStatus, setSwitchStatus] = useState(null);

  useEffect(() => {
    // Llamamos a la función que configura los listeners del WebSocket
    const cleanup = setupSocketListeners(
      socket, 
      setEncoderData, 
      setGyroscopeData, 
      setMilkQuantityData, 
      setTankTemperaturesData,
      setSwitchStatus
    );
  
    // Limpiamos los listeners al desmontar el componente
    return cleanup;
  }, []);

  return (
    <div className="container">
      <div className="content-container">
        <div className="canvas-container">
          <Canvas id="three-canvas">
            <ambientLight intensity={0.6} />
            <directionalLight
              position={[10, 10, 10]}
              intensity={1.5}
              castShadow
            />
            <directionalLight position={[-10, -10, -10]} intensity={0.5} />

            <Suspense fallback={null}>
              {/* <VerticalTankModel2Pales milkQuantity={milkQuantity} speed={speed} /> */}
              <HorizontalTankModel2Blades
                milkQuantity={milkQuantityData}
                encoderData={encoderData}
                gyroscopeData={gyroscopeData}
                switchStatus={switchStatus}
                tankTemperaturesData={tankTemperaturesData}
              />

              {/* Suelo */}
              <Plane
                rotation={[-Math.PI / 2, 0, 0]}
                position={[0, 0, 0]}
                args={[10, 10]}
                receiveShadow
              >
                <meshStandardMaterial attach="material" color="gray" />
              </Plane>

              {/* Control de la cámara con restricciones de zoom y sin movimiento (pan) */}
              <OrbitControls
                enablePan={false} // Deshabilita el movimiento de la cámara
                minDistance={4} // Zoom mínimo (distancia más cercana a la cámara)
                maxDistance={10} // Zoom máximo (distancia más lejana de la cámara)
                maxPolarAngle={Math.PI / 1.2 / 2} // Evita que la cámara vea por debajo del objeto
              />
            </Suspense>
          </Canvas>
        </div>
        <div className="data-container">
          <TankTemperatures tankTemperaturesData={tankTemperaturesData}/>
          <Gyroscope gyroscopeData={gyroscopeData}/>
          <MilkQuantity milkQuantityData={milkQuantityData}/>
          <MagneticSwitch switchStatus={switchStatus}/>
          <Encoder encoderData={encoderData}/>
        </div>
      </div>
    </div>
  );
}

export default App;
