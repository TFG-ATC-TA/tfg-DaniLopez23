"use client"

import { useState } from "react"
import { Info } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import useFarmStore from "@/stores/useFarmStore"
import useTankStore from "@/stores/useTankStore"
import useAppDataStore from "@/stores/useAppDataStore"
import { useTank } from "@/hooks/useTank"

const FarmSelector = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const { farms, setSelectedFarm, selectedFarm } = useFarmStore((state) => state)
  const { setSelectedTank } = useTankStore((state) => state)
  const { changeSelectedTank } = useTank()
  const { filters, setFilters, setMode } = useAppDataStore((state) => state)

  const handleFarmChange = (value) => {
    const selectedFarmId = value
    const farm = farms.find((farm) => farm._id === selectedFarmId)
    if (farm) {
      setSelectedFarm(farm)
      setFilters({
        ...filters,
        dateRange: null,
        selectedStatus: "all",
        selectedSensor: "all",
      })
      setMode("realtime")

      if (farm.equipments.length > 0) {
        changeSelectedTank(farm.equipments[0], farm.broker)
      } else {
        setSelectedTank(null)
      }
    }
  }

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2">
        <h2 className="text-lg font-semibold text-gray-700 whitespace-nowrap">Farm</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-gray-100">
              <Info className="h-4 w-4 text-gray-500" />
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Farm Specifications</DialogTitle>
            </DialogHeader>

            {farms ? (
              <div className="space-y-4 mt-4">
                <div>
                  <strong className="block text-sm font-medium mb-1">Farm ID:</strong>
                  <p className="text-sm">{selectedFarm._id}</p>
                </div>
                <div>
                  <strong className="block text-sm font-medium mb-1">Location:</strong>
                  <p className="text-sm">{selectedFarm.name}</p>
                </div>
                <div>
                  <strong className="block text-sm font-medium mb-1">Total Tanks:</strong>
                  <p className="text-sm">{selectedFarm.equipments?.length || 0}</p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Loading farm data...</p>
            )}
          </DialogContent>
        </Dialog>
      </div>

      <Select value={selectedFarm._id} onValueChange={handleFarmChange}>
        <SelectTrigger className="w-[180px] border-gray-300 focus:ring-blue-500 focus:border-blue-500">
          <SelectValue placeholder="Select Farm">{selectedFarm ? selectedFarm.name : "Select Farm"}</SelectValue>
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
  )
}

export default FarmSelector

