export interface Photo {
  src: string;
  alt?: string;
  location: string;
  date: string;
}

interface PhotoGroup {
  range: [number, number]; // inclusive, 1-based
  location: string;
  date: string;
}

// ── Edit here to update metadata for each batch of photos ──
export const photoGroups: PhotoGroup[] = [
  { range: [1,   33],  location: "Croatia",  date: "2024.03" },
  { range: [34,  41],  location: "Japan", date: "2019.07" },
  { range: [42,  54],  location: "Thailand",  date: "2018.12" },
  { range: [55,  89],  location: "Tunisia", date:"2015. 08" },
  { range: [90,  100],  location: "Portland, US",  date: "2016.05" },
  { range: [101,  112], location: "Japan",    date: "2018.04" },
  { range: [113, 134], location: "Austlia, Slovenia, Italy",    date: "2018.05" },
  { range: [135,  151],  location: "Japan",  date: "2018.04" },
];

export const photos: Photo[] = Array.from({ length: 152 }, (_, i) => {
  const n = i + 1;
  const g = photoGroups.find(g => n >= g.range[0] && n <= g.range[1]);
  if (!g) return null;  // ← グループ未定義はスキップ
  return {
    src: `${String(n).padStart(3, "0")}.webp`,
    location: g.location,
    date: g.date,
  };
}).filter((p): p is Photo => p !== null);  // ← nullを除外
