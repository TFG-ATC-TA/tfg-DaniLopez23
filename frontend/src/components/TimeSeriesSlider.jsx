'use client';

import { useState, useMemo, useEffect, useCallback } from "react";
import {
  format,
  addDays,
  setHours,
  setMinutes,
  isSameDay,
  differenceInCalendarDays,
  addMinutes
} from "date-fns";
import { Play, Pause } from 'lucide-react';

import { Button } from "@/components/ui/button";
import DateSelector from "@/components/ui/DateSelector";
import TimeSlider from "@/components/ui/TimeSlider";

export default function TimeSeriesSlider({ startDate, endDate, states }) {
  const [currentDate, setCurrentDate] = useState(startDate);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleDateChange = (newDay) => {
    const newDate = addDays(startDate, newDay);

    let adjustedDate;
    if (isSameDay(newDate, startDate)) {
      adjustedDate = setMinutes(setHours(newDate, startDate.getHours()), startDate.getMinutes());
    } else if (isSameDay(newDate, endDate)) {
      adjustedDate = setMinutes(setHours(newDate, 0), 0);
    } else {
      adjustedDate = setMinutes(setHours(newDate, 0), 0);
    }

    setCurrentDate(adjustedDate);
  };

  const handleTimeChange = useCallback((newMinutes) => {
    setCurrentDate((prevDate) => {
      const newDate = setMinutes(setHours(prevDate, Math.floor(newMinutes / 60)), newMinutes % 60);
      if (newDate > endDate) {
        return endDate;
      }
      return newDate;
    });
  }, [endDate]);

  const formatTime = useCallback((date) => format(date, "HH:mm"), []);

  const stateMarkers = useMemo(() => {
    return states
      .filter((state) => isSameDay(state.date, currentDate))
      .map((state) => ({
        value: state.date.getHours() * 60 + state.date.getMinutes(),
        label: `${state.label} at ${formatTime(state.date)}`,
      }));
  }, [currentDate, states, formatTime]);

  const handleTimeSliderLimits = useCallback(() => {
    let minTime = 0;
    let maxTime = 23 * 60 + 59;

    if (isSameDay(currentDate, startDate)) {
      minTime = startDate.getHours() * 60 + startDate.getMinutes();
    }
    if (isSameDay(currentDate, endDate)) {
      maxTime = endDate.getHours() * 60 + endDate.getMinutes();
    }

    return { minTime, maxTime };
  }, [currentDate, startDate, endDate]);

  const currentDay = differenceInCalendarDays(currentDate, startDate);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    let intervalId;
    if (isPlaying) {
      intervalId = setInterval(() => {
        setCurrentDate((prevDate) => {
          const newDate = addMinutes(prevDate, 15);
          if (newDate > endDate) {
            setIsPlaying(false);
            return endDate;
          }
          return newDate;
        });
      }, 500);
    }
    return () => clearInterval(intervalId);
  }, [isPlaying, endDate]);

  return (
    <div className="w-full max-w-4xl bg-white shadow-sm rounded-lg p-6">
      <div className="flex items-start space-x-6">
        <div className="w-1/3">
          <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
          <DateSelector
            startDate={startDate}
            endDate={endDate}
            currentDay={currentDay}
            onChange={handleDateChange}
          />
        </div>
        <div className="w-2/3">
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">Time</label>
            <Button
              size="sm"
              variant="outline"
              onClick={togglePlay}
              className="ml-2"
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
          </div>
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