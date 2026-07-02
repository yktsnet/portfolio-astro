// SV6（自宅サーバー・複数プロダクト同居ホスト）のライブステータス表示用の
// 型定義と整形ヘルパー。KVキー `status:sv6` のペイロード形状を定義する。
//
// heartbeats・load1・mem_available_kb は同じ長さ・同じ順序（古い→新しい）の
// 時系列サンプル列。nproc・mem_total_kb はマシンスペックとして不変な固定値。
// uptime_seconds 以下は「トグル内の追加情報」用の最新スナップショット値。

export interface SV6StatusPayload {
  updated_at: string;
  /** 1時間ごとの push 成功タイムスタンプ（ISO文字列、古い→新しい順） */
  heartbeats: string[];
  /** heartbeats と同じ長さ・同じ順序の load1 サンプル列 */
  load1: number[];
  /** 論理コア数（固定値、Load%算出の母数） */
  nproc: number;
  /** 総メモリ容量 (KB, 固定値、Available%算出の母数) */
  mem_total_kb: number;
  /** heartbeats と同じ長さ・同じ順序の MemAvailable サンプル列 (KB) */
  mem_available_kb: number[];
  /** 最新スナップショットのuptime (秒) */
  uptime_seconds: number;
  /** 最新スナップショットのswap使用率 (%) */
  swap_used_percent: number;
  /** 最新スナップショットの稼働コンテナ数 */
  containers_running: number;
  /** 最新スナップショットのコア別使用率 (%)、長さ = nproc */
  cpu_cores: number[];
  /** 最新スナップショットのSlabサイズ (KB) */
  slab_kb: number;
}

function clampPercent(v: number): number {
  if (!Number.isFinite(v)) return 0;
  return Math.min(100, Math.max(0, v));
}

export function loadPercentSeries(p: SV6StatusPayload): number[] {
  const load1 = p.load1 ?? [];
  if (!p.nproc) return load1.map(() => 0);
  return load1.map((v) => clampPercent((v / p.nproc) * 100));
}

export function availablePercentSeries(p: SV6StatusPayload): number[] {
  const memAvailable = p.mem_available_kb ?? [];
  if (!p.mem_total_kb) return memAvailable.map(() => 0);
  return memAvailable.map((v) => clampPercent((v / p.mem_total_kb) * 100));
}

export function latestLoadPercent(p: SV6StatusPayload): number {
  const series = loadPercentSeries(p);
  return series.length ? series[series.length - 1] : 0;
}

export function latestAvailablePercent(p: SV6StatusPayload): number {
  const series = availablePercentSeries(p);
  return series.length ? series[series.length - 1] : 0;
}

export function uptimeDays(p: SV6StatusPayload): number {
  return Math.floor((p.uptime_seconds ?? 0) / 86400);
}

export function formatGb(kb: number): string {
  return `${(kb / 1024 / 1024).toFixed(1)}GB`;
}

export function formatSlab(kb: number): string {
  return kb >= 1024 * 1024 ? `${(kb / 1024 / 1024).toFixed(1)}GB` : `${Math.round(kb / 1024)}MB`;
}
