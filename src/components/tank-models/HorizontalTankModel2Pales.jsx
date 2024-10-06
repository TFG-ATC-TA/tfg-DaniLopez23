import * as THREE from 'three';
import { useGLTF } from '@react-three/drei';
import { useRef, useEffect } from 'react';
import { useThree } from '@react-three/fiber';

export default function HorizontalTankModel2Pales(props) {
  const { nodes, materials } = useGLTF(
    "/horizontalTankModel/ModeloTanqueHorizontal2Palas.gltf"
  );
  const { gl } = useThree(); // Acceder al renderizador
  const meshRef = useRef();

  // Definir el nivel de leche (puede ser una prop o un estado)
  const nivelDeLeche = props.milkQuantity || 0.5; // Nivel de leche entre 0 (vacío) y 1 (lleno)

  // Suponiendo que el cilindro tiene una altura de 5 unidades en Y.
  const alturaCilindro = 5; 
  const planoDeCortePosicionY = alturaCilindro * nivelDeLeche; // Posición del plano en Y

  // Crear el clipping plane que cortará el cilindro de leche
  const clipPlane = new THREE.Plane(new THREE.Vector3(0, -1, 0), planoDeCortePosicionY);

  useEffect(() => {
    // Habilitar el clipping global en el renderizador
    gl.localClippingEnabled = true;

    // Aplicar el clipping plane al material del cilindro de leche
    materials.MilkMaterial.clippingPlanes = [clipPlane];
    materials.MilkMaterial.needsUpdate = true; // Actualizar el material
  }, [nivelDeLeche, materials.MilkMaterial, gl]);

  return (
    <group {...props} dispose={null}>
      <mesh
        geometry={nodes.TankCilinder.geometry}
        material={materials.TankMaterial}
        position={[3, 1.35, 0]}
      />
      <mesh
        ref={meshRef}
        geometry={nodes.MilkCilinder.geometry}
        material={materials.MilkMaterial}
        position={[3, 1.35, 0]}
      />
      {/* Visualizar el plano de corte */}
      <mesh position={[3, planoDeCortePosicionY, 0]}>
        <planeGeometry args={[10, 10]} /> {/* Tamaño del plano */}
        <meshBasicMaterial color="red" transparent={true} opacity={0.5} />
      </mesh>
    </group>
  );
}

useGLTF.preload("/horizontalTankModel/ModeloTanqueHorizontal2Palas.gltf");
