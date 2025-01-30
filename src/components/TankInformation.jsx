import { useState } from 'react';
import { Info, Database, Gauge, Waves, Thermometer } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import DataModeToggle from './DataModeToogle';
import useFarmStore from '@/Stores/useFarmStore';

const TankInformation = ({ selectedTank, setFilters, filters }) => {
  const { mode, setMode } = useFarmStore();
  const isRealTime = mode === 'realtime';

  const handleDataModeToggle = (isRealTimeMode) => {
    setMode(isRealTimeMode ? 'realtime' : 'historical');
    setFilters({
      dateRange: null,
      selectedStatus: "all",
      selectedSensor: "all",
      showAnomalous: false,
    });
  };

  if (!selectedTank) return null;

  return (
    <Card className="w-full border-0 rounded-xl shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 p-2 rounded-lg">
            <Database className="h-6 w-6 text-primary" />
          </div>
          <div>
            <CardTitle className="text-xl font-semibold text-foreground">
              {selectedTank.name}
            </CardTitle>
            <p className="text-sm text-muted-foreground">Milk Storage Tank</p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 text-muted-foreground hover:text-primary"
              >
                <Info className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="rounded-xl max-w-md">
              <DialogHeader>
                <DialogTitle className="text-2xl flex items-center gap-2">
                  <Database className="h-6 w-6 text-primary" />
                  Technical Specifications
                </DialogTitle>
              </DialogHeader>
              <div className="grid gap-3 py-4">
                <InfoItem 
                  icon={<Gauge className="w-5 h-5 text-primary" />}
                  label="Capacity"
                  value={`${selectedTank.capacity || 2500} L`}
                />
                <InfoItem
                  icon={<Waves className="w-5 h-5 text-primary" />}
                  label="Current Volume"
                  value={`${selectedTank.currentVolume || 0} L`}
                />
                <InfoItem
                  icon={<Thermometer className="w-5 h-5 text-primary" />}
                  label="Temperature"
                  value={`${selectedTank.temperature || 4}°C`}
                />
              </div>
            </DialogContent>
          </Dialog>
        </div>
        <DataModeToggle 
          isRealTime={isRealTime} 
          onToggle={handleDataModeToggle}
          className="bg-background shadow-sm border"
        />
      </CardHeader>
    </Card>
  );
};

const InfoItem = ({ icon, label, value }) => (
  <div className="flex items-center gap-4 p-3 bg-muted/20 rounded-lg">
    <div className="bg-primary/10 p-2 rounded-lg">{icon}</div>
    <div className="flex-1">
      <div className="text-sm text-muted-foreground">{label}</div>
      <div className="font-medium text-foreground">{value}</div>
    </div>
  </div>
);

export default TankInformation;