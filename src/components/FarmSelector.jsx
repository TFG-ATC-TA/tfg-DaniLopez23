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

const FarmSelector = ({ farmData }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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

            {farmData ? (
              <div className="space-y-4 mt-4">
                <div>
                  <strong className="block text-sm font-medium mb-1">
                    Farm ID:
                  </strong>
                  <p className="text-sm">{farmData.idname}</p>
                </div>
                <div>
                  <strong className="block text-sm font-medium mb-1">
                    Location:
                  </strong>
                  <p className="text-sm">{farmData.name}</p>
                </div>
                <div>
                  <strong className="block text-sm font-medium mb-1">
                    Total Tanks:
                  </strong>
                  <p className="text-sm">{farmData.equipments?.length || 0}</p>
                </div>
                {/* Agregar más campos según sea necesario */}
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
      <Select>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Select Farm" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="main-farm">Main Farm</SelectItem>
          {/* Agregar más opciones según sea necesario */}
        </SelectContent>
      </Select>
    </div>
  );
};

export default FarmSelector;
