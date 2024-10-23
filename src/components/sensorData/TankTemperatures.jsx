import React from "react"
import { Thermometer } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

const TankTemperatures = ({ tankTemperaturesData }) => {
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Tank Temperatures</CardTitle>
        <Thermometer className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {tankTemperaturesData ? (
          <div className="text-sm">
            <p className="text-xs text-muted-foreground mb-2">
              Last update: {tankTemperaturesData.readableDate}
            </p>
            <div className="grid grid-cols-3 gap-2">
              <div className="flex flex-col items-center">
                <span className="text-xs font-medium">Submerged</span>
                <span className="text-lg font-bold">{tankTemperaturesData.submerged_temperature}</span>
                <span className="text-xs text-muted-foreground">°C</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-xs font-medium">Surface</span>
                <span className="text-lg font-bold">{tankTemperaturesData.surface_temperature}</span>
                <span className="text-xs text-muted-foreground">°C</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-xs font-medium">Over Surface</span>
                <span className="text-lg font-bold">{tankTemperaturesData.over_surface_temperature}</span>
                <span className="text-xs text-muted-foreground">°C</span>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No data received yet</p>
        )}
      </CardContent>
    </Card>
  )
}

export default TankTemperatures