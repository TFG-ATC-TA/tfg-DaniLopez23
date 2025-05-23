import { ToggleRight } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const MagneticSwitch = ({ switchStatus }) => {
  const { status, sensorId, readableDate } = switchStatus || {};
  const isOpen = status === 1;

  return (
    <Card className="ring-2 ring-yellow-200 bg-yellow-50/20">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center space-x-2">
          <ToggleRight size={16} className="text-yellow-500" />
          <span>Magnetic Switch</span>
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Sensor ID:</span>
              <span className="font-medium">{sensorId || 'N/A'}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Last Reading:</span>
              <span className="font-medium">{readableDate || 'N/A'}</span>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center bg-yellow-100/30 p-4 rounded-md">
            <div className="flex items-center gap-2">
              <div className={`h-3 w-3 rounded-full ${isOpen ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className={`text-xl font-bold ${isOpen ? 'text-green-600' : 'text-red-600'}`}>
                {isOpen ? "OPENED" : "CLOSED"}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Current hatch position
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MagneticSwitch;