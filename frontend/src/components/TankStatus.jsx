import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Info } from 'lucide-react';
import useTankStore from '@/Stores/useTankStore';

const statusConfig = {
  operational: {
    color: 'bg-green-500',
    text: 'Operational',
    textColor: 'text-green-600'
  },
  warning: {
    color: 'bg-amber-500',
    text: 'Warning',
    textColor: 'text-amber-600'
  },
  error: {
    color: 'bg-red-500',
    text: 'Error',
    textColor: 'text-red-600'
  }
};

const TankStatus = () => {
  const { selectedTank } = useTankStore();
  
  if (!selectedTank) return null;

  const status = selectedTank.status || 'operational';
  const { color, text, textColor } = statusConfig[status];

  return (
    <div className="flex items-center gap-4">
      {/* Nombre del tanque */}
      <span className="font-medium text-foreground">{selectedTank.name}</span>
      
      {/* Estado */}
      <div className="flex items-center gap-1.5">
        <div className={`w-2 h-2 rounded-full ${color}`} />
        <Badge 
          variant="outline" 
          className={`py-1 px-2 text-sm ${textColor} border-transparent`}
        >
          {text}
        </Badge>
      </div>
      
      {/* Botón de información */}
      <Button 
        variant="ghost" 
        size="sm" 
        className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
      >
        <Info className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default TankStatus;