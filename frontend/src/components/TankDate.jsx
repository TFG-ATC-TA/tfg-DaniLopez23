"use client"

import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { useState, useRef, useEffect } from "react"

const TankDate = ({ mode, filters }) => {
  const [lastUpdate, setLastUpdate] = useState(new Date())
  const [isExpanded, setIsExpanded] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setIsExpanded(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const getDisplayDate = () => {
    if (mode === "historical" && filters.dateRange) {
      const from = format(filters.dateRange.from, "d MMM yyyy", { locale: es })
      const to = format(filters.dateRange.to, "d MMM yyyy", { locale: es })
      return from === to ? from : `${from} - ${to}`
    }
    return format(lastUpdate, "d MMM yyyy, HH:mm", { locale: es })
  }

  return (
    <div
      ref={ref}
      className="relative p-3 rounded-lg bg-white shadow-sm h-full flex flex-col justify-between cursor-pointer"
      onClick={() => setIsExpanded(!isExpanded)}
    >
      {/* Header - Simplificado */}
      <div className="flex items-center border-b pb-1.5">
        <div className="flex items-center gap-1.5">
          <div className="flex-shrink-0 flex items-center justify-center bg-primary/10 p-1 rounded-full">
            <CalendarIcon className="text-primary w-3.5 h-3.5" />
          </div>
          <p className="text-xs font-medium text-gray-500 uppercase">
            {mode === "historical" ? "Rango histórico" : "Tiempo real"}
          </p>
        </div>
      </div>

      {/* Date Display - Más compacto */}
      <div className="flex items-center mt-1.5 overflow-hidden">
        <p className="text-sm font-semibold text-gray-800 truncate w-full">{getDisplayDate()}</p>
      </div>

      {isExpanded && (
        <div className="absolute top-full left-0 mt-2 bg-white border rounded-lg shadow-md p-3 w-[280px] z-20">
          <p className="text-xs font-medium text-gray-600">
            {mode === "historical" ? "Periodo seleccionado:" : "Última actualización:"}
          </p>
          <p className="text-sm font-bold text-gray-900 mt-1 break-words">{getDisplayDate()}</p>
        </div>
      )}
    </div>
  )
}

export default TankDate
