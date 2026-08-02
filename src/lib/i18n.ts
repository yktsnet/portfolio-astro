export type Language = "ja" | "en";

export type MultilingualText =
  | string
  | {
      ja: string;
      en: string;
    };

/**
 * Safely resolves a MultilingualText to a string based on language.
 * Defaults to Japanese if English is not provided.
 */
export function resolveText(
  val: MultilingualText | undefined | null,
  lang: Language = "ja"
): string {
  if (!val) return "";
  if (typeof val === "string") return val;
  return val[lang] || val.ja || "";
}

/**
 * Common UI dictionary for static labels across the application.
 */
export const uiStrings = {
  inUse: {
    ja: "現場に導入・稼働中",
    en: "Active in Production",
  },
  filterAll: {
    ja: "全て表示",
    en: "All",
  },
  filterOSS: {
    ja: "OSSのみ",
    en: "OSS Only",
  },
  noResults: {
    ja: "条件に一致する作品がありません。",
    en: "No works matched this filter.",
  },
  architectureTitle: {
    ja: "NixOS + Docker 基盤構成",
    en: "NixOS + Docker Architecture",
  },
} as const;
