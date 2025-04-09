import { Scale } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const Weight = ({ weightData }) => {
  const { value, tags, readableDate, unit = "kg" } = weightData || {};

  return (
    <Card className="ring-2 ring-green-200 bg-green-50/20">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center space-x-2">
          <Scale size={16} className="text-green-500" />
          <span>Weight Sensor</span>
        </CardTitle>
      </CardHeader>
      
      {weightData ? <CardContent>
        <div className="space-y-4">
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Board ID:</span>
              <span className="font-medium">{tags?.board_id}</span>
            </div>
            <div className="flex justify-between text-xs space-x-2">
              <span className="text-muted-foreground">Last Reading:</span>
              <span className="font-medium">{readableDate}</span>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center bg-green-100/30 p-4 rounded-md">
            <div className="text-3xl font-bold text-green-600">
              {value}
              <span className="text-lg ml-1">{unit}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Current measured weight
            </p>
          </div>
        </div>
      </CardContent> : 
        <CardContent className="flex items-center justify-center h-24 text-sm text-muted-foreground">
          No data available
        </CardContent>
      }
    </Card>
  );
};

export default Weight;