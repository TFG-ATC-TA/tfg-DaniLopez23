import { Slider } from "@/components/ui/slider";
import { format } from "date-fns";

export default function TimeSlider({ value, onChange, marks, min, max }) {
  const MINUTES_STEP = 30;

  const formatTime = (minutes) => {
    const date = new Date();
    date.setHours(Math.floor(minutes / 60), minutes % 60);
    return format(date, "HH:mm");
  };

  return (
    <div className="relative w-full">
      <div className="relative pt-2 w-full">
        <Slider
          min={min}
          max={max}
          step={MINUTES_STEP}
          value={[Math.min(Math.max(value, min), max)]}
          onValueChange={(newValue) => {
            const clampedValue = Math.min(Math.max(newValue[0], min), max);
            onChange(clampedValue);
          }}
          className="w-full h-2 bg-gray-200"
        />
        <div className="absolute top-[-12px] left-0 right-0">
          {marks
            .filter((mark) => mark.value >= min && mark.value <= max)
            .map((mark, index) => (
              <div
                key={index}
                className="absolute w-2 h-2 bg-blue-500 rounded-full cursor-pointer"
                style={{
                  left: `${((mark.value - min) / (max - min)) * 100}%`,
                  transform: "translateX(-50%)",
                }}
                title={mark.label}
                onClick={() => onChange(mark.value)}
              />
            ))}
        </div>
      </div>
      <div className="mt-2 flex justify-between text-sm text-gray-500">
        <span>{formatTime(min)}</span>
        <span>{formatTime(max)}</span>
      </div>
    </div>
  );
}
