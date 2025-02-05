// TankSelector.jsx
import { useState } from "react";
import { Info } from "lucide-react";
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

const TankSelector = ({ selectedTank, handleTankChange, farmData }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  console.log(farmData);
  const getMilkTanks = (equipments) => {
    return equipments?.filter((tank) => tank.type === "Tanque de leche") || [];
  };
  return (
    <div className="flex flex-col space-y-4">
      {/* Fila superior: Título y botón de información */}
      <div className="flex items-center space-x-4">
        <h2 className="text-2xl font-bold">Tank</h2>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="icon" disabled={!selectedTank}>
              <Info className="h-4 w-4" />
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Tank Specifications</DialogTitle>
            </DialogHeader>

            {selectedTank ? (
              <div className="space-y-4 mt-4">
                <div>
                  <strong className="block text-sm font-medium mb-1">
                    Name:
                  </strong>
                  <p className="text-sm">{selectedTank.name}</p>
                </div>
                <div>
                  <strong className="block text-sm font-medium mb-1">
                    Type:
                  </strong>
                  <p className="text-sm">{selectedTank.type}</p>
                </div>
                <div>
                  <strong className="block text-sm font-medium mb-1">
                    Capacity:
                  </strong>
                  <p className="text-sm">{selectedTank.capacity || "N/A"}</p>
                </div>
                <div>
                  <strong className="block text-sm font-medium mb-1">
                    Status:
                  </strong>
                  <p className="text-sm">{selectedTank.status || "N/A"}</p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No tank selected</p>
            )}
          </DialogContent>
        </Dialog>
      </div>

      {/* Selector de tanque */}
      {farmData.equipments?.length > 0 ? (<Select value={selectedTank?._id} onValueChange={handleTankChange}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Select a tank" />
        </SelectTrigger>
        <SelectContent>
          {getMilkTanks(farmData?.equipments).map((tank) => (
            <SelectItem key={tank._id} value={tank._id}>
              {tank.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>) : <p className="text-sm text-muted-foreground">No tanks available</p>}
    </div>
  );
};

export default TankSelector;
