import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Info } from 'lucide-react';
import useTankStore from "@/stores/useTankStore";

const statusConfig = {
  operational: { 
    color: "bg-green-500", 
    text: "Operational", 
    textColor: "text-green-600", 
    bgColor: "bg-green-50" 
  },
  warning: { 
    color: "bg-amber-500", 
    text: "Warning", 
    textColor: "text-amber-600", 
    bgColor: "bg-amber-50" 
  },
  error: { 
    color: "bg-red-500", 
    text: "Error", 
    textColor: "text-red-600", 
    bgColor: "bg-red-50" 
  },
};

const TankStatus = ({ isRealTime }) => {
  const { selectedTank } = useTankStore();
  if (!selectedTank) return null;

  const status = selectedTank.status || "operational";
  const { color, text, textColor, bgColor } = statusConfig[status];

  return (
    <div className="flex items-center gap-3 p-3 h-full rounded-lg">
      <div className="flex items-center gap-2">
        <div className="relative">
          <div className={`w-2.5 h-2.5 rounded-full ${color} ${isRealTime ? 'animate-pulse' : ''}`} />
          {isRealTime && (
            <div className={`absolute inset-0 rounded-full ${color} animate-ping opacity-30`} />
          )}
        </div>
        <span className="font-medium text-gray-900 text-sm whitespace-nowrap">
          {selectedTank.name}
        </span>
      </div>

      <Badge 
        variant="outline" 
        className={`py-1 px-2.5 rounded-md ${textColor} ${bgColor} border-transparent whitespace-nowrap`}
      >
        {text}
      </Badge>

      <Button 
        variant="ghost" 
        size="sm" 
        className="h-7 w-7 p-0 text-gray-400 hover:text-gray-700 hover:bg-gray-100 ml-1"
      >
        <Info className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
};

export default TankStatus;