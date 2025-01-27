import React from "react";
import { Filter } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import CustomDateRangePicker from '@/components/CustomDateRangePicker';

const FilterComponent = ({ filters, setFilters }) => {
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      dateRange: null,
      selectedStatus: "all",
      selectedSensor: "all",
      showAnomalous: false,
    });
  };
  console.log(filters)
  
  return (
    <Card className="w-full h-full shadow-0 border-5 me-3">
      <CardHeader className="pb-2 px-4 pt-3">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Filtros de Datos Históricos
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 overflow-y-auto">
        <div className="space-y-4">
          <div>
            <Label className="block text-sm font-medium mb-1">Rango de Fecha y Hora</Label>
            <CustomDateRangePicker
              value={filters.dateRange}
              onChange={(range) => handleFilterChange("dateRange", range)}
            />
          </div>

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

          <div className="flex items-center space-x-2">
            <Switch
              id="anomalous-data"
              checked={filters.showAnomalous}
              onCheckedChange={(checked) => handleFilterChange("showAnomalous", checked)}
            />
            <Label htmlFor="anomalous-data">Mostrar Datos Anómalos</Label>
          </div>

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