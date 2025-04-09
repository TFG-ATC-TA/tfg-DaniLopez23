import { useState } from "react";
import { Droplet, ChevronDown, ChevronUp } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const MilkQuantity = ({ milkQuantityData }) => {
  const [expanded, setExpanded] = useState(true);

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  const percentage = milkQuantityData?.value || null;
  const fillHeight = percentage ? `${percentage}%` : "0%";

  return (
    <Card
      className={`transition-all duration-300 ease-in-out overflow-hidden 
        ring-2 ring-blue-200 bg-blue-50/20 
        ${expanded ? "w-64 h-auto" : "w-16 h-16 flex items-center justify-center"}`}
    >
      {expanded ? (
        <>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium flex items-center space-x-2">
                <Droplet size={20} className="text-blue-500" />
                <span>Milk Quantity Sensor</span>
              </CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleExpanded}
                className="text-blue-500 hover:bg-transparent"
              >
                <ChevronUp size={18} />
              </Button>
            </div>
          </CardHeader>

          <CardContent>
            <div className="space-y-4">
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Board ID:</span>
                  <span className="font-medium">
                    {milkQuantityData?.tags.board_id || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Last Reading:</span>
                  <span className="font-medium">
                    {milkQuantityData?.readableDate || "N/A"}
                  </span>
                </div>
              </div>

              {percentage !== null ? (
                <div className="relative h-24 bg-gray-200 rounded-md overflow-hidden mt-2">
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
        </>
      ) : (
        // Vista colapsada
        <button onClick={toggleExpanded} className="flex flex-col items-center space-y-1">
          <Droplet size={20} className="text-blue-500" />
          <ChevronDown size={16} className="text-muted-foreground" />
        </button>
      )}
    </Card>
  );
};

export default MilkQuantity;
