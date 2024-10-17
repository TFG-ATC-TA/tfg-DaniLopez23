import React from "react"
import { RotateCw } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

const Encoder = ({ encoderData }) => {
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Encoder</CardTitle>
        <RotateCw className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {encoderData ? (
          <div className="text-sm">
            <p className="text-xs text-muted-foreground mb-2">
              Last update: {encoderData.readableDate}
            </p>
            <div className="flex items-center justify-center">
              <span className="text-2xl font-bold">{encoderData.value}</span>
              <span className="text-lg ml-1">rad/s</span>
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No data received yet</p>
        )}
      </CardContent>
    </Card>
  )
}

export default Encoder