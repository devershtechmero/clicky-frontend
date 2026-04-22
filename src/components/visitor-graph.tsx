import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { DailyVisitors } from "@/lib/types";

interface Props {
  data: DailyVisitors[];
  color: string;
  gradientId: string;
}

export function VisitorGraph({ data, color, gradientId }: Props) {
  const formatDateTick = (value: string) =>
    new Date(value).toLocaleDateString(undefined, { month: "short", day: "numeric" });

  const formatVisitorTick = (value: number) => value.toLocaleString();

  return (
    <ResponsiveContainer width="100%" height={180}>
      <AreaChart data={data} margin={{ top: 6, right: 8, left: 4, bottom: 0 }}>
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.35} />
            <stop offset="100%" stopColor={color} stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <XAxis
          dataKey="date"
          tickFormatter={formatDateTick}
          minTickGap={24}
          tickLine
          axisLine
          tick={{ fontSize: 11 }}
          stroke="hsl(var(--muted-foreground))"
        />
        <YAxis
          domain={["dataMin", "dataMax"]}
          tickFormatter={formatVisitorTick}
          width={52}
          tickLine
          axisLine
          tick={{ fontSize: 11 }}
          stroke="hsl(var(--muted-foreground))"
        />
        <Tooltip
          cursor={{ stroke: color, strokeOpacity: 0.3 }}
          contentStyle={{
            background: "hsl(var(--popover))",
            border: "1px solid hsl(var(--border))",
            borderRadius: 10,
            color: "hsl(var(--popover-foreground))",
            fontSize: 12,
            padding: "8px 10px",
          }}
          labelFormatter={(l) => formatDateTick(l as string)}
          formatter={(v: number) => [`${v.toLocaleString()} visitors`, ""]}
        />
        <Area
          type="monotone"
          dataKey="visitors"
          stroke={color}
          strokeWidth={2}
          fill={`url(#${gradientId})`}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
