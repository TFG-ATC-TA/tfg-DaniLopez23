import { Wifi, History } from 'lucide-react';
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

const DataModeToggle = ({ onToggle, isRealTime }) => {
  return (
    <div className="relative p-4 rounded-lg  space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between border-b pb-2">
        <div className="flex items-center gap-2">
          {isRealTime ? 
            <Wifi className="h-4 w-4 text-primary" /> : 
            <History className="h-4 w-4 text-primary" />
          }
          <p className="text-xs font-medium text-gray-500 uppercase">
            Modo de Datos
          </p>
        </div>
      </div>

      {/* Toggle Controls */}
      <div className="flex items-center bg-gray-100 rounded-full p-1 shadow-inner">
        <button
          className={cn(
            "px-2 py-1.5 rounded-full text-xs font-medium transition-colors flex items-center justify-center",
            isRealTime
              ? "bg-white text-green-600 shadow-sm"
              : "text-gray-600 hover:bg-gray-200"
          )}
          onClick={() => onToggle(true)}
        >
          <Wifi className="mr-1.5 h-3.5 w-3.5" /> Tiempo real
        </button>
        <Switch
          checked={!isRealTime}
          onCheckedChange={(checked) => onToggle(!checked)}
          className="mx-2"
        />
        <button
          className={cn(
            "px-2 py-1.5 rounded-full text-xs font-medium transition-colors flex items-center justify-center",
            !isRealTime
              ? "bg-white text-purple-600 shadow-sm"
              : "text-gray-600 hover:bg-gray-200"
          )}
          onClick={() => onToggle(false)}
        >
          <History className="mr-1.5 h-3.5 w-3.5" /> Histórico
        </button>
      </div>
    </div>
  );
};

export default DataModeToggle;