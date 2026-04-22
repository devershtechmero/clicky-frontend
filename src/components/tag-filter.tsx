import { BookmarkColor } from "@/lib/types";
import { cn } from "@/lib/utils";

interface Props {
  value: BookmarkColor | "all";
  onChange: (v: BookmarkColor | "all") => void;
}

const OPTIONS: { value: BookmarkColor | "all"; label: string; dotClass?: string }[] = [
  { value: "all", label: "All" },
  { value: "yellow", label: "Yellow", dotClass: "bg-bookmark-yellow" },
  { value: "red", label: "Red", dotClass: "bg-bookmark-red" },
  { value: "green", label: "Green", dotClass: "bg-bookmark-green" },
  { value: "blue", label: "Blue", dotClass: "bg-bookmark-blue" },
];

const ACTIVE_BG: Record<string, string> = {
  all: "bg-primary text-primary-foreground border-primary",
  yellow: "bg-bookmark-yellow text-foreground border-bookmark-yellow",
  red: "bg-bookmark-red text-white border-bookmark-red",
  green: "bg-bookmark-green text-white border-bookmark-green",
  blue: "bg-bookmark-blue text-white border-bookmark-blue",
};

export function TagFilter({ value, onChange }: Props) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {OPTIONS.map((o) => {
        const active = value === o.value;
        return (
          <button
            key={o.value}
            onClick={() => onChange(o.value)}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-foreground transition-colors hover:bg-muted",
              active && ACTIVE_BG[o.value]
            )}
          >
            {o.dotClass && <span className={cn("h-2 w-2 rounded-full", o.dotClass)} />}
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
