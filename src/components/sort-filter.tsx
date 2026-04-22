import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ArrowDownUp } from "lucide-react";

export type SortKey = "visitors-desc" | "visitors-asc";

interface Props {
  value: SortKey;
  onChange: (v: SortKey) => void;
}

const LABELS: Record<SortKey, string> = {
  "visitors-desc": "Visitors: High to Low",
  "visitors-asc": "Visitors: Low to High",
};

export function SortFilter({ value, onChange }: Props) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2">
          <ArrowDownUp className="h-4 w-4" />
          {LABELS[value]}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onChange("visitors-desc")}>
          Visitors: High to Low
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onChange("visitors-asc")}>
          Visitors: Low to High
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
