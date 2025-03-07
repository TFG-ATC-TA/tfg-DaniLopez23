import { Wifi } from "lucide-react";
import { History } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

import useFarmStore from "@/stores/useFarmStore";

const DataModeToggle = ({onToggle}) => {

  const {mode, setMode} = useFarmStore((state) => state);
  
  const isRealTime = mode === 'realtime';


    return (
      <div className="flex items-center bg-gray-100 rounded-full p-1 shadow-inner">
        <button
          className={cn(
            "px-3 py-1 rounded-full text-sm font-medium transition-colors flex items-center",
            isRealTime
              ? "bg-white text-primary shadow-sm"
              : "text-gray-600 hover:bg-gray-200"
          )}
          onClick={() => onToggle(true)}
        >
          <Wifi className="mr-2 h-4 w-4" /> Real-time
        </button>
        <Switch
          checked={!isRealTime}
          onCheckedChange={(checked) => onToggle(!checked)}
          className="mx-2"
        />
        <button
          className={cn(
            "px-3 py-1 rounded-full text-sm font-medium transition-colors flex items-center",
            !isRealTime
              ? "bg-white text-primary shadow-sm"
              : "text-gray-600 hover:bg-gray-200"
          )}
          onClick={() => onToggle(false)}
        >
          <History className="mr-2 h-4 w-4" /> Historical
        </button>
      </div>
    );
  };

export default DataModeToggle;