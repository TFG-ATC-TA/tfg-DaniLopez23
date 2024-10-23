import React from "react";
import { useGLTF, Html, Line } from "@react-three/drei";
import { useSpring, animated } from "@react-spring/three";
import CallOutText from "./CallOutText"; // Asegúrate de importar tu nuevo componente CallOutText

export default function HorizontalTankModel2Blades(props) {
  const { nodes, materials } = useGLTF(
    "/horizontalTankModel/2Pales/HorizontalTankModel2Blades.glb"
  );

  const getRotationDuration = (encoderData) => {
    if (encoderData === null) return 0;
    const minDuration = 1000;
    const maxDuration = 10000;
    const minRPM = 0;
    const maxRPM = 100;
    const rpm = encoderData;
    const duration =
      ((rpm - minRPM) * (maxDuration - minDuration)) / (maxRPM - minRPM) +
      minDuration;
    return duration;
  };

  const getVisibleMilkCilinder = (quantity) => {
    if (quantity >= 0 && quantity < 12.5) return null;
    if (quantity >= 12.5 && quantity < 37.5)
      return (
        <mesh
          geometry={nodes.MilkCilinder25.geometry}
          material={materials["MilkMaterial.001"]}
          position={[-0.026, 2.389, -0.096]}
          scale={[2.531, 2.531, 2.615]}
        />
      );
    if (quantity >= 37.5 && quantity < 62.5)
      return (
        <mesh
          geometry={nodes.MilkCilinder50.geometry}
          material={materials["MilkMaterial.001"]}
          position={[-0.026, 2.389, -0.096]}
          scale={[2.531, 2.531, 2.615]}
        />
      );
    if (quantity >= 62.5 && quantity < 87.5)
      return (
        <mesh
          geometry={nodes.MilkCilinder75.geometry}
          material={materials["MilkMaterial.001"]}
          position={[-0.026, 2.389, -0.096]}
          scale={[2.531, 2.531, 2.615]}
        />
      );
    if (quantity >= 87.5 && quantity <= 100)
      return (
        <mesh
          geometry={nodes.MilkCilinder100.geometry}
          material={materials["MilkMaterial.001"]}
          position={[-0.026, 2.389, -0.096]}
          scale={[2.531, 2.531, 2.615]}
        />
      );

    return null;
  };

  const rotationBlade1 = useSpring({
    loop: true,
    to: { rotation: [0, Math.PI * 2, 0] },
    from: { rotation: [0, 0, 0] },
    config: { duration: getRotationDuration(props.encoderData) },
  });

  const rotationBlade2 = useSpring({
    loop: true,
    to: { rotation: [0, -Math.PI * 2, 0] },
    from: { rotation: [0, 0, 0] },
    config: { duration: getRotationDuration(props.encoderData) },
  });

  const { rotation: rotationHatch } = useSpring({
    to: { rotation: props.switchStatus ? [Math.PI / 2, 0, 0] : [0, 0, 0] },
    config: { duration: 1000 },
  });

  return (
    <group {...props} dispose={null}>
      {/* Palas del tanque */}
      <animated.mesh
        geometry={nodes.Blade2.geometry}
        material={materials.BladeMaterial}
        position={[0, 1.529, 0.918]}
        scale={-0.148}
        rotation={rotationBlade1.rotation}
      />
      <animated.mesh
        geometry={nodes.Blade1.geometry}
        material={materials.BladeMaterial}
        position={[0, 1.529, -0.982]}
        scale={-0.148}
        rotation={rotationBlade2.rotation}
      />

      {/* Nivel de leche */}
      {getVisibleMilkCilinder(props.milkQuantityData.milkQuantity)}

      {/* Cilindro del tanque */}
      <mesh
        geometry={nodes.TankCilinder.geometry}
        material={materials.TankMaterial}
        position={[0.002, 2.043, 0.008]}
        scale={1.113}
      />

      {/* Trampilla */}
      <animated.mesh
        geometry={nodes.Hatch.geometry}
        material={materials.HatchMaterial}
        position={[0, 3.257, 0]}
        scale={0.019}
        rotation={rotationHatch}
      />

      {/* CallOutText */}
      <CallOutText
        position={[0, 3.7, 0.92]} // Ajusta la posición más cerca del objeto
        text={`RPM: ${props.encoderData} rad/s`}
        radius={0.05}
      />

      <CallOutText
        position={[0, 3.7, -0.92]} // Ajusta la posición más cerca del objeto
        text={`RPM: ${props.encoderData} rad/s`}
        radius={0.05}
      />

      <CallOutText
        position={[0, 3.6, 0]}
        text={`Hatch: ${props.switchStatus}`}
      />

      <CallOutText
        position={[0, 3.6, 0]}
        text={`Air Quality: ${props.switchStatus}`}
      />
    </group>
  );
}

useGLTF.preload("/horizontalTankModel/2Pales/HorizontalTankModel2Blades.glb");
