import { useEffect } from 'react';
import { Home } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useTank } from "@/hooks/useTank";
import useTankStore from '@/Stores/useTankStore';
import ServerStatus from './ServerStatus';

const Header = ({ serverStatus, mqttStatus, webSocketServerStatus, farmData }) => {
  const { changeSelectedTank } = useTank();
  const { selectedTank } = useTankStore((state) => state);

  const handleTankChange = (tankId) => {
    const tank = farmData.equipments.find((tank) => tank._id === tankId);
    if (tank) {
      changeSelectedTank(tank);
    }
  };

  const getMilkTanks = (equipments) => {
    return equipments.filter((tank) => tank.type === "Tanque de leche");
  };

  useEffect(() => {
    if (!selectedTank && farmData.equipments) {
      changeSelectedTank(farmData.equipments[0]);
    }
  }, [farmData.equipments, selectedTank, changeSelectedTank]);

  return (
    <div className="bg-white p-6 shadow-sm border-b flex justify-between items-center space-x-8">
      <div className="flex items-center space-x-4">
        <Home className="text-3xl text-primary" />
        <div>
          <h2 className="text-2xl font-bold mb-3">Farm Information</h2>
          {farmData ? (
            <div className="flex space-x-6 text-base">
              <p>
                <strong>Id:</strong> {farmData.idname}
              </p>
              <p>
                <strong>Location:</strong> {farmData.name}
              </p>
              <p>
                <strong>Tanks:</strong>{" "}
                {farmData.equipments ? farmData.equipments.length : 0}
              </p>
            </div>
          ) : (
            <p className="text-base text-muted-foreground">
              Loading farm data...
            </p>
          )}
        </div>
      </div>

      <div className="flex-1 mx-10">
        <h3 className="text-2xl font-bold mb-3">Select Tank</h3>
        <Select value={selectedTank?._id} onValueChange={handleTankChange}>
          <SelectTrigger className="w-[250px]">
            <SelectValue placeholder="Select a tank" />
          </SelectTrigger>
          <SelectContent>
            {farmData.equipments &&
              getMilkTanks(farmData.equipments).map((tank) => (
                <SelectItem key={tank._id} value={tank._id}>
                  {tank.name}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center space-x-8">
        <ServerStatus serverStatus={serverStatus} mqttStatus={mqttStatus} webSocketServerStatus={webSocketServerStatus}/>
      </div>
    </div>
  );
};


export default Header;