import { BookmarkColor } from "@/lib/types";

export const BOOKMARK_ORDER: BookmarkColor[] = ["none", "yellow", "red", "green", "blue"];

export const BOOKMARK_HSL: Record<BookmarkColor, string> = {
  none: "var(--muted-foreground)",
  yellow: "var(--bm-yellow)",
  red: "var(--bm-red)",
  green: "var(--bm-green)",
  blue: "var(--bm-blue)",
};

export function bookmarkHslColor(c: BookmarkColor) {
  return `hsl(${BOOKMARK_HSL[c]})`;
}

export function bookmarkBgClass(c: BookmarkColor) {
  switch (c) {
    case "yellow": return "bg-bookmark-yellow text-foreground";
    case "red": return "bg-bookmark-red text-white";
    case "green": return "bg-bookmark-green text-white";
    case "blue": return "bg-bookmark-blue text-white";
    default: return "bg-muted text-foreground";
  }
}
