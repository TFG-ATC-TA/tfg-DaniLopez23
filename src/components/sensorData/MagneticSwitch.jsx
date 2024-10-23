import React from "react"
import { ToggleLeft } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

const MagneticSwitch = ({ switchStatus }) => {
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Magnetic Switch</CardTitle>
        <ToggleLeft className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {switchStatus !== null ? (
          <div className="text-sm">
            <p className="text-xs text-muted-foreground mb-2">
              Last update: {switchStatus.readableDate}
            </p>
            <div className="flex items-center justify-center">
              <span className={`text-2xl font-bold ${switchStatus === 0 ? 'text-red-500' : 'text-green-500'}`}>
                {switchStatus === 0 ? "Closed" : "Opened"}
              </span>
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No data received yet</p>
        )}
      </CardContent>
    </Card>
  )
}

export default MagneticSwitch