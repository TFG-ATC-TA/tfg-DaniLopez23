import React, { useState, Suspense, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Plane } from "@react-three/drei";
import HorizontalTankModel2Blades from "./components/tank-models/HorizontalTankModel2Blades";
import { setupSocketListeners } from "./WebSockets/SetupSocketListeners";
import { socket } from "./webSockets/socket";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import Encoder from "./components/sensorData/Encoder";
import TankTemperatures from "./components/sensorData/TankTemperatures";
import MilkQuantity from "./components/sensorData/MilkQuantity";
import MagneticSwitch from "./components/sensorData/MagneticSwitch";
import Gyroscope from "./components/sensorData/Gyroscope";

function SensorCard({ title, value, unit, details }) {
  return (
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold mb-1">
          {value} {unit}
        </div>
        <p className="text-sm text-muted-foreground">{details}</p>
      </CardContent>
    </Card>
  );
}

export default function App() {
  const [milkQuantityData, setMilkQuantityData] = useState(0);
  const [encoderData, setEncoderData] = useState(0);
  const [gyroscopeData, setGyroscopeData] = useState(null);
  const [switchStatus, setSwitchStatus] = useState(null);
  const [tankTemperaturesData, setTankTemperaturesData] = useState(0);

  useEffect(() => {
    const cleanup = setupSocketListeners(
      socket,
      setEncoderData,
      setGyroscopeData,
      setMilkQuantityData,
      setTankTemperaturesData,
      setSwitchStatus
    );
    return cleanup;
  }, []);

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-gray-100">
      {/* Parte del modelo 3D */}
      <div className="w-full lg:w-3/4 h-1/2 lg:h-full p-4">
        <h1 className="text-3xl font-bold mb-4">Digital Twin - Milk Tank</h1>
        <div className="bg-white rounded-lg shadow-lg overflow-hidden h-full">
          <Canvas>
            <ambientLight intensity={0.6} />
            <directionalLight
              position={[10, 10, 10]}
              intensity={1.5}
              castShadow
            />
            <directionalLight position={[-10, -10, -10]} intensity={0.5} />
            <Suspense fallback={null}>
              <HorizontalTankModel2Blades
                milkQuantityData={milkQuantityData}
                encoderData={encoderData}
                gyroscopeData={gyroscopeData}
                switchStatus={switchStatus}
                tankTemperaturesData={tankTemperaturesData}
              />
              <Plane
                rotation={[-Math.PI / 2, 0, 0]}
                position={[0, 0, 0]}
                args={[10, 10]}
                receiveShadow
              >
                <meshStandardMaterial attach="material" color="gray" />
              </Plane>
              <OrbitControls
                enablePan={false}
                minDistance={4}
                maxDistance={10}
                maxPolarAngle={Math.PI / 1.2 / 2}
              />
            </Suspense>
          </Canvas>
        </div>
      </div>

      {/* Parte de los datos de los sensores */}
      <div className="w-full lg:w-1/4 h-1/2 lg:h-full p-4">
        <h2 className="text-2xl font-bold mb-4">Sensor Data</h2>
        <ScrollArea className="h-full">
          <div className="pr-4">
            <TankTemperatures />
            <MilkQuantity milkQuantityData={milkQuantityData} />
            <Encoder encoderData={encoderData} />
            <MagneticSwitch switchStatus={switchStatus} />
            <Gyroscope gyroscopeData={gyroscopeData} />
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
