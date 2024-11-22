import React from "react"
import { Compass } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

const AirQuality = ({ airQualityData }) => {
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Air Qualit Data</CardTitle>
        <Compass className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {airQualityData ? (
          <div className="text-sm">
            <p className="text-xs text-muted-foreground mb-2">
              Last update: {airQualityData.readableDate}
            </p>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No data received yet</p>
        )}
      </CardContent>
    </Card>
  )
}

export default AirQuality