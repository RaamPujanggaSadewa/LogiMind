# LogiMind — clickable prototype

LogiMind is a multi-tenant B2B platform for freight forwarders and 3PLs in Southeast Asia. A forwarder connects its vendors and customers, and RFQs, quotes, bookings, documents and tracking flow through one place instead of WhatsApp, email and Excel. Staff start every job with a plain-language prompt.

This repository holds the **tenant-staff prototype**: static HTML pages built on the design system in [`DESIGN.md`](DESIGN.md). All companies, prices and regulations are illustrative sample data, and the AI responses are scripted.

## Run it

No build step or dependencies are needed. Serve the folder and open it in a browser at least 1280px wide:

```bash
python3 -m http.server 5180
```

Then open http://localhost:5180.

## Screens

| Page | Screen |
|---|---|
| `index.html` | Home overview: prompt composer, pipeline, needs attention, active shipments |
| `inbox.html` | Inbox (Primary / Other / Later / Cleared) |
| `chat.html` | Prompt → structured request → compliance checklist → draft RFQs by leg |
| `rfq.html` | RFQ detail: replies, side-by-side offers, AI recommendation, award |
| `quote.html` | Quote builder: internal costs and margin, tenant-branded customer preview |
| `shipment.html` | Shipment workspace: milestones, AI document checks, per-party threads, "View as" |
| `network.html` | Vendor and customer directory, invitations, marketplace (coming soon), invite flow |
| `org.html?id=truk` | Organization profile |

Useful states: `index.html?state=new`, `rfq.html?state=expired`, `shipment.html?as=kopi`, `network.html?state=empty`.

See [`LogiMind-Demo-Guide.pdf`](LogiMind-Demo-Guide.pdf) for a step-by-step demo script.

## Structure

- `assets/logimind.css`: design tokens and shared components
- `assets/shell.js`: icon rail and context sidebars
- `assets/data.js`: sample data (the prototype's "today" is Tue 10 Nov 2026)
- `concepts/`: earlier exploration (shipper-facing chat)
