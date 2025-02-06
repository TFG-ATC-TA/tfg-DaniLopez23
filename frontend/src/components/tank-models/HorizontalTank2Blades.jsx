import { useGLTF } from "@react-three/drei";
import { useSpring, animated } from "@react-spring/three";
import CallOutText from "./CallOutText";
import {ParticleField} from "./ParticleField";
export function Model({
  encoderData,
  milkQuantityData,
  switchStatus,
  weightData,
  tankTemperaturesData,
  airQualityData,
  selectedData,
}) {
  const { nodes, materials } = useGLTF(
    "./horizontalTankModel/2Pales/horizontalTank2Blades.glb"
  );

  const getRotationDuration = (encoderData) => {
    if (encoderData === null || encoderData <= 0) return 0;
    const minDuration = 1000;
    const maxDuration = 10000;
    const minRPM = 0;
    const maxRPM = 100;

    const rpm = Math.min(Math.max(encoderData, minRPM), maxRPM);
    const duration =
      maxDuration -
      ((rpm - minRPM) * (maxDuration - minDuration)) / (maxRPM - minRPM);

    return duration;
  };

  const getVisibleMilkCilinder = (quantity) => {
    const ranges = [
      { min: 0, max: 10, node: nodes.MilkCilinder10 },
      { min: 10, max: 20, node: nodes.MilkCilinder20 },
      { min: 20, max: 30, node: nodes.MilkCilinder30 },
      { min: 30, max: 40, node: nodes.MilkCilinder40 },
      { min: 40, max: 50, node: nodes.MilkCilinder50 },
      { min: 50, max: 60, node: nodes.MilkCilinder60 },
      { min: 60, max: 70, node: nodes.MilkCilinder70 },
      { min: 70, max: 80, node: nodes.MilkCilinder80 },
      { min: 80, max: 90, node: nodes.MilkCilinder90 },
      { min: 90, max: 100, node: nodes.MilkCilinder100 },
    ];

    if (quantity == null) return null;
    const range = ranges.find(
      ({ min, max }) => quantity >= min && quantity < max
    );

    if (range && range.node) {
      return (
        <mesh
          geometry={range.node.geometry}
          material={materials["MilkMaterial"]}
          position={[-0.026, 1.597, -0.096]}
          scale={[2.531, 2.531, 2.615]}
        />
      );
    }

    return null;
  };

  const getAlcalineAcidCylinders = ({ quantity, maxValue }) => {
    const calculateMorphTargets = (quantity, maxValue) => {
      const percentage = Math.min(quantity / maxValue, 1);
      const morph1 = percentage * 0.5;
      const morph2 = percentage * 0.3;
      const morph3 = percentage * 0.2;
      return [morph1, morph2, morph3];
    };

    const alcalineMorph = calculateMorphTargets(quantity, maxValue);
    const acidMorph = calculateMorphTargets(quantity, maxValue);

    return (
      <>
        <mesh
          name="AlcalineCilinder"
          geometry={nodes.AlcalineCilinder.geometry}
          material={materials["AlcalineMaterial"]}
          morphTargetDictionary={nodes.AlcalineCilinder.morphTargetDictionary}
          morphTargetInfluences={alcalineMorph}
          position={[1.27, 0, 2.91]}
          scale={[0.19, 0.01, 0.19]}
        />
        <mesh
          name="AcidCilinder"
          geometry={nodes.AcidCilinder.geometry}
          material={materials["AcidMaterial"]}
          morphTargetDictionary={nodes.AcidCilinder.morphTargetDictionary}
          morphTargetInfluences={acidMorph}
          position={[1.91, 0, 3.25]}
          scale={[0.19, 0.01, 0.19]}
        />
      </>
    );
  };

  const rotationBlade1 = useSpring({
    loop: true,
    to: { rotation: [0, Math.PI * 2, 0] },
    from: { rotation: [0, 0, 0] },
    config: { duration: getRotationDuration(encoderData?.value ?? 0) },
  });

  const rotationBlade2 = useSpring({
    loop: true,
    to: { rotation: [0, -Math.PI * 2, 0] },
    from: { rotation: [0, 0, 0] },
    config: { duration: getRotationDuration(encoderData?.value ?? 0) },
  });

  const { rotation: rotationHatch } = useSpring({
    to: {
      rotation:
        switchStatus?.status || false ? [-Math.PI / 2, 0, 0] : [0, 0, 0],
    },
    config: { duration: 1000 },
  });

  const renderMilkQuantity = () => (
    <>{getVisibleMilkCilinder(milkQuantityData?.milkQuantity ?? 0)}</>
  );

  const renderEncoder = () => (
    <>
      <animated.mesh
        geometry={nodes.Blade2.geometry}
        material={materials["BladeMaterial"]}
        position={[0, 0.737, 0.918]}
        scale={-0.148}
        rotation={rotationBlade1.rotation}
      />
      <animated.mesh
        geometry={nodes.Blade1.geometry}
        material={materials["BladeMaterial"]}
        position={[0, 0.737, -0.982]}
        scale={-0.148}
        rotation={rotationBlade2.rotation}
      />
      <mesh
        geometry={nodes.Blade2Hat.geometry}
        material={materials["BladeMaterial"]}
        position={[-0.003, 2.451, 0.916]}
        scale={[0.107, 0.078, 0.107]}
      />
      <mesh
        geometry={nodes.Blade1Hat.geometry}
        material={materials["BladeMaterial"]}
        position={[-0.003, 2.451, -0.988]}
        scale={[0.104, 0.076, 0.104]}
      />
      <CallOutText
        position={[0, 2.9, 0.92]}
        text={`${encoderData?.value + " rad/s" ?? "No data"}`}
        radius={0.05}
      />
      <CallOutText
        position={[0, 2.9, -0.92]}
        text={`${encoderData?.value + " rad/s" ?? "No data"}`}
        radius={0.05}
      />
    </>
  );

  const renderMagneticSwitch = () => (
    <>
      <animated.mesh
        geometry={nodes.Hatch.geometry}
        material={materials["HatchMaterial"]}
        position={[0, 2.377, -0.206]}
        rotation={rotationHatch}
      />
      <CallOutText
        position={[0, 2.9, 0]}
        text={`${
          switchStatus == null
            ? "No Data"
            : switchStatus.status
            ? "Open"
            : "Closed"
        }`}
      />
    </>
  );

  const renderWeight = () => (
    <>
      {getAlcalineAcidCylinders({
        quantity: weightData?.weight ?? 0,
        maxValue: 35000,
      })}
      <mesh
        geometry={nodes.BarrelAlcaline.geometry}
        material={nodes.BarrelAlcaline.material}
        position={[1.36, 0.27, 2.85]}
      />
      <mesh
        geometry={nodes.BarrelAcid.geometry}
        material={nodes.BarrelAcid.material}
        position={[2, 0.27, 3.19]}
      />
      <CallOutText
        position={[1.356, 1.05, 2.848]}
        title={"Alcaline"}
        value={weightData?.weight}
        unit={"kg"}
      />
      <CallOutText
        position={[2.02, 1.05, 2.848]}
        title={"Acid"}
        value={weightData?.weight}
        unit={"kg"}
      />
    </>
  );

  const renderTankTemperatures = () => (
    <>{getVisibleMilkCilinder(milkQuantityData?.milkQuantity ?? 0)}</>
  );

  const renderAirQuality = () => (
    <>
      <ParticleField temperature={32} humidity={60} />
    </>
  );
  console.log("selectedData", selectedData);
  return (
    <group dispose={null}>
      <mesh
        geometry={nodes.TankCilinder.geometry}
        material={materials["TankMaterial"]}
        position={[0.548, 0.399, -1.476]}
      />
      {(selectedData === "MilkQuantity" || selectedData == null) &&
        renderMilkQuantity()}
      {(selectedData === "Encoder" || selectedData == null) && renderEncoder()}
      {(selectedData === "MagneticSwitch" || selectedData == null) &&
        renderMagneticSwitch()}
      {(selectedData === "Weight" || selectedData == null) && renderWeight()}
      {(selectedData === "TankTemperatures" || selectedData == null) &&
        renderTankTemperatures()}
      {selectedData === "AirQuality" && renderAirQuality()}
    </group>
  );
}

useGLTF.preload("./horizontalTankModel/2Pales/horizontalTank2Blades.glb");
