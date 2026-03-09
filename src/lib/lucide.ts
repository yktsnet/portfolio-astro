const icons: Record<string, string> = {
  "chart-candlestick": `<path d="M9 5v4" /><rect width="4" height="6" x="7" y="9" rx="1" /><path d="M9 15v2" /><path d="M17 3v2" /><rect width="4" height="8" x="15" y="5" rx="1" /><path d="M17 13v3" /><path d="M3 3v16a2 2 0 0 0 2 2h16" />`,
  "wifi": `<path d="M12 20h.01" /><path d="M2 8.82a15 15 0 0 1 20 0" /><path d="M5 12.859a10 10 0 0 1 14 0" /><path d="M8.5 16.429a5 5 0 0 1 7 0" />`,
  "code": `<polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>`,
  "id-card": `class="lucide lucide-id-card"  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round">  <path d="M16 10h2" />  <path d="M16 14h2" />  <path d="M6.17 15a3 3 0 0 1 5.66 0" />  <circle cx="9" cy="11" r="2" />  <rect x="2" y="5" width="20" height="14" rx="2" />`,
};

export function getLucideIcon(name: string): string {
  return icons[name] ?? icons["code"];
}
