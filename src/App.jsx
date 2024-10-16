import React, { useState, Suspense, useEffect } from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, Plane } from "@react-three/drei"
import HorizontalTankModel2Blades from "./components/tank-models/HorizontalTankModel2Blades"
import { setupSocketListeners } from "./WebSockets/SetupSocketListeners"
import { socket } from "./webSockets/socket"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp } from "lucide-react"

function SensorCard({ title, value, unit, details }) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <Card className="w-full mb-4">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </Button>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {value} {unit}
        </div>
        {isExpanded && (
          <div className="mt-2 text-sm text-muted-foreground">{details}</div>
        )}
      </CardContent>
    </Card>
  )
}

export default function App() {
  const [sensorData, setSensorData] = useState({
    encoder: 0,
    gyroscope: { x: 0, y: 0, z: 0 },
    milkQuantity: 0,
    tankTemperatures: 0,
    switchStatus: false,
    pressure: 0,
    pH: 7,
    conductivity: 0,
    turbidity: 0,
    dissolvedOxygen: 0
  })

  useEffect(() => {
    const cleanup = setupSocketListeners(
      socket,
      (data) => setSensorData(prevData => ({ ...prevData, ...data }))
    )
    return cleanup
  }, [])

  const sensorCards = [
    {
      title: "Tank Temperature",
      value: sensorData.tankTemperatures.toFixed(1),
      unit: "°C",
      details: "The current temperature of the milk tank. Optimal range: 2°C to 4°C."
    },
    {
      title: "Milk Quantity",
      value: sensorData.milkQuantity.toFixed(2),
      unit: "%",
      details: "The current fill level of the milk tank as a percentage of its total capacity."
    },
    {
      title: "Encoder",
      value: sensorData.encoder.toFixed(2),
      unit: "RPM",
      details: "The rotation speed of the tank's agitator in revolutions per minute."
    },
    {
      title: "Magnetic Switch",
      value: sensorData.switchStatus ? "Open" : "Closed",
      unit: "",
      details: "Indicates whether the tank's access hatch is open or closed."
    },
    {
      title: "Gyroscope",
      value: "X, Y, Z",
      unit: "°/s",
      details: `X: ${sensorData.gyroscope.x.toFixed(2)}°/s, Y: ${sensorData.gyroscope.y.toFixed(2)}°/s, Z: ${sensorData.gyroscope.z.toFixed(2)}°/s. Measures the tank's orientation and movement.`
    },
    {
      title: "Pressure",
      value: sensorData.pressure.toFixed(2),
      unit: "kPa",
      details: "The internal pressure of the milk tank. Important for maintaining milk quality."
    },
    {
      title: "pH Level",
      value: sensorData.pH.toFixed(2),
      unit: "",
      details: "The acidity or alkalinity of the milk. Optimal range: 6.6 to 6.8."
    },
    {
      title: "Conductivity",
      value: sensorData.conductivity.toFixed(2),
      unit: "μS/cm",
      details: "Electrical conductivity of the milk. Can indicate the presence of contaminants."
    },
    {
      title: "Turbidity",
      value: sensorData.turbidity.toFixed(2),
      unit: "NTU",
      details: "Measures the cloudiness of the milk. Higher values may indicate impurities."
    },
    {
      title: "Dissolved Oxygen",
      value: sensorData.dissolvedOxygen.toFixed(2),
      unit: "mg/L",
      details: "Amount of oxygen dissolved in the milk. Important for bacterial growth control."
    }
  ]

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-4xl font-bold text-center mb-8">Digital Twin - Milk Tank</h1>
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
          <div className="h-[60vh]">
            <Canvas>
              <ambientLight intensity={0.6} />
              <directionalLight position={[10, 10, 10]} intensity={1.5} castShadow />
              <directionalLight position={[-10, -10, -10]} intensity={0.5} />
              <Suspense fallback={null}>
                <HorizontalTankModel2Blades
                  milkQuantityData={sensorData.milkQuantity}
                  encoderData={sensorData.encoder}
                  gyroscopeData={sensorData.gyroscope}
                  switchStatus={sensorData.switchStatus}
                  tankTemperaturesData={sensorData.tankTemperatures}
                />
                <Plane
                  rotation={[-Math.PI / 2, 0, 0]}
                  position={[0, 0, 0]}
                  args={[10, 10]}
                  receiveShadow
                >
                  <meshStandardMaterial attach="material" color="gray" />
                </Plane>
                <OrbitControls
                  enablePan={false}
                  minDistance={4}
                  maxDistance={10}
                  maxPolarAngle={Math.PI / 1.2 / 2}
                />
              </Suspense>
            </Canvas>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {sensorCards.map((sensor, index) => (
            <SensorCard
              key={index}
              title={sensor.title}
              value={sensor.value}
              unit={sensor.unit}
              details={sensor.details}
            />
          ))}
        </div>
      </div>
    </div>
  )
}