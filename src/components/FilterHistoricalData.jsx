import React, { useState, useEffect } from 'react';
import { Calendar, Filter } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

const FilterComponent = ({ filters, setFilters }) => {
  const [localFilters, setLocalFilters] = useState(filters);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleFilterChange = (key, value) => {
    setLocalFilters(prev => ({ ...prev, [key]: value }));
  };

  const applyFilters = () => {
    setFilters(localFilters);
  };

  const clearFilters = () => {
    const clearedFilters = {
      date: null,
      selectedStatus: 'all',
      selectedSensor: 'all',
      showAnomalous: false,
      timeSlider: 0
    };
    setLocalFilters(clearedFilters);
    setFilters(clearedFilters);
  };

  return (
    <Card className="w-full shadow-none border-none">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Historical Data Filters
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="date-picker" className="block text-sm font-medium mb-1">Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
                id="date-picker"
              >
                <Calendar className="mr-2 h-4 w-4" />
                {localFilters.date ? format(localFilters.date, "PPP") : "Select a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <CalendarComponent
                mode="single"
                selected={localFilters.date}
                onSelect={(newDate) => handleFilterChange('date', newDate)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        <div>
          <Label htmlFor="status-select" className="block text-sm font-medium mb-1">Status</Label>
          <Select 
            value={localFilters.selectedStatus} 
            onValueChange={(value) => handleFilterChange('selectedStatus', value)}
          >
            <SelectTrigger id="status-select">
              <SelectValue placeholder="Select a status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="working">Working</SelectItem>
              <SelectItem value="maintenance">Maintenance</SelectItem>
              <SelectItem value="error">Error</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="sensor-select" className="block text-sm font-medium mb-1">Sensor</Label>
          <Select 
            value={localFilters.selectedSensor} 
            onValueChange={(value) => handleFilterChange('selectedSensor', value)}
          >
            <SelectTrigger id="sensor-select">
              <SelectValue placeholder="Select a sensor" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sensors</SelectItem>
              <SelectItem value="temperature">Temperature</SelectItem>
              <SelectItem value="pressure">Pressure</SelectItem>
              <SelectItem value="volume">Volume</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id="anomalous-data"
            checked={localFilters.showAnomalous}
            onCheckedChange={(checked) => handleFilterChange('showAnomalous', checked)}
          />
          <Label htmlFor="anomalous-data">Show Anomalous Data</Label>
        </div>
        <div className="flex justify-between pt-4">
          <Button variant="outline" size="sm" onClick={clearFilters}>
            Clear Filters
          </Button>
          <Button size="sm" onClick={applyFilters}>
            Apply Filters
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default FilterComponent;