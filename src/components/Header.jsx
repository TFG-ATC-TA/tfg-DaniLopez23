import { Home, Server, Wifi, WifiOff, History } from 'lucide-react';
import PropTypes from "prop-types";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

import { useTank } from "@/hooks/useTank";
import useDataStore from '@/Stores/useDataStore';

const Header = ({ serverStatus, farmData }) => {
  const { selectedTank, changeSelectedTank } = useTank();
  const { mode, setMode } = useDataStore((state) => state);

  const handleTankChange = (tankId) => {
    const tank = farmData.equipments.find((tank) => tank._id === tankId);
    console.log("Changed tank:", tank.name);

    if (tank) {
      changeSelectedTank(tank);
    }
  };

  const getMilkTanks = (equipments) => {
    return equipments.filter((tank) => tank.type === "Tanque de leche");
  };

  const handleDataModeToggle = (checked) => {
    const newMode = checked ? "realtime" : "historical";
    setMode(newMode);
  };

  return (
    <div className="bg-white p-6 shadow-md flex justify-between items-center space-x-8">
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
          <Switch
            id="data-mode"
            checked={mode === "realtime"}
            onCheckedChange={handleDataModeToggle}
          />
          <Label htmlFor="data-mode" className="text-base font-medium">
            {mode === "realtime" ? (
              <span className="flex items-center">
                <Wifi className="mr-2 h-5 w-5" /> Real-time
              </span>
            ) : (
              <span className="flex items-center">
                <History className="mr-2 h-5 w-5" /> Historical
              </span>
            )}
          </Label>
        </div>

        <div className="flex items-center space-x-3">
          <Server className="text-2xl text-primary" />
          <h3 className="text-2xl font-bold">Server Status</h3>
          {serverStatus === "connected" ? (
            <>
              <Wifi className="text-green-500 h-5 w-5" />
              <Badge variant="outline" className="bg-green-100 text-green-800">
                Connected
              </Badge>
            </>
          ) : serverStatus === "disconnected" ? (
            <>
              <WifiOff className="text-red-500 h-5 w-5" />
              <Badge variant="outline" className="bg-red-100 text-red-800">
                Disconnected
              </Badge>
            </>
          ) : (
            <>
              <Wifi className="text-yellow-500 animate-pulse h-5 w-5" />
              <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
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