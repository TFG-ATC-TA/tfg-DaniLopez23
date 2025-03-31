// FarmSelector.jsx
import { useState } from "react";
import { Home, Info } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import useFarmStore from "@/stores/useFarmStore";
import useTankStore from "@/stores/useTankStore";
import useAppDataStore from "@/stores/useAppDataStore";
import { useTank } from "@/hooks/useTank";

const FarmSelector = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const {farms, setSelectedFarm, selectedFarm} = useFarmStore((state) => state);
  const {setSelectedTank} = useTankStore((state) => state);
  const {changeSelectedTank} = useTank();
  const {filters, setFilters, setMode} = useAppDataStore((state) => state);

  const handleFarmChange = (value) => {
    const selectedFarmId = value;
    const farm = farms.find((farm) => farm._id === selectedFarmId);
    if(farm){
      setSelectedFarm(farm);
      setFilters({
        ...filters,
        dateRange: null,
        selectedStatus: "all",
        selectedSensor: "all",
      });
      setMode("realtime");

      if(farm.equipments.length > 0){
        changeSelectedTank(farm.equipments[0], farm.broker);
      }else{
        setSelectedTank(null);
      }
    }  
  };

  return (
    <div className="flex flex-col space-y-4">
      {/* Fila superior: Título y botón de información */}
      <div className="flex items-center space-x-4">
        <h2 className="text-2xl font-bold">Farm</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="icon">
              <Info className="h-4 w-4" />
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Farm Specifications</DialogTitle>
            </DialogHeader>

            {farms ? (
              <div className="space-y-4 mt-4">
                <div>
                  <strong className="block text-sm font-medium mb-1">
                    Farm ID:
                  </strong>
                  <p className="text-sm">{selectedFarm._id}</p>
                </div>
                <div>
                  <strong className="block text-sm font-medium mb-1">
                    Location:
                  </strong>
                  <p className="text-sm">{selectedFarm.name}</p>
                </div>
                <div>
                  <strong className="block text-sm font-medium mb-1">
                    Total Tanks:
                  </strong>
                  <p className="text-sm">{selectedFarm.equipments?.length || 0}</p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Loading farm data...
              </p>
            )}
          </DialogContent>
        </Dialog>
      </div>

      {/* Selector de granja */}
      <Select value={selectedFarm._id} onValueChange={handleFarmChange}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Select Farm">
            {selectedFarm ? selectedFarm.name : "Select Farm"}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {farms.map((farm) => (
            <SelectItem key={farm._id} value={farm._id}>
              {farm.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default FarmSelector;
