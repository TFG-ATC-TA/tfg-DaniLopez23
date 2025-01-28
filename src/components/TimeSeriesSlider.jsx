import { useState, useEffect, useMemo } from "react";
import {
  format,
  addDays,
  setHours,
  setMinutes,
  differenceInDays,
  isSameDay,
} from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import DateSlider from "@/components/ui/DateSlider";
import TimeSlider from "@/components/ui/TimeSlider";

export default function TimeSeriesSlider({ startDate, endDate, states }) {
  const [currentDate, setCurrentDate] = useState(startDate);
  const [selectedState, setSelectedState] = useState(null);

  const currentDay = differenceInDays(currentDate, startDate);
  const currentMinutes = currentDate.getHours() * 60 + currentDate.getMinutes();

  const handleDateChange = (newDay) => {
    const newDate = addDays(startDate, newDay);
    setCurrentDate(
      setMinutes(
        setHours(newDate, currentDate.getHours()),
        currentDate.getMinutes()
      )
    );
  };

  const handleTimeChange = (newMinutes) => {
    const newDate = setMinutes(setHours(currentDate, 0), newMinutes);
    setCurrentDate(newDate);
  };

  const handleStateSelect = (stateLabel) => {
    setSelectedState(stateLabel === selectedState ? null : stateLabel);
  };

  const formatDate = (date) => format(date, "d MMMM yyyy");
  const formatTime = (date) => format(date, "HH:mm");

  const stateMarkers = useMemo(() => {
    if (!selectedState) return [];
    return states
      .filter(
        (state) =>
          state.label === selectedState && isSameDay(state.date, currentDate)
      )
      .map((state) => ({
        value: state.date.getHours() * 60 + state.date.getMinutes(),
        label: `${state.label} at ${formatTime(state.date)}`,
      }));
  }, [currentDate, states, selectedState, formatTime]); // Added formatTime to dependencies

  return (
    <div className="w-full max-w-2xl">
      <div className="flex items-center mb-2">
        <label className="w-16 text-left text-lg font-semibold h-12">Date</label>
        <div className="flex-grow">
          <DateSlider
            startDate={startDate}
            endDate={endDate}
            currentDay={currentDay}
            onChange={handleDateChange}
          />
        </div>
      </div>
      <div className="flex items-center">
        <label className="w-16 text-left text-lg font-semibold h-12">Time</label>
        <div className="flex-grow">
          <TimeSlider
            value={currentMinutes}
            onChange={handleTimeChange}
            marks={stateMarkers}
          />
        </div>
      </div>
    </div>
  );
}
