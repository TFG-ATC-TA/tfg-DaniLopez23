import { useGLTF } from "@react-three/drei";
import { useSpring, animated } from "@react-spring/three";
import CallOutText from "../CallOutText";
import ParticleField from "../ParticleField";
import { getRotationDuration, getAlcalineAcidCylinders, getVisibleMilkCilinder } from "../Transformations";
export function HorizontalTank2Blades({
  encoderData,
  milkQuantityData,
  switchStatus,
  weightData,
  tankTemperaturesData,
  airQualityData,
  selectedData,
}) {
  const { nodes, materials } = useGLTF(
    "./horizontalTankModel/horizontalTank2Blades.glb"
  );

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

  const renderMilkQuantity = () => {
    const range = getVisibleMilkCilinder(milkQuantityData?.milkQuantity ?? 0);

    if (!range) return null;

    const nodeKey = `MilkCilinder${range.max}`;
    const node = nodes[nodeKey];

    return (
      <mesh
        geometry={node.geometry}
        material={materials["MilkMaterial"]}
        position={[-0.026, 1.597, -0.096]}
        scale={[2.531, 2.531, 2.615]}
      />
    );
  };

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
        value={`${encoderData?.value ?? "No data"}`}
        title={"Encoder"}
        radius={0.05}
      />
      <CallOutText
        position={[0, 2.9, -0.92]}
        title={"Encoder"}
        text={`${encoderData?.value ?? "No data"}`}
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
        title={"Magnetic Switch"}
      />
    </>
  );

  const renderWeight = () => {

    const { alcalineMorph, acidMorph } = getAlcalineAcidCylinders({
      quantity: weightData?.weight,
      maxValue: 100,
    });

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
        />
        <CallOutText
          position={[2.02, 1.05, 2.848]}
          title={"Acid"}
          value={weightData?.weight}
        />
      </>
    );
  };

  const renderTankTemperatures = () => {
    const range = getVisibleMilkCilinder(milkQuantityData?.milkQuantity ?? 0);

    if (!range) return null;

    const nodeKey = `MilkCilinder${range.max}`;
    const node = nodes[nodeKey];

    return (
      <mesh
        geometry={node.geometry}
        material={materials["MilkMaterial"]}
        position={[-0.026, 1.597, -0.096]}
        scale={[2.531, 2.531, 2.615]}
      />
    );
  };

  const renderAirQuality = () => (
    <ParticleField particleCount={1000} humidity={10} temperature={20} />
  );

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

useGLTF.preload("./horizontalTankModel/horizontalTank2Blades.glb");
