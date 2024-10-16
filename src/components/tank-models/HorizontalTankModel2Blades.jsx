import React, { useState, useEffect } from 'react'
import { useGLTF, Html, Line } from '@react-three/drei'
import { useSpring, animated } from '@react-spring/three'
import { useFrame } from '@react-three/fiber'

const Tag = ({ children, position }) => (
  <Html position={position}>
    <div className="bg-white bg-opacity-80 text-black p-2 rounded-lg shadow-lg text-sm transition-all duration-300 hover:bg-opacity-100">
      {children}
    </div>
  </Html>
)

export default function HorizontalTankModel2Blades(props) {
  const { nodes, materials } = useGLTF('/horizontalTankModel/2Pales/HorizontalTankModel2Blades.glb')
  const [hovered, setHovered] = useState(null)

  const getRotationDuration = (encoderData) => {
    if (encoderData === null) return 0
    const minDuration = 1000
    const maxDuration = 10000
    const minRPM = 0
    const maxRPM = 100
    const rpm = encoderData
    const duration = ((rpm - minRPM) * (maxDuration - minDuration)) / (maxRPM - minRPM) + minDuration
    return duration
  }

  const getVisibleMilkCilinder = (quantity) => {
    if (quantity >= 0 && quantity < 12.5) return null
    if (quantity >= 12.5 && quantity < 37.5)
      return (
        <mesh
          geometry={nodes.MilkCilinder25.geometry}
          material={materials['MilkMaterial.001']}
          position={[-0.026, 2.389, -0.096]}
          scale={[2.531, 2.531, 2.615]}
        />
      )
    if (quantity >= 37.5 && quantity < 62.5)
      return (
        <mesh
          geometry={nodes.MilkCilinder50.geometry}
          material={materials['MilkMaterial.001']}
          position={[-0.026, 2.389, -0.096]}
          scale={[2.531, 2.531, 2.615]}
        />
      )
    if (quantity >= 62.5 && quantity < 87.5)
      return (
        <mesh
          geometry={nodes.MilkCilinder75.geometry}
          material={materials['MilkMaterial.001']}
          position={[-0.026, 2.389, -0.096]}
          scale={[2.531, 2.531, 2.615]}
        />
      )
    if (quantity >= 87.5 && quantity <= 100)
      return (
        <mesh
          geometry={nodes.MilkCilinder100.geometry}
          material={materials['MilkMaterial.001']}
          position={[-0.026, 2.389, -0.096]}
          scale={[2.531, 2.531, 2.615]}
        />
      )

    return "Invalid value"
  }

  const rotationBlade1 = useSpring({
    loop: true,
    to: { rotation: [0, Math.PI * 2, 0] },
    from: { rotation: [0, 0, 0] },
    config: { duration: getRotationDuration(props.encoderData.value) },
  })

  const rotationBlade2 = useSpring({
    loop: true,
    to: { rotation: [0, -Math.PI * 2, 0] },
    from: { rotation: [0, 0, 0] },
    config: { duration: getRotationDuration(props.encoderData.value) },
  })

  const { rotation: rotationHatch } = useSpring({
    to: { rotation: props.switchStatus ? [Math.PI / 2, 0, 0] : [0, 0, 0] },
    config: { duration: 1000 },
  })

  const [tagOpacity, setTagOpacity] = useState(0)
  useEffect(() => {
    const timer = setTimeout(() => setTagOpacity(1), 1000)
    return () => clearTimeout(timer)
  }, [])

  useFrame(() => {
    if (hovered) {
      setTagOpacity(1)
    } else {
      setTagOpacity((prev) => Math.max(prev - 0.02, 0.3))
    }
  })

  return (
    <group {...props} dispose={null} onPointerOver={() => setHovered(true)} onPointerOut={() => setHovered(false)}>
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
      {getVisibleMilkCilinder(props.milkQuantityData.milkQuantity)}
      <mesh
        geometry={nodes.TankCilinder.geometry}
        material={materials.TankMaterial}
        position={[0.002, 2.043, 0.008]}
        scale={1.113}
      />
      <animated.mesh
        geometry={nodes.Hatch.geometry}
        material={materials.HatchMaterial}
        position={[0, 3.257, 0]}
        scale={0.019}
        rotation={rotationHatch}
      />

      <group style={{ opacity: tagOpacity }} className="transition-opacity duration-300">
        <Tag position={[0, 2, 1.5]}>
          Blade Speed: {props.encoderData.value} RPM
        </Tag>
        <Tag position={[0, 1, -2]}>
          Milk Level: {props.milkQuantityData.milkQuantity}%
        </Tag>
        <Tag position={[0, 3.5, 0]}>
          Hatch: {props.switchStatus ? 'Open' : 'Closed'}
        </Tag>
      </group>
    </group>
  )
}

useGLTF.preload('/horizontalTankModel/2Pales/HorizontalTankModel2Blades.glb')