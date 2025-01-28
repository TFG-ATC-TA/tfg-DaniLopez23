import { Slider } from "@/components/ui/slider"
import { format, differenceInDays } from "date-fns"

export default function DateSlider({ startDate, endDate, currentDay, onChange }) {
  const totalDays = Math.max(differenceInDays(endDate, startDate), 0)

  const formatDate = (date) => format(date, "d MMM yyyy")

  return (
    <div className="w-full">
      <Slider
        min={0}
        max={totalDays}
        step={1}
        value={[Math.min(currentDay, totalDays)]}
        onValueChange={(value) => onChange(value[0])}
        className="w-full h-2 bg-gray-200"
      />
      <div className="mt-2 flex justify-between text-sm text-gray-500">
        <span>{formatDate(startDate)}</span>
        <span>{formatDate(endDate)}</span>
      </div>
    </div>
  )
}
