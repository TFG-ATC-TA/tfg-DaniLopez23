import { useState, Suspense, useEffect} from 'react';
import { Calendar, Filter} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Slider } from "@/components/ui/slider";
import { format } from "date-fns";
import { Canvas } from "@react-three/fiber";

import { Button } from "@/components/ui/button";
import CameraSettings from "./Camera/CameraSettings";
import {Model}  from "./tank-models/HorizontalTank2Blades";
import useDataStore from '@/Stores/useDataStore';
import { getHistoricalData } from '@/services/farm';
import useTankStore from '@/Stores/useTankStore';
import { getBoardIdsFromTank } from '@/services/tank';

const HistoricalTankModel = () => {
  const [date, setDate] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedSensor, setSelectedSensor] = useState('all');
  const [showAnomalous, setShowAnomalous] = useState(false);
  const [timeSlider, setTimeSlider] = useState(0);

  const selectedData = useDataStore((state) => state.selectedData);
  const selectedTank = useTankStore((state) => state.selectedTank);

  const historicalData = {
    encoderData: [],
    milkQuantityData: [],
    switchStatus: [],
    weightData: [],
    tankTemperaturesData: [],
    airQualityData: [],
    selectedData: null, // Si necesitas un valor inicial específico, puedes ajustarlo aquí
  };

  const boardIds = getBoardIdsFromTank(selectedTank);


  const applyFilters = async () => {
    const filters = {
      date: date ? new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())) : null,
      boardIds: boardIds,
      hour: timeSlider,
    };
    console.log('filters:', filters);
    try {
      const data = await getHistoricalData(filters);
      console.log('Filtered data:', data);
  
      historicalData.encoderData = data.encoderData;
      historicalData.milkQuantityData = data.milkQuantityData;
      historicalData.switchStatus = data.switchStatus;
      historicalData.weightData = data.weightData;
      historicalData.tankTemperaturesData = data.tankTemperaturesData;
      historicalData.airQualityData = data.airQualityData;
    } catch (error) {
      console.error('Error applying filters:', error);
    }
  };
  
  

  useEffect(() => {
    // Opcional: Si deseas cargar datos automáticamente cuando cambian los filtros
    applyFilters();
  }, [date, selectedStatus, selectedSensor, showAnomalous, timeSlider]);
  
  const renderTankModel = () => {
    return (
      <div className="h-full relative">
      <Canvas>
        <ambientLight intensity={0.6} />
        <directionalLight position={[-10, -10, -10]} intensity={0.5} />
        <Suspense fallback={null}>
          {selectedTank ? (
            <group>
              <Model
                key={selectedTank._id}
                encoderData={historicalData.encoderData}
                milkQuantityData={historicalData.milkQuantityData}
                switchStatus={historicalData.switchStatus}
                weightData={historicalData.weightData}
                tankTemperaturesData={historicalData.tankTemperaturesData}
                airQualityData={historicalData.airQualityData}
                selectedData={selectedData}
              />
            </group>
          ) : (
            <mesh>
              <boxGeometry args={[1, 1, 1]} />
              <meshStandardMaterial color="red" />
            </mesh>
          )}
          <CameraSettings view={selectedData} />
        </Suspense>
      </Canvas>
    </div>
    );
  };

  const clearFilters = () => {
    setDate(null);
    setSelectedStatus('all');
    setSelectedSensor('all');
    setShowAnomalous(false);
    setTimeSlider(0);
  };

  const formatTime = (value) => {
    const hours = value;
    return `${hours.toString().padStart(2, '0')}:00`;
  };

  return (
    <div className="flex h-full gap-2">
      <div className="flex-grow flex flex-col">
        <div className="flex-grow">
          {date ? renderTankModel() : <div className="h-full flex items-center justify-center">Select a date to view historical data</div>}
        </div>
        <div className="m-6">
          {date && (
            <>
              <Label htmlFor="time-slider" className="block text-sm font-medium mb-1">
                Time: {formatTime(timeSlider)}
              </Label>
              <Slider
                id="time-slider"
                min={0}
                max={23}
                step={1}
                value={[timeSlider]}
                onValueChange={(value) => setTimeSlider(value[0])}
              />
            </>
          )}
        </div>
      </div>
      <Card className="w-1/5 shadow-md rounded-lg h-full">
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
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <div>
            <Label htmlFor="status-select" className="block text-sm font-medium mb-1">Status</Label>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
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
            <Select value={selectedSensor} onValueChange={setSelectedSensor}>
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
              onCheckedChange={setShowAnomalous}
            />
            <Label htmlFor="anomalous-data">Show Anomalous Data</Label>
          </div>
          <Button  size="sm" onClick={clearFilters}>
              Remove filters
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default HistoricalTankModel;