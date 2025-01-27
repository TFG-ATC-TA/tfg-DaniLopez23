import { Slider } from "@/components/ui/slider"
import { format } from "date-fns"

export default function TimeSlider({ value, onChange, marks, minTime, maxTime }) {
  const MINUTES_STEP = 15
  const minMinutes = minTime?.getHours() * 60 + minTime?.getMinutes() || 0
  const maxMinutes = maxTime?.getHours() * 60 + maxTime?.getMinutes() || 23 * 60 + 59

  const formatTime = (minutes) => {
    const date = new Date()
    date.setHours(Math.floor(minutes / 60), minutes % 60)
    return format(date, "HH:mm")
  }

  return (
    <div className="relative pt-6 pb-2">
      <div className="absolute top-0 left-0 right-0 h-6">
        {marks.map((mark, index) => (
          <div
            key={index}
            className="absolute w-2 h-6 bg-blue-500 rounded-full cursor-pointer"
            style={{
              left: `${((mark.value - minMinutes) / (maxMinutes - minMinutes)) * 100}%`,
              transform: "translateX(-50%)",
            }}
            title={mark.label}
            onClick={() => onChange(mark.value)}
          />
        ))}
      </div>
      <Slider
        min={minMinutes}
        max={maxMinutes}
        step={MINUTES_STEP}
        value={[Math.min(Math.max(value, minMinutes), maxMinutes)]}
        onValueChange={(newValue) => onChange(newValue[0])}
        className="w-full"
      />
      <div className="mt-2 flex justify-between text-sm text-gray-500">
        <span>{formatTime(minMinutes)}</span>
        <span>{formatTime(maxMinutes)}</span>
      </div>
    </div>
  )
}