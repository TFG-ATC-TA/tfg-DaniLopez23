'use client';

import { format, eachDayOfInterval } from "date-fns";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function DateSelector({ startDate, endDate, currentDay, onChange }) {
  const days = eachDayOfInterval({ start: startDate, end: endDate });

  const formatDate = (date) => format(date, "d MMM yyyy");

  return (
    <Select value={currentDay.toString()} onValueChange={(value) => onChange(parseInt(value, 10))}>
      <SelectTrigger className="w-full bg-white border-gray-300 rounded-md shadow-sm">
        <SelectValue placeholder="Select a date" />
      </SelectTrigger>
      <SelectContent>
        {days.map((day, index) => (
          <SelectItem key={index} value={index.toString()}>
            {formatDate(day)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}