"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import { getHistoricalData } from "@/services/farm"
import { format } from "date-fns"

const useHistoricalData = ({ filters, boardIds, selectedFarm, selectedTime }) => {
  const [historicalData, setHistoricalData] = useState(null)
  const [selectedHistoricalData, setSelectedHistoricalData] = useState(null)
  const [error, setError] = useState(null)
  const lastFetchedDate = useRef(null)

  // Helper function to convert time string (HH:MM) to minutes
  const timeStringToMinutes = (timeString) => {
    if (!timeString) return 0
    const [hours, minutes] = timeString.split(":").map(Number)
    return hours * 60 + minutes
  }

  const updateSelectedHistoricalData = useCallback((data, timeString) => {
    if (!data || data === "loading" || !timeString) return

    console.log(`Updating selected historical data for time: ${timeString}`)

    // Check if the exact time exists in the data
    if (data[timeString]) {
      setSelectedHistoricalData(data[timeString])
      return
    }

    // If exact time doesn't exist, find the closest available time
    const times = Object.keys(data)
    if (times.length > 0) {
      // Convert all times to minutes for comparison
      const targetMinutes = timeStringToMinutes(timeString)

      // Find the closest time
      let closestTime = times[0]
      let minDifference = Math.abs(timeStringToMinutes(closestTime) - targetMinutes)

      times.forEach((time) => {
        const difference = Math.abs(timeStringToMinutes(time) - targetMinutes)
        if (difference < minDifference) {
          closestTime = time
          minDifference = difference
        }
      })

      setSelectedHistoricalData(data[closestTime])
      console.log(`Using closest available time: ${closestTime} for requested time: ${timeString}`)
    } else {
      console.warn(`No data found for time ${timeString}`)
      setSelectedHistoricalData(null)
    }
  }, [])

  const fetchHistoricalData = useCallback(async () => {
    if (!filters || !boardIds || !selectedFarm) {
      console.warn("Missing required parameters for fetching historical data")
      return
    }

    try {
      const dateToUse = filters.selectedDate || (filters.dateRange ? filters.dateRange.from : null)

      if (!dateToUse) {
        console.warn("No date available for fetching historical data")
        return
      }

      const formattedDate = format(new Date(dateToUse), "yyyy-MM-dd")

      // Check if we've already fetched data for this date
      if (lastFetchedDate.current === formattedDate && historicalData && historicalData !== "loading") {
        console.log(`Using cached data for ${formattedDate}`)

        // If there's a selected time, update the selected data
        if (selectedTime) {
          updateSelectedHistoricalData(historicalData, selectedTime)
        }

        return
      }

      setHistoricalData("loading")
      setError(null)

      const data = await getHistoricalData({
        date: formattedDate,
        boardIds,
        farm: selectedFarm.broker,
      })

      if (data === null) {
        setHistoricalData(null)
        return
      }

      setHistoricalData(data)
      lastFetchedDate.current = formattedDate

      // If there's a selected time, update the selected data
      if (selectedTime) {
        updateSelectedHistoricalData(data, selectedTime)
      }
    } catch (err) {
      console.error("Error fetching historical data:", err)
      setHistoricalData(null)
      setError(err)
    }
  }, [filters, boardIds, selectedFarm, selectedTime, updateSelectedHistoricalData, historicalData])

  const handleTimeSelected = useCallback(
    (timeString) => {
      if (!timeString) return

      console.log(`Time selected: ${timeString}`)

      if (historicalData && historicalData !== "loading") {
        updateSelectedHistoricalData(historicalData, timeString)
      } else {
        // Reset selected data if we don't have historical data yet
        setSelectedHistoricalData(null)
      }
    },
    [historicalData, updateSelectedHistoricalData],
  )

  // Effect to update selected data when historical data changes
  useEffect(() => {
    if (historicalData && historicalData !== "loading" && selectedTime) {
      updateSelectedHistoricalData(historicalData, selectedTime)
    }
  }, [historicalData, selectedTime, updateSelectedHistoricalData])

  return {
    historicalData,
    selectedHistoricalData,
    error,
    fetchHistoricalData,
    handleTimeSelected,
    setSelectedHistoricalData,
  }
}

export default useHistoricalData
