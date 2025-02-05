import { useState, useMemo } from "react";
import {
  format,
  addDays,
  setHours,
  setMinutes,
  isSameDay,
  startOfDay,
  endOfDay,
} from "date-fns";

import DateSlider from "@/components/ui/DateSlider";
import TimeSlider from "@/components/ui/TimeSlider";

export default function TimeSeriesSlider({ startDate, endDate, states }) {
  const [currentDate, setCurrentDate] = useState(startDate);

  const handleDateChange = (newDay) => {
    const newDate = addDays(startDate, newDay);

    // Al cambiar de día, el tiempo debe ajustarse al inicio permitido de ese día
    let adjustedDate;
    if (isSameDay(newDate, startDate)) {
      adjustedDate = setMinutes(setHours(newDate, startDate.getHours()), startDate.getMinutes());
    } else if (isSameDay(newDate, endDate)) {
      adjustedDate = setMinutes(setHours(newDate, 0), 0); // Inicio del último día
    } else {
      adjustedDate = setMinutes(setHours(newDate, 0), 0); // Días intermedios comienzan a las 00:00
    }

    setCurrentDate(adjustedDate);
  };

  const handleTimeChange = (newMinutes) => {
    setCurrentDate((prevDate) => setMinutes(setHours(prevDate, Math.floor(newMinutes / 60)), newMinutes % 60));
  };

  const formatTime = (date) => format(date, "HH:mm");

  const stateMarkers = useMemo(() => {
    return states
      .filter((state) => isSameDay(state.date, currentDate))
      .map((state) => ({
        value: state.date.getHours() * 60 + state.date.getMinutes(),
        label: `${state.label} at ${formatTime(state.date)}`,
      }));
  }, [currentDate, states]);

  const handleTimeSliderLimits = () => {
    let minTime = 0;
    let maxTime = 23 * 60 + 59;

    if (isSameDay(currentDate, startDate)) {
      minTime = startDate.getHours() * 60 + startDate.getMinutes();
    }
    if (isSameDay(currentDate, endDate)) {
      maxTime = endDate.getHours() * 60 + endDate.getMinutes();
    }

    return { minTime, maxTime };
  };

  return (
    <div className="w-full max-w-4xl">
      <div className="flex items-center mb-2">
        <label className="w-16 text-left text-lg font-semibold h-12">Date</label>
        <div className="flex-grow">
          <DateSlider
            startDate={startDate}
            endDate={endDate}
            currentDay={Math.floor((currentDate - startDate) / (24 * 60 * 60 * 1000))}
            onChange={handleDateChange}
          />
        </div>
      </div>
      <div className="flex items-center">
        <label className="w-16 text-left text-lg font-semibold h-12">Time</label>
        <div className="flex-grow">
          <TimeSlider
            value={currentDate.getHours() * 60 + currentDate.getMinutes()}
            onChange={handleTimeChange}
            marks={stateMarkers}
            min={handleTimeSliderLimits().minTime}
            max={handleTimeSliderLimits().maxTime}
          />
        </div>
      </div>
    </div>
  );
}
