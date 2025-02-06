import { Points, PointMaterial } from '@react-three/drei'
import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber';


export function ParticleField() {
  const particleCount = 800;
  const positions = useMemo(() => {
    const temp = [];
    for (let i = 0; i < particleCount; i++) {
      temp.push((Math.random() - 0.5) * 20); // X
      temp.push((Math.random() - 0.5) * 20); // Y
      temp.push((Math.random() - 0.5) * 20); // Z
    }
    return new Float32Array(temp);
  }, [particleCount]);

  const particlesRef = useRef();

  // Movimiento suave de partículas
  useFrame(() => {
    if (particlesRef.current) {
      const positionsArray = particlesRef.current.geometry.attributes.position.array;
      for (let i = 0; i < positionsArray.length; i += 3) {
        positionsArray[i + 1] += Math.sin((i + performance.now() * 0.001) * 0.02) * 0.002;
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <Points ref={particlesRef}>
      <bufferGeometry attach="geometry">
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <PointMaterial size={0.55} color="#FFFFFF" transparent opacity={0.7} />
    </Points>
  );
}

