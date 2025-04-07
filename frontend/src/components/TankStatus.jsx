import { Activity, HelpCircle, Info } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import useTankStore from "@/stores/useTankStore"

const statusConfig = {
  operational: {
    color: "bg-green-500",
    text: "Operativo",
    textColor: "text-green-600",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
  },
  warning: {
    color: "bg-amber-500",
    text: "Advertencia",
    textColor: "text-amber-600",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
  },
  error: {
    color: "bg-red-500",
    text: "Error",
    textColor: "text-red-600",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
  },
}

const TankStatus = () => {
  const { selectedTank } = useTankStore()

  if (!selectedTank) return null

  const status = selectedTank.status || "operational"
  const { color, text, textColor, bgColor, borderColor } = statusConfig[status]

  return (
    <div className="relative p-4 rounded-lg bg-white shadow-sm h-full flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center border-b pb-2">
        <div className="flex items-center gap-2">
          <div className="flex-shrink-0 flex items-center justify-center bg-primary/10 p-1.5 rounded-full">
            <Activity className="h-4 w-4 text-primary" />
          </div>
          <p className="text-xs font-medium text-gray-500 uppercase">Estado del Tanque</p>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" className="h-5 w-5 p-0">
                  <HelpCircle className="h-3.5 w-3.5 text-gray-400" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Muestra el estado actual del tanque seleccionado</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {/* Tank Name & Status */}
      <div className="flex items-center justify-between mt-2">
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${color}`} />
          <p className="text-sm font-semibold text-gray-800 truncate">{selectedTank.name}</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className={cn("py-1 px-2 rounded-md border", textColor, bgColor, borderColor)}>
            {text}
          </Badge>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" className="h-5 w-5 p-0">
                  <Info className="h-4 w-4 text-gray-400" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  {status === "operational"
                    ? "El tanque está funcionando correctamente"
                    : status === "warning"
                      ? "El tanque requiere atención"
                      : "El tanque presenta problemas"}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </div>
  )
}

export default TankStatus

