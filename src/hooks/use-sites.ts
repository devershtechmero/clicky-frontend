import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { apiRequest } from "@/lib/api";
import { getAuthToken } from "@/lib/auth";
import { readCachedSites, writeCachedSites } from "@/lib/sites-cache";
import { BookmarkColor, DailyVisitors, Site } from "@/lib/types";

type WebsiteAnalytics = {
  visitorsLast7Days: number;
  visitorsLast30Days: number;
  onlineNow: number;
  visitorsTrend30Days: DailyVisitors[];
};

type WebsitePayload = {
  id: string;
  websiteName: string;
  url: string;
  siteId: string;
  siteKey: string;
  bookmarkColor: BookmarkColor | null;
  analytics?: WebsiteAnalytics;
};

type WebsitesResponse = {
  data: WebsitePayload[];
  meta?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};

const VALID_COLORS: BookmarkColor[] = ["none", "yellow", "red", "green", "blue"];
const SITES_CACHE_STALE_MS = 5 * 60 * 1000;
const SITES_CACHE_GC_MS = 60 * 60 * 1000;

function fallbackTrendData(days = 30): DailyVisitors[] {
  const out: DailyVisitors[] = [];
  const today = new Date();

  for (let i = days - 1; i >= 0; i -= 1) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    out.push({
      date: d.toISOString().slice(0, 10),
      visitors: 0,
    });
  }

  return out;
}

function normalizeBookmarkColor(value: BookmarkColor | null | undefined): BookmarkColor {
  return VALID_COLORS.includes(value as BookmarkColor) ? (value as BookmarkColor) : "none";
}

function mapWebsiteToSite(item: WebsitePayload): Site {
  const dailyData =
    item.analytics?.visitorsTrend30Days && item.analytics.visitorsTrend30Days.length > 0
      ? item.analytics.visitorsTrend30Days
      : fallbackTrendData(30);

  return {
    id: item.id,
    name: item.websiteName,
    url: item.url,
    siteId: item.siteId,
    siteKey: item.siteKey,
    bookmarkColor: normalizeBookmarkColor(item.bookmarkColor),
    onlineNow: item.analytics?.onlineNow ?? 0,
    dailyData,
  };
}

export function useSites() {
  const hasToken = Boolean(getAuthToken());
  const cachedSites = hasToken ? readCachedSites() : null;

  return useQuery({
    queryKey: ["sites"],
    enabled: hasToken,
    initialData: cachedSites?.sites,
    initialDataUpdatedAt: cachedSites?.savedAt,
    staleTime: SITES_CACHE_STALE_MS,
    gcTime: SITES_CACHE_GC_MS,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    queryFn: async () => {
      const response = await apiRequest<WebsitesResponse>(
        "/websites?includeAnalytics=true&sortBy=createdAt&sortOrder=desc&paginate=false",
      );

      const sites = response.data.map(mapWebsiteToSite);
      writeCachedSites(sites);

      return sites;
    },
  });
}

export function useAddSite() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (input: {
      name: string;
      url: string;
      siteId: string;
      siteKey: string;
      bookmarkColor: BookmarkColor;
    }) => {
      return apiRequest<{
        data: WebsitePayload;
        meta?: {
          created: boolean;
          ignored: boolean;
          reason?: string;
        };
      }>("/websites", {
        method: "POST",
        body: {
          websiteName: input.name,
          url: input.url,
          siteId: input.siteId,
          siteKey: input.siteKey,
          bookmarkColor: input.bookmarkColor,
        },
      });
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["sites"] });
      await qc.invalidateQueries({ queryKey: ["online-visitors"] });
    },
  });
}

export function useBulkAddSites() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (file: File) => {
      const form = new FormData();
      form.append("file", file);

      return apiRequest<{
        data: {
          importBatchId: string;
          totalRows: number;
          processedRows: number;
          inserted: number;
          ignored: number;
          ignoredExisting: number;
          ignoredDuplicateInFile: number;
        };
      }>("/websites/import", {
        method: "POST",
        body: form,
      });
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["sites"] });
      await qc.invalidateQueries({ queryKey: ["online-visitors"] });
    },
  });
}

export function useUpdateBookmark() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, color }: { id: string; color: BookmarkColor }) => {
      await apiRequest(`/websites/${id}/bookmark`, {
        method: "PATCH",
        body: {
          bookmarkColor: color,
        },
      });
    },
    onMutate: async ({ id, color }) => {
      const previousSites = qc.getQueryData<Site[]>(["sites"]);

      qc.setQueryData<Site[]>(["sites"], (current) => {
        if (!current) return current;
        const next = current.map((site) => (site.id === id ? { ...site, bookmarkColor: color } : site));
        writeCachedSites(next);
        return next;
      });

      await qc.cancelQueries({ queryKey: ["sites"] });

      return { previousSites };
    },
    onError: (_error, _input, context) => {
      if (!context?.previousSites) return;

      qc.setQueryData(["sites"], context.previousSites);
      writeCachedSites(context.previousSites);
      toast.error("Bookmark was not saved");
    },
  });
}

export function useOnlineVisitors() {
  const hasToken = Boolean(getAuthToken());

  return useQuery({
    queryKey: ["online-visitors"],
    enabled: hasToken,
    queryFn: async () => {
      const response = await apiRequest<WebsitesResponse>(
        "/websites?includeAnalytics=true&sortBy=createdAt&sortOrder=desc&paginate=false",
      );

      return response.data.reduce<Record<string, number>>((acc, site) => {
        acc[site.id] = site.analytics?.onlineNow ?? 0;
        return acc;
      }, {});
    },
  });
}
