import React from "react";
import { Droplet } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const MilkQuantity = ({ milkQuantityData }) => {
  const percentage = milkQuantityData?.milkQuantity || null;
  const fillHeight = percentage ? `${percentage}%` : "0%";

  return (
    <Card className="transition-all duration-300 hover:shadow-lg">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center space-x-2">
          <Droplet size={16} className="text-blue-500" />
          <span>Milk Quantity</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {percentage !== null ? (
          <>
            <div className="my-2 text-xs text-muted-foreground">
            Last update: {milkQuantityData.readableDate}
            </div>
            <div className="relative h-24 bg-gray-200 rounded-md overflow-hidden">
              
              <div
                className="absolute bottom-0 left-0 right-0 bg-blue-500 transition-all duration-500 ease-in-out"
                style={{ height: fillHeight }}
              ></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-bold text-black">
                  {percentage.toFixed(2)}%
                </span>
              </div>
            </div>
            
          </>
        ) : (
          <span className="text-sm text-muted-foreground">
            No data available
          </span>
        )}
      </CardContent>
    </Card>
  );
};

export default MilkQuantity;
