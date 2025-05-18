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

  const getDisplayDate = () => {
    if (mode === "historical" && filters.dateRange) {
      const from = format(filters.dateRange.from, "d MMM yyyy", { locale: es })
      const to = format(filters.dateRange.to, "d MMM yyyy", { locale: es })
      return from === to ? from : `${from} - ${to}`
    }

    // Si estamos en tiempo real, usa `readableDate` de `lastSensorData`
    if (mode === "realtime" && lastSensorData?.readableDate) {
      return lastSensorData.readableDate
    }

    // Si no hay datos, muestra un mensaje de que no hay datos disponibles
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
            {mode === "historical" ? "Rango histórico" : "Tiempo real"}
          </p>
        </div>
      </div>

      {/* Date Display - Improved for better text handling */}
      <div className="flex items-center mt-2">
        {displayDate ? (
          <p className="text-sm font-semibold text-gray-800 line-clamp-2 w-full">{displayDate}</p>
        ) : (
          <p className="text-sm font-semibold text-red-500 line-clamp-2 w-full">Aún no han llegado datos</p>
        )}
      </div>
    </div>
  )
}

export default TankDate
