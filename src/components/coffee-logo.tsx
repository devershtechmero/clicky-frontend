import { Eye } from "lucide-react";

export function CoffeeLogo({ size = 22 }: { size?: number }) {
  return (
    <div className="flex items-center gap-2">
      {/* <div
        className="flex items-center justify-center rounded-lg bg-primary/10 text-primary"
        style={{ width: size + 14, height: size + 14 }}
      >
        <Eye size={size} />
      </div> */}
      <span className="text-lg font-semibold tracking-tight text-primary">
        Watcher
      </span>
    </div>
  );
}
