import { useGLTF } from "@react-three/drei";
import { useSpring, animated } from "@react-spring/three";
import CallOutText from "../CallOutText";
import ParticleField from "../ParticleField";
import { getRotationDuration, getAlcalineAcidCylinders } from "../Transformations";

export function VerticalTank1Blade({
  encoderData,
  milkQuantityData,
  switchStatus,
  weightData,
  tankTemperaturesData,
  airQualityData,
  selectedData,
}) {
  const { nodes, materials } = useGLTF("./verticalTankModel/verticalTank1Blade.glb");

  const rotationBlade = useSpring({
    loop: true,
    to: { rotation: [0, Math.PI * 2, 0] },
    from: { rotation: [0, 0, 0] },
    config: { duration: getRotationDuration(encoderData?.value["01"] ?? 0) },
  });

  const { rotation: rotationHatch } = useSpring({
    to: {
      rotation: switchStatus?.value ? [-Math.PI / 2, 0, 0] : [0, 0, 0],
    },
    config: { duration: 1000 },
  });
  
  const renderMilkQuantity = () => {

    if (milkQuantityData == null) return null;

    const morphInfluence = Math.min(Math.max((milkQuantityData?.value ?? 0) / 100, 0), 1);
  
    return (
      <mesh
        name="MilkCilinder"
        geometry={nodes.MilkCilinder.geometry}
        material={materials.MilkMaterial}
        morphTargetDictionary={nodes.MilkCilinder.morphTargetDictionary}
        morphTargetInfluences={[morphInfluence]}
        position={[-0.002, 1.398, 0.012]}
        scale={[0.782, 1.311, 0.782]}
      />
    );
  };

  const renderEncoder = () => (
    <>
      <animated.mesh
        geometry={nodes.Blade.geometry}
        material={materials.BladeMaterial}
        position={[-0.006, 0.495, 0.022]}
        scale={[-0.148, -0.188, -0.148]}
        rotation={rotationBlade.rotation}
      />
      <mesh
        geometry={nodes.BladeHat.geometry}
        material={materials.BladeMaterial}
        position={[-0.006, 2.811, 0.019]}
        scale={[0.061, 0.045, 0.061]}
      />
      <CallOutText
        position={[0, 3.1, 0.4]}
        title={"Encoder"}
        value={`${encoderData?.value["01"] ?? "No data"}`}
      />
    </>
  );

  const renderMagneticSwitch = () => (
    <>
      <animated.mesh
        geometry={nodes.Hatch.geometry}
        material={materials.HatchMaterial}
        position={[0, 2.79, -0.606]}
        rotation={rotationHatch}
      />
      <CallOutText
        position={[0, 3, -0.9]}
        title={"Magnetic Switch"}
        value={`${switchStatus == null ? "No Data" : switchStatus?.value ? "Open" : "Closed"}`}
      />
    </>
  );

  const renderWeight = () => {
    const { alcalineMorph, acidMorph } = getAlcalineAcidCylinders({
      quantity: weightData?.value,
      maxValue: 100,
    });

    return (
      <>
        <mesh
          name="AlcalineCilinder"
          geometry={nodes.AlcalineCilinder.geometry}
          material={materials.AlcalineMaterial}
          morphTargetDictionary={nodes.AlcalineCilinder.morphTargetDictionary}
          morphTargetInfluences={alcalineMorph}
          position={[0.824, -0.001, 1.634]}
          scale={[0.188, 0.015, 0.188]}
        />
        <mesh
          name="AcidCilinder"
          geometry={nodes.AcidCilinder.geometry}
          material={materials.AcidMaterial}
          morphTargetDictionary={nodes.AcidCilinder.morphTargetDictionary}
          morphTargetInfluences={acidMorph}
          position={[1.671, -0.001, 1.876]}
          scale={[0.188, 0.015, 0.188]}
        />
        <mesh
          geometry={nodes.BarrelAlcaline.geometry}
          material={materials.BarrelMaterial}
          position={[0.915, 0.27, 1.575]}
        />
        <mesh
          geometry={nodes.BarrelAcid.geometry}
          material={materials.BarrelMaterial}
          position={[1.763, 0.27, 1.817]}
        />
        <CallOutText
          position={[0.85, 0.9, 1.55]}
          title="Alcaline"
          value={weightData?.value}
        />
        <CallOutText
          position={[1.7, 0.9, 1.8]}
          title="Acid"
          value={weightData?.value}
        />
      </>
    );
  };

  const renderTankTemperatures = () => renderMilkQuantity();

  const renderAirQuality = () => (
    <ParticleField
      particleCount={1000}
      humidity={airQualityData?.value.humidity || 0}
      temperature={airQualityData?.value.temperature || 0}
    />
  );

  return (
    <group dispose={null}>
      <mesh
        geometry={nodes.TankCilinder.geometry}
        material={materials.TankMaterial}
        position={[0.391, -0.004, -0.541]}
        scale={[0.31, 0.169, 0.31]}
      />
      {(selectedData === "MilkQuantity" || selectedData == null) &&
        renderMilkQuantity()}
      {(selectedData === "Encoder" || selectedData == null) && renderEncoder()}
      {(selectedData === "MagneticSwitch" || selectedData == null) &&
        renderMagneticSwitch()}
      {(selectedData === "Weight" || selectedData == null) && renderWeight()}
      {(selectedData === "TankTemperatures") &&
        renderTankTemperatures()}
      {selectedData === "AirQuality" && renderAirQuality()}
    </group>
  );
}

useGLTF.preload("./verticalTankModel/verticalTank1Blade.glb");
