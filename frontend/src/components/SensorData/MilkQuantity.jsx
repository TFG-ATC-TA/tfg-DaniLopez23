import { Droplet } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const MilkQuantity = ({ milkQuantityData }) => {
  const percentage = milkQuantityData?.milkQuantity || null;
  const fillHeight = percentage ? `${percentage}%` : '0%';
  return (
    <Card className="ring-2 ring-blue-200 bg-blue-50/20">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center space-x-2">
          <Droplet size={16} className="text-blue-500" />
          <span>Milk Quantity Sensor</span>
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {/* Sección de información del sensor */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Board ID:</span>
              <span className="font-medium">{milkQuantityData?.tags.board_id || 'N/A'}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Last Reading:</span>
              <span className="font-medium">{milkQuantityData?.readableDate || 'N/A'}</span>
            </div>
          </div>

          {/* Visualización de porcentaje */}
          {percentage !== null ? (
            <div className="relative h-24 bg-gray-200 rounded-md overflow-hidden mt-4">
              <div
                className="absolute bottom-0 left-0 right-0 bg-blue-500"
                style={{ height: fillHeight }}
              ></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-bold text-black">
                  {percentage.toFixed(2)}%
                </span>
              </div>
            </div>
          ) : (
            <div className="h-24 flex items-center justify-center text-sm text-muted-foreground">
              No data available
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MilkQuantity;