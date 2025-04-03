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
import { Play, Pause, ChevronLeft, ChevronRight, Info, RefreshCw } from "lucide-react"
import * as SliderPrimitive from "@radix-ui/react-slider"
import { cn } from "@/lib/utils"

import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"

import useAppDataStore from "@/stores/useAppDataStore"

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

// State summary modal component
const StateSummaryModal = ({ isOpen, onClose, intervals, currentDate }) => {
  // Filter intervals for the current day
  const dayIntervals = intervals.filter(
    (interval) => isSameDay(interval.start, currentDate) || isSameDay(interval.end, currentDate),
  )

  // Calculate total duration for each state
  const stateDurations = useMemo(() => {
    const durations = {}

    dayIntervals.forEach((interval) => {
      let startTime = interval.start
      let endTime = interval.end

      if (!isSameDay(startTime, currentDate)) {
        startTime = new Date(currentDate)
        startTime.setHours(0, 0, 0, 0)
      }

      if (!isSameDay(endTime, currentDate)) {
        endTime = new Date(currentDate)
        endTime.setHours(23, 59, 59, 999)
      }

      const durationMinutes = (endTime - startTime) / (1000 * 60)

      if (!durations[interval.state]) {
        durations[interval.state] = 0
      }

      durations[interval.state] += durationMinutes
    })

    return durations
  }, [dayIntervals, currentDate])

  // Format minutes as hours and minutes
  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60)
    const mins = Math.round(minutes % 60)
    return `${hours}h ${mins}m`
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Tank State Summary</DialogTitle>
          <DialogDescription>{format(currentDate, "EEEE, MMMM d, yyyy")}</DialogDescription>
        </DialogHeader>

        <div className="mt-4 space-y-4">
          <div className="grid grid-cols-1 gap-3">
            {Object.entries(stateDurations).map(([state, duration]) => (
              <div key={state} className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded-full mr-3" style={{ backgroundColor: STATE_COLORS[state] }} />
                  <span className="font-medium">{state}</span>
                </div>
                <div className="text-sm text-gray-600">{formatDuration(duration)}</div>
              </div>
            ))}
          </div>

          <div className="border-t pt-4">
            <h4 className="text-sm font-medium mb-2">Timeline</h4>
            <div className="space-y-2">
              {dayIntervals.map((interval, index) => (
                <div key={index} className="flex items-center text-sm">
                  <span className="text-gray-500 w-20">{format(interval.start, "HH:mm")}</span>
                  <span className="mx-2">-</span>
                  <span className="text-gray-500 w-20">{format(interval.end, "HH:mm")}</span>
                  <div
                    className="ml-2 px-2 py-0.5 rounded-full text-xs text-white"
                    style={{ backgroundColor: STATE_COLORS[interval.state] }}
                  >
                    {interval.state}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Compact date selector component
const CompactDateSelector = ({ startDate, endDate, currentDay, onChange }) => {
  const totalDays = differenceInCalendarDays(endDate, startDate) + 1

  const handlePrevDay = () => {
    if (currentDay > 0) {
      onChange(currentDay - 1)
    }
  }

  const handleNextDay = () => {
    if (currentDay < totalDays - 1) {
      onChange(currentDay + 1)
    }
  }

  const currentDate = addDays(startDate, currentDay)
  const formattedDate = format(currentDate, "dd MMM yyyy")

  return (
    <div className="flex items-center space-x-1">
      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handlePrevDay} disabled={currentDay === 0}>
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <span className="text-sm font-medium">{formattedDate}</span>
      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7"
        onClick={handleNextDay}
        disabled={currentDay === totalDays - 1}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  )
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
    <div className={cn("relative pt-6 pb-6", className)} {...props}>
      {/* Current time display - positioned above the slider */}
      <div
        className="absolute font-medium bg-white px-1.5 py-0.5 rounded-md shadow-sm border text-xs"
        style={{
          left: `${((value - min) / (max - min)) * 100}%`,
          transform: "translateX(-50%)",
          top: "-2px",
          zIndex: 10,
        }}
      >
        {formatMinutesToTime(value)}
      </div>

      {/* Render interval segments */}
      <div
        ref={sliderRef}
        className="absolute h-3 top-6 left-0 right-0 bg-gray-100 rounded-full overflow-hidden shadow-inner"
      >
        {intervals.map((interval, index) => {
          // Calculate position and width as percentages
          const startPercent = ((interval.startValue - min) / (max - min)) * 100
          const endPercent = ((interval.endValue - min) / (max - min)) * 100
          const widthPercent = endPercent - startPercent

          // Get the color for this state
          const color = STATE_COLORS[interval.state]
          const opacity = interval.isActive ? 1 : 0.6

          return (
            <TooltipProvider key={index}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div
                    style={{
                      position: "absolute",
                      height: "100%",
                      left: `${startPercent}%`,
                      width: `${widthPercent}%`,
                      backgroundColor: color,
                      opacity: opacity,
                      transition: "opacity 0.3s ease",
                    }}
                  />
                </TooltipTrigger>
                <TooltipContent side="top" className="text-xs">
                  {interval.label}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )
        })}
      </div>

      {/* The actual slider component */}
      <SliderPrimitive.Root
        className="relative flex w-full touch-none select-none items-center"
        value={[value]}
        min={min}
        max={max}
        step={15} // Set step to 15 minutes
        onValueChange={(vals) => onChange(vals[0])}
      >
        <SliderPrimitive.Track className="relative h-3 w-full grow rounded-full bg-transparent">
          <SliderPrimitive.Range className="absolute h-full bg-transparent" />
        </SliderPrimitive.Track>
        <SliderPrimitive.Thumb className="block h-5 w-5 rounded-full border-2 border-primary bg-white shadow-md ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50" />
      </SliderPrimitive.Root>

      {/* Time labels */}
      <div className="absolute left-0 right-0 mt-1 flex justify-between text-xs text-gray-500">
        <span>{formatMinutesToTime(min)}</span>
        <span>{formatMinutesToTime(max)}</span>
      </div>
    </div>
  )
}

// Legend component to show state colors
const StateLegend = ({ states }) => {
  return (
    <div className="flex flex-wrap gap-2 items-center">
      {states.map((state) => (
        <div key={state} className="flex items-center">
          <div className="w-3 h-3 rounded-full mr-1" style={{ backgroundColor: STATE_COLORS[state] }} />
          <span className="text-xs text-gray-600">{state}</span>
        </div>
      ))}
    </div>
  )
}

export default function TimeSeriesSlider({ startDate, endDate, states = [], onTimeSelected }) {
  const [currentDate, setCurrentDate] = useState(startDate)
  const [isPlaying, setIsPlaying] = useState(false)
  const [activeState, setActiveState] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const componentRef = useRef(null)

  const { filters, setFilters } = useAppDataStore((state) => state)

  // Parse intervals from the provided data
  const intervals = useMemo(() => {
    return stateData.intervals.map((interval) => ({
      start: parse(interval.inicio, "dd/MM/yyyy HH:mm:ss", new Date()),
      end: parse(interval.fin, "dd/MM/yyyy HH:mm:ss", new Date()),
      state: interval.estado,
    }))
  }, [])

  // Modificado: Ahora actualiza selectedDate en el store global cuando se cambia de día
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

    // Actualizar la fecha actual en el componente
    setCurrentDate(adjustedDate)

    // Actualizar selectedDate en el store global para desencadenar la petición al backend
    setFilters({ ...filters, selectedDate: adjustedDate })
  }

  const handleTimeChange = useCallback(
    (newMinutes) => {
      setCurrentDate((prevDate) => {
        const newDate = setMinutes(setHours(prevDate, Math.floor(newMinutes / 60)), newMinutes % 60)
        if (newDate > endDate) {
          return endDate
        }

        // Format the time as HH:MM
        const hours = Math.floor(newMinutes / 60)
          .toString()
          .padStart(2, "0")
        const minutes = (newMinutes % 60).toString().padStart(2, "0")
        const timeString = `${hours}:${minutes}`

        // Call the onTimeSelected callback with the formatted time string
        if (onTimeSelected) {
          onTimeSelected(timeString)
        }

        return newDate
      })
    },
    [endDate, onTimeSelected],
  )

  // Función para cargar datos explícitamente para el tiempo actual
  const loadDataForCurrentTime = () => {
    const currentMinutes = currentDate.getHours() * 60 + currentDate.getMinutes()
    const hours = Math.floor(currentMinutes / 60)
      .toString()
      .padStart(2, "0")
    const minutes = (currentMinutes % 60).toString().padStart(2, "0")
    const timeString = `${hours}:${minutes}`

    // Call the onTimeSelected callback with the formatted time string
    if (onTimeSelected) {
      onTimeSelected(timeString)
    }

    setFilters({ ...filters, selectedDate: currentDate })
  }

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

  const openModal = () => {
    setIsModalOpen(true)
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

  // Efecto para la reproducción automática
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

          // Format the time as HH:MM for the new date
          const newMinutes = newDate.getHours() * 60 + newDate.getMinutes()
          const hours = Math.floor(newMinutes / 60)
            .toString()
            .padStart(2, "0")
          const minutes = (newMinutes % 60).toString().padStart(2, "0")
          const timeString = `${hours}:${minutes}`

          // Call the onTimeSelected callback with the formatted time string
          if (onTimeSelected) {
            onTimeSelected(timeString)
          }

          return newDate
        })
      }, 500)
    }
    return () => clearInterval(intervalId)
  }, [isPlaying, endDate, onTimeSelected])

  // Sincronizar currentDate con selectedDate al montar el componente
  useEffect(() => {
    if (filters.selectedDate) {
      setCurrentDate(filters.selectedDate)
    }
  }, [filters.selectedDate])

  // Notify parent component of initial time selection on mount
  useEffect(() => {
    // Format the initial time as HH:MM
    const initialMinutes = currentDate.getHours() * 60 + currentDate.getMinutes()
    const hours = Math.floor(initialMinutes / 60)
      .toString()
      .padStart(2, "0")
    const minutes = (initialMinutes % 60).toString().padStart(2, "0")
    const timeString = `${hours}:${minutes}`

    // Call the onTimeSelected callback with the formatted time string
    if (onTimeSelected) {
      onTimeSelected(timeString)
    }
  }, [currentDate, onTimeSelected])

  return (
    <div className="w-full bg-transparent" ref={componentRef}>
      <div className="flex flex-col space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CompactDateSelector
              startDate={startDate}
              endDate={endDate}
              currentDay={currentDay}
              onChange={handleDateChange}
            />

            {activeState && (
              <div className="flex items-center">
                <div
                  className="px-2 py-0.5 rounded-full text-xs text-white font-medium ml-2"
                  style={{ backgroundColor: STATE_COLORS[activeState] }}
                >
                  {activeState}
                </div>
                <Button variant="ghost" size="icon" className="h-6 w-6 ml-1" onClick={openModal}>
                  <Info className="h-3.5 w-3.5" />
                </Button>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Button
              size="sm"
              variant="outline"
              onClick={loadDataForCurrentTime}
              className="h-7 px-2 text-xs flex items-center gap-1"
              title="Cargar datos para este momento"
            >
              <RefreshCw className="h-3 w-3" />
              Cargar datos
            </Button>
            <Button size="sm" variant="outline" onClick={togglePlay} className="h-7 w-7 p-0 rounded-full">
              {isPlaying ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
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
          className="mx-1"
        />

        <div className="flex justify-center mt-1">
          <StateLegend states={stateData.states} />
        </div>
      </div>

      <StateSummaryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        intervals={intervals}
        currentDate={currentDate}
      />
    </div>
  )
}

