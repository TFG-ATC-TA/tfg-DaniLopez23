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

const ConnectionStatus = ({ status, label, error }) => (
  <div className="flex flex-col space-y-2">
    <div className="flex items-center space-x-2">
      {status === "connected" ? (
        <>
          <Wifi className="text-green-500 h-5 w-5" />
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Connected
          </Badge>
        </>
      ) : status === "disconnected" || status === "error" ? (
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
      <span className="font-medium">{label}</span>
    </div>
    {error && (
      <p className="text-sm text-red-600 ml-7">{error}</p>
    )}
  </div>
);

const ServerStatus = ({ serverStatus, webSocketServerStatus, mqttStatus }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { retryInitialization } = useFarmInitialization();

  const handleRefresh = () => {
    retryInitialization();
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Server className="text-2xl text-primary" />
          <h3 className="text-2xl font-bold">Server Status</h3>
        </div>
        <div className="flex items-center space-x-4">
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button className={"ms-2"} variant="outline">
                <Info className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Connection Details</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <ConnectionStatus
                  status={webSocketServerStatus.status}
                  label="WebSocket Server"
                  error={webSocketServerStatus.error}
                />
                <ConnectionStatus
                  status={mqttStatus.status}
                  label="MQTT Broker"
                  error={mqttStatus.error}
                />
              </div>
            </DialogContent>
          </Dialog>
          <Button onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <ConnectionStatus
          status={serverStatus.status}
          error={serverStatus.error}
        />
      </div>
    </div>
  );
};

export default ServerStatus;