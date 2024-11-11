import { Home, Server, Wifi, WifiOff } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Header = ({ farmData, serverStatus, selectedTank, setSelectedTank }) => {
  return (
    <div className="bg-white p-4 shadow-md flex justify-between items-center">
      <div className="flex items-center space-x-4">
        <Home className="text-2xl text-primary" />
        <div>
          <h2 className="text-xl font-bold mb-2">Farm Information</h2>
          {farmData ? (
            <div className="flex space-x-4 text-sm">
              <p><strong>Id:</strong> {farmData.farmId}</p>
              <p><strong>Location:</strong> {farmData.location}</p>
              <p><strong>Tanks:</strong> {farmData.tanks ? farmData.tanks.length : 0}</p>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Loading farm data...</p>
          )}
        </div>
      </div>
      
      <div className="flex-1 mx-8">
        <h3 className="text-xl font-bold mb-2">Select Tank</h3>
        <Select 
          value={selectedTank?.id} 
          onValueChange={(value) => setSelectedTank(farmData.tanks.find(tank => tank.id === value))}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select a tank" />
          </SelectTrigger>
          <SelectContent>
            {farmData.tanks && farmData.tanks.map((tank) => (
              <SelectItem key={tank.id} value={tank.id}>{tank.tankName}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center space-x-2">
        <Server className="text-xl text-primary" />
        <h3 className="text-xl font-bold">Server Status</h3>
        {serverStatus === "connected" ? (
          <>
            <Wifi className="text-green-500" />
            <Badge variant="outline" className="bg-green-100 text-green-800">Connected</Badge>
          </>
        ) : serverStatus === "disconnected" ? (
          <>
            <WifiOff className="text-red-500" />
            <Badge variant="outline" className="bg-red-100 text-red-800">Disconnected</Badge>
          </>
        ) : (
          <>
            <Wifi className="text-yellow-500 animate-pulse" />
            <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Connecting</Badge>
          </>
        )}
      </div>
    </div>
  );
};

export default Header;