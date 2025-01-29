import { useState, useMemo } from "react";
import {
  format,
  addDays,
  setHours,
  setMinutes,
  differenceInDays,
  isSameDay,
  max as maxDate,
  min as minDate,
} from "date-fns";

import DateSlider from "@/components/ui/DateSlider";
import TimeSlider from "@/components/ui/TimeSlider";

export default function TimeSeriesSlider({ startDate, endDate, states }) {
  const [currentDate, setCurrentDate] = useState(startDate);

  const [selectedState, setSelectedState] = useState(null);

  const currentDay = differenceInDays(0);
  const currentMinutes = currentDate.getHours() * 60 + currentDate.getMinutes();

  const handleDateChange = (newDay) => {
    const newDate = addDays(startDate, newDay);
  
    let hours = currentDate.getHours();
    let minutes = currentDate.getMinutes();
  
    if (isSameDay(newDate, startDate)) {
      // Aseguramos que las horas y minutos no estén fuera del rango del día inicial
      const minMinutes = startDate.getHours() * 60 + startDate.getMinutes();
      if (hours * 60 + minutes < minMinutes) {
        hours = startDate.getHours();
        minutes = startDate.getMinutes();
      }
    } else if (isSameDay(newDate, endDate)) {
      // Aseguramos que las horas y minutos no excedan el rango del día final
      const maxMinutes = endDate.getHours() * 60 + endDate.getMinutes();
      if (hours * 60 + minutes > maxMinutes) {
        hours = endDate.getHours();
        minutes = endDate.getMinutes();
      }
    }
  
    setCurrentDate(setMinutes(setHours(newDate, hours), minutes));
  };
  
  const handleTimeChange = (newMinutes) => {
    let newDate = setMinutes(setHours(currentDate, Math.floor(newMinutes / 60)), newMinutes % 60);
  
    // Limitar los minutos en función del día actual
    if (isSameDay(newDate, startDate)) {
      const minMinutes = startDate.getHours() * 60 + startDate.getMinutes();
      if (newMinutes < minMinutes) {
        newDate = setMinutes(setHours(currentDate, startDate.getHours()), startDate.getMinutes());
      }
    } else if (isSameDay(newDate, endDate)) {
      const maxMinutes = endDate.getHours() * 60 + endDate.getMinutes();
      if (newMinutes > maxMinutes) {
        newDate = setMinutes(setHours(currentDate, endDate.getHours()), endDate.getMinutes());
      }
    }
  
    setCurrentDate(newDate);
  };
  

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
  }, [currentDate, states, selectedState]);

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

  console.log(`Current Day ${currentDay} - Current Minutes ${currentMinutes}`);
  console.log(`Current Date ${currentDate}`);
  return (
    <div className="w-full max-w-4xl">
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
            min={handleTimeSliderLimits().minTime}
            max={handleTimeSliderLimits().maxTime}
          />
        </div>
      </div>
    </div>
  );
}
