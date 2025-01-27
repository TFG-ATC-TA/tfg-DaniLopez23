import { useState, useEffect, useMemo } from "react"
import { format, addDays, setHours, setMinutes, differenceInDays, isSameDay } from "date-fns"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import DateSlider from "@/components/ui/DateSlider"
import TimeSlider from "@/components/ui/TimeSlider"


export default function TimeSeriesSlider({ startDate, endDate, states }) {
  const [currentDate, setCurrentDate] = useState(startDate)
  const [selectedState, setSelectedState] = useState(null)

  const currentDay = differenceInDays(currentDate, startDate)
  const currentMinutes = currentDate.getHours() * 60 + currentDate.getMinutes()

  const handleDateChange = (newDay) => {
    const newDate = addDays(startDate, newDay)
    setCurrentDate(setMinutes(setHours(newDate, currentDate.getHours()), currentDate.getMinutes()))
  }

  const handleTimeChange = (newMinutes) => {
    const newDate = setMinutes(setHours(currentDate, 0), newMinutes)
    setCurrentDate(newDate)
  }

  const handleStateSelect = (stateLabel) => {
    setSelectedState(stateLabel === selectedState ? null : stateLabel)
  }


  const formatDate = (date) => format(date, "d MMMM yyyy")
  const formatTime = (date) => format(date, "HH:mm")

  const stateMarkers = useMemo(() => {
    if (!selectedState) return []
    return states
      .filter((state) => state.label === selectedState && isSameDay(state.date, currentDate))
      .map((state) => ({
        value: state.date.getHours() * 60 + state.date.getMinutes(),
        label: `${state.label} at ${formatTime(state.date)}`,
      }))
  }, [currentDate, states, selectedState, formatTime]) // Added formatTime to dependencies


  return (
    <div className="w-full max-w-2xl">
      <div className="mb-6 space-y-4">
        <div>
          <h3 className="text-lg font-semibold mb-2">Select Date</h3>
          <DateSlider startDate={startDate} endDate={endDate} currentDay={currentDay} onChange={handleDateChange} />
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">Select Time</h3>
          <TimeSlider value={currentMinutes} onChange={handleTimeChange} marks={stateMarkers} />
        </div>
      </div>
    </div>
  )
}

