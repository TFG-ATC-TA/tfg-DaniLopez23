"use client"

import useAppDataStore from "@/stores/useAppDataStore"
import { useTank } from "@/hooks/useTank"
import { useState } from "react"
import { Info } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import useTankStore from "@/stores/useTankStore"
import useFarmStore from "@/stores/useFarmStore"

const TankSelector = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const getMilkTanks = (equipments) => {
    return equipments?.filter((tank) => tank.type === "Tanque de leche") || []
  }

  const { changeSelectedTank } = useTank()
  const { filters, setFilters, setMode } = useAppDataStore((state) => state)
  const { selectedTank } = useTankStore((state) => state)
  const { selectedFarm } = useFarmStore((state) => state)
  const handleTankChange = (tankId) => {
    const tank = selectedFarm.equipments.find((tank) => tank._id === tankId)
    setFilters({
      ...filters,
      dateRange: null,
      selectedStatus: "all",
      selectedSensor: "all",
    })
    setMode("realtime")
    if (tank) changeSelectedTank(tank, selectedFarm.broker)
  }

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2">
        <h2 className="text-lg font-semibold text-gray-700 whitespace-nowrap">Tank</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full hover:bg-gray-100"
              disabled={!selectedTank}
            >
              <Info className="h-4 w-4 text-gray-500" />
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Tank Specifications</DialogTitle>
            </DialogHeader>

            {selectedTank ? (
              <div className="space-y-4 mt-4">
                <div>
                  <strong className="block text-sm font-medium mb-1">Name:</strong>
                  <p className="text-sm">{selectedTank.name}</p>
                </div>
                <div>
                  <strong className="block text-sm font-medium mb-1">Type:</strong>
                  <p className="text-sm">{selectedTank.type}</p>
                </div>
                <div>
                  <strong className="block text-sm font-medium mb-1">Capacity:</strong>
                  <p className="text-sm">{selectedTank.capacity || "N/A"}</p>
                </div>
                <div>
                  <strong className="block text-sm font-medium mb-1">Status:</strong>
                  <p className="text-sm">{selectedTank.status || "N/A"}</p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No tank selected</p>
            )}
          </DialogContent>
        </Dialog>
      </div>

      {selectedFarm.equipments?.length > 0 ? (
        <Select value={selectedTank?._id} onValueChange={handleTankChange}>
          <SelectTrigger className="w-[180px] border-gray-300 focus:ring-blue-500 focus:border-blue-500">
            <SelectValue placeholder="Select a tank" />
          </SelectTrigger>
          <SelectContent>
            {getMilkTanks(selectedFarm?.equipments).map((tank) => (
              <SelectItem key={tank._id} value={tank._id}>
                {tank.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : (
        <p className="text-sm text-muted-foreground">No tanks available</p>
      )}
    </div>
  )
}

export default TankSelector

