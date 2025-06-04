import { useRef, useEffect } from "react";
import { CameraControls } from "@react-three/drei";
import { cameraViews } from "./CameraViews";

const CameraSettings = ({ view, tankDisplay, isFullscreen }) => {
  const cameraControlsRef = useRef();

  useEffect(() => {
    if (cameraControlsRef.current) {
      const config = cameraViews[tankDisplay][view] || cameraViews.default;

      cameraControlsRef.current.setLookAt(
        ...config.position,
        ...config.target,
        true
      );

      if (isFullscreen) {
        // Permitir solo rotar y hacer zoom limitado en fullscreen, NO mover (truck/dolly)
        cameraControlsRef.current.dollyEnabled = false;
        cameraControlsRef.current.truckEnabled = false;
        cameraControlsRef.current.rotateEnabled = true;
        cameraControlsRef.current.zoomEnabled = true;

        cameraControlsRef.current.mouseButtons.left = 1;    // Rotar
        cameraControlsRef.current.mouseButtons.right = 0;   // No mover
        cameraControlsRef.current.mouseButtons.middle = 0;  // No mover
        cameraControlsRef.current.mouseButtons.wheel = 8;   // Zoom

        cameraControlsRef.current.touches.one = 1;   // Rotar
        cameraControlsRef.current.touches.two = 0;   // No mover
        cameraControlsRef.current.touches.three = 0;
      } else {
        // Bloquear todas las interacciones fuera de fullscreen
        cameraControlsRef.current.dollyEnabled = false;
        cameraControlsRef.current.zoomEnabled = false;
        cameraControlsRef.current.rotateEnabled = false;
        cameraControlsRef.current.truckEnabled = false;
        cameraControlsRef.current.mouseButtons.left = 0;
        cameraControlsRef.current.mouseButtons.right = 0;
        cameraControlsRef.current.mouseButtons.middle = 0;
        cameraControlsRef.current.mouseButtons.wheel = 0;
        cameraControlsRef.current.touches.one = 0;
        cameraControlsRef.current.touches.two = 0;
        cameraControlsRef.current.touches.three = 0;
      }
    }
  }, [view, tankDisplay, isFullscreen]);

  return (
    <>
      <CameraControls
        ref={cameraControlsRef}
        makeDefault
        minDistance={3} 
        maxDistance={10} 
      />
    </>
  );
};

export default CameraSettings;