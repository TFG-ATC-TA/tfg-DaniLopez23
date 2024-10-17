import React from 'react'
import { useGLTF, Html, Billboard, Line } from '@react-three/drei'
import { useSpring, animated } from '@react-spring/three'

// Componente para etiquetas con fondo, que siempre miran hacia la cámara
const Tag = ({ children, position }) => (
  <Billboard position={position}>
    <Html distanceFactor={10}>
      <div className="bg-white bg-opacity-90 text-black px-2 py-1 rounded shadow-lg text-sm whitespace-nowrap">
        {children}
      </div>
    </Html>
  </Billboard>
)

// Componente principal del tanque
export default function HorizontalTankModel2Blades(props) {
  const { nodes, materials } = useGLTF('/horizontalTankModel/2Pales/HorizontalTankModel2Blades.glb')

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

    return null
  }

  const rotationBlade1 = useSpring({
    loop: true,
    to: { rotation: [0, Math.PI * 2, 0] },
    from: { rotation: [0, 0, 0] },
    config: { duration: getRotationDuration(props.encoderData) },
  })

  const rotationBlade2 = useSpring({
    loop: true,
    to: { rotation: [0, -Math.PI * 2, 0] },
    from: { rotation: [0, 0, 0] },
    config: { duration: getRotationDuration(props.encoderData) },
  })

  const { rotation: rotationHatch } = useSpring({
    to: { rotation: props.switchStatus ? [Math.PI / 2, 0, 0] : [0, 0, 0] },
    config: { duration: 1000 },
  })

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

      {/* Etiquetas */}
      <Line points={[[0, 3.5, 0], [1.5, 3.5, 0]]} color="black" lineWidth={1} />
      <Tag position={[1.5, 3.5, 0]}>
        Hatch: {props.switchStatus ? 'Open' : 'Closed'}
      </Tag>

      <Line points={[[0, 2.5, 0], [1.5, 2.5, 0]]} color="black" lineWidth={1} />
      <Tag position={[1.5, 2.5, 0]}>
        Blade Speed: {props.encoderData.value} RPM
      </Tag>

      <Line points={[[0, 1.5, 0], [1.5, 1.5, 0]]} color="black" lineWidth={1} />
      <Tag position={[1.5, 1.5, 0]}>
        Milk Level: {props.milkQuantityData.milkQuantity}%
      </Tag>
    </group>
  )
}

useGLTF.preload('/horizontalTankModel/2Pales/HorizontalTankModel2Blades.glb')
