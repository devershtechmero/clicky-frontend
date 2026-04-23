import { Globe, Link, TrendingDown, TrendingUp } from "lucide-react";
import { Site } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { BookmarkSelector } from "./bookmark-selector";
import { VisitorGraph } from "./visitor-graph";
import { bookmarkHslColor } from "@/lib/bookmark";
import { useUpdateBookmark } from "@/hooks/use-sites";

interface Props {
  site: Site;
  onlineOverride?: number;
  index: number;
}

function sumLast(arr: { visitors: number }[], n: number) {
  return arr.slice(-n).reduce((a, b) => a + b.visitors, 0);
}

function sumVisitors(arr: { visitors: number }[]) {
  return arr.reduce((sum, item) => sum + item.visitors, 0);
}

export function SiteCard({ site, onlineOverride, index }: Props) {
  const updateBookmark = useUpdateBookmark();

  const last30Data = site.dailyData.slice(-30);
  const todayVisitors = site.dailyData[site.dailyData.length - 1]?.visitors ?? 0;
  const last7 = sumLast(site.dailyData, 7);
  const last30 = sumVisitors(last30Data);
  const midPoint = Math.floor(last30Data.length / 2);
  const previousPeriodVisitors = sumVisitors(last30Data.slice(0, midPoint));
  const recentPeriodVisitors = sumVisitors(last30Data.slice(midPoint));
  const trend =
    previousPeriodVisitors > 0
      ? ((recentPeriodVisitors - previousPeriodVisitors) / previousPeriodVisitors) * 100
      : 0;
  const trendUp = trend >= 0;

  const graphColor =
    site.bookmarkColor === "none"
      ? "hsl(var(--primary))"
      : bookmarkHslColor(site.bookmarkColor);

  const online = onlineOverride ?? site.onlineNow;
  const clickyUrl = `https://clicky.com/?site_id=${encodeURIComponent(site.siteId)}&sitekey=${encodeURIComponent(site.siteKey)}`;

  return (
    <Card
      className="p-4 animate-fade-up hover:shadow-md transition-shadow"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {/* Top row */}
      <div className="flex items-center gap-3">
        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-muted">
          <Globe className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="min-w-0 flex-1">
          <a
            href={clickyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex max-w-full items-center gap-1 truncate text-sm font-semibold text-foreground hover:underline"
          >
            <span className="truncate">{site.name}</span>
            <Link className="h-3 w-3 shrink-0" />
          </a>
          <div className="truncate text-xs text-muted-foreground">{site.url}</div>
        </div>
        <BookmarkSelector
          value={site.bookmarkColor}
          onChange={(c) => updateBookmark.mutate({ id: site.id, color: c })}
        />
        <div className="flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 text-xs font-medium">
          <span className="relative inline-flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full rounded-full bg-bookmark-green opacity-60 pulse-dot" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-bookmark-green" />
          </span>
          {online} online
        </div>
      </div>

      {/* Bottom section */}
      <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-12">
        <div className="grid grid-cols-3 gap-4 sm:gap-6 lg:col-span-3 lg:grid-cols-1 lg:gap-3">
          <div>
            <div className="text-[11px] uppercase tracking-wide text-muted-foreground">Today</div>
            <div className="text-lg font-semibold text-foreground">
              {todayVisitors.toLocaleString()}
            </div>
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-wide text-muted-foreground">Last 7 days</div>
            <div className="text-2xl font-bold leading-tight text-foreground">
              {last7.toLocaleString()}
            </div>
            <div className="mt-1 flex items-center gap-1 text-xs">
              {trendUp ? (
                <TrendingUp className="h-3.5 w-3.5 text-bookmark-green" />
              ) : (
                <TrendingDown className="h-3.5 w-3.5 text-bookmark-red" />
              )}
              <span className={trendUp ? "text-bookmark-green" : "text-bookmark-red"}>
                {trendUp ? "+" : ""}
                {trend.toFixed(1)}%
              </span>
            </div>
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-wide text-muted-foreground">Last 30 days</div>
            <div className="text-lg font-semibold text-foreground">
              {last30.toLocaleString()}
            </div>
          </div>
        </div>
        <div className="lg:col-span-9">
          <div className="mb-1 flex items-center justify-between">
            <div className="text-[11px] uppercase tracking-wide text-muted-foreground">
              30-day visitor trend
            </div>
            <div className="text-[11px] text-muted-foreground">
              {new Date(last30Data[0].date).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
              {" — "}
              {new Date(last30Data[last30Data.length - 1].date).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
            </div>
          </div>
          <VisitorGraph data={last30Data} color={graphColor} gradientId={`g-${site.id}`} />
        </div>
      </div>
    </Card>
  );
}
