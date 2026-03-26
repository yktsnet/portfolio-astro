const icons: Record<string, string> = {
  "chart-candlestick": `<path d="M9 5v4" /><rect width="4" height="6" x="7" y="9" rx="1" /><path d="M9 15v2" /><path d="M17 3v2" /><rect width="4" height="8" x="15" y="5" rx="1" /><path d="M17 13v3" /><path d="M3 3v16a2 2 0 0 0 2 2h16" />`,
  "wifi": `<path d="M12 20h.01" /><path d="M2 8.82a15 15 0 0 1 20 0" /><path d="M5 12.859a10 10 0 0 1 14 0" /><path d="M8.5 16.429a5 5 0 0 1 7 0" />`,
  "code": `<polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>`,
  "id-card": `<path d="M16 10h2" /><path d="M16 14h2" /><path d="M6.17 15a3 3 0 0 1 5.66 0" /><circle cx="9" cy="11" r="2" /><rect x="2" y="5" width="20" height="14" rx="2" />`,
  "cat": `<path d="M12 5c.67 0 1.35.09 2 .26 1.78-2 5.03-2.84 6.42-2.26 1.4.58-.42 7-.42 7 .57 1.07 1 2.24 1 3.44C21 17.9 16.97 21 12 21s-9-3-9-7.56c0-1.25.5-2.4 1-3.44 0 0-1.89-6.42-.5-7 1.39-.58 4.72.23 6.5 2.23A9.04 9.04 0 0 1 12 5Z" />  <path d="M8 14v.5" />  <path d="M16 14v.5" />  <path d="M11.25 16.25h1.5L12 17l-.75-.75Z" />`,
  "cpu": `<path d="M12 20v2" />  <path d="M12 2v2" />  <path d="M17 20v2" />  <path d="M17 2v2" />  <path d="M2 12h2" />  <path d="M2 17h2" />  <path d="M2 7h2" />  <path d="M20 12h2" />  <path d="M20 17h2" />  <path d="M20 7h2" />  <path d="M7 20v2" />  <path d="M7 2v2" />  <rect x="4" y="4" width="16" height="16" rx="2" />  <rect x="8" y="8" width="8" height="8" rx="1" />`,
};

export function getLucideIcon(name: string): string {
  return icons[name] ?? icons["code"];
}
