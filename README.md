# LogiMind — clickable prototype

LogiMind is a multi-tenant B2B platform for logistics companies in Southeast Asia. A logistics company (the paying tenant) runs its operations in a LogiMind workspace. Its senders (shippers and consignees) get a portal branded as that logistics company, and its partners (trucking, warehouse, fleet) see the jobs assigned to them.

This repository holds static HTML pages built on the design system in [`DESIGN.md`](DESIGN.md). **All companies, people, prices, rates and regulations are illustrative sample data**, and the AI responses are scripted.

## Run it

No build step or dependencies are needed. Serve the folder, then open the login page in a browser at least 1280px wide:

```bash
python3 -m http.server 5180
```

Open http://localhost:5180/login.html. Any page opened without a session redirects to the login page, then continues to that page after you sign in.

## Demo accounts

The password for every account is `demo1234`. On the login page, **Use this account** fills in the form.

| Persona | Email | Who | Lands on |
|---|---|---|---|
| Sender | `rina@kopinusantara.co.id` | Rina Wijaya, PT Kopi Nusantara: a customer of **Nusantara Cargo** | `portal/index.html` (teal, Nusantara Cargo branding) |
| Logistics company | `ops@nusantaracargo.co.id` | Dewi Lestari, Ops Manager, PT Nusantara Cargo | `index.html` (full staff workspace) |
| Partner | `dispatch@trukjaya.co.id` | PT Truk Jaya, trucking partner | `partner/index.html` (placeholder) |
| Sender at another logistics company | `sinta@batikmakmur.co.id` | Sinta Maharani, PT Batik Makmur: a customer of **Samudra Logistik** | `portal/index.html` (navy, Samudra Logistik branding) |

Every signed-in page shows a dismissible **Demo mode · signed in as …** chip. The avatar at the bottom of the rail opens a menu with **Switch demo account** and **Sign out**. **Reset demo data** on the login page clears everything created during a demo (requests, quotes, bookings, settings).

For shareable links, `login.html?as=rina&next=portal/ask.html` signs in and jumps straight to that page. `next` only accepts pages inside that persona's own area.

## The one-logistics-company rule

A sender belongs to exactly **one** logistics company: the one that invited them. Their requests go only to that company. A sender can never see, search for or contact any other logistics company, and never sees partner or vendor names, vendor costs or margins. This protects each logistics company's customers, and it is the most important rule in the product.

How the prototype enforces it:

- **Separate areas per persona.** Pages under `portal/` are for senders, `partner/` for partners, and everything else for logistics-company staff. Opening another persona's page redirects to your own home.
- **Branded, scoped portal.** The portal is branded and scoped from the signed-in account's logistics company. Rina sees only Nusantara Cargo and Sinta sees only Samudra Logistik. Opening the other sender's quote, request or shipment ID shows "not found".
- **No public sign-up.** Senders join through an invitation (`portal/welcome.html`). The branded sign-in (`portal/login.html`, or `?tenant=samudralog`) only accepts that company's senders and gives the same generic error for everyone else.
- **Roles, not names.** Shipment legs are labelled by type (Trucking, Ocean, Customs), never by partner company. Quotes show only the customer price, with no vendor costs or margin.

Staff pages follow the same promise from the other side: customers show "Only visible to Nusantara Cargo", the customer picker and search cover only the company's own customers, the marketplace lists partners only, and a partner profile shows only your own allocation.

In production the server scopes this data per account. The prototype keeps all sample data in `assets/data.js`, so the rule is enforced in what each page renders.

## Demo script: one request end to end

1. **Sign in as Rina** (`rina@kopinusantara.co.id`). Open **Ask** and click **Coffee to Shanghai** (or type a request). Try a what-if, then press **Send request to Nusantara Cargo**. It appears under **My requests** as *Sent*.
2. **Switch to Nusantara Cargo staff** (`ops@nusantaracargo.co.id`). The Inbox shows **New request from PT Kopi Nusantara · Rina Wijaya** with a reply timer. Open it:
   - Review what Rina typed, the option she picked and the estimate she saw.
   - On the Trucking leg, click **Book directly**. PT Truk Jaya is API-connected, so the booking goes straight into their system: *Reference TJ-88231 · Confirmed*.
   - Click **Send RFQs** for the manual partners. Samudra Lines' API is offline, so it gets an RFQ too.
   - Click **Build quote**, then **Send to customer**. The preview is exactly what Rina will see.
3. **Switch to Rina.** The request now shows **Quote ready**. Open the quote (staff now see *Viewed*) and **Accept** it. The request becomes a booked shipment.
4. **Switch to staff.** The request shows *Accepted · booked as SHP-2431*, and the shipment appears on the **Operations** status board. Open **SHP-2402** under *Delays and impact* to see what slipped, the knock-on to the next sailing, the cost before and after, fix options and the customer log. Use **Notify customer** on SHP-2386 to send an AI-drafted update to Rina's portal.

Staff can check any customer-facing page with **View as customer**. It opens the portal page read-only with the banner "You are viewing what Rina Wijaya sees".

## Screens

**Logistics company (staff):**

| Page | What it shows |
|---|---|
| `index.html` | Operations dashboard: KPIs, delays with knock-on effects and cost impact (suggested fixes, notify customer), status board, cost vs quote, requests and quotes pipeline, prompt for a customer |
| `inbox.html` | New customer requests with reply timers, plus partner updates |
| `request.html?id=` | A customer request: what they typed, the structured request, their pick and estimate, documents. The AI plan: legs, partners, availability and rates, cost build-up with margin, risks. Actions: Send RFQs, Book directly, Build quote, Ask the customer, Decline |
| `quote.html?request=` | Quote builder. The preview matches `portal/quote.html` exactly; after sending it tracks Sent · Viewed · Accepted/Declined |
| `customers.html`, `customer.html?id=` | Customer base (own customers only), invite flow with branded preview, profile with account manager and internal notes |
| `settings-portal.html` | Customer portal settings: branding, carrier names and transshipment ports, estimate policy, rate cards and margin rules, lanes served, AI guardrails, response target |
| `shipment.html` | Shipment workspace; "View as" the customer (portal, read-only) or each partner (their leg only). `?id=SHP-2402` / `SHP-2386` shows the delay detail |
| `network.html`, `org.html?id=truk` | Partners with integration status (API connected / Manual / Invite pending / offline), live availability, direct booking and your own allocation |
| `chat.html` | Staff creating a request on a customer's behalf (a customer must be chosen first) |
| `rfq.html` | RFQ comparison and award for manual partners |

**Sender portal (`portal/`):**

| Page | What it shows |
|---|---|
| `welcome.html` | Invitation acceptance: set a password, confirm company details, done |
| `login.html` | Branded sender sign-in (`?tenant=samudralog` for Samudra Logistik) |
| `index.html` | Home: prompt composer ("Your request goes to …"), my shipments with "What I need to do next", needs your attention, my requests |
| `ask.html` | Prompt flow: editable request summary, route options (Recommended / Fastest / Cheapest) with estimates, what-if versions with Compare, documents with AI pre-check, "Send request to …" |
| `requests.html`, `request.html?id=` | Requests list and detail with the Sent → Under review → Quote ready → Accepted → Booked stepper |
| `quote.html?id=` | Confirmed quote in the logistics company's branding: validity countdown, Accept / Ask for changes / Decline, booking confirmation |
| `shipment.html?id=` | Tracking: route line with current position, milestones by leg type, delay banner, documents, conversation (AI first, then the account manager) |
| `documents.html` | Documents per shipment and reusable company documents, with AI validation and rejection reasons |
| `inbox.html` | Notifications (quote ready, document requested, milestone, delay), also sent to WhatsApp and email |

**Partner (`partner/`):** `index.html` is a read-only list of jobs across two logistics companies, plus fleet allocation.

### States to try

| URL | State |
|---|---|
| `portal/index.html?state=new` | Sender's first visit |
| `portal/request.html?id=REQ-0330` | Under review for 1 day, account manager notified |
| `portal/request.html?id=REQ-0298`, `portal/quote.html?id=QT-0870` | Quote expired |
| `portal/shipment.html?id=SHP-2386` | Shipment delayed |
| `portal/documents.html` | Document rejected (NIB), with the reason |
| `index.html?state=new`, `customers.html?state=empty` | No customers yet: invite your first customer |
| `request.html?id=REQ-0330` | A request waiting past its reply target |
| `index.html` (Lost), `customer.html?id=kopi` (QT-0855) | A quote declined, with the customer's reason |
| `org.html?id=samudra` | An API partner is offline, so fall back to RFQ |
| Book directly on `org.html?id=truk` with more than the free trailers | A partner with no capacity (rejected), with a suggested alternative |
| `index.html` (Cost vs quote) | Cost overrun on a shipment |
| `shipment.html?id=SHP-2402` | Delay with a knock-on to the next sailing |
| `rfq.html?state=expired`, `network.html?state=empty`, `shipment.html?as=truk` | Other staff-side states |

## Structure

- `assets/logimind.css`: design tokens and shared components
- `assets/shell.js`: demo session and persona routing, the staff / sender / partner shells, account menu, demo chip, "View as customer", the shared quote renderer, and `LM.db` (the demo backend both personas share in this browser)
- `assets/staff.js`: logistics-company helpers: customer requests and reply timers, Book directly, Notify customer, customer picker
- `assets/portal.js`: sender-portal helpers (route line, request stepper, document checks, upload with AI pre-check)
- `assets/data.js`: all sample data, including tenants, demo accounts, per-sender portal data and partner jobs. The prototype's "today" is Tue 10 Nov 2026.
- `concepts/`: earlier exploration
