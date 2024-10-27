import React from "react"
import { Droplet } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

const MilkQuantity = ({ milkQuantityData }) => {
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Milk Quantity</CardTitle>
        <Droplet className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {milkQuantityData !== null ? (
          <div className="text-sm">
            <p className="text-xs text-muted-foreground mb-2">
              Last update: {milkQuantityData.readableDate}
            </p>
            <div className="flex items-center justify-center">
              <span className="text-2xl font-bold">{milkQuantityData.milkQuantity}</span>
              <span className="text-lg ml-1">%</span>
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No data received yet</p>
        )}
      </CardContent>
    </Card>
  )
}

export default MilkQuantity