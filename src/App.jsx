import React, { useState, Suspense, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Plane } from "@react-three/drei";
import HorizontalTank2BladesModel from "./components/tank-models/HorizontalTank2BladesModel";
import { setupSocketListeners } from "./WebSockets/SetupSocketListeners";
import { socket } from "./webSockets/socket";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

import { getFarm } from "./services/farm";
import { Home, Server, Wifi, WifiOff } from "lucide-react";

export default function App() {
  const [milkQuantityData, setMilkQuantityData] = useState(null);
  const [encoderData, setEncoderData] = useState(null);
  const [gyroscopeData, setGyroscopeData] = useState(null);
  const [switchStatus, setSwitchStatus] = useState(null);
  const [tankTemperaturesData, setTankTemperaturesData] = useState(null);
  const [airQualityData, setAirQualityData] = useState(null);
  const [weightData, setWeightData] = useState(null);

  const [farmData, setFarmData] = useState({});
  const [serverStatus, setServerStatus] = useState("connecting");
  const [selectedTank, setSelectedTank] = useState(null);
  const [isRealTime, setIsRealTime] = useState(true);

  useEffect(() => {
    const cleanup = setupSocketListeners(
      socket,
      setEncoderData,
      setGyroscopeData,
      setMilkQuantityData,
      setTankTemperaturesData,
      setSwitchStatus,
      setWeightData,
      setAirQualityData
    );

    socket.on("connect", () => setServerStatus("connected"));
    socket.on("disconnect", () => setServerStatus("disconnected"));

    return () => {
      cleanup();
      socket.off("connect");
      socket.off("disconnect");
    };
  }, []);

  useEffect(() => {
    getFarm().then((data) => {
      if (Array.isArray(data) && data.length > 0) {
        setFarmData(data[0]);
        if (data[0].tanks && data[0].tanks.length > 0) {
          setSelectedTank(data[0].tanks[0]);
        }
      } else {
        console.error("No data found");
      }
    });
  }, []);

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Top Bar: Farm Information and Server Status */}
      <div className="bg-white p-5 shadow-md flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Home className="text-xl" />
          <div>
            <h2 className="text-xl font-bold">Farm Information</h2>
            {farmData ? (
              <div className="flex space-x-4">
                <p>
                  <strong>Id:</strong> {farmData.farmId}
                </p>
                <p>
                  <strong>Location:</strong> {farmData.location}
                </p>
                <p>
                  <strong>Number of Tanks:</strong>{" "}
                  {farmData && farmData.tanks ? farmData.tanks.length : 0}
                </p>
              </div>
            ) : (
              <p>Loading farm data...</p>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div>
            <h2 className="text-xl font-bold flex items-center">
              <Server className="mr-2" />
              Server Status
            </h2>
            <div className="mt-2 flex items-center">
              {serverStatus === "connected" ? (
                <>
                  <Wifi className="mr-2 text-green-500" />
                  <Badge
                    variant="outline"
                    className="bg-green-100 text-green-800"
                  >
                    Connected
                  </Badge>
                </>
              ) : serverStatus === "disconnected" ? (
                <>
                  <WifiOff className="mr-2 text-red-500" />
                  <Badge variant="outline" className="bg-red-100 text-red-800">
                    Disconnected
                  </Badge>
                </>
              ) : (
                <>
                  <Wifi className="mr-2 text-yellow-500 animate-pulse" />
                  <Badge
                    variant="outline"
                    className="bg-yellow-100 text-yellow-800"
                  >
                    Connecting
                  </Badge>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content: Sidebar and 3D Model */}
      <div className="flex flex-grow">
        {/* Sidebar */}
        <div className="w-64 m-4 bg-white shadow-md">
          <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Tanks</h2>
            <ScrollArea className="h-[calc(100vh-8rem)]">
              {farmData.tanks &&
                farmData.tanks.map((tank) => (
                  <Button
                    key={tank.id}
                    className={`w-full mb-2 ${
                      selectedTank && selectedTank.id === tank.id
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200"
                    }`}
                    onClick={() => setSelectedTank(tank)}
                  >
                    {tank.tankName}
                  </Button>
                ))}
            </ScrollArea>
          </div>
        </div>

        {/* 3D Model */}
        <div className="flex-grow p-4">
          <div className="w-full h-full bg-white rounded-lg shadow-lg overflow-hidden">
            <Canvas>
              <ambientLight intensity={0.6} />
              
              <directionalLight position={[-10, -10, -10]} intensity={0.5} />
              <Suspense fallback={null}>
                {/* For each tank map farm.tanks and add an id for each station that has the tank (e.g --> boardIDs = [ 00,01,02]) */}
                <HorizontalTank2BladesModel
                  milkQuantityData={milkQuantityData}
                  encoderData={encoderData}
                  gyroscopeData={gyroscopeData}
                  switchStatus={switchStatus}
                  tankTemperaturesData={tankTemperaturesData}
                  weightData={weightData}
                  airQualityData={airQualityData}
                />
                <Plane
                  rotation={[-Math.PI / 2, 0, 0]}
                  position={[0, -0.01, 0]} // Un poco por debajo para evitar z-fighting
                  args={[30, 30]} // Más grande para un entorno más espacioso
                  receiveShadow
                >
                  <meshStandardMaterial
                    roughness={0.2}
                    metalness={0.1}
                    color="#95a5a6" // Ajusta el color para que combine con el entorno
                  />
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
      </div>
    </div>
  );
}
