import { useState, useEffect } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { CalendarIcon, CalendarRange } from "lucide-react"
import { format, set, startOfDay, endOfDay, subDays, differenceInMonths } from "date-fns"
import { es } from "date-fns/locale"
import { cn } from "@/lib/utils"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const CustomDateRangePicker = ({ value, onChange }) => {
  // Ensure value is properly initialized
  const safeValue = value || { from: undefined, to: undefined }
  const [isOpen, setIsOpen] = useState(false)
  const [tempRange, setTempRange] = useState(safeValue)
  const [error, setError] = useState(null)
  const [timeMode, setTimeMode] = useState("fullDay") // "fullDay" or "custom"
  const [startTime, setStartTime] = useState({ hours: "00", minutes: "00" })
  const [endTime, setEndTime] = useState({ hours: "23", minutes: "59" })
  const [selectionMode, setSelectionMode] = useState("range") // "single" or "range"
  
  // Initialize with proper times when value changes
  useEffect(() => {
    // Make sure we have a valid value object
    const currentValue = value || { from: undefined, to: undefined }
    setTempRange(currentValue)

    if (currentValue.from) {
      // Extract time from existing values
      setStartTime({
        hours: format(currentValue.from, "HH"),
        minutes: format(currentValue.from, "mm"),
      })

      // Determine if it's a single date or range
      if (currentValue.to) {
        // Check if it's the same day (single date)
        if (format(currentValue.from, "yyyy-MM-dd") === format(currentValue.to, "yyyy-MM-dd")) {
          setSelectionMode("single")
        } else {
          setSelectionMode("range")
        }

        setEndTime({
          hours: format(currentValue.to, "HH"),
          minutes: format(currentValue.to, "mm"),
        })

        // Determine if it's full day or custom time
        const isFullDay = format(currentValue.from, "HH:mm") === "00:00" && format(currentValue.to, "HH:mm") === "23:59"
        setTimeMode(isFullDay ? "fullDay" : "custom")
      } else {
        setSelectionMode("single")
      }
    }
  }, [value])

  const handleSelect = (date) => {
    if (!date) {
      setTempRange({ from: undefined, to: undefined })
      setError(null)
      return
    }

    let updatedRange

    if (selectionMode === "single") {
      // For single date selection
      if (timeMode === "fullDay") {
        updatedRange = {
          from: startOfDay(date),
          to: set(endOfDay(date), { seconds: 0 }), // 23:59:00
        }
      } else {
        updatedRange = {
          from: set(date, {
            hours: Number.parseInt(startTime.hours),
            minutes: Number.parseInt(startTime.minutes),
            seconds: 0,
          }),
          to: set(date, {
            hours: Number.parseInt(endTime.hours),
            minutes: Number.parseInt(endTime.minutes),
            seconds: 0,
          }),
        }
      }
    } else {
      // For range selection
      if (!date.from || !date.to) {
        setTempRange(date || { from: undefined, to: undefined })
        setError(null)
        return
      }

      // Check if range is more than 3 months
      if (differenceInMonths(date.to, date.from) > 3) {
        setError("No se puede seleccionar un rango mayor a 3 meses")
        return
      }

      // Apply times based on mode
      if (timeMode === "fullDay") {
        updatedRange = {
          from: startOfDay(date.from),
          to: set(endOfDay(date.to), { seconds: 0 }), // 23:59:00
        }
      } else {
        updatedRange = {
          from: set(date.from, {
            hours: Number.parseInt(startTime.hours),
            minutes: Number.parseInt(startTime.minutes),
            seconds: 0,
          }),
          to: set(date.to, {
            hours: Number.parseInt(endTime.hours),
            minutes: Number.parseInt(endTime.minutes),
            seconds: 0,
          }),
        }
      }
    }

    setTempRange(updatedRange)
    setError(null)
  }

  // Update times when time mode changes
  useEffect(() => {
    if (tempRange && tempRange.from) {
      if (timeMode === "fullDay") {
        setStartTime({ hours: "00", minutes: "00" })
        setEndTime({ hours: "23", minutes: "59" })

        if (selectionMode === "single") {
          const updatedRange = {
            from: startOfDay(tempRange.from),
            to: set(endOfDay(tempRange.from), { seconds: 0 }), // 23:59:00
          }
          setTempRange(updatedRange)
        } else if (tempRange.to) {
          const updatedRange = {
            from: startOfDay(tempRange.from),
            to: set(endOfDay(tempRange.to), { seconds: 0 }), // 23:59:00
          }
          setTempRange(updatedRange)
        }
      } else {
        // Keep current times but update the range
        if (selectionMode === "single") {
          const updatedRange = {
            from: set(tempRange.from, {
              hours: Number.parseInt(startTime.hours),
              minutes: Number.parseInt(startTime.minutes),
              seconds: 0,
            }),
            to: set(tempRange.from, {
              hours: Number.parseInt(endTime.hours),
              minutes: Number.parseInt(endTime.minutes),
              seconds: 0,
            }),
          }
          setTempRange(updatedRange)
        } else if (tempRange.to) {
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
    }
  }, [timeMode])

  // Update range when times change
  useEffect(() => {
    if (timeMode === "custom" && tempRange && tempRange.from) {
      if (selectionMode === "single") {
        const updatedRange = {
          from: set(tempRange.from, {
            hours: Number.parseInt(startTime.hours),
            minutes: Number.parseInt(startTime.minutes),
            seconds: 0,
          }),
          to: set(tempRange.from, {
            hours: Number.parseInt(endTime.hours),
            minutes: Number.parseInt(endTime.minutes),
            seconds: 0,
          }),
        }
        setTempRange(updatedRange)
      } else if (tempRange.to) {
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
  }, [startTime, endTime])

  // Update when selection mode changes
  useEffect(() => {
    if (tempRange && tempRange.from) {
      if (selectionMode === "single") {
        // Convert range to single date
        const singleDate = {
          from: tempRange.from,
          to:
            timeMode === "fullDay"
              ? set(endOfDay(tempRange.from), { seconds: 0 })
              : set(tempRange.from, {
                  hours: Number.parseInt(endTime.hours),
                  minutes: Number.parseInt(endTime.minutes),
                  seconds: 0,
                }),
        }
        setTempRange(singleDate)
      }
      // No need to handle range mode as it will be handled by the calendar select
    }
  }, [selectionMode])

  const handleApply = () => {
    if (tempRange && tempRange.from) {
      onChange(tempRange)
      setIsOpen(false)
    }
  }

  const formatDateRange = (range) => {
    if (!range || !range.from) return "Seleccionar fecha y hora"

    if (
      selectionMode === "single" ||
      !range.to ||
      format(range.from, "d MMM yyyy") === format(range.to, "d MMM yyyy")
    ) {
      return format(range.from, "d MMM yyyy HH:mm", { locale: es })
    }

    return `${format(range.from, "d MMM yyyy HH:mm", { locale: es })} - ${format(range.to, "d MMM yyyy HH:mm", { locale: es })}`
  }

  const setToday = () => {
    const today = new Date()
    const rangeToSet =
      timeMode === "fullDay"
        ? {
            from: startOfDay(today),
            to:
              selectionMode === "single" ? set(endOfDay(today), { seconds: 0 }) : set(endOfDay(today), { seconds: 0 }),
          }
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
    if (selectionMode === "single") {
      setToday()
      return
    }

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
    if (selectionMode === "single") {
      setToday()
      return
    }

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
      <DialogContent className="sm:max-w-[650px] p-0 overflow-hidden">
        <DialogHeader className="px-4 py-3 border-b">
          <DialogTitle className="text-base font-medium">Seleccionar fecha y hora</DialogTitle>
        </DialogHeader>

        <div className="p-4">
          {/* Top controls */}
          <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
            <div className="flex items-center gap-2">
              <Button
                variant={selectionMode === "single" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectionMode("single")}
                className="h-8 px-3"
              >
                <CalendarIcon className="mr-1 h-3.5 w-3.5" />
                <span>Día único</span>
              </Button>
              <Button
                variant={selectionMode === "range" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectionMode("range")}
                className="h-8 px-3"
              >
                <CalendarRange className="mr-1 h-3.5 w-3.5" />
                <span>Rango</span>
              </Button>
            </div>

            <div className="flex items-center gap-2">
              {selectionMode === "single" ? (
                <Button variant="outline" size="sm" onClick={setToday} className="h-8 px-3">
                  Hoy
                </Button>
              ) : (
                <>
                  <Button variant="outline" size="sm" onClick={setLastWeek} className="h-8 px-3">
                    7 días
                  </Button>
                  <Button variant="outline" size="sm" onClick={setLastMonth} className="h-8 px-3">
                    30 días
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Calendar and time controls */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {/* Calendar - takes 3/5 of the space on desktop */}
            <div className="md:col-span-3 border rounded-md p-2 flex justify-center">
              <Calendar
                mode={selectionMode}
                selected={selectionMode === "single" ? tempRange?.from : tempRange}
                onSelect={handleSelect}
                numberOfMonths={1}
                disabled={(date) => date > new Date()}
                locale={es}
                className="mx-auto"
              />
            </div>

            {/* Time controls - takes 2/5 of the space on desktop */}
            <div className="md:col-span-2 space-y-3">
              {/* Selected range display */}
              {tempRange && tempRange.from && (
                <div className="text-sm border rounded-md p-2 bg-muted/20">
                  <div className="flex items-center justify-between mb-1">
                    <Badge variant="outline" className="bg-primary/10">
                      Desde
                    </Badge>
                    <span className="text-xs">{format(tempRange.from, "HH:mm", { locale: es })}</span>
                  </div>
                  <div className="font-medium">{format(tempRange.from, "d MMM yyyy", { locale: es })}</div>

                  {tempRange.to && format(tempRange.from, "yyyy-MM-dd") !== format(tempRange.to, "yyyy-MM-dd") && (
                    <>
                      <div className="flex items-center justify-between mb-1 mt-2">
                        <Badge variant="outline" className="bg-primary/10">
                          Hasta
                        </Badge>
                        <span className="text-xs">{format(tempRange.to, "HH:mm", { locale: es })}</span>
                      </div>
                      <div className="font-medium">{format(tempRange.to, "d MMM yyyy", { locale: es })}</div>
                    </>
                  )}
                </div>
              )}

              {/* Time mode selection */}
              <Tabs value={timeMode} onValueChange={setTimeMode} className="w-full">
                <TabsList className="grid w-full grid-cols-2 h-8">
                  <TabsTrigger value="fullDay" className="text-xs">
                    Días completos
                  </TabsTrigger>
                  <TabsTrigger value="custom" className="text-xs">
                    Personalizar
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="fullDay" className="pt-2">
                  <div className="text-xs text-muted-foreground">
                    {selectionMode === "single" ? "Día completo (00:00 - 23:59)" : "Días completos (00:00 - 23:59)"}
                  </div>
                </TabsContent>
                <TabsContent value="custom" className="pt-2">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label className="text-xs mb-1 block">Hora inicio</Label>
                      <div className="flex space-x-1 items-center">
                        <Select
                          value={startTime.hours}
                          onValueChange={(value) => setStartTime((prev) => ({ ...prev, hours: value }))}
                        >
                          <SelectTrigger className="w-[60px] h-7 text-xs">
                            <SelectValue placeholder="HH" />
                          </SelectTrigger>
                          <SelectContent>
                            <div className="overflow-y-auto max-h-[200px] pr-1">
                              {hourOptions.map((hour) => (
                                <SelectItem key={`start-hour-${hour}`} value={hour} className="text-xs">
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
                          <SelectTrigger className="w-[60px] h-7 text-xs">
                            <SelectValue placeholder="MM" />
                          </SelectTrigger>
                          <SelectContent>
                            <div className="overflow-y-auto max-h-[200px] pr-1">
                              {minuteOptions.map((minute) => (
                                <SelectItem key={`start-min-${minute}`} value={minute} className="text-xs">
                                  {minute}
                                </SelectItem>
                              ))}
                            </div>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs mb-1 block">Hora fin</Label>
                      <div className="flex space-x-1 items-center">
                        <Select
                          value={endTime.hours}
                          onValueChange={(value) => setEndTime((prev) => ({ ...prev, hours: value }))}
                        >
                          <SelectTrigger className="w-[60px] h-7 text-xs">
                            <SelectValue placeholder="HH" />
                          </SelectTrigger>
                          <SelectContent>
                            <div className="overflow-y-auto max-h-[200px] pr-1">
                              {hourOptions.map((hour) => (
                                <SelectItem key={`end-hour-${hour}`} value={hour} className="text-xs">
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
                          <SelectTrigger className="w-[60px] h-7 text-xs">
                            <SelectValue placeholder="MM" />
                          </SelectTrigger>
                          <SelectContent>
                            <div className="overflow-y-auto max-h-[200px] pr-1">
                              {minuteOptions.map((minute) => (
                                <SelectItem key={`end-min-${minute}`} value={minute} className="text-xs">
                                  {minute}
                                </SelectItem>
                              ))}
                            </div>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              {/* Error message */}
              {error && (
                <div className="text-destructive text-xs p-1.5 border border-destructive/20 rounded-md bg-destructive/10">
                  {error}
                </div>
              )}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex justify-end space-x-2 pt-4 mt-4 border-t">
            <Button variant="outline" size="sm" onClick={() => setIsOpen(false)}>
              Cancelar
            </Button>
            <Button size="sm" onClick={handleApply} disabled={!tempRange || !tempRange.from || !!error}>
              Aplicar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default CustomDateRangePicker

