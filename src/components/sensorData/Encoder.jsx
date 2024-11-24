import React, { useState } from "react";
import { RotateCw } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const Encoder = ({ encoderData, isSelected, onSelect }) => {

  return (
    <Card
      className={cn(
        "transition-all duration-300 hover:shadow-lg",
        isSelected && "ring-2 ring-green-200"
      )}
      onClick={onSelect}
      tabIndex={0}
      role="button"
      aria-pressed={isSelected}
    >
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <RotateCw size={16} className="text-green-500" />
            <span>Encoder</span>
          </div>
          <div
            className={cn(
              "w-2 h-2 rounded-full transition-all duration-300",
              isSelected ? "bg-green-500" : "bg-gray-300"
            )}
          />
        </CardTitle>
      </CardHeader>
      <p className="text-xs text-muted-foreground mb-2 px-6">
        Last update: {encoderData?.readableDate || "N/A"}
      </p>
      <CardContent>
        {encoderData ? (
          <div className="flex items-center justify-center">
            <span className="text-2xl font-bold text-black">{encoderData.value}</span>
            <span className="text-lg ml-1">rad/s</span>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No data available</p>
        )}
      </CardContent>
    </Card>
  );
};

export default Encoder;
