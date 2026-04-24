import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, Search } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { SubNavbar } from "@/components/sub-navbar";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TagFilter } from "@/components/tag-filter";
import { SortFilter, SortKey } from "@/components/sort-filter";
import { SiteCard } from "@/components/site-card";
import { useSites } from "@/hooks/use-sites";
import { BookmarkColor } from "@/lib/types";
import { isAuthenticated } from "@/lib/auth";

function SiteCardLoader({ index }: { index: number }) {
  return (
    <Card
      className="p-4 animate-fade-up"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="flex items-center gap-3">
        <Skeleton className="h-7 w-7 rounded-md" />
        <div className="min-w-0 flex-1 space-y-2">
          <Skeleton className="h-4 w-48 max-w-full" />
          <Skeleton className="h-3 w-64 max-w-full" />
        </div>
        <Skeleton className="h-8 w-8 rounded-full" />
        <Skeleton className="h-7 w-20 rounded-full" />
      </div>
      <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-12">
        <div className="grid grid-cols-3 gap-4 sm:gap-6 lg:col-span-3 lg:grid-cols-1 lg:gap-3">
          <div className="space-y-2">
            <Skeleton className="h-3 w-14" />
            <Skeleton className="h-5 w-20" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-7 w-24" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-5 w-20" />
          </div>
        </div>
        <div className="space-y-3 lg:col-span-9">
          <div className="flex items-center justify-between">
            <Skeleton className="h-3 w-36" />
            <Skeleton className="h-3 w-24" />
          </div>
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    </Card>
  );
}

function SitesLoader() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin text-foreground" />
        Loading websites
      </div>
      {[0, 1, 2].map((index) => (
        <SiteCardLoader key={index} index={index} />
      ))}
    </div>
  );
}

const Dashboard = () => {
  const navigate = useNavigate();
  const { data: sites = [], isFetching, isLoading } = useSites();
  const [query, setQuery] = useState("");
  const [tag, setTag] = useState<BookmarkColor | "all">("all");
  const [sort, setSort] = useState<SortKey>("visitors-desc");

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  const visible = useMemo(() => {
    let out = sites.filter((s) => {
      if (tag !== "all" && s.bookmarkColor !== tag) return false;
      if (!query.trim()) return true;
      const q = query.toLowerCase();
      return s.name.toLowerCase().includes(q) || s.url.toLowerCase().includes(q);
    });
    out = [...out].sort((a, b) => {
      const av = a.dailyData.slice(-7).reduce((s, d) => s + d.visitors, 0);
      const bv = b.dailyData.slice(-7).reduce((s, d) => s + d.visitors, 0);
      return sort === "visitors-desc" ? bv - av : av - bv;
    });
    return out;
  }, [sites, tag, query, sort]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <SubNavbar />
      <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6">
        {/* Controls row */}
        <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-xs">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search websites..."
              className="pl-9"
            />
          </div>
          <div className="lg:flex-1 lg:flex lg:justify-center">
            <TagFilter value={tag} onChange={setTag} />
          </div>
          <div className="flex items-center justify-between gap-3 lg:justify-end">
            {isFetching && !isLoading ? (
              <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Updating
              </div>
            ) : null}
            <SortFilter value={sort} onChange={setSort} />
          </div>
        </div>

        {isLoading ? (
          <SitesLoader />
        ) : visible.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card/50 px-6 py-20 text-center">
            <div className="text-sm font-medium text-foreground">No websites match your filters</div>
            <div className="mt-1 text-xs text-muted-foreground">Try clearing search or tag filters.</div>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {visible.map((s, i) => (
              <SiteCard key={s.id} site={s} index={i} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
