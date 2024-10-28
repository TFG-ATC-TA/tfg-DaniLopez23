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
import { Separator } from "@/components/ui/separator";

import { getFarm } from "./services/farm";
import { Home, Server, Wifi, WifiOff, Droplet, Thermometer, Milk, LogOut } from "lucide-react";

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
        const farm = data[0];
        const tanksWithStations = farm.tanks.map(tank => ({
          ...tank,
          boardIDs: tank.tankStations.map(station => station.boardId)
        }));
        setFarmData({ ...farm, tanks: tanksWithStations });
        if (tanksWithStations.length > 0) {
          setSelectedTank(tanksWithStations[0]);
        }
      } else {
        console.error("No data found");
      }
    });
  }, []);

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header: Farm Information, Server Status, and Exit Button */}
      <div className="bg-white p-6 shadow-md flex justify-between items-center">
        <div className="flex items-center space-x-8">
          <div className="flex items-center space-x-3">
            <Home className="text-2xl text-primary" />
            <div>
              <h2 className="text-2xl font-bold">Farm Information</h2>
              {farmData ? (
                <div className="flex space-x-4 text-sm">
                  <p>
                    <strong>Id:</strong> {farmData.farmId}
                  </p>
                  <p>
                    <strong>Location:</strong> {farmData.location}
                  </p>
                  <p>
                    <strong>Tanks:</strong>{" "}
                    {farmData && farmData.tanks ? farmData.tanks.length : 0}
                  </p>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Loading farm data...</p>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Server className="text-2xl text-primary" />
            <div>
              <h2 className="text-2xl font-bold">Server Status</h2>
              <div className="flex items-center mt-1">
                {serverStatus === "connected" ? (
                  <>
                    <Wifi className="mr-2 text-green-500" />
                    <Badge variant="outline" className="bg-green-100 text-green-800">
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
                    <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                      Connecting
                    </Badge>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
        <Button variant="outline" size="lg" className="space-x-2">
          <LogOut className="h-5 w-5" />
          <span>Exit</span>
        </Button>
      </div>

      {/* Main Content: Sidebar, Tank Information, and 3D Model */}
      <div className="flex flex-grow">
        {/* Sidebar */}
        <div className="w-64 m-2 bg-white shadow-md rounded-lg">
          <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Tanks</h2>
            <ScrollArea className="h-[calc(100vh-12rem)]">
              {farmData.tanks &&
                farmData.tanks.map((tank) => (
                  <Button
                    key={tank.id}
                    className={`w-full mb-2 ${
                      selectedTank && selectedTank.id === tank.id
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary"
                    }`}
                    onClick={() => setSelectedTank(tank)}
                  >
                    {tank.tankName}
                  </Button>
                ))}
            </ScrollArea>
          </div>
        </div>

        <div className="flex-grow flex flex-col m-2">
          {/* Tank Information */}
          <Card className="mb-1 bg-white shadow-md">
            <CardContent className="m-2">
              {selectedTank ? (
                <div className="grid grid-cols-5">
                  <div className="space-y-2">
                    <p className="font-semibold">Tank Name</p>
                    <p>{selectedTank.tankName}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="font-semibold">Capacity</p>
                    <p>{selectedTank.capacity} liters</p>
                  </div>
                  <div className="space-y-2">
                    <p className="font-semibold">Height</p>
                    <p>{milkQuantityData ? `${milkQuantityData.milkQuantity}%` : 'N/A'}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="font-semibold">Weight:</p>
                    <p>{weightData ? `${weightData.weight} kg` : 'N/A'}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="font-semibold">Status:</p>
                    <Badge variant={switchStatus ? "success" : "secondary"}>
                      {switchStatus ? 'Working' : 'Stopped'}
                    </Badge>
                  </div>
                </div>
              ) : (
                <p>No tank selected</p>
              )}
            </CardContent>
          </Card>

          {/* 3D Model */}
          <div className="flex-grow bg-white rounded-lg shadow-md overflow-hidden">
            <Canvas>
              <ambientLight intensity={0.6} />
              <directionalLight position={[-10, -10, -10]} intensity={0.5} />
              <Suspense fallback={null}>
                {farmData.tanks && farmData.tanks.map((tank) => (
                  <HorizontalTank2BladesModel
                    key={tank.id}
                    tankId={tank.id}
                    boardIDs={tank.boardIDs}
                    milkQuantityData={milkQuantityData}
                    encoderData={encoderData}
                    gyroscopeData={gyroscopeData}
                    switchStatus={switchStatus}
                    tankTemperaturesData={tankTemperaturesData}
                    weightData={weightData}
                    airQualityData={airQualityData}
                    isSelected={selectedTank && selectedTank.id === tank.id}
                  />
                ))}
                <Plane
                  rotation={[-Math.PI / 2, 0, 0]}
                  position={[0, -0.01, 0]}
                  args={[30, 30]}
                  receiveShadow
                >
                  <meshStandardMaterial
                    roughness={0.2}
                    metalness={0.1}
                    color="#95a5a6"
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