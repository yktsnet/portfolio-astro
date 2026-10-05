import type { ImageMetadata } from "astro";

export interface Photo {
  src: ImageMetadata;
  location: string;
  date: string;
}

interface PhotoGroup {
  range: [number, number]; // inclusive, 1-based
  location: string;
  date: string;
}

// ── Edit here to update metadata for each batch of photos ──
// 写真は src/assets/photos/NNN.webp に置き、その番号を含む範囲をここに足す
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

const files = import.meta.glob<ImageMetadata>("/src/assets/photos/*.webp", {
  eager: true,
  import: "default",
});

export const photos: Photo[] = Object.entries(files)
  .map(([path, src]) => ({ name: path.split("/").pop()!, src }))
  .sort((a, b) => a.name.localeCompare(b.name))
  .flatMap(({ name, src }) => {
    const n = parseInt(name, 10);
    const g = photoGroups.find((g) => n >= g.range[0] && n <= g.range[1]);
    if (!g) {
      console.warn(`[photos] ${name} has no matching photoGroups range; skipped`);
      return [];
    }
    return [{ src, location: g.location, date: g.date }];
  });
