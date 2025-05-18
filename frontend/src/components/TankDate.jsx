import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { useRef } from "react"
import useDataStore from "@/stores/useDataStore"
import useAppDataStore from "@/stores/useAppDataStore"

const TankDate = () => {
  const ref = useRef(null)

  const { mode, filters } = useAppDataStore((state) => state)
  const { lastSensorData } = useDataStore((state) => state)

  const isRealtime = mode === "realtime"
  const isHistorical = mode === "historical"

  const hasRealtimeData = !!lastSensorData?.readableDate

  const getDisplayDate = () => {
    if (isHistorical) {
      if (filters.dateRange?.from && filters.dateRange?.to) {
        const from = format(filters.dateRange.from, "d MMM yyyy", { locale: es })
        const to = format(filters.dateRange.to, "d MMM yyyy", { locale: es })
        return from === to ? from : `${from} - ${to}`
      } else {
        return "Selecciona un rango"
      }
    }

    if (isRealtime) {
      return hasRealtimeData ? lastSensorData.readableDate : "Aún no han llegado datos"
    }

    return null
  }

  const displayDate = getDisplayDate()

  return (
    <div
      ref={ref}
      className="relative p-3 rounded-lg bg-white shadow-sm h-full flex flex-col justify-between cursor-pointer"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b pb-1.5">
        <div className="flex items-center gap-1.5">
          <div className="flex-shrink-0 flex items-center justify-center bg-primary/10 p-1 rounded-full">
            <CalendarIcon className="text-primary w-3.5 h-3.5" />
          </div>
          <p className="text-xs font-medium text-gray-500 uppercase">
            {isHistorical ? "Rango histórico" : "Tiempo real"}
          </p>
        </div>
      </div>

      {/* Display */}
      <div className="flex items-center mt-2 min-h-[1.5rem]">
        <p
          className={`text-sm font-semibold line-clamp-2 w-full ${
            displayDate === "Selecciona un rango" || displayDate === "Aún no han llegado datos"
              ? "text-red-500"
              : "text-gray-800"
          }`}
        >
          {displayDate}
        </p>
      </div>
    </div>
  )
}

export default TankDate
