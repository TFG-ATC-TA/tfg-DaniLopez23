import React, { useRef, useEffect } from "react";
import { CameraControls } from "@react-three/drei";
import { cameraViews } from "./CameraViews";


const CameraSettings = ({ view }) => {
    const cameraControlsRef = useRef();
  
    useEffect(() => {
      if (cameraControlsRef.current) {
        // Use the 'front' view as a fallback if the provided view doesn't exist
        const { position, target } = cameraViews[view] || cameraViews.default;
        cameraControlsRef.current.setLookAt(
          ...position,
          ...target,
          true // Enable smooth transition
        );
  
        // Disable user interactions
        cameraControlsRef.current.mouseButtons.left = 0;
        cameraControlsRef.current.mouseButtons.right = 0;
        cameraControlsRef.current.mouseButtons.middle = 0;
        cameraControlsRef.current.mouseButtons.wheel = 0;
        cameraControlsRef.current.touches.one = 0;
        cameraControlsRef.current.touches.two = 0;
        cameraControlsRef.current.touches.three = 0;
      }
    }, [view]);
  
    return <CameraControls ref={cameraControlsRef} />;
  };
  

export default CameraSettings;