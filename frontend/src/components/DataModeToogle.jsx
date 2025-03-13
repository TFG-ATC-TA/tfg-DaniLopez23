import { Wifi, History } from 'lucide-react';
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

const DataModeToggle = ({ onToggle, isRealTime }) => {
  return (
    <div className="p-3 h-full flex items-center">
      <div className="flex items-center bg-gray-100 rounded-full p-1 shadow-inner">
        <button
          className={cn(
            "w-24 px-2 py-1.5 rounded-full text-xs font-medium transition-colors flex items-center justify-center",
            isRealTime
              ? "bg-white text-green-600 shadow-sm"
              : "text-gray-600 hover:bg-gray-200"
          )}
          onClick={() => onToggle(true)}
        >
          <Wifi className="mr-1.5 h-3.5 w-3.5" /> Real-time
        </button>
        <Switch
          checked={!isRealTime}
          onCheckedChange={(checked) => onToggle(!checked)}
          className="mx-2"
        />
        <button
          className={cn(
            "w-24 px-2 py-1.5 rounded-full text-xs font-medium transition-colors flex items-center justify-center",
            !isRealTime
              ? "bg-white text-purple-600 shadow-sm"
              : "text-gray-600 hover:bg-gray-200"
          )}
          onClick={() => onToggle(false)}
        >
          <History className="mr-1.5 h-3.5 w-3.5" /> Historical
        </button>
      </div>
    </div>
  );
};

export default DataModeToggle;