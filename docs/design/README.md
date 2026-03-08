# Design System

```yaml
theme:
  dark_mode: "class"

colors:
  page_bg:
    dark: "bg-poi-back"
    light: "bg-white"
  panel_bg:
    dark: "bg-poi-panel"
    light: "bg-white"
  border:
    dark: "border-poi-border"
    light: "border-zinc-200"
  text:
    dark: "text-poi-text"
    light: "text-zinc-700"
  text_strong:
    dark: "text-poi-focus"
    light: "text-zinc-900"
  text_muted:
    dark: "text-zinc-400"
    light: "text-zinc-500"
  accent:
    dark: "text-poi-accent"
    light: "text-light-accent"
  accent_hover:
    dark: "hover:text-poi-accent-hover"
    light: "hover:text-light-accent"
  link:
    dark: "text-poi-accent hover:text-poi-accent-hover"
    light: "text-light-accent hover:text-light-accent"

fonts:
  sans: 'font-sans'
  mono: 'font-mono'

typography:
  h1: "text-2xl sm:text-3xl font-semibold tracking-tight text-zinc-900 dark:text-poi-focus"
  h2: "text-xl font-semibold text-zinc-900 dark:text-poi-focus"
  h3: "text-lg font-semibold text-zinc-900 dark:text-poi-focus"
  body: "text-base leading-8 text-zinc-700 dark:text-poi-text"
  body_strong: "text-base leading-8 text-zinc-900 dark:text-poi-focus"
  body_muted: "text-base leading-8 text-zinc-600 dark:text-zinc-400"
  small: "text-sm leading-7 text-zinc-600 dark:text-zinc-400"
  label: "text-sm text-light-accent dark:text-poi-accent"
  mono_label: "font-mono text-sm text-light-accent dark:text-poi-accent"

layout:
  page_width: "mx-auto max-w-3xl"
  reading_width: "max-w-3xl"
  narrow_width: "max-w-2xl"
  hero_row: "flex flex-col gap-6 sm:flex-row sm:items-start"
  service_grid: "grid gap-6 md:grid-cols-2"
  section_gap_l: "mb-16"
  section_gap_m: "mb-14"
  section_gap_s: "mt-12"
  stack_l: "space-y-10"
  stack_m: "space-y-8"
  stack_s: "space-y-4"

blocks:
  panel:
    base: "rounded-2xl border border-zinc-200 bg-white dark:border-poi-border dark:bg-poi-panel"
    padding: "p-6"
  service_panel:
    base: "rounded-2xl border border-zinc-200 bg-white dark:border-poi-border dark:bg-poi-panel"
    grid: "grid gap-6 md:grid-cols-2"
    padding: "p-6"
  media_avatar:
    sm: "h-20 w-20 rounded-full object-cover"
    md: "sm:h-24 sm:w-24"
  inline_links: "cactus-link"
  prose_list: "space-y-4 leading-8"

page_patterns:
  page:
    root: "mx-auto max-w-3xl py-8 sm:py-12"
    section: "mb-16"
  article:
    title: "text-2xl font-semibold tracking-tight sm:text-3xl text-zinc-900 dark:text-poi-focus"
    meta: "text-sm text-zinc-500 dark:text-zinc-400"
    body: "text-base leading-8 text-zinc-700 dark:text-poi-text"
  landing:
    hero_title: "text-2xl sm:text-3xl font-semibold tracking-tight text-zinc-900 dark:text-poi-focus"
    hero_body: "mt-5 text-base leading-8 text-zinc-700 dark:text-poi-text"
    theme_copy: "text-base leading-8 text-zinc-600 dark:text-zinc-400"
    service_wrap: "rounded-2xl border border-zinc-200 bg-white p-6 dark:border-poi-border dark:bg-poi-panel"
    service_grid: "grid gap-6 md:grid-cols-2"

rules:
  headings:
    page_title: "h1"
    section_title: "h2"
    item_title: "h3"
  text:
    base: "body"
    secondary: "body_muted"
    accent: "label"
  structure:
    default_width: "page_width"
    default_gap: "section_gap_l"
    default_stack: "stack_m"
  components:
    service: "service_panel"
    card: "panel"
    avatar: "media_avatar"
  links:
    default: "inline_links"
  keep:
    - "text-first"
    - "max-w-3xl"
    - "leading-8"
    - "accent only for labels and links"
    - "panel only where structure improves scanability"
  avoid:
    - "new color tokens"
    - "hero-only visual language"
    - "oversized display headings"
    - "dense vertical rhythm"
    - "mixed spacing systems in one page"

semantic_slots:
  page_root: "mx-auto max-w-3xl py-8 sm:py-12"
  hero: "flex flex-col gap-6 sm:flex-row sm:items-start"
  hero_image: "h-20 w-20 shrink-0 rounded-full object-cover sm:h-24 sm:w-24"
  hero_label: "text-sm text-light-accent dark:text-poi-accent"
  hero_title: "text-2xl sm:text-3xl font-semibold tracking-tight text-zinc-900 dark:text-poi-focus"
  hero_copy: "mt-5 text-base leading-8 text-zinc-700 dark:text-poi-text"
  section: "mb-16 max-w-3xl"
  section_title: "text-xl font-semibold text-zinc-900 dark:text-poi-focus"
  section_copy: "mt-3 text-base leading-8 text-zinc-700 dark:text-poi-text"
  muted_copy: "text-base leading-8 text-zinc-600 dark:text-zinc-400"
  service_wrap: "rounded-2xl border border-zinc-200 bg-white p-6 dark:border-poi-border dark:bg-poi-panel"
  service_grid: "grid gap-6 md:grid-cols-2"
  service_title: "text-lg font-semibold text-zinc-900 dark:text-poi-focus"
  service_copy: "mt-3 text-base leading-8 text-zinc-700 dark:text-poi-text"
  list_block: "mt-6 space-y-4"
  social_block: "mt-12"
