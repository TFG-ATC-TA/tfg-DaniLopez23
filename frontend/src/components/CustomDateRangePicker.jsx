"use client"

import { useState, useEffect } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { CalendarIcon, Clock } from "lucide-react"
import { format, set, startOfDay, endOfDay, subDays, differenceInMonths } from "date-fns"
import { es } from "date-fns/locale"
import { cn } from "@/lib/utils"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"

const CustomDateRangePicker = ({ value, onChange }) => {
  // Ensure value is properly initialized
  const safeValue = value || { from: undefined, to: undefined }

  const [isOpen, setIsOpen] = useState(false)
  const [tempRange, setTempRange] = useState(safeValue)
  const [error, setError] = useState(null)
  const [timeMode, setTimeMode] = useState("fullDay") // "fullDay" or "custom"
  const [startTime, setStartTime] = useState({ hours: "00", minutes: "00" })
  const [endTime, setEndTime] = useState({ hours: "23", minutes: "59" })

  // Initialize with proper times when value changes
  useEffect(() => {
    // Make sure we have a valid value object
    const currentValue = value || { from: undefined, to: undefined }
    setTempRange(currentValue)

    if (currentValue.from && currentValue.to) {
      // Extract time from existing values
      setStartTime({
        hours: format(currentValue.from, "HH"),
        minutes: format(currentValue.from, "mm"),
      })

      setEndTime({
        hours: format(currentValue.to, "HH"),
        minutes: format(currentValue.to, "mm"),
      })

      // Determine if it's full day or custom time
      const isFullDay = format(currentValue.from, "HH:mm") === "00:00" && format(currentValue.to, "HH:mm") === "23:59"

      setTimeMode(isFullDay ? "fullDay" : "custom")
    }
  }, [value])

  const handleSelect = (range) => {
    if (!range || !range.from || !range.to) {
      setTempRange(range || { from: undefined, to: undefined })
      setError(null)
      return
    }

    // Check if range is more than 3 months
    if (differenceInMonths(range.to, range.from) > 3) {
      setError("No se puede seleccionar un rango mayor a 3 meses")
      return
    }

    // Apply times based on mode
    let updatedRange
    if (timeMode === "fullDay") {
      updatedRange = {
        from: startOfDay(range.from),
        to: set(endOfDay(range.to), { seconds: 0 }), // 23:59:00
      }
    } else {
      updatedRange = {
        from: set(range.from, {
          hours: Number.parseInt(startTime.hours),
          minutes: Number.parseInt(startTime.minutes),
          seconds: 0,
        }),
        to: set(range.to, {
          hours: Number.parseInt(endTime.hours),
          minutes: Number.parseInt(endTime.minutes),
          seconds: 0,
        }),
      }
    }

    setTempRange(updatedRange)
    setError(null)
  }

  // Update times when time mode changes
  useEffect(() => {
    if (tempRange && tempRange.from && tempRange.to) {
      if (timeMode === "fullDay") {
        setStartTime({ hours: "00", minutes: "00" })
        setEndTime({ hours: "23", minutes: "59" })

        const updatedRange = {
          from: startOfDay(tempRange.from),
          to: set(endOfDay(tempRange.to), { seconds: 0 }), // 23:59:00
        }
        setTempRange(updatedRange)
      } else {
        // Keep current times but update the range
        const updatedRange = {
          from: set(tempRange.from, {
            hours: Number.parseInt(startTime.hours),
            minutes: Number.parseInt(startTime.minutes),
            seconds: 0,
          }),
          to: set(tempRange.to, {
            hours: Number.parseInt(endTime.hours),
            minutes: Number.parseInt(endTime.minutes),
            seconds: 0,
          }),
        }
        setTempRange(updatedRange)
      }
    }
  }, [timeMode])

  // Update range when times change
  useEffect(() => {
    if (timeMode === "custom" && tempRange && tempRange.from && tempRange.to) {
      const updatedRange = {
        from: set(tempRange.from, {
          hours: Number.parseInt(startTime.hours),
          minutes: Number.parseInt(startTime.minutes),
          seconds: 0,
        }),
        to: set(tempRange.to, {
          hours: Number.parseInt(endTime.hours),
          minutes: Number.parseInt(endTime.minutes),
          seconds: 0,
        }),
      }
      setTempRange(updatedRange)
    }
  }, [startTime, endTime])

  const handleApply = () => {
    if (tempRange && tempRange.from && tempRange.to) {
      onChange(tempRange)
      setIsOpen(false)
    }
  }

  const formatDateRange = (range) => {
    if (range && range.from && range.to) {
      return `${format(range.from, "d MMM yyyy HH:mm", { locale: es })} - ${format(range.to, "d MMM yyyy HH:mm", { locale: es })}`
    }
    return "Seleccionar rango de fecha y hora"
  }

  const setToday = () => {
    const today = new Date()
    const rangeToSet =
      timeMode === "fullDay"
        ? { from: startOfDay(today), to: set(endOfDay(today), { seconds: 0 }) }
        : {
            from: set(today, {
              hours: Number.parseInt(startTime.hours),
              minutes: Number.parseInt(startTime.minutes),
              seconds: 0,
            }),
            to: set(today, {
              hours: Number.parseInt(endTime.hours),
              minutes: Number.parseInt(endTime.minutes),
              seconds: 0,
            }),
          }

    setTempRange(rangeToSet)
    setError(null)
  }

  const setLastWeek = () => {
    const today = new Date()
    const weekAgo = subDays(today, 7)

    const rangeToSet =
      timeMode === "fullDay"
        ? { from: startOfDay(weekAgo), to: set(endOfDay(today), { seconds: 0 }) }
        : {
            from: set(weekAgo, {
              hours: Number.parseInt(startTime.hours),
              minutes: Number.parseInt(startTime.minutes),
              seconds: 0,
            }),
            to: set(today, {
              hours: Number.parseInt(endTime.hours),
              minutes: Number.parseInt(endTime.minutes),
              seconds: 0,
            }),
          }

    setTempRange(rangeToSet)
    setError(null)
  }

  const setLastMonth = () => {
    const today = new Date()
    const monthAgo = subDays(today, 30)

    const rangeToSet =
      timeMode === "fullDay"
        ? { from: startOfDay(monthAgo), to: set(endOfDay(today), { seconds: 0 }) }
        : {
            from: set(monthAgo, {
              hours: Number.parseInt(startTime.hours),
              minutes: Number.parseInt(startTime.minutes),
              seconds: 0,
            }),
            to: set(today, {
              hours: Number.parseInt(endTime.hours),
              minutes: Number.parseInt(endTime.minutes),
              seconds: 0,
            }),
          }

    setTempRange(rangeToSet)
    setError(null)
  }

  // Generate time options
  const hourOptions = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, "0"))
  const minuteOptions = ["00", "15", "30", "45", "59"]

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal border-input",
            !safeValue.from && "text-muted-foreground",
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4 text-primary" />
          <span className="truncate">{formatDateRange(safeValue)}</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-4 border-b">
          <DialogTitle className="text-xl font-semibold">Seleccionar rango de fecha y hora</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col md:flex-row p-6 gap-6">
          <div className="space-y-4 md:w-1/4">
            <div>
              <h3 className="font-medium mb-3">Selección rápida</h3>
              <div className="flex flex-col gap-2">
                <Button variant="outline" size="sm" className="justify-start" onClick={setToday}>
                  Hoy
                </Button>
                <Button variant="outline" size="sm" className="justify-start" onClick={setLastWeek}>
                  Últimos 7 días
                </Button>
                <Button variant="outline" size="sm" className="justify-start" onClick={setLastMonth}>
                  Últimos 30 días
                </Button>
              </div>
            </div>

            {tempRange && tempRange.from && tempRange.to && (
              <div className="pt-4 border-t">
                <h3 className="font-medium mb-2">Rango seleccionado</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-primary/10">
                      Desde
                    </Badge>
                    <span>{format(tempRange.from, "d MMM yyyy HH:mm", { locale: es })}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-primary/10">
                      Hasta
                    </Badge>
                    <span>{format(tempRange.to, "d MMM yyyy HH:mm", { locale: es })}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6 md:w-3/4">
            <div className="space-y-4">
              <h3 className="font-medium">Seleccionar fechas</h3>
              <div className="border rounded-lg p-4">
                <Calendar
                  mode="range"
                  selected={tempRange}
                  onSelect={handleSelect}
                  numberOfMonths={2}
                  disabled={(date) => date > new Date()}
                  locale={es}
                  className="mx-auto"
                />
              </div>

              {error && <div className="text-destructive text-sm mt-2">{error}</div>}
            </div>

            <div className="space-y-4">
              <h3 className="font-medium">Configuración de hora</h3>

              <Tabs value={timeMode} onValueChange={setTimeMode} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="fullDay">Días completos</TabsTrigger>
                  <TabsTrigger value="custom">Personalizar horas</TabsTrigger>
                </TabsList>
                <TabsContent value="fullDay" className="pt-2">
                  <Card>
                    <CardContent className="pt-4 text-sm text-muted-foreground">
                      Se seleccionarán días completos (desde 00:00 hasta 23:59)
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="custom" className="pt-2">
                  <Card>
                    <CardContent className="pt-4">
                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label className="text-sm">Hora de inicio</Label>
                          <div className="flex space-x-2 items-center">
                            <Select
                              value={startTime.hours}
                              onValueChange={(value) => setStartTime((prev) => ({ ...prev, hours: value }))}
                            >
                              <SelectTrigger className="w-[80px]">
                                <SelectValue placeholder="HH" />
                              </SelectTrigger>
                              <SelectContent>
                                <div className="overflow-y-auto max-h-[200px] pr-1">
                                  {hourOptions.map((hour) => (
                                    <SelectItem key={`start-hour-${hour}`} value={hour}>
                                      {hour}
                                    </SelectItem>
                                  ))}
                                </div>
                              </SelectContent>
                            </Select>
                            <span>:</span>
                            <Select
                              value={startTime.minutes}
                              onValueChange={(value) => setStartTime((prev) => ({ ...prev, minutes: value }))}
                            >
                              <SelectTrigger className="w-[80px]">
                                <SelectValue placeholder="MM" />
                              </SelectTrigger>
                              <SelectContent>
                                <div className="overflow-y-auto max-h-[200px] pr-1">
                                  {minuteOptions.map((minute) => (
                                    <SelectItem key={`start-min-${minute}`} value={minute}>
                                      {minute}
                                    </SelectItem>
                                  ))}
                                </div>
                              </SelectContent>
                            </Select>
                            <Clock className="h-4 w-4 text-muted-foreground ml-1" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm">Hora de fin</Label>
                          <div className="flex space-x-2 items-center">
                            <Select
                              value={endTime.hours}
                              onValueChange={(value) => setEndTime((prev) => ({ ...prev, hours: value }))}
                            >
                              <SelectTrigger className="w-[80px]">
                                <SelectValue placeholder="HH" />
                              </SelectTrigger>
                              <SelectContent>
                                <div className="overflow-y-auto max-h-[200px] pr-1">
                                  {hourOptions.map((hour) => (
                                    <SelectItem key={`end-hour-${hour}`} value={hour}>
                                      {hour}
                                    </SelectItem>
                                  ))}
                                </div>
                              </SelectContent>
                            </Select>
                            <span>:</span>
                            <Select
                              value={endTime.minutes}
                              onValueChange={(value) => setEndTime((prev) => ({ ...prev, minutes: value }))}
                            >
                              <SelectTrigger className="w-[80px]">
                                <SelectValue placeholder="MM" />
                              </SelectTrigger>
                              <SelectContent>
                                <div className="overflow-y-auto max-h-[200px] pr-1">
                                  {minuteOptions.map((minute) => (
                                    <SelectItem key={`end-min-${minute}`} value={minute}>
                                      {minute}
                                    </SelectItem>
                                  ))}
                                </div>
                              </SelectContent>
                            </Select>
                            <Clock className="h-4 w-4 text-muted-foreground ml-1" />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            <div className="flex justify-end space-x-2 pt-4 border-t">
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleApply} disabled={!tempRange || !tempRange.from || !tempRange.to || !!error}>
                Aplicar
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default CustomDateRangePicker

