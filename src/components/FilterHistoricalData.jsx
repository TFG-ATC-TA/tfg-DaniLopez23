import React, { useState } from 'react';
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
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      date: null,
      selectedStatus: 'all',
      selectedSensor: 'all',
      showAnomalous: false,
      timeSlider: 0
    });
  };

  return (
    <Card className="w-full h-full shadow-none border-none">
      <CardHeader className="pb-2 px-4 pt-3">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Historical Data Filters
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 overflow-y-auto">
        <div className="space-y-4">
          <div>
            <Label htmlFor="date-picker" className="block text-sm font-medium mb-1">Date</Label>
            <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                  id="date-picker"
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {filters.date ? format(filters.date, "PPP") : "Select a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" onOpenAutoFocus={(e) => e.preventDefault()}>
                <CalendarComponent
                  mode="single"
                  selected={filters.date}
                  onSelect={(newDate) => {
                    handleFilterChange('date', newDate);
                    setIsCalendarOpen(false);
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <div>
            <Label htmlFor="status-select" className="block text-sm font-medium mb-1">Status</Label>
            <Select 
              value={filters.selectedStatus} 
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
              value={filters.selectedSensor} 
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
              checked={filters.showAnomalous}
              onCheckedChange={(checked) => handleFilterChange('showAnomalous', checked)}
            />
            <Label htmlFor="anomalous-data">Show Anomalous Data</Label>
          </div>
          <div className="flex justify-end pt-2">
            <Button variant="outline" size="sm" onClick={clearFilters}>
              Clear Filters
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FilterComponent;