# Field Observation App — Design System

**Version:** alpha

Design system for the factory field-observation app: line employees log broken equipment, leaks, and safety issues in a dairy plant, and supervisors track and resolve what gets reported. Trust-first and utilitarian: a cool pale-lavender canvas rather than pure white, with a confident blue reserved for chrome, alerts, and the primary "new report" action. Hero numbers (open/unresolved report counts) render oversized and near-black — the loudest typographic moment in the system — while everything else stays modest and gray. Cards are white, generously rounded, and float directly on the lavender canvas with no visible hairline border. A five-item bottom tab bar with a raised circular FAB anchors navigation, putting "new report" one tap away from anywhere in the app.

## Design Tokens

Raw token values, for pulling into code or a design tool. Narrative explanations of each token are in the sections below.

```yaml
colors:
  primary: "#0257d8"
  primary-vivid: "#0166f4"
  primary-navy: "#012a94"
  accent-sky: "#62ceff"
  action-pill-bg: "#b3ccf5"
  warning-bg: "#fef6e3"
  warning-text: "#74540d"
  ink: "#0a0a0a"
  muted: "#68686c"
  muted-soft: "#a8a7ad"
  canvas: "#eff2fb"
  surface-card: "#ffffff"
  surface-soft: "#f6f7fb"
  on-primary: "#ffffff"
  on-dark: "#ffffff"
  scrim: "#000000"

typography:
  stat-display:
    fontFamily: "'Inter', -apple-system, system-ui, 'Helvetica Neue', sans-serif"
    fontSize: 40px
    fontWeight: 700
    lineHeight: 1.05
    letterSpacing: -0.5px
  screen-title:
    fontFamily: "'Inter', -apple-system, system-ui, sans-serif"
    fontSize: 28px
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: 0
  section-header:
    fontFamily: "'Inter', -apple-system, system-ui, sans-serif"
    fontSize: 20px
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: 0
  tile-number:
    fontFamily: "'Inter', -apple-system, system-ui, sans-serif"
    fontSize: 17px
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: 0
  body-md:
    fontFamily: "'Inter', -apple-system, system-ui, sans-serif"
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.35
    letterSpacing: 0
  link-muted:
    fontFamily: "'Inter', -apple-system, system-ui, sans-serif"
    fontSize: 15px
    fontWeight: 500
    lineHeight: 1.3
    letterSpacing: 0
  button-sm:
    fontFamily: "'Inter', -apple-system, system-ui, sans-serif"
    fontSize: 14px
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: 0
  caption:
    fontFamily: "'Inter', -apple-system, system-ui, sans-serif"
    fontSize: 12px
    fontWeight: 400
    lineHeight: 1.3
    letterSpacing: 0
  tab-label:
    fontFamily: "'Inter', -apple-system, system-ui, sans-serif"
    fontSize: 10px
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: 0

rounded:
  none: 0px
  xs: 6px
  sm: 12px
  md: 16px
  lg: 20px
  xl: 24px
  full: 9999px

spacing:
  xxs: 2px
  xs: 4px
  sm: 8px
  md: 12px
  base: 16px
  lg: 20px
  xl: 24px
  xxl: 32px
  section: 28px

components:
  top-bar:
    backgroundColor: transparent
    textColor: "{colors.ink}"
    height: 56px
  icon-button-round:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.primary}"
    rounded: "{rounded.full}"
    height: 44px
  avatar-photo:
    rounded: "{rounded.full}"
    height: 44px
  avatar-placeholder:
    backgroundColor: "#d4d4d8"
    rounded: "{rounded.full}"
    height: 44px
  summary-card:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.ink}"
    typography: "{typography.stat-display}"
    rounded: "{rounded.lg}"
  summary-card-banner:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.body-md}"
    padding: 16px
  activity-summary-card:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.ink}"
    typography: "{typography.tile-number}"
    rounded: "{rounded.lg}"
    padding: 16px
  section-header-row:
    backgroundColor: transparent
    textColor: "{colors.ink}"
    typography: "{typography.section-header}"
  see-all-link:
    backgroundColor: transparent
    textColor: "{colors.muted-soft}"
    typography: "{typography.link-muted}"
  featured-alert-card:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.section-header}"
    rounded: "{rounded.lg}"
    padding: 20px
  pill-cta-light:
    backgroundColor: "{colors.action-pill-bg}"
    textColor: "{colors.ink}"
    typography: "{typography.button-sm}"
    rounded: "{rounded.full}"
    padding: 10px 20px
  filter-chip:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.full}"
    padding: 12px 20px
  screen-title-lockup:
    backgroundColor: transparent
    textColor: "{colors.ink}"
    typography: "{typography.screen-title}"
  status-badge-tag:
    backgroundColor: "{colors.primary-navy}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.xs}"
  warning-tag-pill:
    backgroundColor: "{colors.warning-bg}"
    textColor: "{colors.warning-text}"
    typography: "{typography.button-sm}"
    rounded: "{rounded.full}"
    padding: 6px 14px
  quick-action-button:
    backgroundColor: "{colors.surface-soft}"
    textColor: "{colors.ink}"
    rounded: "{rounded.full}"
    height: 56px
  inline-banner-sky:
    backgroundColor: "{colors.accent-sky}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.lg}"
    padding: 20px
  category-grid-card:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.lg}"
    padding: 20px
  category-icon-chip:
    backgroundColor: "{colors.surface-card}"
    rounded: "{rounded.full}"
    height: 48px
  bottom-tab-bar:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.muted}"
    typography: "{typography.tab-label}"
    height: 64px
  tab-bar-item-active:
    backgroundColor: transparent
    textColor: "{colors.ink}"
    typography: "{typography.tab-label}"
  tab-bar-item-inactive:
    backgroundColor: transparent
    textColor: "{colors.muted}"
    typography: "{typography.tab-label}"
  new-report-fab:
    backgroundColor: "{colors.primary-vivid}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.full}"
    height: 52px
```

## Overview

This is a **trust-first, utilitarian** system: a cool pale-lavender canvas (`{colors.canvas}` #eff2fb, not pure white) holds pure-white cards with no borders or shadows — separation comes from color contrast alone, which keeps the interface calm and legible under bright factory-floor lighting. One confident blue (`{colors.primary}` #0257d8) carries chrome and alert banners, while a distinct, brighter blue (`{colors.primary-vivid}` #0166f4) is reserved for the single floating "New Report" action, so the button people need most in the moment — spotting a leak, a broken guard rail — always stands apart from ordinary chrome.

Hero numbers (an open-reports count, an unresolved-issues count) are the loudest type in the system — bold, near-black, and roughly 2× the size of any section header — while everything else stays in a modest 12–20px band. Shape language is soft but structural: ~20px card radius, fully-round pills and icon buttons, and a bottom tab bar whose center action is a raised circular FAB that breaks the bar's baseline.

**Key characteristics:**
- Canvas is pale lavender, not white — cards float on it with zero borders.
- A three-tier blue system: `{colors.primary}` for chrome/banners, `{colors.primary-vivid}` for the one primary action (New Report), `{colors.accent-sky}` for lower-urgency secondary banners.
- One warm non-blue accent (`{colors.warning-bg}` / `{colors.warning-text}`) flags pending/unresolved states without borrowing red — red is reserved for genuinely urgent/safety-critical flags, not routine pending states.
- Horizontally-scrolling carousels peek the next card at the edge to signal more content.
- Five-item bottom tab bar with a raised circular FAB as the center item — "New Report" is always one tap away.

## Colors

| Token | Value | Use |
|---|---|---|
| `primary` | #0257d8 | Chrome — top-bar icons, alert/status banners |
| `primary-vivid` | #0166f4 | The New Report FAB (kept visually distinct from `primary`) |
| `primary-navy` | #012a94 | Small dense marks only (e.g. a status/shift badge) |
| `accent-sky` | #62ceff | Lower-urgency secondary banner (reminders, tips) |
| `action-pill-bg` | #b3ccf5 | Low-contrast CTA pill sitting on top of a `primary`-filled card |
| `warning-bg` / `warning-text` | #fef6e3 / #74540d | Cream-and-amber pending/unresolved tag — not an error color |
| `canvas` | #eff2fb | Page background (pale lavender, not white) |
| `surface-card` | #ffffff | All card surfaces |
| `surface-soft` | #f6f7fb | Near-white fill for icon buttons sitting inside a white card |
| `ink` | #0a0a0a | Primary text — near-true-black on headline figures |
| `muted` | #68686c | Secondary labels |
| `muted-soft` | #a8a7ad | Lowest-emphasis text (e.g. trailing "See all" links) |
| `on-primary` | #ffffff | Text/icons on any blue fill |
| `scrim` | #000000 | Modal backdrop |

A true error/critical-safety color (red) is not yet defined — see Known Gaps.

## Typography

**Font:** Inter — free, SIL Open Font License, built for small screen sizes, humanist and even-weighted so it stays calm and legible at a glance. Stack: `'Inter', -apple-system, system-ui, "Helvetica Neue", sans-serif`.

| Token | Size | Weight | Use |
|---|---|---|---|
| `stat-display` | ~40px | 700 | Hero figure — e.g. open/unresolved report count |
| `screen-title` | ~28px | 700 | Top-level screen title |
| `section-header` | ~20px | 700 | Rail/section headers |
| `tile-number` | ~17px | 700 | Small bold counters inside cards |
| `body-md` | ~16px | 400 | Card body copy, banner text |
| `link-muted` | ~15px | 500 | Trailing links ("See all") |
| `button-sm` | ~14px | 700 | Pill button labels |
| `caption` | ~12px | 400 | Muted captions |
| `tab-label` | ~10px | 500 | Bottom tab bar labels |

All text is sentence case, no uppercase/italics/letter-spacing tricks. The hierarchy is deliberately steep — the hero figure is ~2.3× the screen title's cap-height — so nothing competes with it for attention: whatever number matters most on that screen is what the eye lands on first.

## Layout & Spacing

- **Base unit:** 4px — `{spacing.xxs}` 2 · `{spacing.xs}` 4 · `{spacing.sm}` 8 · `{spacing.md}` 12 · `{spacing.base}` 16 · `{spacing.lg}` 20 · `{spacing.xl}` 24 · `{spacing.xxl}` 32 · `{spacing.section}` 28.
- **Card padding:** ~20px typical, tightening to ~16px where three items share one row (e.g. a quick-action button group).
- **Carousel peek:** the next card in a horizontal rail shows 10–15% of its width as a "there's more" cue.
- **Screen structure:** transparent top bar (~56px) with circular icon buttons left/right and an avatar top-right; single-column content with ~16–20px side margins; fixed white bottom tab bar (~64px) with the center item raised as a FAB.

## Elevation

Cards separate from the canvas by color contrast alone (`{colors.surface-card}` on `{colors.canvas}`), not shadows — this keeps visual noise low, which matters on a phone screen viewed outdoors or under harsh plant lighting. The FAB floats above the tab bar via z-order/clipping rather than a visible shadow.

## Components

**Navigation** — `top-bar`: transparent, circular icon buttons + avatar. `bottom-tab-bar`: white, 5 items (e.g. Home, Reports, New Report, Activity, Profile), inactive in `{colors.muted}` / active in `{colors.ink}`, center item raised as `new-report-fab` (`{colors.primary-vivid}` circle).

**Hero/summary cards** — `summary-card`: white, `{rounded.lg}`, header + oversized hero figure (e.g. "4 Open Reports"), optionally closed by a full-bleed colored `summary-card-banner` strip at the bottom edge (e.g. "3 reports need your review"); a denser variant adds a small `status-badge-tag`, a `warning-tag-pill` for pending items, a caption, and a row of `quick-action-button` circular icon buttons (e.g. New Report, My Location, Report Info). `activity-summary-card`: muted label ("Recent activity") + bold count + a cluster of small overlapping category icons.

**Discovery/alerts** — `section-header-row`: bold label + trailing `see-all-link`. `featured-alert-card`: wide `primary`-filled card with a badge, headline, and a `pill-cta-light` action pill — for a flagged or urgent report that needs attention. `inline-banner-sky`: lower-urgency full-width banner in `accent-sky`, for reminders and tips. `warning-tag-pill`: small cream/amber pending-state tag ("Awaiting review"). `filter-chip`: white fully-rounded pill in a scrolling row (e.g. category filters: Equipment, Leak, Safety, Cleanliness). `category-grid-card` / `category-icon-chip`: white card with a headline, a grid of small category icons (e.g. resolved-by-category), and a text link.

**Buttons** — `icon-button-round`: white circle, `primary` icon, ~44px. `quick-action-button`: `surface-soft` circle with a caption label beneath, ~56px. `pill-cta-light`: low-contrast pill for use on top of a colored card. `new-report-fab`: the system's one bold interactive-color moment — always available, always the same color, so it's never mistaken for anything else.

## Known Gaps

- **Error/critical-safety color:** not yet defined. A genuinely urgent flag (e.g. a safety hazard, not just a routine pending report) likely needs a red or high-alert token distinct from `warning-bg`/`warning-text`, which currently only signals routine "pending" states.
- **Dark mode:** not yet defined — useful for low-light plant areas or night shifts.
- **Hover/pressed/loading states:** not yet defined for any component.
- **Form/validation states:** not yet defined — a report form (photo upload, location, description, severity) will need input, error, and success states.
- **Icon set:** not yet chosen — category icons (equipment, leak, safety, cleanliness) and status icons need a consistent icon library.
- **Real content model:** screen structure above is illustrative (open-reports count, flagged-report card, category grid). The actual information architecture — what a report record contains, what statuses exist, how supervisors triage — still needs to be defined before these components are built out.