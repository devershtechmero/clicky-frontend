import { Bookmark, CircleSlash } from "lucide-react";
import { BookmarkColor } from "@/lib/types";
import { BOOKMARK_OPTIONS, bookmarkHslColor } from "@/lib/bookmark";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Props {
  value: BookmarkColor;
  onChange: (next: BookmarkColor) => void;
  pending?: boolean;
}

export function BookmarkSelector({ value, onChange, pending }: Props) {
  return (
    <div className="flex shrink-0 items-center gap-2">
      <div
        className={cn(
          "flex items-center rounded-md border border-border bg-muted/40 p-0.5 transition-colors",
          pending && "border-primary/30 bg-primary/5",
        )}
      >
        {BOOKMARK_OPTIONS.map((option) => {
          const active = value === option.value;
          const filled = option.value !== "none";
          const iconColor = filled ? bookmarkHslColor(option.value) : "hsl(var(--muted-foreground))";

          return (
            <Button
              key={option.value}
              type="button"
              variant="ghost"
              size="icon"
              title={`${option.label} bookmark`}
              aria-label={`Set bookmark to ${option.label}`}
              aria-pressed={active}
              onClick={() => {
                if (!active && !pending) onChange(option.value);
              }}
              className={cn(
                "h-7 w-7 rounded-sm transition-colors",
                active && "bg-background shadow-sm hover:bg-background",
                pending && !active && "opacity-60",
              )}
            >
              {filled ? (
                <Bookmark
                  className="h-4 w-4 transition-colors"
                  style={{
                    color: iconColor,
                    fill: active ? iconColor : "transparent",
                  }}
                />
              ) : (
                <CircleSlash className="h-4 w-4 text-muted-foreground" />
              )}
            </Button>
          );
        })}
      </div>
      <span
        aria-live="polite"
        className={cn(
          "min-w-10 text-[11px] font-medium text-muted-foreground transition-opacity",
          pending ? "opacity-100" : "opacity-0",
        )}
      >
        Saving
      </span>
    </div>
  );
}
