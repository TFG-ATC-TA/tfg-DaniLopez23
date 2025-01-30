import { useRef, useEffect } from "react";
import { CameraControls } from "@react-three/drei";
import { cameraViews } from "./CameraViews";
import { GizmoHelper, GizmoViewport } from "@react-three/drei";

const CameraSettings = ({ view }) => {
  const cameraControlsRef = useRef();
  

  useEffect(() => {
    if (cameraControlsRef.current) {
      const config = cameraViews[view] || cameraViews.default;
      
      // Configurar posición y objetivo
      cameraControlsRef.current.setLookAt(
        ...config.position,
        ...config.target,
        true
      );

      // Restricciones de movimiento
      cameraControlsRef.current.mouseButtons.left = 0;
      cameraControlsRef.current.mouseButtons.right = 0;
      cameraControlsRef.current.mouseButtons.middle = 0;
      cameraControlsRef.current.mouseButtons.wheel = 0;
      cameraControlsRef.current.touches.one = 0;
      cameraControlsRef.current.touches.two = 0;
      cameraControlsRef.current.touches.three = 0;

      // Restricciones de ángulos y zoom
      cameraControlsRef.current.dollyEnabled = false;
      cameraControlsRef.current.infinityDolly = false;
    }
  }, [view]);

  return (
    <>
      <CameraControls
        ref={cameraControlsRef}
        makeDefault
        minDistance={5}
        maxDistance={5}
      />
      
      
        <GizmoHelper
          alignment="bottom-right"
          margin={[60, 60]}
          onUpdate={() => cameraControlsRef.current?.updateCameraUp()}
        >
          <GizmoViewport
            axisColors={["#9d4b4b", "#2f7f4f", "#3b5b9d"]}
            labelColor="white"
          />
        </GizmoHelper>
 
    </>
  );
};

export default CameraSettings;