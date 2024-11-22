import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import useDataStore from "@/Stores/useDataStore";
import HorizontalTank2BladesModel from "./tank-models/HorizontalTank2BladesModel";
import useTankStore from "@/Stores/useTankStore";

const TankModel = () => {

  const {
    farmData
  } = useDataStore((state) => state);

  const {
    selectedTank
  } = useTankStore((state) => state);

  const {
    encoderData,
    milkQuantityData,
    switchStatus,
    weightData,
    tankTemperaturesData,
    airQualityData,
  } = useDataStore((state) => state);
  return (
    <div className="h-full">
      <Canvas>
        <ambientLight intensity={0.6} />
        <directionalLight position={[-10, -10, -10]} intensity={0.5} />
        <Suspense fallback={null}>
          {farmData.equipments &&
            farmData.equipments.map((tank) =>
              selectedTank && selectedTank._id === tank._id ? (
                <HorizontalTank2BladesModel key={tank._id}
                  encoderData={encoderData}
                  milkQuantityData={milkQuantityData}
                  switchStatus={switchStatus}
                  weightData={weightData}
                  tankTemperaturesData={tankTemperaturesData}
                  airQualityData={airQualityData}
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
