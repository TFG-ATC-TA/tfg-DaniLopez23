import React, { useState, Suspense, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Plane } from "@react-three/drei";
import "./App.css";
import VerticalTankModel2Pales from "./components/tank-models/VerticalTankModel2Pales";
import HorizontalTankModel2Pales from "./components/tank-models/HorizontalTankModel2Pales";

import TankTemperatures from "./components/sensorData/TankTemperatures";
import Gyroscope from "./components/sensorData/Gyroscope";
import MilkQuantity from "./components/sensorData/MilkQuantity";
import MagneticSwitch from "./components/sensorData/MagneticSwitch";

import { socket } from "./webSockets/socket";

function App() {
  const [speed, setSpeed] = useState(1);
  const [milkQuantity, setmilkQuantity] = useState(0);

  useEffect(() => {
    const onConnect = () => {
      console.log("Connected to server");
    };

    const onDisconnect = () => {
      console.log("Disconnected from server");
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
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
              <HorizontalTankModel2Pales
                milkQuantity={milkQuantity}
                speed={speed}
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
          <TankTemperatures />
          <Gyroscope />
          <MilkQuantity />
          <MagneticSwitch />
          
        </div>
      </div>
      <div className="controls-container">
        <button onClick={() => setSpeed(speed + 0.1)}>+ velocidad palas</button>
        <button onClick={() => setSpeed(speed - 0.1)}>- velocidad palas</button>
        <input
          type="range"
          min={0}
          max={100}
          step={25}
          value={milkQuantity}
          onChange={(e) => setmilkQuantity(parseFloat(e.target.value))}
        />
      </div>
    </div>
  );
}

export default App;
