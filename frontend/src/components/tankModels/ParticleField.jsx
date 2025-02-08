import { Points, PointMaterial } from '@react-three/drei';
import { useMemo } from 'react';
import * as THREE from 'three';

/**
 * Crea una textura circular usando un canvas.
 */
function createCircleTexture() {
  const size = 120;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const context = canvas.getContext('2d');
  context.fillStyle = 'white';
  context.beginPath();
  context.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
  context.fill();
  // Es importante que la textura se actualice para usar transparencia
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

/**
 * Componente ParticleField
 * @param {number} particleCount - Cantidad de partículas a generar.
 * @param {object} zone - Objeto que define el área permitida para las partículas.
 *                        Por ejemplo: { x: [-5, 5], y: [-5, 5], z: [-5, 5] }
 */
export default function ParticleField({ 
  particleCount = 1000, 
  zone = { x: [-3, 5], y: [-5, 5], z: [-5, 5] } 
}) {
  // Genera posiciones aleatorias solo dentro del área definida en "zone"
  const positions = useMemo(() => {
    const temp = [];
    const { x: [xmin, xmax], y: [ymin, ymax], z: [zmin, zmax] } = zone;
    for (let i = 0; i < particleCount; i++) {
      const x = Math.random() * (xmax - xmin) + xmin;
      const y = Math.random() * (ymax - ymin) + ymin;
      const z = Math.random() * (zmax - zmin) + zmin;
      temp.push(x, y, z);
    }
    return new Float32Array(temp);
  }, [particleCount, zone]);

  // Usamos useMemo para crear la textura circular una sola vez.
  const circleTexture = useMemo(() => createCircleTexture(), []);

  return (
    <Points positions={positions}>
      <PointMaterial
        map={circleTexture}        // Textura circular para cada partícula.
        transparent={true}         // Permite usar transparencia.
        alphaTest={0.5}            // Descarta píxeles con alfa menor a 0.5.
        size={0.05}                // Tamaño de la partícula.
        color="#ffffff"            // Color base.
      />
    </Points>
  );
}
