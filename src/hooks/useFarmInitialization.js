// src/hooks/useFarmInitialization.js
import { useEffect, useState } from "react";
import useFarmStore from "@/Stores/useFarmStore";
import useTankStore from "@/Stores/useTankStore";
import useSocketStore from "@/Stores/useSocketStore";
import { getFarmById } from "@/services/farm";

const defaultFarmId = "673b5c5ed5c203a653ace69a";
const MAX_RETRIES = 3;
const RETRY_DELAY = 2000; // 2 seconds

export const useFarmInitialization = () => {

  const { setFarmData } = useFarmStore((state) => state);

  const { setSelectedTank } = useTankStore((state) => state);
  const { joinRooms } = useSocketStore((state) => state);

  const [error, setError] = useState(null);

  const initialize = async (retryCount = 0) => {
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
      setError(null);
    } catch (error) {
      setError(error.message);
      if (retryCount < MAX_RETRIES) {
        console.log(`Retrying in ${RETRY_DELAY / 1000} seconds...`);
        setTimeout(() => initialize(retryCount + 1), RETRY_DELAY);
      }
    }
  };

  useEffect(() => {
    initialize();
  }, [setFarmData, setSelectedTank, joinRooms]);

  const retryInitialization = () => {
    setError(null);
    initialize();
  };

  return { error, retryInitialization };
};