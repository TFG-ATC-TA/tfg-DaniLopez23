import { useState } from 'react';
import { ChevronRight, ChevronDown } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
// import { DatePickerWithRange } from "@/components/ui/date-picker-with-range";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const HistoricalTankModel = ({ farmData, selectedTank }) => {
  const [isFilterOpen, setIsFilterOpen] = useState(true);
  const [dateRange, setDateRange] = useState({ from: new Date(), to: new Date() });
  const [selectedSensor, setSelectedSensor] = useState('all');

  // This is a placeholder for the actual tank model rendering
  const renderTankModel = () => {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <p>Historical Tank Model Placeholder</p>
      </div>
    );
  };

  return (
    <div className="flex h-full">
      <div className="flex-grow">
        {renderTankModel()}
      </div>
      <Collapsible
        open={isFilterOpen}
        onOpenChange={setIsFilterOpen}
        className="w-80 bg-white shadow-md rounded-lg overflow-hidden"
      >
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="w-full flex justify-between items-center p-4">
            Filter
            {isFilterOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <Card>
            <CardHeader>
              <CardTitle>Historical Data Filters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
                {/* <DatePickerWithRange date={dateRange} setDate={setDateRange} /> */}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sensor</label>
                <Select value={selectedSensor} onValueChange={setSelectedSensor}>
                  <SelectTrigger>
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
              <Button className="w-full">Apply Filters</Button>
            </CardContent>
          </Card>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default HistoricalTankModel;