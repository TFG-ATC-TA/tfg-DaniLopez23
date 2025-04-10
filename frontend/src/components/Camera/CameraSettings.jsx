import { useRef, useEffect } from "react";
import { CameraControls} from "@react-three/drei";
import { cameraViews } from "./CameraViews";

const CameraSettings = ({ view, tankDisplay }) => {
  const cameraControlsRef = useRef();

  // Efecto para restricciones iniciales y cambios de vista
  useEffect(() => {
    if (cameraControlsRef.current) {
      const config = cameraViews[tankDisplay][view] || cameraViews.default;
      
      // Configurar posición y objetivo
      cameraControlsRef.current.setLookAt(
        ...config.position,
        ...config.target,
        true
      );

      // Bloquear completamente el zoom
      cameraControlsRef.current.dollyEnabled = false;
      cameraControlsRef.current.zoomEnabled = false;
      
      // Bloquear rotación
      cameraControlsRef.current.rotateEnabled = false;
      
      // Bloquear paneo
      cameraControlsRef.current.truckEnabled = false;
      
      // Bloquear todos los botones del mouse
      cameraControlsRef.current.mouseButtons.left = 0;
      cameraControlsRef.current.mouseButtons.right = 0;
      cameraControlsRef.current.mouseButtons.middle = 0;
      cameraControlsRef.current.mouseButtons.wheel = 0;
      
      // Bloquear todos los gestos táctiles
      cameraControlsRef.current.touches.one = 0;
      cameraControlsRef.current.touches.two = 0;
      cameraControlsRef.current.touches.three = 0;
    }
    

  }, [view, tankDisplay]);
  
  return (
    <>
      <CameraControls
        ref={cameraControlsRef}
        makeDefault
        minDistance={6}
        maxDistance={6}
      />
    </>
  );
};

export default CameraSettings;