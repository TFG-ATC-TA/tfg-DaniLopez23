import React, { useState, Suspense, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Plane } from "@react-three/drei";
import HorizontalTank2BladesModel from "./components/tank-models/HorizontalTank2BladesModel";   
import { setupSocketListeners } from "./WebSockets/SetupSocketListeners";
import { socket } from "./webSockets/socket";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";

import { getFarm } from "./services/farm";
import { Home, Server, Wifi, WifiOff, History, Clock } from "lucide-react";

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
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md">
        <div className="p-4">
          <h2 className="text-xl font-bold mb-4">Tanks</h2>
          <ScrollArea className="h-[calc(100vh-8rem)]">
            {farmData.tanks && farmData.tanks.map((tank) => (
              <Button
                key={tank.tankId}
                className={`w-full mb-2 ${selectedTank && selectedTank.tankId === tank.tankId ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                onClick={() => setSelectedTank(tank)}
              >
                {tank.name}
              </Button>
            ))}
          </ScrollArea>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Farm Information and Server Status */}
        <div className="bg-white p-4 shadow-md">
          <div className="flex flex-wrap justify-between items-center">
            <div className="w-full md:w-auto mb-4 md:mb-0">
              <h2 className="text-xl font-bold flex items-center">
                <Home className="mr-2" />
                Farm Information
              </h2>
              {farmData ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-2">
                  <p><strong>Id:</strong> {farmData.farmId}</p>
                  <p><strong>Location:</strong> {farmData.location}</p>
                  <p><strong>Number of Tanks:</strong> {farmData && farmData.tanks ? farmData.tanks.length : 0}</p>
                </div>
              ) : (
                <p>Loading farm data...</p>
              )}
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <Server className="mr-2" />
                {serverStatus === "connected" ? (
                  <>
                    <Wifi className="mr-2 text-green-500" />
                    <Badge variant="outline" className="bg-green-100 text-green-800">Connected</Badge>
                  </>
                ) : serverStatus === "disconnected" ? (
                  <>
                    <WifiOff className="mr-2 text-red-500" />
                    <Badge variant="outline" className="bg-red-100 text-red-800">Disconnected</Badge>
                  </>
                ) : (
                  <>
                    <Wifi className="mr-2 text-yellow-500 animate-pulse" />
                    <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Connecting</Badge>
                  </>
                )}
              </div>
              <div className="flex items-center">
                {isRealTime ? <Clock className="mr-2" /> : <History className="mr-2" />}
                <Switch
                  checked={isRealTime}
                  onCheckedChange={setIsRealTime}
                />
                <span className="ml-2">{isRealTime ? 'Real-time' : 'Historic'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* 3D Model */}
        <div className="flex-grow p-4">
          <div className="w-full h-full bg-white rounded-lg shadow-lg overflow-hidden">
            <Canvas>
              <ambientLight intensity={0.6} />
              <directionalLight
                position={[10, 10, 10]}
                intensity={1.5}
                castShadow
              />
              <directionalLight position={[-10, -10, -10]} intensity={0.5} />
              <Suspense fallback={null}>
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
                  position={[0, 0, 0]}
                  args={[15, 15]}
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
      </div>
    </div>
  );
}