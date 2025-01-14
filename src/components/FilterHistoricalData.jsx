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

const FilterComponent = ({ onFilterChange }) => {
  const [date, setDate] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedSensor, setSelectedSensor] = useState('all');
  const [showAnomalous, setShowAnomalous] = useState(false);

  const handleFilterChange = () => {
    onFilterChange({
      date,
      selectedStatus,
      selectedSensor,
      showAnomalous
    });
  };

  const clearFilters = () => {
    setDate(null);
    setSelectedStatus('all');
    setSelectedSensor('all');
    setShowAnomalous(false);
    handleFilterChange();
  };

  return (
    <Card className="w-full shadow-md rounded-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
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
                {date ? format(date, "PPP") : "Select a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <CalendarComponent
                mode="single"
                selected={date}
                onSelect={(newDate) => {
                  setDate(newDate);
                  handleFilterChange();
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        <div>
          <Label htmlFor="status-select" className="block text-sm font-medium mb-1">Status</Label>
          <Select 
            value={selectedStatus} 
            onValueChange={(value) => {
              setSelectedStatus(value);
              handleFilterChange();
            }}
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
            value={selectedSensor} 
            onValueChange={(value) => {
              setSelectedSensor(value);
              handleFilterChange();
            }}
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
            checked={showAnomalous}
            onCheckedChange={(checked) => {
              setShowAnomalous(checked);
              handleFilterChange();
            }}
          />
          <Label htmlFor="anomalous-data">Show Anomalous Data</Label>
        </div>
        <Button size="sm" onClick={clearFilters}>
          Remove filters
        </Button>
        </CardContent>
      </Card>
  );
};

export default FilterComponent;