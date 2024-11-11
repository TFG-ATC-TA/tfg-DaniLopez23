import { Home, Server, Wifi, WifiOff, Droplet, Thermometer, Milk, LogOut } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const Header = ({farmData, serverStatus}) => {
    
  return (
    <div className="bg-white p-6 shadow-md flex justify-between items-center">
    <div className="flex items-center space-x-8">
      <div className="flex items-center space-x-3">
        <Home className="text-2xl text-primary" />
        <div>
          <h2 className="text-2xl font-bold">Farm Information</h2>
          {farmData ? (
            <div className="flex space-x-4 text-sm">
              <p>
                <strong>Id:</strong> {farmData.farmId}
              </p>
              <p>
                <strong>Location:</strong> {farmData.location}
              </p>
              <p>
                <strong>Tanks:</strong>{" "}
                {farmData && farmData.tanks ? farmData.tanks.length : 0}
              </p>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Loading farm data...</p>
          )}
        </div>
      </div>
      <div className="flex items-center space-x-3">
        <Server className="text-2xl text-primary" />
        <div>
          <h2 className="text-2xl font-bold">Server Status</h2>
          <div className="flex items-center mt-1">
            {serverStatus === "connected" ? (
              <>
                <Wifi className="mr-2 text-green-500" />
                <Badge variant="outline" className="bg-green-100 text-green-800">
                  Connected
                </Badge>
              </>
            ) : serverStatus === "disconnected" ? (
              <>
                <WifiOff className="mr-2 text-red-500" />
                <Badge variant="outline" className="bg-red-100 text-red-800">
                  Disconnected
                </Badge>
              </>
            ) : (
              <>
                <Wifi className="mr-2 text-yellow-500 animate-pulse" />
                <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                  Connecting
                </Badge>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  </div>
  );
}

export default Header;