import React from "react"
import { Thermometer } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

const TankTemperatures = ({ tankTemperaturesData }) => {
  const { overSurface, onSurface, underSurface } = tankTemperaturesData || {}

  return (
    <Card className="transition-all duration-300 hover:shadow-lg">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center space-x-2">
          <Thermometer size={16} className="text-red-500" />
          <span>Milk Temperatures</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {overSurface ? (
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">Over Surface:</span>
              <span className="text-sm font-medium">{overSurface}°C</span>
            </div>
          ) : (
            <span className="text-xs text-muted-foreground">Over Surface: No data</span>
          )}
          {onSurface  ? (
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">On Surface:</span>
              <span className="text-sm font-medium">{onSurface}°C</span>
            </div>
          ) : (
            <span className="text-xs text-muted-foreground">On Surface: No data</span>
          )}
          {underSurface  ? (
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">Under Surface:</span>
              <span className="text-sm font-medium">{underSurface}°C</span>
            </div>
          ) : (
            <span className="text-xs text-muted-foreground">Under Surface: No data</span>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default TankTemperatures