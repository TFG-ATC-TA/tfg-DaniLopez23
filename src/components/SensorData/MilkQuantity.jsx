import React, { useState } from "react"
import { Droplet } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

const MilkQuantity = ({ milkQuantityData }) => {
  const [isSelected, setIsSelected] = useState(false);
  const percentage = milkQuantityData?.milkQuantity || null
  const fillHeight = percentage ? `${percentage}%` : '0%'

  const handleClick = () => {
    setIsSelected(!isSelected);
  };

  const handleMouseLeave = () => {
    if (!isSelected) {
      setIsSelected(false);
    }
  };

  return (
    <Card
      className={cn(
        "transition-all duration-300 hover:shadow-lg",
        isSelected && "ring-2 ring-blue-200"
      )}
      onClick={() => setIsSelected(!isSelected)}
      onMouseLeave={() => !isSelected && setIsSelected(false)}
      tabIndex={0}
      role="button"
      aria-pressed={isSelected}
    >
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Droplet size={16} className="text-blue-500" />
            <span>Milk Quantity</span>
          </div>
          <div
            className={cn(
              "w-2 h-2 rounded-full transition-all duration-300",
              isSelected ? "bg-blue-500" : "bg-gray-300"
            )}
          />
        </CardTitle>
      </CardHeader>
      <p className="text-xs text-muted-foreground mb-2 px-6">
        Last update: {milkQuantityData?.readableDate}
      </p>
      <CardContent>
        {percentage !== null ? (
          <>
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
          <span className="text-sm text-muted-foreground">No data available</span>
        )}
      </CardContent>
    </Card>
  )
}

export default MilkQuantity