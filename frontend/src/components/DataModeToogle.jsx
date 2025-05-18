import { Wifi, History } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"

const DataModeToggle = ({ onToggle, isRealTime }) => {
  return (
    <div className="relative p-3 rounded-lg bg-white shadow-sm h-full flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between border-b pb-1.5">
        <div className="flex items-center gap-1.5">
          <div className="flex-shrink-0 flex items-center justify-center bg-primary/10 p-1 rounded-full">
            {isRealTime ? (
              <Wifi className="h-3.5 w-3.5 text-primary" />
            ) : (
              <History className="h-3.5 w-3.5 text-primary" />
            )}
          </div>
          <p className="text-xs font-medium text-gray-500 uppercase">Modo</p>
        </div>
      </div>

      {/* Toggle Controls - Improved for better spacing */}
      <div className="flex flex-col space-y-2 mt-2">
        <div className="flex items-center justify-between gap-1">
          <button
            className={cn(
              "flex items-center justify-center px-2 py-1 rounded-md text-xs font-medium transition-colors flex-1",
              isRealTime ? "bg-green-50 text-green-600 border border-green-200" : "text-gray-600 hover:bg-gray-100",
            )}
            onClick={() => onToggle(true)}
          >
            <Wifi className="mr-1 h-3 w-3 flex-shrink-0" />
            <span className="truncate">Tiempo real</span>
          </button>

          <Switch checked={!isRealTime} onCheckedChange={(checked) => onToggle(!checked)} className="mx-1 scale-75" />

          <button
            className={cn(
              "flex items-center justify-center px-2 py-1 rounded-md text-xs font-medium transition-colors flex-1",
              !isRealTime ? "bg-purple-50 text-purple-600 border border-purple-200" : "text-gray-600 hover:bg-gray-100",
            )}
            onClick={() => onToggle(false)}
          >
            <History className="mr-1 h-3 w-3 flex-shrink-0" />
            <span className="truncate">Histórico</span>
          </button>
        </div>

        <div className="h-1.5 w-full bg-gray-100 rounded-full relative">
          <div
            className={cn(
              "h-1.5 absolute top-0 rounded-full transition-all duration-300",
              isRealTime ? "bg-green-500 left-0 w-1/2" : "bg-purple-500 left-1/2 w-1/2",
            )}
          />
        </div>
      </div>
    </div>
  )
}

export default DataModeToggle
