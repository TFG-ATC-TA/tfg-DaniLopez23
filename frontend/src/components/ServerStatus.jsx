"use client"

import { Server, Wifi, WifiOff, Info, RefreshCw } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useFarmInitialization } from "@/hooks/useFarmInitialization"

const StatusIndicator = ({ status, icon: Icon }) => {
  const colors = {
    connected: "bg-green-500 text-green-50",
    disconnected: "bg-red-500 text-red-50",
    error: "bg-red-500 text-red-50",
    connecting: "bg-yellow-500 text-yellow-50",
  }

  return (
    <Badge className={`${colors[status]}`}>
      <Icon className="h-4 w-4" />
    </Badge>
  )
}

const ServerStatus = ({ serverStatus, webSocketServerStatus, mqttStatus }) => {
  const { retryInitialization } = useFarmInitialization()
  const handleRefresh = () => {
    retryInitialization()
  }

  return (
    <div className="flex items-center space-x-2 ml-auto">
      <div className="flex items-center gap-2">
        <span className="text-lg font-semibold text-gray-700 whitespace-nowrap">Server Status</span>
        <StatusIndicator status={serverStatus.status} icon={Server} />
      </div>

      <div className="flex space-x-1">
        <Dialog>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-gray-100">
                    <Info className="h-4 w-4 text-gray-500" />
                  </Button>
                </DialogTrigger>
              </TooltipTrigger>
              <TooltipContent>
                <p>View connection details</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <DialogContent className="sm:max-w-[300px]">
            <DialogHeader>
              <DialogTitle>Connection Details</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <h4 className="font-medium text-sm">WebSocket Status</h4>
                <div className="flex items-center space-x-2">
                  {webSocketServerStatus.status === "connected" ? (
                    <Wifi className="text-green-500 h-5 w-5" />
                  ) : (
                    <WifiOff className="text-red-500 h-5 w-5" />
                  )}
                  <span className="text-sm">{webSocketServerStatus.status}</span>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium text-sm">MQTT Status</h4>
                <div className="flex items-center space-x-2">
                  {mqttStatus.status === "connected" ? (
                    <Wifi className="text-green-500 h-5 w-5" />
                  ) : (
                    <WifiOff className="text-red-500 h-5 w-5" />
                  )}
                  <span className="text-sm">{mqttStatus.status}</span>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={handleRefresh}
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full hover:bg-gray-100"
              >
                <RefreshCw className="h-4 w-4 text-gray-500" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Refresh connections</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  )
}

export default ServerStatus

