import { Bookmark } from "lucide-react";
import { BookmarkColor } from "@/lib/types";
import { BOOKMARK_ORDER, bookmarkHslColor } from "@/lib/bookmark";
import { Button } from "@/components/ui/button";

interface Props {
  value: BookmarkColor;
  onChange: (next: BookmarkColor) => void;
}

export function BookmarkSelector({ value, onChange }: Props) {
  const cycle = () => {
    const idx = BOOKMARK_ORDER.indexOf(value);
    const next = BOOKMARK_ORDER[(idx + 1) % BOOKMARK_ORDER.length];
    onChange(next);
  };
  const filled = value !== "none";
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={cycle}
      aria-label="Cycle bookmark color"
      className="transition-colors duration-300"
    >
      <Bookmark
        className="h-5 w-5 transition-colors duration-300"
        style={{
          color: filled ? bookmarkHslColor(value) : "hsl(var(--muted-foreground))",
          fill: filled ? bookmarkHslColor(value) : "transparent",
        }}
      />
    </Button>
  );
}
