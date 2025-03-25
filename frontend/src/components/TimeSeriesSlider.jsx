"use client"

import { useState, useMemo, useEffect, useCallback, useRef } from "react"
import {
  format,
  addDays,
  setHours,
  setMinutes,
  isSameDay,
  differenceInCalendarDays,
  addMinutes,
  parse,
  isWithinInterval,
} from "date-fns"
import { Play, Pause } from "lucide-react"
import * as SliderPrimitive from "@radix-ui/react-slider"
import { cn } from "@/lib/utils"

import { Button } from "@/components/ui/button"
import DateSelector from "@/components/ui/DateSelector"

// Define state colors - using actual CSS color values for direct styling
const STATE_COLORS = {
  MAINTENANCE: "#f59e0b", 
  MILKING: "#97ff3a", 
  COOLING: "#4da1ff",
  CLEANING: "#ff763a", 
  "EMPTY TANK": "#bb82ff", 
}

// Hardcoded intervals data
const stateData = {
  intervals: [
    {
      inicio: "23/03/2025 00:00:00",
      fin: "23/03/2025 04:00:00",
      estado: "MAINTENANCE",
    },
    {
      inicio: "23/03/2025 04:00:00",
      fin: "23/03/2025 05:45:00",
      estado: "MILKING",
    },
    {
      inicio: "23/03/2025 05:45:00",
      fin: "23/03/2025 08:00:00",
      estado: "COOLING",
    },
    {
      inicio: "23/03/2025 08:00:00",
      fin: "23/03/2025 13:15:00",
      estado: "MAINTENANCE",
    },
    {
      inicio: "23/03/2025 13:15:00",
      fin: "23/03/2025 14:00:00",
      estado: "COOLING",
    },
    {
      inicio: "23/03/2025 14:00:00",
      fin: "23/03/2025 14:15:00",
      estado: "MAINTENANCE",
    },
    {
      inicio: "23/03/2025 14:15:00",
      fin: "23/03/2025 14:45:00",
      estado: "COOLING",
    },
    {
      inicio: "23/03/2025 14:45:00",
      fin: "23/03/2025 16:00:00",
      estado: "MAINTENANCE",
    },
    {
      inicio: "23/03/2025 16:00:00",
      fin: "23/03/2025 17:30:00",
      estado: "MILKING",
    },
    {
      inicio: "23/03/2025 17:30:00",
      fin: "23/03/2025 20:30:00",
      estado: "COOLING",
    },
    {
      inicio: "23/03/2025 20:30:00",
      fin: "23/03/2025 23:59:59",
      estado: "MAINTENANCE",
    },
  ],
  states: ["CLEANING", "COOLING", "EMPTY TANK", "MAINTENANCE", "MILKING"],
}

// Internal TimeSlider component
const TimeSlider = ({
  value,
  onChange,
  marks = [],
  intervals = [],
  min = 0,
  max = 1439, // 23:59
  activeState = null,
  className,
  ...props
}) => {
  const sliderRef = useRef(null)
  const [sliderWidth, setSliderWidth] = useState(0)

  // Update slider width on mount and resize
  useEffect(() => {
    const updateWidth = () => {
      if (sliderRef.current) {
        setSliderWidth(sliderRef.current.offsetWidth)
      }
    }

    updateWidth()
    window.addEventListener("resize", updateWidth)
    return () => window.removeEventListener("resize", updateWidth)
  }, [])

  // Format minutes to HH:MM
  const formatMinutesToTime = (minutes) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}`
  }

  return (
    <div className={cn("relative pt-10 pb-10", className)} {...props}>
      {/* Current time display - positioned above the slider */}
      <div
        className="absolute font-medium"
        style={{
          left: `${((value - min) / (max - min)) * 100}%`,
          transform: "translateX(-20%)",
          top: "0px",
          fontSize: "14px",
        }}
      >
        {formatMinutesToTime(value)}
      </div>

      {/* Render interval segments */}
      <div ref={sliderRef} className="absolute h-2 top-10 left-0 right-0 bg-gray-100 rounded-full overflow-hidden">
        {intervals.map((interval, index) => {
          // Calculate position and width as percentages
          const startPercent = ((interval.startValue - min) / (max - min)) * 100
          const endPercent = ((interval.endValue - min) / (max - min)) * 100
          const widthPercent = endPercent - startPercent

          // Get the color for this state
          const color = STATE_COLORS[interval.state]
          const opacity = interval.isActive ? 1 : 0.4

          return (
            <div
              key={index}
              style={{
                position: "absolute",
                height: "100%",
                left: `${startPercent}%`,
                width: `${widthPercent}%`,
                backgroundColor: color,
                opacity: opacity,
                transition: "opacity 0.3s ease",
              }}
              title={interval.label}
            />
          )
        })}
      </div>

      {/* The actual slider component */}
      <SliderPrimitive.Root
        className="relative flex w-full touch-none select-none items-center"
        value={[value]}
        min={min}
        max={max}
        step={1}
        onValueChange={(vals) => onChange(vals[0])}
      >
        <SliderPrimitive.Track className="relative h-2 w-full grow rounded-full bg-transparent">
          <SliderPrimitive.Range className="absolute h-full bg-transparent" />
        </SliderPrimitive.Track>
        <SliderPrimitive.Thumb className="block h-5 w-5 rounded-full border-2 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50" />
      </SliderPrimitive.Root>

      {/* Time labels */}
      <div className="absolute left-0 right-0 mt-2 flex justify-between text-xs text-gray-500">
        <span>{formatMinutesToTime(min)}</span>
        <span>{formatMinutesToTime(max)}</span>
      </div>

      {/* Original marks (if any) */}
      {marks.length > 0 &&
        marks.map((mark, index) => {
          const markPosition = ((mark.value - min) / (max - min)) * 100
          return (
            <div
              key={`mark-${index}`}
              className="absolute w-1 h-4 bg-gray-400"
              style={{
                left: `${markPosition}%`,
                top: "10px",
                transform: "translateX(-50%)",
              }}
              title={mark.label}
            />
          )
        })}
    </div>
  )
}

export default function TimeSeriesSlider({ startDate, endDate, states = [] }) {
  const [currentDate, setCurrentDate] = useState(startDate)
  const [isPlaying, setIsPlaying] = useState(false)
  const [activeState, setActiveState] = useState(null)
  const componentRef = useRef(null)

  // Parse intervals from the provided data
  const intervals = useMemo(() => {
    return stateData.intervals.map((interval) => ({
      start: parse(interval.inicio, "dd/MM/yyyy HH:mm:ss", new Date()),
      end: parse(interval.fin, "dd/MM/yyyy HH:mm:ss", new Date()),
      state: interval.estado,
    }))
  }, [])

  const handleDateChange = (newDay) => {
    const newDate = addDays(startDate, newDay)

    let adjustedDate
    if (isSameDay(newDate, startDate)) {
      adjustedDate = setMinutes(setHours(newDate, startDate.getHours()), startDate.getMinutes())
    } else if (isSameDay(newDate, endDate)) {
      adjustedDate = setMinutes(setHours(newDate, 0), 0)
    } else {
      adjustedDate = setMinutes(setHours(newDate, 0), 0)
    }

    setCurrentDate(adjustedDate)
  }

  const handleTimeChange = useCallback(
    (newMinutes) => {
      setCurrentDate((prevDate) => {
        const newDate = setMinutes(setHours(prevDate, Math.floor(newMinutes / 60)), newMinutes % 60)
        if (newDate > endDate) {
          return endDate
        }
        return newDate
      })
    },
    [endDate],
  )

  const formatTime = useCallback((date) => format(date, "HH:mm"), [])

  // Find the active interval based on current time
  useEffect(() => {
    const activeInterval = intervals.find((interval) =>
      isWithinInterval(currentDate, { start: interval.start, end: interval.end }),
    )

    setActiveState(activeInterval ? activeInterval.state : null)
  }, [currentDate, intervals])

  // Generate interval markers for the current day
  const intervalMarkers = useMemo(() => {
    // Filter intervals for the current day
    return intervals
      .filter((interval) => isSameDay(interval.start, currentDate) || isSameDay(interval.end, currentDate))
      .map((interval) => {
        // Adjust start and end times to be within the current day
        let startTime = interval.start
        let endTime = interval.end

        if (!isSameDay(startTime, currentDate)) {
          // If start is not on current day, set to beginning of current day
          startTime = setMinutes(setHours(new Date(currentDate), 0), 0)
        }

        if (!isSameDay(endTime, currentDate)) {
          // If end is not on current day, set to end of current day
          endTime = setMinutes(setHours(new Date(currentDate), 23), 59)
        }

        return {
          startValue: startTime.getHours() * 60 + startTime.getMinutes(),
          endValue: endTime.getHours() * 60 + endTime.getMinutes(),
          state: interval.state,
          label: `${interval.state} (${formatTime(startTime)} - ${formatTime(endTime)})`,
          color: STATE_COLORS[interval.state],
          isActive: interval.state === activeState,
        }
      })
  }, [currentDate, intervals, formatTime, activeState])

  // Keep the original state markers for backward compatibility
  const stateMarkers = useMemo(() => {
    return states
      .filter((state) => isSameDay(state.date, currentDate))
      .map((state) => ({
        value: state.date.getHours() * 60 + state.date.getMinutes(),
        label: `${state.label} at ${formatTime(state.date)}`,
      }))
  }, [currentDate, states, formatTime])

  const handleTimeSliderLimits = useCallback(() => {
    let minTime = 0
    let maxTime = 23 * 60 + 59

    if (isSameDay(currentDate, startDate)) {
      minTime = startDate.getHours() * 60 + startDate.getMinutes()
    }
    if (isSameDay(currentDate, endDate)) {
      maxTime = endDate.getHours() * 60 + endDate.getMinutes()
    }

    return { minTime, maxTime }
  }, [currentDate, startDate, endDate])

  const currentDay = differenceInCalendarDays(currentDate, startDate)

  const togglePlay = () => {
    setIsPlaying(!isPlaying)
  }

  // Add click outside handler to stop playback
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (componentRef.current && !componentRef.current.contains(event.target)) {
        setIsPlaying(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  useEffect(() => {
    let intervalId
    if (isPlaying) {
      intervalId = setInterval(() => {
        setCurrentDate((prevDate) => {
          const newDate = addMinutes(prevDate, 15)
          if (newDate > endDate) {
            setIsPlaying(false)
            return endDate
          }
          return newDate
        })
      }, 500)
    }
    return () => clearInterval(intervalId)
  }, [isPlaying, endDate])

  return (
    <div className="w-full max-w-4xl bg-white shadow-sm rounded-lg p-6" ref={componentRef}>
      <div className="flex items-start space-x-6">
        <div className="w-1/3">
          <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
          <DateSelector startDate={startDate} endDate={endDate} currentDay={currentDay} onChange={handleDateChange} />
        </div>
        <div className="w-2/3">
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">Time</label>
            <div className="flex items-center">
              {activeState && (
                <div
                  className="mr-3 px-2 py-1 rounded text-xs text-white"
                  style={{ backgroundColor: STATE_COLORS[activeState] }}
                >
                  {activeState}
                </div>
              )}
              <Button size="sm" variant="outline" onClick={togglePlay}>
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          <TimeSlider
            value={currentDate.getHours() * 60 + currentDate.getMinutes()}
            onChange={handleTimeChange}
            marks={stateMarkers}
            intervals={intervalMarkers}
            min={handleTimeSliderLimits().minTime}
            max={handleTimeSliderLimits().maxTime}
            activeState={activeState}
          />
        </div>
      </div>
    </div>
  )
}

