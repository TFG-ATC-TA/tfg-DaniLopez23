import { useEffect, useCallback } from "react";
import useTankStore from "@/Stores/useTankStore";
import { useSocket } from "@/WebSockets/SocketProvider";

export const useTank = () => {
  const { selectedTank, setSelectedTank } = useTankStore((state) => state);
  const { joinRooms } = useSocket();

  const changeSelectedTank = useCallback((newTank) => {
    // Select the new tank
    setSelectedTank(newTank);

    // Join the rooms for the new tank
    if (newTank.devices && Array.isArray(newTank.devices)) {
      const boardIds = newTank.devices
        .map(device => device.boardId)
        .filter(Boolean);
      
      joinRooms(boardIds);
    } else {
      console.warn("New tank has no devices or devices is not an array");
    }
  }, [setSelectedTank, joinRooms]);

  useEffect(() => {
    if (selectedTank) {
      // Join rooms for the initially selected tank
      if (selectedTank.devices && Array.isArray(selectedTank.devices)) {
        const boardIds = selectedTank.devices
          .map(device => device.boardId)
          .filter(Boolean);
        
        joinRooms(boardIds);
      }
    }
  }, [selectedTank, joinRooms]);

  return { selectedTank, changeSelectedTank };
};