import React from "react";
import { useGLTF } from "@react-three/drei";
import { useSpring, animated } from "@react-spring/three";
import CallOutText from "./CallOutText";
import CallOutTextTemperatures from "./CallOutTextTemperatures";
import CallOutTextMilkQuantity from "./CallOutTextMilkQuantity";
import CallOutTextAirQuality from "./CallOutTextAirQuality";

export default function HorizontalTank2BladesModel({
  encoderData,
  milkQuantityData,
  switchStatus,
  weightData,
  gyroscopeData,
  tankTemperaturesData,
  airQualityData,
  tankStations
}) {
  const { nodes, materials } = useGLTF(
    "/horizontalTankModel/2Pales/HorizontalTank2BladesModel.glb"
  );
  


  const getRotationDuration = (encoderData) => {
    if (encoderData === null || encoderData <= 0) return 0; // Duración máxima si encoderData es nulo o menor o igual a cero
    const minDuration = 1000; // Duración mínima (animación rápida)
    const maxDuration = 10000; // Duración máxima (animación lenta)
    const minRPM = 0; // RPM mínimo
    const maxRPM = 100; // RPM máximo

    const rpm = Math.min(Math.max(encoderData, minRPM), maxRPM); // Asegurarse de que rpm esté en el rango
    const duration =
      maxDuration -
      ((rpm - minRPM) * (maxDuration - minDuration)) / (maxRPM - minRPM);

    return duration;
  };

  const getVisibleMilkCilinder = (quantity) => {
    if (quantity >= 0 && quantity < 12.5) return null;
    if (quantity >= 12.5 && quantity < 37.5)
      return (
        <mesh
          geometry={nodes.MilkCilinder25.geometry}
          material={materials["MilkMaterial.001"]}
          position={[-0.026, 1.597, -0.096]}
          scale={[2.531, 2.531, 2.615]}
        />
      );
    if (quantity >= 37.5 && quantity < 62.5)
      return (
        <mesh
          geometry={nodes.MilkCilinder50.geometry}
          material={materials["MilkMaterial.001"]}
          position={[-0.026, 1.597, -0.096]}
          scale={[2.531, 2.531, 2.615]}
        />
      );
    if (quantity >= 62.5 && quantity < 87.5)
      return (
        <mesh
          geometry={nodes.MilkCilinder75.geometry}
          material={materials["MilkMaterial.001"]}
          position={[-0.026, 1.597, -0.096]}
          scale={[2.531, 2.531, 2.615]}
        />
      );
    if (quantity >= 87.5 && quantity <= 100)
      return (
        <mesh
          geometry={nodes.MilkCilinder100.geometry}
          material={materials["MilkMaterial.001"]}
          position={[-0.026, 1.597, -0.096]}
          scale={[2.531, 2.531, 2.615]}
        />
      );

    return null;
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

  return (
    <group dispose={null}>
      {/* Palas del tanque */}
      <animated.mesh
        geometry={nodes.Blade2.geometry}
        material={materials.BladeMaterial}
        position={[0, 0.737, 0.918]}
        scale={-0.148}
        rotation={rotationBlade1.rotation}
      />
      <animated.mesh
        geometry={nodes.Blade1.geometry}
        material={materials.BladeMaterial}
        position={[0, 0.737, -0.982]}
        scale={-0.148}
        rotation={rotationBlade2.rotation}
      />

      {/* Nivel de leche */}
      {getVisibleMilkCilinder(milkQuantityData?.milkQuantity ?? 0)}

      {/* Cilindro del tanque */}
      <mesh
        geometry={nodes.TankCilinder.geometry}
        material={materials["TankMaterial.001"]}
        position={[0.548, 0.399, -1.476]}
      />

      {/* Trampilla */}
      <animated.mesh
        geometry={nodes.Hatch.geometry}
        material={materials.HatchMaterial}
        position={[0, 2.377, -0.206]}
        rotation={rotationHatch}
      />

      {/* Elementos adicionales */}
      <mesh
        geometry={nodes.Plano.geometry}
        material={nodes.Plano.material}
        position={[-0.3, 1.014, 0.775]}
        scale={5.276}
      />
      <mesh
        geometry={nodes.Can1.geometry}
        material={materials.RedCanMaterial}
        position={[1.765, 0.426, 3.401]}
      />
      <mesh
        geometry={nodes.Can2.geometry}
        material={materials.BlueCanMaterial}
        position={[1.765, 0.426, 2.998]}
      />
      <mesh
        geometry={nodes.Scales.geometry}
        material={materials.ScaleMaterial}
        position={[1.762, 0.22, 3.206]}
        scale={[0.302, 0.017, 0.389]}
      />
      <mesh
        geometry={nodes.Blade2Hat.geometry}
        material={materials.BladeMaterial}
        position={[-0.003, 2.451, 0.916]}
        scale={[0.116, 0.085, 0.116]}
      />
      <mesh
        geometry={nodes.Blade1Hat.geometry}
        material={materials.BladeMaterial}
        position={[-0.003, 2.451, -0.988]}
        scale={[0.116, 0.085, 0.116]}
      />

      {/* CallOutText */}
      <CallOutText
        position={[0, 2.9, 0.92]}
        text={`RPM: ${encoderData?.value ?? "No data"} `}
        radius={0.05}
      />
      <CallOutText
        position={[0, 2.9, -0.92]}
        text={`RPM: ${encoderData?.value ?? "No data"} `}
        radius={0.05}
      />
      <CallOutText
        position={[0, 2.9, 0]}
        text={`Hatch: ${
          switchStatus == null
            ? "No Data"
            : switchStatus.status
            ? "Open"
            : "Closed"
        }`}
      />
      <CallOutText
        position={[1.7, 0.8, 3.2]}
        text={`Weight: ${
          weightData == null ? "No Data" : weightData.weight + "kg"
        } `}
      />
      <CallOutTextTemperatures
        position={[-1.2, 1.8, -3.8]}
        overSurface={tankTemperaturesData?.over_surface_temperature}
        onSurface={tankTemperaturesData?.surface_temperature}
        underSurface={tankTemperaturesData?.submerged_temperature}
      />
      
      <CallOutTextMilkQuantity
        position={[-1.2, 1.8, -5.4]}
        quantity={milkQuantityData?.milkQuantity}
      />

      <CallOutTextAirQuality
        position={[3.7, 2.8, 4.8]}
        data={airQualityData}
      />
    </group>
  );
}

useGLTF.preload("/horizontalTankModel/2Pales/HorizontalTank2BladesModel.glb");
