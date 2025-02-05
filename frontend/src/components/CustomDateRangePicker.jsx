import { useState } from 'react';
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { CalendarIcon } from 'lucide-react';
import { format, set, startOfWeek, endOfWeek, startOfMonth, endOfMonth, subMonths } from "date-fns";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const    CustomDateRangePicker = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [tempRange, setTempRange] = useState(value);
  const [startTime, setStartTime] = useState({ hours: "00", minutes: "00" });
  const [endTime, setEndTime] = useState({ hours: "00", minutes: "00" });

  const handleSelect = (range) => {
    if (range) {
      setTempRange(range);
    }
  };

  const handleApply = () => {
    const newRange = {
      from: tempRange.from ? set(tempRange.from, { hours: parseInt(startTime.hours), minutes: parseInt(startTime.minutes) }) : undefined,
      to: tempRange.to ? set(tempRange.to, { hours: parseInt(endTime.hours), minutes: parseInt(endTime.minutes) }) : undefined
    };
    onChange(newRange);
    setIsOpen(false);
  };

  const formatDateRange = (range) => {
    if (range && range.from && range.to) {
      return `${format(range.from, "d MMM yyyy HH:mm")} - ${format(range.to, "d MMM yyyy HH:mm")}`;
    }
    return "Seleccionar rango de fecha y hora";
  };

  const setQuickRange = (start, end) => {
    setTempRange({ from: start, to: end });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !value && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {formatDateRange(value)}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[750px]">
        <DialogHeader>
          <DialogTitle>Seleccionar rango de fecha y hora</DialogTitle>
        </DialogHeader>
        <div className="flex p-3 gap-4">
          <div className="space-y-2">
            <Label>Selección rápida</Label>
            <div className="flex flex-col gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setQuickRange(startOfWeek(new Date()), endOfWeek(new Date()))}
              >
                Esta semana
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setQuickRange(startOfMonth(new Date()), endOfMonth(new Date()))}
              >
                Este mes
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const prevMonth = subMonths(new Date(), 1);
                  setQuickRange(startOfMonth(prevMonth), endOfMonth(prevMonth));
                }}
              >
                Mes anterior
              </Button>
            </div>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Rango de fechas</Label>
              <Calendar
                mode="range"
                selected={tempRange}
                onSelect={handleSelect}
                numberOfMonths={2}
                disabled={(date) => date > new Date()}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Hora de inicio</Label>
                <div className="flex space-x-2">
                  <Select
                    value={startTime.hours}
                    onValueChange={(value) => setStartTime(prev => ({ ...prev, hours: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="HH" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0')).map((hour) => (
                        <SelectItem key={hour} value={hour}>{hour}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select
                    value={startTime.minutes}
                    onValueChange={(value) => setStartTime(prev => ({ ...prev, minutes: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="MM" />
                    </SelectTrigger>
                    <SelectContent>
                      {['00', '30'].map((minute) => (
                        <SelectItem key={minute} value={minute}>{minute}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Hora de fin</Label>
                <div className="flex space-x-2">
                  <Select
                    value={endTime.hours}
                    onValueChange={(value) => setEndTime(prev => ({ ...prev, hours: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="HH" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0')).map((hour) => (
                        <SelectItem key={hour} value={hour}>{hour}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select
                    value={endTime.minutes}
                    onValueChange={(value) => setEndTime(prev => ({ ...prev, minutes: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="MM" />
                    </SelectTrigger>
                    <SelectContent>
                      {['00', '30'].map((minute) => (
                        <SelectItem key={minute} value={minute}>{minute}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsOpen(false)}>Cancelar</Button>
              <Button onClick={handleApply}>Aplicar</Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CustomDateRangePicker;