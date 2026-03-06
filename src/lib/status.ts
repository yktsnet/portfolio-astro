export interface LatencyPoint {
  t: string;
  v: number;
}

export interface SessionPoint {
  t: string;
  open: number;
  close: number;
  session: string;
}

export interface PlStep {
  t: string;
  v: number;
}

export interface StatusPayload {
  updated_at: string;
  latency: LatencyPoint[];
  session: SessionPoint[];
  pl_steps: PlStep[];
}

export function relativeTime(isoStr: string): string {
  const diff = Math.floor((Date.now() - new Date(isoStr).getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  return `${Math.floor(diff / 3600)}h ago`;
}

export function formatTimeUTC(isoStr: string): string {
  return new Date(isoStr).toLocaleTimeString("en-US", {
    hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "UTC",
  });
}

export function formatTimeJST(isoStr: string): string {
  return new Date(isoStr).toLocaleTimeString("ja-JP", {
    hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "Asia/Tokyo",
  });
}

export function formatDateShort(isoStr: string): string {
  return new Date(isoStr).toLocaleDateString("en-US", {
    month: "short", day: "numeric", timeZone: "UTC",
  });
}

export function isWeekend(): boolean {
  const day = new Date().getDay();
  return day === 0 || day === 6;
}

export function formatUpdatedAt(isoStr: string): string {
  const d = new Date(isoStr);
  const utc = d.toLocaleTimeString("en-US", {
    hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "UTC",
  });
  const jst = d.toLocaleTimeString("ja-JP", {
    hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "Asia/Tokyo",
  });
  return `${utc} UTC · ${jst} JST`;
}
