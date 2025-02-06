import React, { Suspense, useState } from "react";
import { Canvas } from "@react-three/fiber";
import useDataStore from "@/stores/useDataStore";
import useTankStore from "@/stores/useTankStore";
import { Button } from "@/components/ui/button";
import CameraSettings from "./camera/CameraSettings";
import { cameraViews } from "./camera/CameraViews";
import {Model}  from "./tank-models/HorizontalTank2Blades";

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
              <Model
                key={selectedTank._id}
                encoderData={encoderData}
                milkQuantityData={milkQuantityData}
                switchStatus={switchStatus}
                weightData={weightData}
                tankTemperaturesData={tankTemperaturesData}
                airQualityData={airQualityData}
                selectedData={selectedData}
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