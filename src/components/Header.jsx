import { Home, Server, Wifi, WifiOff } from 'lucide-react';
import PropTypes from "prop-types";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";


import { useTank } from "@/hooks/useTank";
import { useEffect } from 'react';
import useTankStore from '@/Stores/useTankStore';



const Header = ({ serverStatus, farmData }) => {

  const { changeSelectedTank } = useTank();
  const {selectedTank} = useTankStore((state) => state);
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
        <div className="flex items-center space-x-3">
          <Server className="text-2xl text-primary" />
          <h3 className="text-2xl font-bold">Server Status</h3>
          {serverStatus === "connected" ? (
            <>
              <Wifi className="text-green-500 h-5 w-5" />
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                Connected
              </Badge>
            </>
          ) : serverStatus === "disconnected" ? (
            <>
              <WifiOff className="text-red-500 h-5 w-5" />
              <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                Disconnected
              </Badge>
            </>
          ) : (
            <>
              <Wifi className="text-yellow-500 animate-pulse h-5 w-5" />
              <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                Connecting
              </Badge>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

Header.propTypes = {
  serverStatus: PropTypes.string.isRequired,
  farmData: PropTypes.shape({
    idname: PropTypes.string,
    name: PropTypes.string,
    equipments: PropTypes.arrayOf(
      PropTypes.shape({
        _id: PropTypes.string,
        name: PropTypes.string,
        type: PropTypes.string,
        devices: PropTypes.arrayOf(
          PropTypes.shape({
            boardId: PropTypes.string,
          })
        ),
      })
    ),
  }),
};

export default Header;