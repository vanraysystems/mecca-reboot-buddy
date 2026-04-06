import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface GuestCounterProps {
  label: string;
  value: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
}

const GuestCounter = ({ label, value, min = 0, max = 20, onChange }: GuestCounterProps) => {
  return (
    <div className="flex flex-col items-center gap-3">
      <span className="text-sm font-sans text-muted-foreground uppercase tracking-wide">{label}</span>
      <div className="flex items-center gap-4">
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="rounded-full h-10 w-10 border-border"
          disabled={value <= min}
          onClick={() => onChange(Math.max(min, value - 1))}
        >
          <Minus className="h-4 w-4" />
        </Button>
        <span className="text-4xl font-serif font-bold min-w-[3rem] text-center">{value}</span>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="rounded-full h-10 w-10 border-border"
          disabled={value >= max}
          onClick={() => onChange(Math.min(max, value + 1))}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default GuestCounter;
