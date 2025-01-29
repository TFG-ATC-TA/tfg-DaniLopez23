import { Slider } from "@/components/ui/slider";
import { format, differenceInCalendarDays } from "date-fns";

export default function DateSlider({ startDate, endDate, currentDay, onChange }) {
  const totalDays = differenceInCalendarDays(endDate, startDate);

  const formatDate = (date) => format(date, "d MMM yyyy");

  const value = [Math.min(Math.max(currentDay, 0), totalDays)]

  return (
    <div className="w-full">
      <Slider
        min={0}
        max={totalDays}
        step={1}
        value={value}
        onValueChange={(value) => onChange(value[0])}
        className="w-full h-2 bg-gray-200"
      />
      <div className="mt-2 flex justify-between text-sm text-gray-500">
        <span>{formatDate(startDate)}</span>
        <span>{formatDate(endDate)}</span>
      </div>
    </div>
  );
}
