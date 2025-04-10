import { useState } from "react";
import { Scale, ChevronDown, ChevronUp } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Weight = ({ weightData }) => {
  const [expanded, setExpanded] = useState(true);
  const { value, tags, readableDate, unit = "kg" } = weightData || {};

  const toggleExpanded = () => setExpanded(!expanded);

  return (
    <Card
      className={`transition-all duration-300 ease-in-out overflow-hidden 
      ring-2 ring-green-200 bg-green-50/20
      ${expanded ? "w-64 h-auto" : "w-16 h-16 flex items-center justify-center"}`}
    >
      {expanded ? (
        <>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium flex items-center space-x-2">
                <Scale size={20} className="text-green-500" />
                <span>Weight Sensor</span>
              </CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleExpanded}
                className="text-green-500 hover:bg-transparent"
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
                  <span className="font-medium">{tags?.board_id || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Last Reading:</span>
                  <span className="font-medium">{readableDate || "N/A"}</span>
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
          </CardContent>
        </>
      ) : (
        // Vista colapsada
        <button onClick={toggleExpanded} className="flex flex-col items-center space-y-1">
          <Scale size={20} className="text-green-500" />
          <ChevronDown size={16} className="text-muted-foreground" />
        </button>
      )}
    </Card>
  );
};

export default Weight;
