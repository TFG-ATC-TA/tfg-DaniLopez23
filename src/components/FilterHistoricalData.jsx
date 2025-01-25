import React, { useState } from "react";
import { Filter } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { DateRangePicker } from "react-date-range";
import { format } from "date-fns";
import "react-date-range/dist/styles.css"; // Estilos generales
import "react-date-range/dist/theme/default.css"; // Estilos del tema

const FilterComponent = ({ filters, setFilters }) => {
  const [dateRange, setDateRange] = useState([
    {
      startDate: filters.dateRange?.from ? new Date(filters.dateRange.from) : new Date(),
      endDate: filters.dateRange?.to ? new Date(filters.dateRange.to) : new Date(),
      key: "selection",
    },
  ]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      dateRange: { from: undefined, to: undefined },
      selectedStatus: "all",
      selectedSensor: "all",
      showAnomalous: false,
    });
    setDateRange([{ startDate: new Date(), endDate: new Date(), key: "selection" }]);
  };

  const handleApply = () => {
    const { startDate, endDate } = dateRange[0];
    handleFilterChange("dateRange", { from: startDate, to: endDate });
  };

  const formatDateRange = ({ startDate, endDate }) =>
    `${format(startDate, "d MMM yyyy")} - ${format(endDate, "d MMM yyyy")}`;

  return (
    <Card className="w-full h-full shadow-none border-none">
      <CardHeader className="pb-2 px-4 pt-3">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Filtros de Datos Históricos
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 overflow-y-auto">
        <div className="space-y-4">
          {/* Selector de rango de fecha */}
          <div>
            <Label className="block text-sm font-medium mb-1">Rango de Fecha</Label>
            <DateRangePicker
              onChange={(ranges) => setDateRange([ranges.selection])}
              ranges={dateRange}
              showSelectionPreview={true}
              moveRangeOnFirstSelection={false}
              rangeColors={["#4F46E5"]}
            />
            <div className="text-sm text-muted-foreground mt-2">
              {formatDateRange(dateRange[0])}
            </div>
            <Button className="mt-4 w-full" onClick={handleApply}>
              Aplicar Rango de Fecha
            </Button>
          </div>

          {/* Filtro de Estado */}
          <div>
            <Label htmlFor="status-select" className="block text-sm font-medium mb-1">
              Estado
            </Label>
            <Select
              value={filters.selectedStatus}
              onValueChange={(value) => handleFilterChange("selectedStatus", value)}
            >
              <SelectTrigger id="status-select">
                <SelectValue placeholder="Seleccionar un estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los Estados</SelectItem>
                <SelectItem value="working">Funcionando</SelectItem>
                <SelectItem value="maintenance">En Mantenimiento</SelectItem>
                <SelectItem value="error">Error</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Filtro de Sensor */}
          <div>
            <Label htmlFor="sensor-select" className="block text-sm font-medium mb-1">
              Sensor
            </Label>
            <Select
              value={filters.selectedSensor}
              onValueChange={(value) => handleFilterChange("selectedSensor", value)}
            >
              <SelectTrigger id="sensor-select">
                <SelectValue placeholder="Seleccionar un sensor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los Sensores</SelectItem>
                <SelectItem value="temperature">Temperatura</SelectItem>
                <SelectItem value="pressure">Presión</SelectItem>
                <SelectItem value="volume">Volumen</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Mostrar datos anómalos */}
          <div className="flex items-center space-x-2">
            <Switch
              id="anomalous-data"
              checked={filters.showAnomalous}
              onCheckedChange={(checked) => handleFilterChange("showAnomalous", checked)}
            />
            <Label htmlFor="anomalous-data">Mostrar Datos Anómalos</Label>
          </div>

          {/* Botón para limpiar filtros */}
          <div className="flex justify-end pt-2">
            <Button variant="outline" size="sm" onClick={clearFilters}>
              Limpiar Filtros
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FilterComponent;
