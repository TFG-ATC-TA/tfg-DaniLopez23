import React, { Suspense, useState } from "react";
import { Canvas } from "@react-three/fiber";
import useDataStore from "@/Stores/useDataStore";
import useTankStore from "@/Stores/useTankStore";
import HorizontalTank2BladesModel from "./tank-models/HorizontalTank2BladesModel";
import { Button } from "@/components/ui/button";
import CameraSettings from "./Camera/CameraSettings";
import { cameraViews } from "./Camera/CameraViews";

const TankModel = () => {

  const { selectedTank } = useTankStore((state) => state);
  const {
    encoderData,
    milkQuantityData,
    switchStatus,
    weightData,
    tankTemperaturesData,
    airQualityData,
    selectedData,
  } = useDataStore((state) => state);
  
  return (
    <div className="h-full relative">
      <Canvas>
        <ambientLight intensity={0.6} />
        <directionalLight position={[-10, -10, -10]} intensity={0.5} />
        <Suspense fallback={null}>
          {selectedTank ? (
            <group>
              <HorizontalTank2BladesModel
                key={selectedTank._id}
                encoderData={encoderData}
                milkQuantityData={milkQuantityData}
                switchStatus={switchStatus}
                weightData={weightData}
                tankTemperaturesData={tankTemperaturesData}
                airQualityData={airQualityData}
              />
            </group>
          ) : (
            <mesh>
              <boxGeometry args={[1, 1, 1]} />
              <meshStandardMaterial color="red" />
            </mesh>
          )}
          <CameraSettings view={selectedData} />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default TankModel;