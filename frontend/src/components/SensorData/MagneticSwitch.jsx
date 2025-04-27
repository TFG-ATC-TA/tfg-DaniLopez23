import { useState } from "react";
import { ToggleRight, ChevronDown, ChevronUp } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const MagneticSwitch = ({ switchStatus }) => {
  const [expanded, setExpanded] = useState(true);

  const { value, tags, readableDate } = switchStatus || {};
  const isOpen = value === 1;

  const toggleExpanded = () => setExpanded(!expanded);

  return (
    <Card
      className={`transition-all duration-300 ease-in-out overflow-hidden 
        ring-2 ring-yellow-200 bg-yellow-50/20
        ${expanded ? "w-64 h-auto" : "w-16 h-16 flex items-center justify-center"}`}
    >
      {expanded ? (
        <>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium flex items-center space-x-2">
                <ToggleRight size={20} className="text-yellow-500" />
                <span>Magnetic Switch</span>
              </CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleExpanded}
                className="text-yellow-500 hover:bg-transparent"
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

              <div className="flex flex-col items-center justify-center bg-yellow-100/30 p-4 rounded-md">
                {value !== undefined ? (
                  <div className="flex items-center gap-2">
                    <div
                      className={`h-3 w-3 rounded-full ${
                        isOpen ? "bg-green-500" : "bg-red-500"
                      }`}
                    />
                    <span
                      className={`text-xl font-bold ${
                        isOpen ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {isOpen ? "OPENED" : "CLOSED"}
                    </span>
                  </div>
                ) : (
                  <span className="text-xl font-bold text-gray-600">No data</span>
                )}
                <p className="text-xs text-muted-foreground mt-2">
                  Current hatch position
                </p>
              </div>
            </div>
          </CardContent>
        </>
      ) : (
        // Vista colapsada
        <button onClick={toggleExpanded} className="flex flex-col items-center space-y-1">
          <ToggleRight size={20} className="text-yellow-500" />
          <ChevronDown size={16} className="text-muted-foreground" />
        </button>
      )}
    </Card>
  );
};

export default MagneticSwitch;
