// src/hooks/useFarmInitialization.js
import { useEffect } from "react";
import useFarmStore from "@/Stores/useFarmStore";
import useTankStore from "@/Stores/useTankStore";
import useSocketStore from "@/Stores/useSocketStore";
import { getFarms } from "@/services/farm";
import { set } from "date-fns";

const MAX_RETRIES = 3;
const RETRY_DELAY = 2000; // 2 seconds

export const useFarmInitialization = () => {

  const { setFarms, setSelectedFarm, setServerStatus } = useFarmStore((state) => state);

  const { setSelectedTank } = useTankStore((state) => state);
  const { joinRooms } = useSocketStore((state) => state);


  const initialize = async (retryCount = 0) => {
    try {

      const farms = await getFarms();
      setFarms(farms);
      const farmData = farms[1];
      setSelectedFarm(farmData);
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
      setServerStatus({ status: "connected", error: null });
    } catch (error) {
      setServerStatus({ status: "disconnected", error: error.message });
      // if (retryCount < MAX_RETRIES) {
      //   console.log(`Retrying in ${RETRY_DELAY / 1000} seconds...`);
      //   setTimeout(() => initialize(retryCount + 1), RETRY_DELAY);
      // }
    }
  };

  useEffect(() => {
    initialize();
  }, [setSelectedFarm, setSelectedTank, joinRooms]);

  const retryInitialization = () => {
    setServerStatus({ status: "connecting", error: null });
    initialize();
  };

  return { retryInitialization };
};