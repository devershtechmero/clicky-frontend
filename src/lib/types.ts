export type BookmarkColor = "none" | "yellow" | "red" | "green" | "blue";

export interface DailyVisitors {
  date: string;
  visitors: number;
}

export interface Site {
  id: string;
  name: string;
  url: string;
  siteId: string;
  siteKey: string;
  bookmarkColor: BookmarkColor;
  onlineNow: number;
  dailyData: DailyVisitors[];
}
