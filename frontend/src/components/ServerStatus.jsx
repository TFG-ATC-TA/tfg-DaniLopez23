import { Server, Wifi, Info, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useFarmInitialization } from "@/hooks/useFarmInitialization";

const statusColors = {
  connected: "bg-green-500 text-white",
  disconnected: "bg-red-500 text-white",
  error: "bg-red-500 text-white",
  connecting: "bg-yellow-500 text-white",
};

const statusText = {
  connected: "Connected",
  disconnected: "Disconnected",
  error: "Error",
  connecting: "Connecting",
};

const ServerStatus = ({ serverStatus, webSocketServerStatus, mqttStatus }) => {
  const { retryInitialization } = useFarmInitialization();

  return (
    <div className="flex items-center gap-3 px-3 py-2">
      <div className="flex items-center gap-2">
        <Server className="h-5 w-5 text-primary" />
        <span className="font-medium text-sm text-gray-700">Server</span>
        <Badge className={statusColors[serverStatus.status] || "bg-gray-400 text-white"}>
          {statusText[serverStatus.status] || "Desconocido"}
        </Badge>
      </div>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-gray-100">
                  <Info className="h-4 w-4 text-gray-500" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[320px]">
                <DialogHeader>
                  <DialogTitle>Connection details</DialogTitle>
                </DialogHeader>
                <div className="space-y-3 mt-2">
                  <div className="flex items-center gap-2">
                    <Wifi className={`h-4 w-4 ${webSocketServerStatus.status === "connected" ? "text-green-500" : "text-red-500"}`} />
                    <span className="text-sm">WebSocket:</span>
                    <Badge className={statusColors[webSocketServerStatus.status] || "bg-gray-400 text-white"}>
                      {statusText[webSocketServerStatus.status] || webSocketServerStatus.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Wifi className={`h-4 w-4 ${mqttStatus.status === "connected" ? "text-green-500" : "text-red-500"}`} />
                    <span className="text-sm">MQTT:</span>
                    <Badge className={statusColors[mqttStatus.status] || "bg-gray-400 text-white"}>
                      {statusText[mqttStatus.status] || mqttStatus.status}
                    </Badge>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </TooltipTrigger>
          <TooltipContent>
            <p>Ver detalles de conexión</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={retryInitialization}
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full hover:bg-gray-100"
            >
              <RefreshCw className="h-4 w-4 text-gray-500" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Reintentar conexión</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default ServerStatus;