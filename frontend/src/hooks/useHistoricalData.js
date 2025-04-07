import { useState, useCallback } from "react";
import { getHistoricalData } from "@/services/farm";
import { format } from "date-fns";

const useHistoricalData = ({ filters, boardIds, selectedFarm, selectedTime }) => {
  const [historicalData, setHistoricalData] = useState(null);
  const [selectedHistoricalData, setSelectedHistoricalData] = useState(null);
  const [error, setError] = useState(null);

  const updateSelectedHistoricalData = useCallback((data, timeString) => {
    if (!data || data === "loading") return;

    if (data[timeString]) {
      setSelectedHistoricalData(data[timeString]);
    } else {
      console.warn(`No data found for time ${timeString}`);
      setSelectedHistoricalData(null);
    }
  }, []);

  const fetchHistoricalData = useCallback(async () => {
    try {
      const dateToUse =
        filters.selectedDate || (filters.dateRange ? filters.dateRange.from : null);

      if (!dateToUse) {
        console.warn("No date available for fetching historical data");
        return;
      }

      const formattedDate = format(new Date(dateToUse), "yyyy-MM-dd");

      setHistoricalData("loading");
      setError(null);

      const data = await getHistoricalData({
        date: formattedDate,
        boardIds,
        farm: selectedFarm.broker,
      });

      if (data === null) {
        setHistoricalData(null);
        return;
      }

      setHistoricalData(data);

      if (selectedTime) {
        updateSelectedHistoricalData(data, selectedTime);
      }
    } catch (err) {
      console.error("Error fetching historical data:", err);
      setHistoricalData(null);
      setError(err);
    }
  }, [filters, boardIds, selectedFarm?.broker, selectedTime, updateSelectedHistoricalData]);

  const handleTimeSelected = useCallback(
    (timeString) => {
      setSelectedHistoricalData(null);
      if (historicalData && historicalData !== "loading") {
        updateSelectedHistoricalData(historicalData, timeString);
      }
    },
    [historicalData, updateSelectedHistoricalData]
  );

  return {
    historicalData,
    selectedHistoricalData,
    error,
    fetchHistoricalData,
    handleTimeSelected,
    setSelectedHistoricalData,
  };
};

export default useHistoricalData;
