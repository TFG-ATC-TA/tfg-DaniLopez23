import { create } from "zustand";
import { getHistoricalData } from "@/services/farm";
import { format } from "date-fns";

// Helper function to convert time string (HH:MM) to minutes
const timeStringToMinutes = (timeString) => {
  if (!timeString) return 0;
  const [hours, minutes] = timeString.split(":").map(Number);
  return hours * 60 + minutes;
};

export const useHistoricalDataStore = create((set, get) => ({
  historicalData: null,
  selectedHistoricalData: null,
  selectedTime: null,
  error: null,

  // Actualiza el dato seleccionado según la hora
  updateSelectedHistoricalData: (data, timeString) => {
    if (!data || data === "loading" || !timeString) {
      set({ selectedHistoricalData: null });
      return;
    }

    if (data[timeString]) {
      set({ selectedHistoricalData: data[timeString] });
      return;
    }

    const times = Object.keys(data);
    if (times.length > 0) {
      const targetMinutes = timeStringToMinutes(timeString);
      let closestTime = times[0];
      let minDifference = Math.abs(timeStringToMinutes(closestTime) - targetMinutes);

      times.forEach((time) => {
        const difference = Math.abs(timeStringToMinutes(time) - targetMinutes);
        if (difference < minDifference) {
          closestTime = time;
          minDifference = difference;
        }
      });

      set({ selectedHistoricalData: data[closestTime] });
    } else {
      set({ selectedHistoricalData: null });
    }
  },

  // Fetch de datos históricos
  fetchHistoricalData: async ({ filters, boardIds, selectedFarm, selectedTank }) => {
    if (!filters || !boardIds || !selectedFarm) {
      console.warn("Missing required parameters for fetching historical data");
      console.warn("Filters:", filters);
      console.warn("Board IDs:", boardIds);
      console.warn("Selected Farm:", selectedFarm);
      return;
    }

    try {
      const dateToUse =
        filters.selectedDate ||
        (filters.dateRange ? filters.dateRange.from : null);

      if (!dateToUse) {
        console.warn("No date available for fetching historical data");
        return;
      }

      const formattedDate = format(new Date(dateToUse), "yyyy-MM-dd");

      set({ historicalData: "loading", error: null });

      const data = await getHistoricalData({
        date: formattedDate,
        boardIds,
        farm: selectedFarm.broker,
        tank: selectedTank,
      });

      if (!data || data.data === null) {
        const msg =
          data && data.message
            ? data.message
            : `No historical data found for date ${formattedDate}`;
        set({ historicalData: null, error: new Error(msg) });
        return;
      }

      set({ historicalData: data, error: null });

      // Si hay hora seleccionada, actualiza el dato seleccionado
      const selectedTime = get().selectedTime;
      if (selectedTime) {
        get().updateSelectedHistoricalData(data, selectedTime);
      }
    } catch (err) {
      console.error("Error fetching historical data:", err);
      set({ historicalData: null, error: err });
    }
  },

  handleTimeSelected: (timeString) => {
    set({ selectedTime: timeString });
    const { historicalData, updateSelectedHistoricalData } = get();
    if (!timeString) return;

    if (historicalData && historicalData !== "loading") {
      updateSelectedHistoricalData(historicalData, timeString);
    } else {
      set({ selectedHistoricalData: null });
    }
  },

  setSelectedTime: (timeString) => set({ selectedTime: timeString }),
  setSelectedHistoricalData: (data) => set({ selectedHistoricalData: data }),
  setHistoricalData: (data) => set({ historicalData: data }),
  setError: (err) => set({ error: err }),
}));