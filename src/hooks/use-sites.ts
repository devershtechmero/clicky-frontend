import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Site, BookmarkColor } from "@/lib/types";
import { generateMockSites } from "@/lib/mock-data";

const KEY = "sitewatch.sites";

function loadSites(): Site[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw) as Site[];
  } catch {
    // ignore
  }
  const seeded = generateMockSites();
  localStorage.setItem(KEY, JSON.stringify(seeded));
  return seeded;
}

function saveSites(sites: Site[]) {
  localStorage.setItem(KEY, JSON.stringify(sites));
}

export function useSites() {
  return useQuery({
    queryKey: ["sites"],
    queryFn: async () => loadSites(),
    staleTime: Infinity,
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
      const sites = loadSites();
      const today = new Date();
      const dailyData = Array.from({ length: 30 }, (_, i) => {
        const d = new Date(today);
        d.setDate(today.getDate() - (29 - i));
        return { date: d.toISOString().slice(0, 10), visitors: Math.floor(200 + Math.random() * 7800) };
      });
      const newSite: Site = {
        id: `site-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        name: input.name,
        url: input.url,
        siteId: input.siteId,
        siteKey: input.siteKey,
        bookmarkColor: input.bookmarkColor,
        onlineNow: Math.floor(5 + Math.random() * 295),
        dailyData,
      };
      const next = [newSite, ...sites];
      saveSites(next);
      return next;
    },
    onSuccess: (next) => qc.setQueryData(["sites"], next),
  });
}

export function useBulkAddSites() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (rows: { name: string; url: string; siteId: string; siteKey: string; color?: string }[]) => {
      const sites = loadSites();
      const today = new Date();
      const newOnes: Site[] = rows.map((r, idx) => {
        const dailyData = Array.from({ length: 30 }, (_, i) => {
          const d = new Date(today);
          d.setDate(today.getDate() - (29 - i));
          return { date: d.toISOString().slice(0, 10), visitors: Math.floor(200 + Math.random() * 7800) };
        });
        const c = (r.color || "none").toLowerCase();
        const valid: BookmarkColor[] = ["none", "yellow", "red", "green", "blue"];
        const color = (valid.includes(c as BookmarkColor) ? c : "none") as BookmarkColor;
        return {
          id: `site-${Date.now()}-${idx}-${Math.random().toString(36).slice(2, 6)}`,
          name: r.name,
          url: r.url,
          siteId: r.siteId,
          siteKey: r.siteKey,
          bookmarkColor: color,
          onlineNow: Math.floor(5 + Math.random() * 295),
          dailyData,
        };
      });
      const next = [...newOnes, ...sites];
      saveSites(next);
      return next;
    },
    onSuccess: (next) => qc.setQueryData(["sites"], next),
  });
}

export function useUpdateBookmark() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, color }: { id: string; color: BookmarkColor }) => {
      const sites = loadSites();
      const next = sites.map((s) => (s.id === id ? { ...s, bookmarkColor: color } : s));
      saveSites(next);
      return next;
    },
    onSuccess: (next) => qc.setQueryData(["sites"], next),
  });
}

export function useOnlineVisitors() {
  return useQuery({
    queryKey: ["online-visitors"],
    queryFn: async () => {
      const sites = loadSites();
      const updated = sites.map((s) => ({
        ...s,
        onlineNow: Math.max(1, s.onlineNow + Math.floor(Math.random() * 41) - 20),
      }));
      saveSites(updated);
      return updated.reduce<Record<string, number>>((acc, s) => {
        acc[s.id] = s.onlineNow;
        return acc;
      }, {});
    },
    refetchInterval: 30_000,
  });
}
