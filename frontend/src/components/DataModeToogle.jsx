"use client"

import { Wifi, History } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"

const DataModeToggle = ({ onToggle, isRealTime }) => {
  return (
    <div className="relative p-4 rounded-lg bg-white shadow-sm h-full flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center border-b pb-2">
        <div className="flex items-center gap-2">
          <div className="flex-shrink-0 flex items-center justify-center bg-primary/10 p-1.5 rounded-full">
            {isRealTime ? <Wifi className="h-4 w-4 text-primary" /> : <History className="h-4 w-4 text-primary" />}
          </div>
          <p className="text-xs font-medium text-gray-500 uppercase">Modo de Datos</p>
        </div>
      </div>

      {/* Toggle Controls - Centrado y con colores originales */}
      <div className="flex items-center justify-center bg-gray-100 rounded-full p-1 shadow-inner mt-2">
        <button
          className={cn(
            "flex-1 px-2 py-1.5 rounded-full text-xs font-medium transition-colors flex items-center justify-center whitespace-nowrap",
            isRealTime ? "bg-white text-green-600 shadow-sm" : "text-gray-600 hover:bg-gray-200",
          )}
          onClick={() => onToggle(true)}
        >
          <Wifi className="mr-1 h-3.5 w-3.5" /> Tiempo real
        </button>
        <Switch checked={!isRealTime} onCheckedChange={(checked) => onToggle(!checked)} className="mx-2" />
        <button
          className={cn(
            "flex-1 px-2 py-1.5 rounded-full text-xs font-medium transition-colors flex items-center justify-center whitespace-nowrap",
            !isRealTime ? "bg-white text-purple-600 shadow-sm" : "text-gray-600 hover:bg-gray-200",
          )}
          onClick={() => onToggle(false)}
        >
          <History className="mr-1 h-3.5 w-3.5" /> Histórico
        </button>
      </div>
    </div>
  )
}

export default DataModeToggle

