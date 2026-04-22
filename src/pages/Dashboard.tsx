import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { SubNavbar } from "@/components/sub-navbar";
import { Input } from "@/components/ui/input";
import { TagFilter } from "@/components/tag-filter";
import { SortFilter, SortKey } from "@/components/sort-filter";
import { SiteCard } from "@/components/site-card";
import { useOnlineVisitors, useSites } from "@/hooks/use-sites";
import { BookmarkColor } from "@/lib/types";

const Dashboard = () => {
  const { data: sites = [] } = useSites();
  const { data: online } = useOnlineVisitors();
  const [query, setQuery] = useState("");
  const [tag, setTag] = useState<BookmarkColor | "all">("all");
  const [sort, setSort] = useState<SortKey>("visitors-desc");

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
          <SortFilter value={sort} onChange={setSort} />
        </div>

        {visible.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card/50 px-6 py-20 text-center">
            <div className="text-sm font-medium text-foreground">No websites match your filters</div>
            <div className="mt-1 text-xs text-muted-foreground">Try clearing search or tag filters.</div>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {visible.map((s, i) => (
              <SiteCard key={s.id} site={s} index={i} onlineOverride={online?.[s.id]} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
