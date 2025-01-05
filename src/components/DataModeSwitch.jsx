import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

const DataModeSwitch = ({ isRealTime, onToggle }) => {
  return (
    <div className="flex items-center bg-secondary rounded-full p-1">
      <button
        className={cn(
          "px-3 py-1 rounded-full text-sm font-medium transition-colors",
          isRealTime
            ? "bg-primary text-primary-foreground"
            : "text-secondary-foreground"
        )}
        onClick={() => onToggle(true)}
      >
        Real Time
      </button>
      <Switch
        checked={!isRealTime}
        onCheckedChange={(checked) => onToggle(!checked)}
        className="mx-2"
      />
      <button
        className={cn(
          "px-3 py-1 rounded-full text-sm font-medium transition-colors",
          !isRealTime
            ? "bg-primary text-primary-foreground"
            : "text-secondary-foreground"
        )}
        onClick={() => onToggle(false)}
      >
        Historical Data
      </button>
    </div>
  );
};

export default DataModeSwitch;