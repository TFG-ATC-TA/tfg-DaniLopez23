import { useEffect } from "react";
import useDataStore from "@/Stores/useDataStore";
import useTankStore from "@/Stores/useTankStore";
import { getFarmById } from "@/services/farm";

const defaultFarmId = "673b5c5ed5c203a653ace69a";

export const useFarmInitialization = (joinRooms) => {
  const { setFarmData } = useDataStore((state) => state);
  const { setSelectedTank } = useTankStore((state) => state);

  useEffect(() => {
    const initialize = async () => {
      try {
        const farmData = await getFarmById(defaultFarmId);
        setFarmData(farmData);

        const firstMilkTank = farmData.equipments.find(
          (tank) => tank.type === "Tanque de leche"
        );
        setSelectedTank(firstMilkTank);

        if (firstMilkTank?.devices) {
          const boardIds = firstMilkTank.devices
            .map((device) => device.boardId)
            .filter(Boolean);
          joinRooms(boardIds);
        }
      } catch (error) {
        console.error("Error initializing farm data:", error);
      }
    };

    initialize();
  }, [setFarmData, setSelectedTank, joinRooms]);
};
