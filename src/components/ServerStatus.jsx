// ServerStatus.jsx
import { useState } from "react";
import { Server, Wifi, WifiOff, Info, RefreshCw } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useFarmInitialization } from "@/hooks/useFarmInitialization";
const StatusIndicator = ({ status, icon: Icon, label }) => {
  const colors = {
    connected: 'bg-green-100 text-green-800',
    disconnected: 'bg-red-100 text-red-800',
    error: 'bg-red-100 text-red-800',
    connecting: 'bg-yellow-100 text-yellow-800'
  };

  return (
    <div className="flex items-center space-x-2">
      <Badge className={`${colors[status]} hover:${colors[status]} px-3 py-1`}>
        <div className="flex items-center space-x-2">
          <Icon className="h-4 w-4" />
          <span>{label}</span>
        </div>
      </Badge>
    </div>
  );
};

const ServerStatus = ({ serverStatus, webSocketServerStatus, mqttStatus }) => {
  const [isOpen, setIsOpen] = useState(false);

  const { retryInitialization } = useFarmInitialization();

  const handleRefresh = () => {
    retryInitialization();
  };

  return (
    <div className="flex items-center space-x-4">
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <div className="flex items-center space-x-4">
          <StatusIndicator
            status={serverStatus.status}
            icon={Server}
            label="Server"
          />
          <DialogTrigger asChild>
            <Button variant="outline" size="icon">
              <Info className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <Button onClick={handleRefresh} size="icon">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>Connection Details</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="flex flex-col space-y-2">
              <h4 className="font-medium">WebSocket Status</h4>
              <div className="flex items-center space-x-2">
                {webSocketServerStatus.status === 'connected' ? (
                  <Wifi className="text-green-500 h-5 w-5" />
                ) : (
                  <WifiOff className="text-red-500 h-5 w-5" />
                )}
                <span>{webSocketServerStatus.status}</span>
              </div>
            </div>
            
            <div className="flex flex-col space-y-2">
              <h4 className="font-medium">MQTT Status</h4>
              <div className="flex items-center space-x-2">
                {mqttStatus.status === 'connected' ? (
                  <Wifi className="text-green-500 h-5 w-5" />
                ) : (
                  <WifiOff className="text-red-500 h-5 w-5" />
                )}
                <span>{mqttStatus.status}</span>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ServerStatus;