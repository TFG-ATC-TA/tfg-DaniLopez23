import { OrbitControls, Plane } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import React, { useState, Suspense, useEffect } from "react";

import HorizontalTank2BladesModel from "./tank-models/HorizontalTank2BladesModel";

const TankModel = ({
  farmData,
  selectedTank,
  milkQuantityData,
  encoderData,
  gyroscopeData,
  switchStatus,
  tankTemperaturesData,
  weightData,
  airQualityData,
}) => {
  const checkDataIsFromTank = (data, tankStations) => {
    if (data == null) return false;
    if (tankStations == null || tankStations.length === 0) return false;

    const boardIds = tankStations.map((station) => station.board.boardId);
    console.log(`${data.measurement} ${data.tags.board_id} - ${boardIds}`);
    if (boardIds.includes(data.tags.board_id)) {
      return true;
    } else {
      return false;
    }
  };
  return (
    <div className="h-full">
      <Canvas>
        <ambientLight intensity={0.6} />
        <directionalLight position={[-10, -10, -10]} intensity={0.5} />
        <Suspense fallback={null}>
          {farmData.tanks &&
            farmData.tanks.map((tank) =>
              selectedTank && selectedTank.id === tank.id ? (
                <HorizontalTank2BladesModel
                  key={tank.id}
                  tankStations={tank.tankStations}
                  milkQuantityData={
                    checkDataIsFromTank(milkQuantityData, tank.tankStations)
                      ? milkQuantityData
                      : null
                  }
                  encoderData={
                    checkDataIsFromTank(encoderData, tank.tankStations)
                      ? encoderData
                      : null
                  }
                  gyroscopeData={
                    checkDataIsFromTank(gyroscopeData, tank.tankStations)
                      ? gyroscopeData
                      : null
                  }
                  switchStatus={
                    checkDataIsFromTank(switchStatus, tank.tankStations)
                      ? switchStatus
                      : null
                  }
                  tankTemperaturesData={
                    checkDataIsFromTank(tankTemperaturesData, tank.tankStations)
                      ? tankTemperaturesData
                      : null
                  }
                  weightData={
                    checkDataIsFromTank(weightData, tank.tankStations)
                      ? weightData
                      : null
                  }
                  airQualityData={
                    checkDataIsFromTank(airQualityData, tank.tankStations)
                      ? airQualityData
                      : null
                  }
                />
              ) : (
                "No tank selected"
              )
            )}
          
          <OrbitControls
            enablePan={false}
            minDistance={4}
            maxDistance={10}
            maxPolarAngle={Math.PI / 1.2 / 2}
          />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default TankModel;
