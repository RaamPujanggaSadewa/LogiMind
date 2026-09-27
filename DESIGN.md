# LogiMind — Design System

**Version:** alpha (v0.2 — rebased on the desktop workspace reference)

Design system for LogiMind, a desktop web dashboard for **high-volume international shipping** (export/import by sea or air freight: FCL/LCL containers, pallets, bulk). It is not for parcels or small courier packages. Users create a shipment **by prompting**. A sender types something like *"Ship 2 × 40ft containers of coffee beans from Surabaya to Shanghai in November"*, and the AI assistant explains the regulations, lists the documents and preparation steps for that trade lane, suggests the best route, and gives a price estimate.

The visual language is taken from a calm, productivity-workspace reference. A saturated violet **icon rail** anchors the far left. Beside it sits a light-gray **context sidebar** (inbox, AI chats, trade lanes, channels, direct messages), and a large white **main panel** holds tabbed content and empty states. Violet appears in only three places: the rail, the single primary button, and small identity marks such as avatars and space badges. Everything else is neutral gray on white, separated by hairline borders rather than shadows. Type is small, even and sentence case. Density is desktop-comfortable: 14px body, 36px rows and generous whitespace in the main panel.

## Design Tokens

Raw token values, for pulling into code or a design tool. The sections below explain each token. Values are sampled from the reference screenshot (a Retina capture, normalized to CSS px). Treat hex values as ±2–3% approximations until they are verified in a design tool.

```yaml
colors:
  # Brand / violet
  primary: "#5B3DE0"          # primary button fill ("Invite people"), brand icon
  primary-hover: "#4D30CC"
  primary-pressed: "#4226B3"
  primary-soft: "#EEEAFD"     # tinted fill behind brand icons, selected chips
  rail-top: "#6001D5"         # icon rail gradient start (matches logo)
  rail-bottom: "#3D12A0"      # icon rail gradient end
  on-rail: "#FFFFFF"          # rail icons + labels (90% opacity inactive, 100% active)
  rail-active-tile: "#FFFFFF" # white rounded tile behind the active rail item

  # Neutrals
  shell: "#F2F2F3"            # outermost app background (thin gutter around panels)
  sidebar: "#F7F7F8"          # context sidebar background
  surface: "#FFFFFF"          # main panel, buttons, cards, empty-state tile
  nav-active: "#EBEBED"       # selected sidebar row fill
  nav-hover: "#F0F0F2"
  border: "#E4E4E7"           # panel borders, button outlines
  divider: "#ECECEE"          # sidebar section dividers, tab separators
  ink: "#1F1F23"              # primary text, active tab underline
  text-secondary: "#3F3F46"   # sidebar row labels
  muted: "#6B6B73"            # icons, secondary copy (empty-state subtext)
  muted-soft: "#9C9CA3"       # section labels, placeholder rows ("New Space"), workspace suffix
  disabled: "#B8B8BE"         # disabled button text/icon ("Clear all")
  on-primary: "#FFFFFF"

  # Identity marks (avatars, space/channel badges)
  avatar-teal: "#4FB59F"
  avatar-indigo: "#4C5BD4"
  avatar-violet: "#6A4BE0"
  badge-channel: "#3D9C88"    # small square workspace badge on a channel icon
  presence-offline: "#A1A1AA" # ring on avatar presence dot
  presence-online: "#22A06B"  # not in reference; defined for completeness

  # Status (LogiMind extension — not in reference)
  success: "#1F9D63"
  success-soft: "#E7F6EE"
  warning: "#B7791F"
  warning-soft: "#FDF4E3"
  danger: "#D93A3A"
  danger-soft: "#FDECEC"
  info: "#2F6FDB"
  info-soft: "#EAF1FD"

  scrim: "rgba(15, 15, 20, 0.45)"

typography:
  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif"
  empty-title:
    fontSize: 18px
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: -0.1px
  sidebar-title:
    fontSize: 17px
    fontWeight: 600
    lineHeight: 1.3
  tab-label:
    fontSize: 14px
    fontWeight: 500
    lineHeight: 1.3
  nav-item:
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.3
  body:
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.45
  button:
    fontSize: 14px
    fontWeight: 500
    lineHeight: 1.2
  button-sm:
    fontSize: 13px
    fontWeight: 500
    lineHeight: 1.2
  section-label:
    fontSize: 12.5px
    fontWeight: 500
    lineHeight: 1.3
  caption:
    fontSize: 12px
    fontWeight: 400
    lineHeight: 1.3
  rail-label:
    fontSize: 10.5px
    fontWeight: 500
    lineHeight: 1.2

rounded:
  none: 0px
  xs: 4px      # space avatar square, channel badge
  sm: 6px      # sidebar row, icon button, rail active tile
  md: 8px      # panels, primary button, split button
  lg: 12px     # empty-state icon tile, cards
  xl: 16px     # prompt composer
  full: 9999px # filter pill, avatars

spacing:
  xxs: 2px
  xs: 4px
  sm: 8px
  md: 12px
  base: 16px
  lg: 20px
  xl: 24px
  xxl: 32px
  xxxl: 48px

size:
  rail-width: 56px
  rail-item: 44px            # icon + label hit area height ~58px incl. label
  sidebar-width: 240px
  sidebar-row: 30px
  tab-bar-height: 52px
  toolbar-height: 40px
  control-sm: 28px           # Filter pill, settings icon button, Clear all
  control-md: 32px           # sidebar "+ ⌄" split button
  control-lg: 40px           # primary button
  avatar-sm: 18px
  icon: 16px
  icon-rail: 20px
  empty-tile: 48px

components:
  app-shell:
    backgroundColor: "{colors.shell}"
    padding: 4px
    gap: 4px
  icon-rail:
    background: "linear-gradient(180deg, {colors.rail-top}, {colors.rail-bottom})"
    textColor: "{colors.on-rail}"
    typography: "{typography.rail-label}"
    width: "{size.rail-width}"
    rounded: "{rounded.md}"
  rail-item-active:
    tileColor: "{colors.rail-active-tile}"
    iconColor: "{colors.primary}"
    rounded: "{rounded.sm}"
  context-sidebar:
    backgroundColor: "{colors.sidebar}"
    borderColor: "{colors.border}"
    width: "{size.sidebar-width}"
  sidebar-header:
    typography: "{typography.sidebar-title}"
    textColor: "{colors.ink}"
  split-add-button:
    backgroundColor: "{colors.surface}"
    borderColor: "{colors.border}"
    height: "{size.control-md}"
    rounded: "{rounded.md}"
  sidebar-row:
    textColor: "{colors.text-secondary}"
    iconColor: "{colors.muted}"
    typography: "{typography.nav-item}"
    height: "{size.sidebar-row}"
    rounded: "{rounded.sm}"
    padding: "0 8px"
  sidebar-row-active:
    backgroundColor: "{colors.nav-active}"
    textColor: "{colors.ink}"
  sidebar-row-placeholder:
    textColor: "{colors.muted-soft}"   # "+ New Space", "+ Add Channel", "+ Ask, Build, Create"
  sidebar-section-label:
    textColor: "{colors.muted}"
    typography: "{typography.section-label}"
  space-avatar:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    size: 18px
    rounded: "{rounded.xs}"
  user-avatar:
    size: "{size.avatar-sm}"
    rounded: "{rounded.full}"
    presenceDot: 7px
  main-panel:
    backgroundColor: "{colors.surface}"
    borderColor: "{colors.border}"
    rounded: "{rounded.md}"
  tab-bar:
    height: "{size.tab-bar-height}"
    borderBottom: "1px {colors.divider}"
    separator: "1px {colors.divider}"
  tab-active:
    textColor: "{colors.ink}"
    indicator: "2px {colors.ink}"
  tab-inactive:
    textColor: "{colors.text-secondary}"
  filter-pill:
    backgroundColor: "{colors.surface}"
    borderColor: "{colors.border}"
    textColor: "{colors.text-secondary}"
    typography: "{typography.button-sm}"
    height: "{size.control-sm}"
    rounded: "{rounded.full}"
    padding: "0 12px"
  icon-button:
    backgroundColor: "{colors.surface}"
    borderColor: "{colors.border}"
    iconColor: "{colors.muted}"
    size: "{size.control-sm}"
    rounded: "{rounded.sm}"
  button-secondary-disabled:
    borderColor: "{colors.border}"
    textColor: "{colors.disabled}"
    height: "{size.control-sm}"
    rounded: "{rounded.sm}"
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.button}"
    height: "{size.control-lg}"
    rounded: "{rounded.md}"
    padding: "0 16px"
  empty-state:
    iconTile: "{size.empty-tile} {colors.surface} border {colors.border} {rounded.lg}"
    iconColor: "{colors.primary}"
    titleTypography: "{typography.empty-title}"
    bodyTextColor: "{colors.muted}"
    gap: "{spacing.base}"
  # LogiMind extensions (built from the tokens above; not in the reference)
  prompt-composer:
    backgroundColor: "{colors.surface}"
    borderColor: "{colors.border}"
    focusBorderColor: "{colors.primary}"
    rounded: "{rounded.xl}"
    minHeight: 96px
    padding: "{spacing.base}"
  suggestion-chip:
    backgroundColor: "{colors.surface}"
    borderColor: "{colors.border}"
    rounded: "{rounded.full}"
    height: "{size.control-sm}"
  status-tag:
    rounded: "{rounded.xs}"
    typography: "{typography.caption}"
    padding: "2px 6px"
  content-card:
    backgroundColor: "{colors.surface}"
    borderColor: "{colors.border}"
    rounded: "{rounded.lg}"
    padding: "{spacing.base}"
```

## Product context

LogiMind handles **bulk and commercial cross-border freight**. A typical user is an exporter, importer or trading company moving containers, pallets or bulk cargo between countries. The product's core promise is that **the prompt is the entry point**:

1. **Prompt:** the sender describes the shipment in plain language (goods, quantity, origin, destination, timing).
2. **Understand:** the AI identifies the trade lane (e.g. Indonesia → China), the likely HS code, and the applicable rules. Examples include the Indonesian export declaration (PEB), the certificate of origin under a free-trade agreement (Form E for ASEAN–China), the destination country's import registration and labeling requirements, and restricted or prohibited goods checks.
3. **Prepare:** it turns those rules into a **document checklist** (commercial invoice, packing list, bill of lading or air waybill, certificate of origin, and phytosanitary, fumigation or health certificates when relevant) and a **task list** of what the sender must do and by when.
4. **Plan:** it proposes **route options** (port pairs, carrier/mode, transit time, transshipments) and a **price estimate** (freight, surcharges, customs and handling, duties/taxes where estimable).
5. **Create:** the confirmed plan becomes a shipment record that the sender, forwarders and customs brokers track together in the workspace.

Regulatory examples in this document are illustrative. The product must source real requirements from maintained data and never from hard-coded UI copy.

## Overview

This is a **calm, workspace-style** desktop system. The layout has three columns: a narrow violet **icon rail**, a light-gray **context sidebar**, and a wide white **main panel**. All three sit on a very light gray **shell** (`{colors.shell}`) with a ~4px gutter, so each panel reads as its own rounded, bordered surface. Separation comes from **1px hairline borders and background steps** (shell → sidebar → white), not shadows.

Violet (`{colors.primary}` #5B3DE0) is used sparingly. It fills the entire rail, which acts as the brand's identity block, and otherwise appears only on the **one primary button per view**, on brand icons (the empty-state glyph) and on identity marks (space avatars). Everything interactive in the main panel is neutral: outlined white pills and icon buttons, and gray text. The primary action therefore always stands out.

**Key characteristics:**
- The three-column shell (rail 56px, sidebar ~240px, fluid main) always shows the icon rail and the context sidebar.
- The violet rail has a subtle vertical gradient (lighter at the top). The active item sits on a white rounded tile with a violet glyph. Inactive items are white glyphs with 10–11px labels beneath.
- The context sidebar follows a strict pattern: a header with a title and a split "+ ⌄" add button, then primary nav rows, then a divider, then labeled sections (AI Chats, Spaces, Channels, Direct Messages). Each section ends in a muted "+ Add …" placeholder row.
- The main panel opens with an equal-width **tab bar** (icon + label, thin vertical separators, 2px ink underline on the active tab), then a **toolbar row** with a Filter pill on the left and settings plus bulk actions on the right.
- Empty states are centered in the panel: a small bordered icon tile, a semibold title, one muted line of copy and a single violet primary button.
- Everything is sentence case at 12–18px. No display-size type appears in the reference.

## Colors

| Token | Value | Use |
|---|---|---|
| `primary` | #5B3DE0 | Primary button fill, brand glyphs, space avatar |
| `primary-hover` / `primary-pressed` | #4D30CC / #4226B3 | Primary button states |
| `primary-soft` | #EEEAFD | Tinted background for selected chips / AI-message accents |
| `rail-top` → `rail-bottom` | #6001D5 → #3D12A0 | Icon rail vertical gradient (tuned to the LogiMind logo) |
| `on-rail` | #FFFFFF | Rail glyphs + labels (inactive at ~90% opacity) |
| `rail-active-tile` | #FFFFFF | Rounded tile behind the active rail item (glyph turns `primary`) |
| `shell` | #F2F2F3 | Outer app background / gutter between panels |
| `sidebar` | #F7F7F8 | Context sidebar background |
| `surface` | #FFFFFF | Main panel, buttons, pills, empty-state tile, cards |
| `nav-active` | #EBEBED | Selected sidebar row ("Inbox") |
| `nav-hover` | #F0F0F2 | Sidebar row hover |
| `border` | #E4E4E7 | Panel edges, outlined buttons and pills |
| `divider` | #ECECEE | Sidebar section divider, tab separators, tab-bar bottom edge |
| `ink` | #1F1F23 | Headings, active tab label and underline |
| `text-secondary` | #3F3F46 | Sidebar row labels, inactive tab labels, pill text |
| `muted` | #6B6B73 | Icons, empty-state body copy, section labels |
| `muted-soft` | #9C9CA3 | Placeholder "+ Add …" rows, workspace suffix ("— Tetanggaku") |
| `disabled` | #B8B8BE | Disabled buttons ("Clear all" with nothing to clear) |
| `avatar-teal` / `avatar-indigo` / `avatar-violet` | #4FB59F / #4C5BD4 / #6A4BE0 | User initials avatars (assigned deterministically per user) |
| `badge-channel` | #3D9C88 | Small square workspace badge overlaid on a channel "#" glyph |
| `presence-offline` | #A1A1AA | Presence dot ring (hollow white dot = offline) |

**Status colors (extension).** The reference has no semantic colors. LogiMind needs them for document and shipment states, so they are defined as soft-fill tags: `success` (document approved, cleared customs), `warning` (document missing or expiring, action due soon), `danger` (restricted goods, rejected document, blocked shipment) and `info` (AI note, regulatory tip). Each has a `-soft` background and its full value for text and icons. Never use violet for status; violet always means brand or primary action.

## Typography

**Font:** Inter (SIL OFL). The reference uses a neutral grotesque, and Inter matches its proportions closely. Stack: `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif`.

| Token | Size | Weight | Use (reference → LogiMind) |
|---|---|---|---|
| `empty-title` | 18px | 600 | "Looking to collaborate?" → "Where are you shipping today?" |
| `sidebar-title` | 17px | 600 | Sidebar header ("Home") |
| `tab-label` | 14px | 500 | Main-panel tabs (Primary / Other / Later / Cleared) |
| `nav-item` | 14px | 400 | Sidebar rows (Inbox, Replies, Spaces, DMs) |
| `body` | 14px | 400 | Panel copy, empty-state subtext, AI responses |
| `button` | 14px | 500 | Primary button ("Invite people") |
| `button-sm` | 13px | 500 | Filter pill, "Clear all", suggestion chips |
| `section-label` | 12.5px | 500 | Sidebar section labels (AI Chats, Spaces, Channels, Direct Messages) |
| `caption` | 12px | 400 | Metadata, workspace suffix, status tags |
| `rail-label` | 10.5px | 500 | Labels under rail icons (Home, Spaces, Chat…) |

Use sentence case and Title Case only for proper nouns and product nav names, as in the reference ("Assigned Comments", "My Tasks"). Avoid uppercase labels, italics and letter-spacing tricks. The scale is flat on purpose, because the interface's hierarchy comes from **position and color** rather than size. Numbers such as prices and transit days use `font-variant-numeric: tabular-nums`.

## Layout & Spacing

- **Base unit:** 4px: `xxs` 2 · `xs` 4 · `sm` 8 · `md` 12 · `base` 16 · `lg` 20 · `xl` 24 · `xxl` 32 · `xxxl` 48.
- **Shell:** `{colors.shell}` background with a 4px outer margin and 4px gaps. The rail is a separate rounded block. The sidebar and main panel share one bordered container (`{rounded.md}`), split by a 1px vertical `border`.
- **Icon rail (56px):** logo tile at the top, then items stacked with ~86px vertical rhythm (20px glyph, 4px gap, label). **Invite** is pinned to the bottom, separated from the list.
- **Context sidebar (~240px):** 16px side padding. Header row ~56px ("Home" + split button right-aligned). Nav rows are 30px tall with an 8px icon–label gap and 16px icons. The divider has 12px vertical margin. Section labels have 24px space above and 8px below. Section-level "+" icon buttons are right-aligned with the label.
- **Main panel:**
  - **Tab bar (52px):** tabs share equal widths, are left-aligned with an icon + label and have 1px vertical separators between them. The active tab gets a 2px `ink` underline spanning the full tab width.
  - **Toolbar (40px):** sits 12px below the tab bar with 24px side padding. Filter pill on the left; settings icon button and "Clear all" on the right with an 8px gap.
  - **Content:** fluid. Empty states are centered horizontally and vertically in the remaining space.
- **Empty state stack:** icon tile, then 24px gap, title, 8px gap, body, 20px gap, primary button.

## Elevation

The UI is **flat**. Surfaces are distinguished by background step and a 1px border: shell (#F2F2F3), then sidebar (#F7F7F8), then panel (#FFFFFF). The empty-state icon tile is the only element with a hint of lift: a 1px border plus a very soft shadow (`0 1px 2px rgba(16,16,24,0.06)`). Menus, popovers and modals (not shown in the reference) use `0 8px 24px rgba(16,16,24,0.12)` with a 1px `border` and sit above `scrim` for modals.

## Components

**Navigation**
- `icon-rail`: violet gradient column. Items in order: logo/**Home**, **Shipments**, **Assistant** (AI chat), **RFQs** (RFQs & Quotes), **Network** (vendors, customers, invitations), **Docs** (document vault), **Planner** (cut-offs, pickup/ETD/ETA calendar), **More**. **Invite** (invite partner) is pinned at the bottom. Dashboards/analytics is deferred to Phase 3 and not in the rail. Active item: white rounded tile (`{rounded.sm}`) with a violet glyph. Inactive: white glyph with a label below. *(Reference: Home, Spaces, Chat, Planner, AI, Teams, Docs, Dashboards, Whiteboards, More, Invite.)*
- `context-sidebar`: contents change with the rail selection. For **Home**:
  - Header: **Home** + `split-add-button` ("+" = new shipment prompt; "⌄" = new quote, upload document, new trade lane).
  - Primary rows: **Inbox** (active), **Replies**, **Assigned Comments**, **Action Items** (documents or tasks waiting on me), **Meetings**, **My Tasks**, **More**. *(Reference row "Skills" maps to "Action Items".)*
  - Divider.
  - **AI Chats**: saved shipment-planning conversations, topped by the placeholder row **"+ Ask, Plan, Ship"**, which opens a new prompt. *(Reference: "+ Ask, Build, Create".)*
  - **Spaces** → **Trade Lanes**: e.g. *All Shipments — {workspace}*, *ID → CN* (space avatar with initials), and a **"+ New Trade Lane"** placeholder. Section header has a "+" icon button.
  - **Channels**: team channels such as *General — {workspace}* (hash glyph + `badge-channel`), plus **"+ Add Channel"**.
  - **Direct Messages**: people (teammates, forwarder contacts, customs brokers) with `user-avatar` initials and presence dots.
- `sidebar-row`: 16px icon + label. The active row gets a `nav-active` fill with `{rounded.sm}`. An optional trailing suffix in `muted-soft` shows the workspace name ("All Tasks - Tetanggaku").

**Main panel: Inbox**
- `tab-bar`: **Primary** (inbox glyph), **Other** (activity pulse), **Later** (clock), **Cleared** (check-list). In LogiMind, *Primary* holds items needing action (a document requested, a quote ready, a regulation change on an active lane). *Other* holds FYI activity. *Later* holds snoozed items. *Cleared* holds done items.
- Toolbar: `filter-pill` ("Filter" with a filter-lines icon) on the left. `icon-button` (settings gear) and `button-secondary-disabled` ("Clear all", enabled only when the list has items) on the right.
- `empty-state` (reference): tile with a violet "add person" glyph, the title **"Looking to collaborate?"**, the body **"Collaboration is one invite away."** and the primary button **"Invite people"**. LogiMind keeps this for the Inbox's empty state when the workspace has no teammates.

**Buttons & controls**
- `button-primary`: violet fill, white 14px/500 label, 40px, `{rounded.md}`. Use at most one per view.
- `split-add-button`: white, outlined, "+" and "⌄" in one 32px control, with a divider between them.
- `filter-pill`: white, outlined, fully rounded, 28px, icon + label.
- `icon-button`: white, outlined, 28px square, `{rounded.sm}`, muted glyph.
- `button-secondary-disabled`: outlined, `disabled` text and icon, no hover.
- Section "+" (sidebar): 22px borderless square with `{rounded.xs}` and a `nav-hover` fill on hover.

**Identity**
- `user-avatar`: 18px circle, white initial on an `avatar-*` color, 7px presence dot bottom-right (hollow gray ring = offline).
- `space-avatar`: 18px `{rounded.xs}` square, violet, white initial ("S"), used for trade lanes and spaces.
- Channel glyph: "#" in `muted` with a 10px `badge-channel` square showing the workspace initial ("T").

**LogiMind extensions.** These are not in the reference and are built only from the tokens above so they stay on-system.
- `prompt-composer`: the **primary entry point**. It appears as the Home empty state ("Where are you shipping today?") and at the bottom of every AI chat. White, 1px `border`, `{rounded.xl}`, 96px minimum height, focus border `primary`. Placeholder copy: *"e.g. Ship 20 tons of coffee beans from Surabaya to Shanghai in November"*. The right side holds attach (upload invoice or packing list) and send (a violet `button-primary`, icon-only, 32px). Below it sits a row of `suggestion-chip`s: "Export to China", "Import from Japan", "Check documents for HS code…", "Compare sea vs air".
- **AI response blocks** (inside a chat, in `content-card`s):
  - *Regulation summary*: `info-soft` left accent, bullet list, source links.
  - *Document checklist*: rows with a document name, who issues it, a status-tag (`Ready` success / `Missing` warning / `Rejected` danger) and an upload action.
  - *Route options*: 2–3 cards side by side, each with origin port → destination port, mode, carrier, transit days, transshipments and a price range. The recommended card gets a `primary-soft` background and a "Recommended" tag.
  - *Price estimate*: line items (freight, surcharges, origin/destination handling, customs, estimated duties) in tabular numerals with a bold total and a currency selector. Always labeled "Estimate".
  - *Next step*: one `button-primary` ("Create shipment").
- `status-tag`: 4px-radius soft-fill tag with 12px text, in success / warning / danger / info / neutral (`nav-active` bg + `text-secondary`) variants.

## Reference → LogiMind mapping

| Reference element | Reference content | LogiMind content |
|---|---|---|
| Rail logo tile | Brand mark (white tile) | LogiMind mark. Use our own logo, not the reference's |
| Rail items | Home, Spaces, Chat, Planner, AI, Teams, Docs, Dashboards, Whiteboards, More, Invite | Home, Shipments, Assistant, RFQs, Network, Docs, Planner, More, Invite |
| Sidebar header | Home + "+ ⌄" | Home + "+ ⌄" (new shipment prompt / quote / upload / trade lane) |
| Primary rows | Inbox, Replies, Assigned Comments, Skills, Meetings, My Tasks, More | Inbox, Replies, Assigned Comments, Action Items, Meetings, My Tasks, More |
| AI Chats | "+ Ask, Build, Create" | "+ Ask, Plan, Ship" and a list of saved shipment chats |
| Spaces | All Tasks — Tetanggaku, Space, + New Space | All Shipments — {workspace}, trade lanes (ID → CN…), + New Trade Lane |
| Channels | General — Tetanggaku, + Add Channel | General — {workspace}, + Add Channel |
| Direct Messages | Muhamad Ikhsan Ardiansyah, Muhammad Nur Kholis, Ahmad Bairuni Hasibuan | Teammates, forwarder and broker contacts |
| Tabs | Primary, Other, Later, Cleared | Same labels (inbox triage) |
| Toolbar | Filter · ⚙ · Clear all | Same |
| Empty state | "Looking to collaborate?" / "Collaboration is one invite away." / Invite people | Inbox: same. Home: prompt composer |

## Prototype additions (v0.3)

Built for the tenant-staff prototype (`index.html`, `inbox.html`, shared `assets/`). All use existing tokens only.

**Home = Overview, not Inbox.** For tenant staff (freight forwarders), Home opens an **Overview**: prompt composer → pipeline strip → *Needs attention* + *Active shipments* (main column) → *Next 7 days*, *Network activity*, *Lane updates* (320px side column, which stacks below the main column under 1320px). Inbox keeps the reference's tabbed layout as its own sidebar row. Home sidebar rows: Overview, Inbox, Replies, Assigned to me, Action items, My tasks. The sidebar header shows the tenant's short name (full legal name in the tooltip).

**New components**
- `page-head`: 52px bar matching `tab-bar` height; 14px/600 title, `caption` metadata, right-aligned pills/icon buttons.
- `visibility`: 12px `muted` line with an eye (or lock for internal pages) glyph: "Visible to: **You, PT Truk Jaya**". Required on every shared object row and screen.
- `org-avatar`: 28px `{rounded.sm}` square, `nav-active` fill, `text-secondary` initials. Organizations (vendors, customers) — distinct from round person avatars.
- `org-badge`: 11px `{rounded.xs}` chip in `text-secondary` with white 6.5px initials, overlaid bottom-right on a `user-avatar` for external contacts, in place of the presence dot. The org's short name follows the person's name in `muted-soft`.
- `pipeline-strip`: bordered `{rounded.lg}` row of equal stages divided by `divider` hairlines with chevron notches. Each stage: `section-label` + 18px/600 tabular count + `caption` note (`warning`/`danger` when action is needed). Stages: Requests → RFQs out → Quoting → Booked → In transit → Cleared.
- `attention-row`: 28px tinted status icon tile, 14px/500 title + inline `status-tag` deadline, 13px `muted` context, `visibility` line, right-aligned `button-secondary` action. Sorted by deadline.
- `data-table`: 12px/500 `muted` headers, 14px cells, 1px `divider` rows, `row-hover` (#FAFAFB) hover, first cell = ID (tabular) + stage tag with a `caption` sub-line.
- `skeleton`: `nav-hover` → `nav-active` shimmer bars for loading states.
- Token added: `row-hover` #FAFAFB (list/table row hover inside the white panel).

**Primary-button rule on Home:** the composer's send button is the one violet action; every other action on the overview is `button-secondary`.

**Screen 4 — prompt → structured request → draft RFQs (`chat.html`)**

An AI chat thread in the main panel (max 920px), a sticky `action-bar` and a composer at the bottom. The AI reply streams its reasoning steps, then reveals four blocks: an intro line, a **Structured request** card, a **Documents & compliance** card, and **Draft RFQs by leg**. Nothing goes to vendors until staff confirm in the review modal.

- `flow-stepper` (page head, right): Request → Checklist → RFQs → Compare → Quote. Pill steps; done steps get a `success` check dot, and the current step gets a `nav-active` fill.
- `field`: 12px `muted` label + borderless input (a `border` outline on hover, the `primary` focus ring on edit) + an optional 12px hint. Laid out in a 3-column grid with `divider` rules.
- `provenance tag`: 11.5px label beside each field showing where the value came from: *From your prompt*, *From customer profile* (`muted-soft`), *AI guess* (`info`), *Missing* (`warning`), *Edited* (`text-secondary`).
- `rfq-leg`: a bordered `{rounded.lg}` block. The header sits on `row-hover` and holds the leg number, service, route/timing, scope warning, vendor count and an *Include* switch. The body splits into *Scope the vendor sees* and *Suggested from your network*. The footer holds the `visibility` line and the marketplace toggle.
- `vendor-suggestion`: checkbox + `org-avatar` + name (with a *Link only* tag for vendors who haven't joined) + reason line (lane, on-time %, last price) + a 15px/600 match score. Unchecked rows fade to 50%.
- `switch` (28×16) and `checkbox` (16px, `ink` when checked): new form controls. A disabled switch plus a *Coming soon* tag marks the marketplace option.
- `action-bar`: bordered `{rounded.lg}` bar holding a summary (what will be sent, reply deadline, a shield-marked "Nothing is sent until you confirm" plus the most important warning), *Save draft* (`button-secondary`) and **Review & send** (the view's one `button-primary`, disabled when a leg has no vendor). After sending it becomes a success bar.
- `modal`: 560px panel with `shadow-pop`, a `scrim` behind it, and head/body/foot sections. Used for **Preview as vendor** (exactly what that vendor sees, plus a `danger-soft` "Hidden from this vendor" list) and for **Review & send**.
- `notice`: soft-fill callout (`warning-soft` / `info-soft`) with an icon, used for FOB scope and missing-field warnings.
- **Primary-button rule in chat:** where a flow action is on screen, the composer's send button uses a neutral `ink` fill (`send-btn.neutral`) so the flow keeps the one violet button.

**Screen 5: RFQ detail (`rfq.html`, rail: RFQs)**

The RFQs rail item gets its own context sidebar, **RFQs & Quotes**. It lists RFQ status rows (All, Ready to compare, Awaiting replies, Awarded, Expired), Customer quotes (Drafts, Sent, Accepted) and Recent RFQs. The main panel shows, top to bottom: facts strip → (deadline banner) → AI recommendation → one block per leg with offers side by side → a sticky `action-bar` whose **Award N legs** is the one violet button.

- `facts-strip`: a single-row card with Customer, Request link, Sent, Reply by + countdown tag, Replies (n of m + a 64px `success` progress bar), and Target ETD.
- `recommendation-card`: `primary-soft` background (the recommended-item rule from Route options). It has an AI label, a title and segmented pills (**Recommended** / **Lowest cost**, plus **Custom** when staff pick manually). Inside a white inset, one line per leg shows the leg number, service, vendor with the AI's one-line reason, and cost. The footer gives a trade-off sentence plus the total vendor cost, labelled "estimate".
- `offer-card`: 260px-min column in an auto-fill grid. It shows `org-avatar`, name, reply-status tag (Replied in Xh / Opened · no reply yet / No reply / Declined), *Link only* and *AI pick* tags, price per unit (18px/600) with the quoted total, and a **normalized** line in `warning` when the AI adds charges the vendor left out. Below that come a `dl` of terms (dates, waiting time, validity, free days, on-time %), vendor notes, and AI flags (`warning-soft` rows). The footer has a radio **Select** button and a compact `visibility` line. **Selected** = a 1px `primary` ring. A pending vendor gets a dashed `row-hover` card with a *Nudge on WhatsApp* / *Send reminder* action.
- `add-more placeholder`: a dashed card beside a single offer ("Only one offer to compare" + *Add vendors*).
- `deadline banner`: a `warning-soft` bar with a timer-off icon, what's missing, and *Extend 24h* / *Ask more vendors*.
- **Award modal:** lists each awarded leg and its cost. Legs with no offer stay open and don't close their vendors. It also lists *Not selected* and *RFQ closed, no reply* vendors, and has a checkbox to notify unselected vendors **without sharing prices**. After the award the stepper moves to **Quote**, the offers lock, and the action bar's primary becomes **Build customer quote**.

**Screen 6: quote builder (`quote.html`, rail: RFQs, row: Quote drafts)**

Two columns. On the left, the internal builder: an FOB notice, **Costs and margin**, and **What the customer gets**. On the right, a sticky 400px **customer preview** that updates as staff edit. Below 1280px the preview stacks underneath. **Send to customer** is the one violet button; it becomes **Request approval** when the margin is below the floor.

- `internal-badge`: an `ink`-filled 11.5px chip with a lock, "Internal only". It marks data that never leaves the tenant (vendor costs, margin). This is the one place ink is used as a fill, so it reads as a hard boundary rather than a status.
- `pricing-table`: each row is an editable customer-facing line label (an auto-growing textarea), with the vendor's `org-avatar` + name underneath (internal), vendor cost, margin % input, and a computed sell price. Own fees and add-ons have a fixed sell input instead of a margin. Optional lines (FOB ocean freight, insurance) carry an *Include* switch and a `warning` reason. The footer shows total vendor cost, then margin amount and customer price.
- `margin-gauge`: 160px track on a 0–25% scale. It has a `success-soft` band for the lane's typical range, a 2px `danger` tick at the tenant's margin floor, and an ink dot for the current margin, plus a status tag (Below floor / Below lane average / Within / Above).
- `ai-hint`: an `info-soft` strip with a suggestion, its evidence (e.g. last 8 quotes on this lane, the win rate) and an **Apply** button.
- `form-field`: a 12px/500 label, a 32px input/select or auto-height textarea, and an optional hint. Hints in `danger` are for guardrails.
- **Vendor-name guardrail:** if a customer-facing text mentions a vendor (full or short name), the field warns inline, the preview replaces it with "[partner]", and the send modal repeats the warning.
- `branded-document`: the customer-facing surface. It uses the **tenant's brand color** (`tenant.brand`, e.g. #0E6E5C) for the 4px top rule, logo tile and the customer's action buttons, never LogiMind violet. This keeps white-labelling honest and keeps the page to one violet button. It shows tenant name + portal domain, quote no./date, route, lines (itemized or all-in), total, included / not included, note, validity and payment terms, and **Accept quote** / **Ask a question**. Its footer reads "Powered by LogiMind" at 11px in `muted-soft`.
- **Send modal:** recipient card, an editable message, an *Attach PDF* checkbox, the vendor-name warning, and a lock notice listing exactly what is shared. After sending, the stepper is fully complete, the inputs lock, and the action bar shows the send confirmation plus *View in customer portal*.

**Screen 7: shipment workspace (`shipment.html`, rail: Shipments)**

The Shipments rail item gets its own sidebar: Active, Needs attention, Departing / Arriving this week, Completed, Recent shipments and Trade Lanes. The page head holds the ID, the route, a stage tag, a risk tag and a **View as** select. Below it, top to bottom: facts strip → milestone timeline → a two-column grid. The left column holds Documents and Conversations; the right (340px) holds **Next up** and Parties. **Send back with reason** in Next up is the one violet button.

- **Visibility model:** every fact, milestone, document and thread declares which parties can see it. Party names are resolved **for the viewer**. Customers never see vendor identities, and vendors never see each other; both see a role instead ("Trucking partner", "Ocean carrier"). The customer sees "Direct sailing" instead of the vessel name. Costs and margin are tenant-only. The carrier's master B/L stays internal, and the customer gets the house B/L.
- `preview-banner` (proposed): an `ink` bar reading "Previewing as {party}. This is exactly what they see. N items and all costs are hidden", with an *Exit preview* button. Also reachable by URL (`?as=kopi`). In preview, composers are disabled and internal cards (Next up, full Parties) are replaced by a `restricted` placeholder: a dashed `row-hover` box with an eye-off icon.
- `milestone-timeline` (proposed): equal columns joined by a 2px track (`success` behind completed steps). Dot states: **done** is a `success` fill with a check, **next** is an ink ring with a `nav-active` halo plus a *Next* tag, **at risk** is `warning-soft` with a warning icon and a one-line reason, and **to do** is hollow. Each column shows label, date/time and the owner (`org-avatar` 16px + name/role).
- `doc-row`: a four-column grid (document + AI check line · owner · status tag · actions + eye). The AI line takes the status colour: sparkles for passed checks, and `danger` text for failures, with the specific reason (e.g. a missing container number). Statuses: Ready, Needs fix, Fix requested, Missing, In progress, To do, After loading. The eye icon shows a count of parties with a "Visible to" tooltip. The document owner, when previewing, gets **Upload**.
- `conversations`: **one thread per party** (Team is internal; one thread each for the customer and each vendor) as underline tabs. A `row-hover` bar under the tabs shows the thread's `visibility` line, which the composer footer repeats so every message states its audience before sending. AI check results post into the relevant vendor thread as `danger`-tinted AI messages.
- `next-up` (proposed): an AI-labelled card with one prioritized action (tinted icon, bold title, why it matters now) and its primary button. After the action it moves on to the next item.
- `party-card`: the party's avatar, name (plus a *Link only* tag if they're not on LogiMind), role · contact, and two lines: *sees* (eye, `success`) and *hidden* (eye-off, `muted`). It ends with a "Preview what a party sees" link.

**Screens 2–3: Network directory, organization profile, invite flow (`network.html`, `org.html`, rail: Network)**

- **Network sidebar:** My vendors, My customers, Invitations (count of pending + received), Marketplace (a *Soon* count label), then *Vendors by type* rows (Trucking, Warehouse, Packing / Fumigation, Customs broker, Shipping line / Agent, Air) that deep-link into filtered lists.
- **Directory (`network.html?tab=vendors|customers`):** the page head has a count, a pill search (`{rounded.full}`, 28px) and **Invite partner** as the one violet button. A toolbar row holds type filter pills (`selected` = `primary-soft`) and a status select. The `data-table` columns are Organization (`org-avatar` + name + city), Service, Lanes (ellipsis + tooltip), Rating (a `warning` star + count, or "No jobs yet"), On-time, Last job, and Connection. A caption states that the network is private. Clicking a row opens the profile.
- `connection-status` tags: **Connected** (`success`, link-2), **Link only** (neutral, link: replies by magic link, no account), **Invited** (`info`, mail), **Invite expired** (`warning`, timer-off), **Accepted** (`success`), **Wants to connect** (`info`).
- **Invitations tab:** *Received* then *Sent* lists of bordered `{rounded.lg}` rows showing avatar, name + status tag, role · recipient · channel · date, a note (e.g. "Opened twice"), and actions per state: Copy link / Revoke (pending), Resend (expired), Open profile (accepted), Invite to join (link-only), Decline / Accept (received). Expired rows sit on `row-hover`.
- **Marketplace (coming soon):** an empty-state layout with a *Coming soon* tag, a promise statement (opt-in listing, private network, customers never see it), dashed preview rows for the "Also ask marketplace vendors" switch (disabled) and browsing, and a *Notify me* secondary button.
- **Empty network (`?state=empty`):** the empty-state CTA becomes the page's violet button (the header one is hidden), plus a text link to import from a spreadsheet. Sidebar counts are hidden.
- **Profile (`org.html?id=…`):** breadcrumbs in the page head. A hero shows a 52px `org-avatar` (`{rounded.lg}`), name + status tag, role · type · connected since, then Message, More and **Send RFQ** (vendors) / **New request for them** (customers). Then come an optional state banner (Link only / Invitation pending / Expired, as `info-soft` / `warning-soft`) and a 5-up stats strip (Rating, On-time, Avg. reply, Quote accuracy, Last job; for customers: Shipments, On-time, Revenue 🔒, Quotes accepted, Last shipment). The main column has Services and lanes (tags + lane rows), a **Rate card** table (Rate card vs Last quote source tags, "Visible to: You, {vendor}"), and Shared history with deep links. The side column has **Connection and visibility** (role, access, *They see* / *Never shown to them*) and Contacts. Empty sections use a dashed `row-hover` placeholder.
- **Invite flow (modal, 760px):** reachable from every "Invite partner" entry point (the rail's Invite, sidebar split menus, Home cards) and via `network.html?invite=1`. It has a 3-step `flow-stepper`:
  1. **Who:** role cards (Vendor / Customer; selected = `primary-soft` + 1px primary ring), company name with a duplicate/on-LogiMind check, contact, and a channel toggle (WhatsApp / Email) that swaps the address field.
  2. **Services and lanes:** a service choice grid (checkbox tiles) plus lane chips with suggestions from the tenant's trade lanes. Customers see a note about the branded portal instead of the services.
  3. **Preview and send:** an editable message, *They'll see* / *Never shown to them* lists, and a `message-preview` of the WhatsApp bubble or email **in the tenant's brand color**, with the magic link and "expires in 14 days".

  *Continue* stays disabled until the step is valid. Sending adds a pending invitation and the partner (status *Invited*) and switches to the Invitations tab.

## Known Gaps

- **Exact color values:** sampled from a compressed screenshot. Verify the violet, the rail gradient and the neutrals in a design tool before locking them.
- **Hover, pressed and focus states:** only the reference's static state is visible. Hover (`nav-hover`) and primary pressed/hover tokens are proposed. A visible focus ring (suggested: 2px `primary` at 40% opacity with a 2px offset) still needs to be specified and checked for contrast.
- **Dark mode:** not defined.
- **Populated inbox:** the reference shows only the empty state. Inbox list rows (avatar, title, lane tag, time, hover actions) still need to be designed.
- **AI chat surface:** message layout, streaming and loading states, citations to regulation sources and error states ("couldn't find rules for this HS code") are proposed above but not yet designed.
- **Data-dense views:** the shipment table, document vault, route comparison and quote breakdown need table, tag and number-formatting specs (currency, weight, volume in CBM, container types).
- **Icon set:** the reference uses a thin (≈1.5px stroke), rounded line icon style. Pick a library that matches (e.g. Lucide or Tabler) and add freight-specific glyphs (container, vessel, plane, customs, document stamp).
- **Responsive behavior:** the reference is a wide desktop layout. Tablet and mobile behavior (a collapsible sidebar, a rail turned into a bottom bar) is undefined.
- **Regulatory content model:** the checklist, route and price components assume a structured data source for trade-lane rules, carriers and rates. That model needs to exist before these components can show real data.
