import { useCallback } from "react";
import useTankStore from "@/stores/useTankStore";
import useSocketStore from "@/stores/useSocketStore";

export const useTank = () => {
  const { setSelectedTank } = useTankStore((state) => state);
  const { joinRooms } = useSocketStore((state) => state);
  const changeSelectedTank = useCallback(
    (newTank, farmId) => {
      // Select the new tank
      setSelectedTank(newTank);
      // Join the rooms for the new tank
      if (newTank.devices && Array.isArray(newTank.devices)) {
        const boardIds = newTank.devices
          .map((device) => device.boardId)
          .filter(Boolean);

        joinRooms(boardIds, farmId);
        
      } else {
        console.warn("New tank has no devices or devices is not an array");
      }
    },
    [setSelectedTank, joinRooms]
  );

  return { changeSelectedTank };
};
