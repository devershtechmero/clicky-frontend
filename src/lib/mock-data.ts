import { BookmarkColor, Site } from "./types";

const SEED = [
  { name: "Stripe Docs", url: "stripe.com" },
  { name: "Vercel", url: "vercel.com" },
  { name: "Linear", url: "linear.app" },
  { name: "Notion", url: "notion.so" },
  { name: "GitHub", url: "github.com" },
  { name: "Figma", url: "figma.com" },
  { name: "Supabase", url: "supabase.com" },
  { name: "Tailwind CSS", url: "tailwindcss.com" },
  { name: "Next.js", url: "nextjs.org" },
  { name: "Lovable", url: "lovable.dev" },
  { name: "OpenAI", url: "openai.com" },
  { name: "Cloudflare", url: "cloudflare.com" },
];

const COLORS: BookmarkColor[] = ["none", "yellow", "red", "green", "blue"];

function genDaily(days = 30) {
  const out = [];
  const today = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    out.push({
      date: d.toISOString().slice(0, 10),
      visitors: Math.floor(200 + Math.random() * 7800),
    });
  }
  return out;
}

export function generateMockSites(): Site[] {
  return SEED.map((s, i) => ({
    id: `site-${i}-${Date.now()}`,
    name: s.name,
    url: s.url,
    bookmarkColor: COLORS[Math.floor(Math.random() * COLORS.length)],
    onlineNow: Math.floor(5 + Math.random() * 295),
    dailyData: genDaily(30),
  }));
}
