"use client"

import { useState } from "react"
import { CircleX, Trash2, Sliders } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import CustomDateRangePicker from "@/components/CustomDateRangePicker"
import useAppDataStore from "@/stores/useAppDataStore"

const HistoricalDataFilter = () => {
  const [isFiltersVisible, setIsFiltersVisible] = useState(true)
  const { filters, setFilters, mode } = useAppDataStore((state) => state)

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
  }

  const clearFilters = () => {
    setFilters({
      dateRange: null,
      selectedDate: null,
      selectedStatus: "all",
      selectedSensor: "all",
    })
  }

  // If not in historical mode, don't render anything
  if (mode !== "historical") {
    return null
  }

  // Si el panel está oculto, solo mostrar el botón flotante
  if (!isFiltersVisible) {
    return (
      <div className="absolute right-0 top-1/4 z-30">
        <Button
          variant="secondary"
          onClick={() => setIsFiltersVisible(true)}
          className="h-auto py-3 px-2 rounded-r-none shadow-md flex flex-col gap-2 bg-white border-r-0"
        >
          <Sliders className="h-5 w-5" />
          <span className="text-xs font-medium">Filtros</span>
        </Button>
      </div>
    )
  }

  // Si el panel está visible, mostrarlo como parte del layout normal
  return (
    <Card className="w-80 h-full shadow-sm border overflow-hidden">
      <CardHeader className="sticky z-10 border-b p-4">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Sliders className="h-5 w-5 text-primary" />
            Filtros Datos Históricos
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsFiltersVisible(false)}
            className="h-8 w-8 p-0 text-primary hover:bg-primary/10"
          >
            <CircleX className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-4 space-y-6 overflow-y-auto">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Rango de Fechas</Label>
            <CustomDateRangePicker
              value={filters.dateRange || { from: undefined, to: undefined }}
              onChange={(range) => handleFilterChange("dateRange", range)}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Estado del Tanque</Label>
            <Select
              value={filters.selectedStatus}
              onValueChange={(value) => handleFilterChange("selectedStatus", value)}
            >
              <SelectTrigger className="w-full rounded-lg">
                <SelectValue placeholder="Seleccionar estado" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="all" className="rounded-lg">
                  Todos
                </SelectItem>
                <SelectItem value="working" className="rounded-lg">
                  Operativo
                </SelectItem>
                <SelectItem value="maintenance" className="rounded-lg">
                  Mantenimiento
                </SelectItem>
                <SelectItem value="error" className="rounded-lg">
                  Error
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between p-2 rounded-lg bg-muted/20">
            <Label className="text-sm font-medium">Mostrar anomalías</Label>
            <Switch
              checked={filters.showAnomalous}
              onCheckedChange={(checked) => handleFilterChange("showAnomalous", checked)}
            />
          </div>
        </div>

        <div className="sticky bottom-0 bg-background/80 pt-4 border-t">
          <Button variant="outline" onClick={clearFilters} className="w-full gap-2 rounded-lg">
            <Trash2 className="h-4 w-4" />
            Limpiar Filtros
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default HistoricalDataFilter

