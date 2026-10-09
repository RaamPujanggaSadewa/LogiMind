# LogiMind — clickable prototype

LogiMind is a multi-tenant B2B platform for logistics companies in Southeast Asia. A logistics company (the LSP, Logistic Service Provider, and the paying tenant) runs its operations in a LogiMind workspace. Its shippers get a portal branded as that LSP, and its partners see only the jobs and legs assigned to them. The PIC is the LSP staff member in charge of a job.

The prototype has two scenarios:

- **Main demo: ASCO import.** ABC Electronics in Shanghai ships 200 CBM of electronics to PT Chan Electronics in Bandung through PT ASCO Logistik Indonesia. Prices come from core-partner costing collected by RFQ, and the flow runs from request to POD and invoices. This follows the official "LSP Tenant Setup & End-to-End Shipment Business Flow".
- **Second scenario: Nusantara Cargo coffee export.** The earlier demo with instant estimates, API trucking and direct booking, unchanged.

This repository holds static HTML pages built on the design system in [`DESIGN.md`](DESIGN.md). **All companies, people, prices, rates and regulations are illustrative sample data**, and the AI responses are scripted.

## Run it

No build step or dependencies are needed. Serve the folder, then open the login page in a browser at least 1280px wide:

```bash
python3 -m http.server 5180
```

Open http://localhost:5180/login.html. Any page opened without a session redirects to the login page, then continues to that page after you sign in.

## Demo accounts

The password for every account is `demo1234`. On the login page, **Use this account** fills in the form.

**Main demo: ASCO import scenario**

| Persona | Email | Who | Lands on |
|---|---|---|---|
| LSP staff (PIC) | `pic@asco.co.id` | Andi Pratama, PIC at PT ASCO Logistik Indonesia, Jakarta | `index.html` (ASCO workspace) |
| Shipper | `lina@abcelectronics.cn` | Lina Zhou, ABC Electronics Co., Ltd., Shanghai: a customer of **ASCO** | `portal/index.html` (ASCO branding) |
| Core partner | `ops@jayacargo.co.id` | Jaya Cargo Agency, Jakarta destination agent | `partner/index.html` |
| Core partner, no account | magic links only | Pudong Link Logistics, Shanghai origin agent | `partner/rfq-reply.html?token=rfq-pudong` (after Andi sends the RFQ) |

The consignee, PT Chan Electronics, is a party on the shipment with no login. The other two core partners (Huangpu Freight Agency in Shanghai, Priok Express Agent in Jakarta) also reply through magic links.

**Second scenario: Nusantara Cargo coffee export**

| Persona | Email | Who | Lands on |
|---|---|---|---|
| Sender | `rina@kopinusantara.co.id` | Rina Wijaya, PT Kopi Nusantara: a customer of **Nusantara Cargo** | `portal/index.html` (teal, Nusantara Cargo branding) |
| Logistics company | `ops@nusantaracargo.co.id` | Dewi Lestari, Ops Manager, PT Nusantara Cargo | `index.html` (full staff workspace) |
| Partner | `dispatch@trukjaya.co.id` | PT Truk Jaya, trucking partner | `partner/index.html` (read-only placeholder) |
| Sender at another logistics company | `sinta@batikmakmur.co.id` | Sinta Maharani, PT Batik Makmur: a customer of **Samudra Logistik** | `portal/index.html` (navy, Samudra Logistik branding) |

Every signed-in page shows a dismissible **Demo mode · signed in as …** chip. The avatar at the bottom of the rail opens a menu with **Switch demo account** and **Sign out**. **Reset demo data** on the login page clears everything created during a demo, including the ASCO flow (requests, quotes, bookings, settings).

For shareable links, `login.html?as=rina&next=portal/ask.html` signs in and jumps straight to that page. `next` only accepts pages inside that persona's own area.

## Demo script: ASCO import end to end

Sign in from `login.html` and switch accounts with the avatar menu (**Switch demo account**). Partner magic links open in a new tab from Andi's pages (**Open as partner (demo)**).

1. **Lina submits.** In **Ask**, click the example chip *200 CBM electronics from Shanghai to Bandung via Jakarta…*, or turn on **Use template** and fill in the fields. The AI fills the operation request and highlights the 2 missing fields (expected arrival, consignee); use the suggestions. There are no prices or route options. Press **Send request to ASCO**: "ASCO is collecting partner costing. You'll get a quotation by email and here."
2. **Andi plans and sends RFQs.** On **Request & plan**, the AI delivery plan shows 7 steps in 2 core-partner legs, with two Shanghai and two Jakarta core partners (star rating, on-time %). Press **Send RFQ to core partners**, review the 4 auto-generated emails and send.
3. **Partners reply by magic link.** On **Partner costing**, open each **Open as partner (demo)** link: `partner/rfq-reply.html` shows only that partner's leg and the requirement. Enter a cost, currency (CNY / USD / IDR), validity, transit days and notes (or **Demo: fill typical reply**), then submit. Rows still waiting show *Waiting for reply*.
4. **Andi quotes.** The comparison converts each reply to USD (illustrative FX), sorts by **Lowest price** or **Best on-time**, and gives an AI ranking with a reason per leg. Pick one partner per leg, set ASCO's margin (% or fixed), and press **Generate quotation**. Review the preview (exactly what Lina sees: breakdown by service stage in USD, no partner names, costs or margin) and press **Confirm & send**: "Email sent to lina@abcelectronics.cn".
5. **Lina negotiates.** In the portal quotation, press **Negotiate** with a message and a target price (US$9,300).
6. **v2 accepted.** Andi presses **Revise quotation** and sets the margin to 9%. The change log reads "Margin 12% → 9%, validity +7 days". He sends v2, and Lina accepts it. Both sides show the version history; the portal shows only customer prices.
7. **Documents with a mismatch fixed.** In **Documents**, Lina fills in the shipper instruction (MSDS is only required if dangerous goods = Yes) and uploads the packing list and the commercial invoice. The AI Document Agent flags "packing list says 210 CBM but the request says 200 CBM" and "invoice currency is CNY but the request is USD". **Submit documents** stays disabled until **Upload corrected file** turns both green. Andi's request page shows the same results.
8. **Approval, DSID and POs.** Andi sees "Documents validated · awaiting your approval" and presses **Approve & start execution**. LogiMind issues a Digital Shipment ID (for example `DSID-7F3K-9Q2M-ASCO`, with a copy button), PO-ASCO-000123 to the origin partner in CNY and PO-ASCO-000124 to Jaya Cargo in IDR (email previews), and the 30% down-payment invoice to ABC Electronics. Lina's portal shows "Execution started" and the DSID.
9. **Partners update steps.** Pudong Link opens `partner/job.html?token=job-pudong` (magic link) and marks steps 1–3 done with time, location and goods condition (photos optional). Updates appear on Andi's timeline with the partner name, and on Lina's shipment page as step and condition only.
10. **B/L reminder.** After ocean loading, Andi's checklist shows *Bill of lading: awaited*. **Demo: advance to Sat 7 Nov** sends the reminder 3 days before arrival (Settings), and **Remind again** sends it a second time. The row, and an action item on Home, then read "reminder sent 2×". Pudong uploads the B/L from its job page, or Andi records **Received by email**.
11. **Jaya Cargo and the driver's POD.** Sign in as Jaya Cargo and open the job. Import customs unlocks after the B/L and is pre-filled with *Minor damage: 2 cartons dented*, which shows as a warning for Andi (Home, *Delays and impact*) and for Lina. Mark inland delivery done, then open the driver POD (`partner/pod.html?dsid=…`, phone layout). Enter the receiver, sign on the pad, add up to 3 photos and submit.
12. **POD with QR, then invoices.** `pod.html?dsid=…` shows the shipment summary, receiver, signature, photos, a QR code to the audit trail and every event from request to POD (time, actor role, what changed). Both core partners are asked to invoice ASCO (`partner/invoice.html?token=inv-…`). **Payables** lists their invoices against the POs: *Awaiting*, *Received*, *Matches PO* or *Differs from PO* (Jaya adds 1 day of storage). Andi presses **Issue balance invoice**, Lina sees both invoices under **Invoices**, and the shipment is **Closed**.

### Demo: jump to stage

The staff request page (`request.html`, signed in as Andi) has a **Demo: jump to stage** menu, shown in demo mode only. It fills the flow with realistic data up to any of the 11 lifecycle stages: Request → Plan → Partner costing → Quotation → Documents → Approval → Execution → Pre-arrival docs → Delivery & POD → Invoicing → Closed. All three ASCO personas see the same state. In that data, v1 is negotiated and v2 is accepted; the packing list and invoice mismatches are uploaded at *Documents* and fixed at *Approval*; minor damage is reported at import customs; and Jaya's invoice differs from its PO. The first item clears the flow so Lina can send her own request.

## The one-logistics-company rule

A shipper (sender) belongs to exactly **one** logistics company: the one that invited them. Their requests go only to that company. A sender can never see, search for or contact any other logistics company, and never sees partner or vendor names, vendor costs or margins. This protects each logistics company's customers, and it is the most important rule in the product.

How the prototype enforces it:

- **Separate areas per persona.** Pages under `portal/` are for senders, `partner/` for partners, and everything else for logistics-company staff. Opening another persona's page redirects to your own home.
- **Branded, scoped portal.** The portal is branded and scoped from the signed-in account's logistics company. Rina sees only Nusantara Cargo and Sinta sees only Samudra Logistik. Opening the other sender's quote, request or shipment ID shows "not found".
- **No public sign-up.** Senders join through an invitation (`portal/welcome.html`). The branded sign-in (`portal/login.html`, or `?tenant=samudralog`) only accepts that company's senders and gives the same generic error for everyone else.
- **Roles, not names.** Shipment legs are labelled by type (Trucking, Ocean, Customs), never by partner company. Quotes show only the customer price, with no vendor costs or margin.
- **Partners see only their own leg.** An ASCO core partner sees its own steps, its own price or PO amount, the site details for its leg and the ASCO coordinator. It never sees the customer price, the margin, the other leg's partner or the shipper's contact details.
- **Scenarios never mix.** ASCO accounts never see Nusantara Cargo, its customers or partners, and Nusantara accounts never see anything from ASCO. ASCO staff pages that only exist for the second scenario (chat, inbox, partner profiles) redirect to Home.

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

**ASCO (main demo).** The shared page files render the ASCO version for ASCO accounts:

| Page | Who | What it shows |
|---|---|---|
| `index.html` | Andi | Home: lifecycle, needs your action (including the B/L reminder count), delays and impact (late steps, goods not in good condition), recent activity |
| `request.html` | Andi | Request and plan: what Lina typed, the operation request, customer master data and payment terms, the AI delivery plan (2 lanes, 7 steps, core partners), documents check, approval with DSID and POs, **Demo: jump to stage** |
| `rfq.html` | Andi | Partner costing: replies per leg in their currency and in USD, sort by price or on-time, AI ranking, **Open as partner (demo)**, pick per leg, margin, **Generate quotation** |
| `quote.html` | Andi | Quotation preview (same renderer as the portal), Confirm & send, negotiation, Revise quotation with a change log, version history with internal cost and margin |
| `shipment.html` | Andi | Execution keyed by DSID: steps with partner name and condition, document checklist (B/L reminders, POD), customer invoices |
| `payables.html` | Andi | Partner invoices against POs |
| `network.html`, `customers.html`, `settings-portal.html` | Andi | Core partners; ABC Electronics master data, payment terms and consignee; estimate policy ("Only show confirmed quotes", product decision pending), B/L reminder days, default margin |
| `portal/ask.html` | Lina | Prompt plus **Use template**, AI-filled operation request with missing fields highlighted, no prices |
| `portal/index.html`, `requests.html`, `request.html` | Lina | Lifecycle in customer words, what to do next, history |
| `portal/quote.html` | Lina | Quotation, Accept or Negotiate (message and target price), versions |
| `portal/documents.html` | Lina | Shipper instruction form, uploads with AI Document Agent results, Submit |
| `portal/shipment.html?id=DSID-…` | Lina | Route, steps with goods condition (no partner names), documents, POD |
| `portal/invoices.html`, `portal/inbox.html` | Lina | Down-payment and balance invoices; notifications |
| `partner/index.html`, `partner/job.html?dsid=…` | Jaya Cargo | RFQs, jobs and invoice requests from ASCO; its own leg's steps |
| `partner/rfq-reply.html?token=rfq-<partner>` | Any core partner | Magic-link RFQ reply. `?token=expired` shows the expired state |
| `partner/job.html?token=job-<partner>` | Origin partner | Magic-link job: own steps, B/L upload |
| `partner/pod.html?dsid=…` | Destination driver | Mobile POD: goods received, condition, receiver, signature pad, photos |
| `partner/invoice.html?token=inv-<partner>` | Core partner | Invoice upload against the PO |
| `pod.html?dsid=…` | Andi, Lina | Generated POD with QR and full audit trail (`&view=audit` jumps to the trail) |

Partners are `pudong`, `huangpu`, `jaya` and `priok`. Links only work once the flow reaches that point (for example, a job link needs a PO).

**Nusantara Cargo staff (second scenario):**

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

**Partner (`partner/`, second scenario):** for PT Truk Jaya, `index.html` is a read-only list of jobs across two logistics companies, plus fleet allocation.

### States to try

| URL | State |
|---|---|
| `partner/rfq-reply.html?token=expired` | ASCO: RFQ magic link expired |
| `rfq.html` after sending RFQs (jump to *Partner costing*) | ASCO: replies still being collected (*Waiting for reply*) |
| `portal/documents.html` (jump to *Documents*) | ASCO: AI Document Agent mismatches, Submit disabled |
| `shipment.html` (jump to *Pre-arrival docs*) | ASCO: B/L awaited, reminder sent 2× |
| `partner/job.html?dsid=…` as Jaya Cargo before the B/L | ASCO: import customs locked until the B/L is received |
| `payables.html` (jump to *Closed*) | ASCO: one partner invoice matches its PO, one is waiting to be matched (and differs) |
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
- `assets/asco.js`: the ASCO flow engine. One record in `LM.db` (`asco`) holds the request, RFQ replies, quotation versions, documents, approval (DSID, POs), steps, B/L, POD, invoices and the audit trail. It also has the lifecycle stepper, the jump-to-stage seeds, the shared renderers (quotation, documents, steps, audit trail, emails, QR) and the ASCO rails and sidebars
- `assets/asco-staff.js`, `assets/asco-portal.js`, `assets/asco-partner.js`: the ASCO pages for Andi, Lina and the core partners (including the public magic-link pages and `pod.html`)
- `assets/data.js`: all sample data, including tenants, demo accounts, per-sender portal data and partner jobs. The Nusantara scenario's "today" is Tue 10 Nov 2026. The ASCO story runs from Mon 19 Oct (request) to Thu 12 Nov (POD) on its own demo clock, whenever you run it.
- `concepts/`: earlier exploration
