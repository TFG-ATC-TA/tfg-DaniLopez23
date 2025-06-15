import { useState, useCallback } from "react";
import { predictStatesByDate } from "@/services/predictStates";
import { format } from "date-fns";

const useTankStates = ({ filters, boardIds, selectedFarm, selectedTank }) => {
  const [tankStates, setTankStates] = useState(null);
  const [tankStatesLoading, setTankStatesLoading] = useState(false);
  const [tankStatesError, setTankStatesError] = useState(null);

  const fetchTankStates = useCallback(async () => {
    try {
      const dateToUse =
        filters.selectedDate || (filters.dateRange ? filters.dateRange.from : null);

      if (!dateToUse) {
        console.warn("No date available for fetching tank states");
        return;
      }

      const formattedDate = format(new Date(dateToUse), "yyyy-MM-dd");

      setTankStatesLoading(true);
      setTankStatesError(null);

      const tankStates = await predictStatesByDate({
        farm: selectedFarm.broker,
        tank: selectedTank.name,
        date: formattedDate,
        boardIds,
      });

      setTankStates(tankStates || null);
    } catch (err) {
      console.error("Error fetching tank states:", err);
      setTankStates(null);
      setTankStatesError(err);
    } finally {
      setTankStatesLoading(false);
    }
  }, [filters, boardIds, selectedFarm?.broker, selectedTank?.name]);

  const retryFetchTankStates = () => {
    setTankStatesError(null);
    fetchTankStates();
  };

  return {
    tankStates,
    tankStatesLoading,
    tankStatesError,
    fetchTankStates,
    retryFetchTankStates,
  };
};

export default useTankStates;
