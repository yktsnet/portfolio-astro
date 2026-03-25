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
  { range: [1,   30],  location: "Croatia",  date: "2024.06" },
  { range: [31,  60],  location: "Slovenia", date: "2024.06" },
  { range: [61,  90],  location: "Croatia",  date: "2024.07" },
  { range: [91,  120], location: "Japan",    date: "2024.10" },
  { range: [121, 152], location: "Japan",    date: "2024.11" },
];

export const photos: Photo[] = Array.from({ length: 152 }, (_, i) => {
  const n = i + 1;
  const g = photoGroups.find(g => n >= g.range[0] && n <= g.range[1])!;
  return {
    src: `${String(n).padStart(3, "0")}.webp`,
    location: g.location,
    date: g.date,
  };
});
