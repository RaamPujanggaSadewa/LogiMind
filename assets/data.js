/* ==========================================================================
   LogiMind prototype — sample data (DESIGN brief §8).
   Illustrative only: real rules, rates and schedules come from maintained data.
   Prototype "today" is fixed so dates and deadlines stay consistent.
   ========================================================================== */

window.LMData = {
  today: 'Tuesday, 10 November 2026',

  tenant: { name: 'PT Nusantara Cargo', short: 'Nusantara Cargo', initial: 'N', type: 'Freight forwarder · Jakarta', brand: '#0E6E5C', portal: 'portal.nusantaracargo.co.id' },

  me: { name: 'Dewi Lestari', role: 'Operations', initial: 'D' },

  orgs: {
    kopi:    { name: 'PT Kopi Nusantara',       initials: 'KN', role: 'customer', type: 'Coffee exporter · Surabaya' },
    rempah:  { name: 'PT Rempah Jaya',          initials: 'RJ', role: 'customer', type: 'Spice exporter · Makassar' },
    mebel:   { name: 'PT Mebel Jepara Indah',   initials: 'MJ', role: 'customer', type: 'Furniture exporter · Jepara' },
    sinar:   { name: 'PT Sinar Elektronik',     initials: 'SE', role: 'customer', type: 'Electronics importer · Cikarang' },
    truk:    { name: 'PT Truk Jaya',            initials: 'TJ', role: 'vendor', type: 'Trucking · East Java' },
    fumi:    { name: 'CV Fumigasi Prima',       initials: 'FP', role: 'vendor', type: 'Fumigation · Surabaya' },
    bea:     { name: 'PT Bea Cepat',            initials: 'BC', role: 'vendor', type: 'Customs broker' },
    samudra: { name: 'Samudra Lines Agency',    initials: 'SL', role: 'vendor', type: 'Ocean carrier agent' },
    pacific: { name: 'Pacific Bridge Shipping', initials: 'PB', role: 'vendor', type: 'Ocean carrier agent' },
    gudang:  { name: 'PT Gudang Sentosa',       initials: 'GS', role: 'vendor', type: 'Warehouse · Surabaya' },
  },

  pipeline: [
    { id: 'requests',  label: 'Requests',    count: 5,  note: '2 unassigned', tone: 'warning' },
    { id: 'rfqs',      label: 'RFQs out',    count: 7,  note: '3 ready to compare', tone: 'warning' },
    { id: 'quoting',   label: 'Quoting',     count: 4,  note: '1 expiring', tone: 'warning' },
    { id: 'booked',    label: 'Booked',      count: 9,  note: 'On track', tone: 'muted' },
    { id: 'transit',   label: 'In transit',  count: 12, note: '1 delayed', tone: 'danger' },
    { id: 'cleared',   label: 'Cleared',     count: 23, note: 'Last 30 days', tone: 'muted' },
  ],

  attention: [
    {
      icon: 'git-compare-arrows', tone: 'info',
      title: 'RFQ replies ready to compare',
      meta: 'RFQ-0194 · 2 × 40ft coffee Surabaya → Shanghai · 6 of 7 vendors replied',
      href: 'rfq.html',
      due: ['Award by today 17:00', 'warning'],
      visible: 'You, 7 invited vendors (each sees only their own leg and reply)',
      action: ['Compare', 'git-compare-arrows'],
    },
    {
      icon: 'file-x-2', tone: 'danger',
      title: 'Draft fumigation certificate needs a fix',
      href: 'shipment.html#docs',
      meta: 'SHP-2411 · AI check: lists 1 container, but the booking has 2 (TGHU 872104-1 is missing)',
      due: ['Needs fix', 'danger'],
      visible: 'You, CV Fumigasi Prima',
      action: ['Review', 'eye'],
    },
    {
      icon: 'file-warning', tone: 'warning',
      title: 'Phytosanitary certificate missing',
      meta: 'SHP-2411 · PT Kopi Nusantara · required for Surabaya → Shanghai coffee',
      due: ['Due Thu 12 Nov', 'warning'],
      visible: 'You, PT Kopi Nusantara',
      action: ['Open documents', 'files'],
      href: 'shipment.html#docs',
    },
    {
      icon: 'mail-question', tone: 'warning',
      title: 'CV Angkut Timur opened the RFQ link but hasn’t replied',
      meta: 'RFQ-0194 · Trucking Rungkut → Tanjung Perak · opened 2 hours ago via WhatsApp',
      due: ['Link only', 'neutral'],
      visible: 'You, CV Angkut Timur',
      action: ['Nudge', 'bell-ring'],
    },
    {
      icon: 'timer', tone: 'warning',
      title: 'Quote QT-0877 expires tomorrow',
      meta: 'PT Rempah Jaya · 1 × 20ft cloves Makassar → Rotterdam · sent 6 days ago',
      due: ['Expires Wed 11 Nov', 'warning'],
      visible: 'You, PT Rempah Jaya',
      action: ['Follow up', 'message-circle'],
    },
    {
      icon: 'alarm-clock', tone: 'info',
      title: 'VGM cut-off in 2 days',
      meta: 'SHP-2411 · 2 × 40ft coffee beans · Surabaya (Tanjung Perak) → Shanghai',
      due: ['Thu 12 Nov 16:00', 'neutral'],
      visible: 'You, PT Kopi Nusantara, Samudra Lines Agency',
      action: ['Open shipment', 'arrow-up-right'],
      href: 'shipment.html',
    },
  ],

  shipments: [
    { id: 'SHP-2411', href: 'shipment.html', customer: 'PT Kopi Nusantara', cargo: '2 × 40ft coffee beans', lane: ['Surabaya', 'Shanghai'], mode: 'ship', stage: ['Booked', 'neutral'], next: 'VGM cut-off', when: 'Thu 12 Nov', risk: ['Docs missing', 'warning'] },
    { id: 'SHP-2398', customer: 'PT Sinar Elektronik', cargo: '1 × 40ft HC electronics', lane: ['Nagoya', 'Tanjung Priok'], mode: 'ship', stage: ['In transit', 'info'], next: 'ETA Tanjung Priok', when: 'Mon 16 Nov', risk: ['On track', 'success'] },
    { id: 'SHP-2402', customer: 'PT Mebel Jepara Indah', cargo: 'LCL 12 CBM furniture', lane: ['Semarang', 'Rotterdam'], mode: 'ship', stage: ['In transit', 'info'], next: 'Transshipment Singapore', when: 'Wed 11 Nov', risk: ['Delayed 2 days', 'danger'] },
    { id: 'SHP-2415', customer: 'PT Sinar Elektronik', cargo: '3 × 40ft trucking', lane: ['Cikarang', 'Tanjung Priok'], mode: 'truck', stage: ['Booked', 'neutral'], next: 'Pickup', when: 'Fri 13 Nov', risk: ['On track', 'success'] },
    { id: 'SHP-2390', customer: 'PT Rempah Jaya', cargo: '850 kg nutmeg samples', lane: ['Makassar', 'Dubai'], mode: 'plane', stage: ['Customs', 'warning'], next: 'Import clearance', when: 'Today', risk: ['Inspection hold', 'warning'] },
    { id: 'SHP-2386', customer: 'PT Kopi Nusantara', cargo: '1 × 20ft roasted coffee', lane: ['Surabaya', 'Busan'], mode: 'ship', stage: ['In transit', 'info'], next: 'ETA Busan', when: 'Sat 14 Nov', risk: ['On track', 'success'] },
  ],

  upcoming: [
    { day: 'Wed', date: '11', items: [['Stuffing and fumigation at Rungkut', 'SHP-2411 · PT Truk Jaya, CV Fumigasi Prima'], ['Transshipment Singapore', 'SHP-2402']] },
    { day: 'Thu', date: '12', items: [['PEB and Form E ready', 'SHP-2411 · PT Bea Cepat'], ['Gate-in, VGM and SI cut-off', 'SHP-2411 · 16:00']] },
    { day: 'Fri', date: '13', items: [['Pickup 3 × 40ft Cikarang', 'SHP-2415 · PT Truk Jaya']] },
    { day: 'Sat', date: '14', items: [['ETD Tanjung Perak', 'SHP-2411 · Samudra Lines'], ['ETA Busan', 'SHP-2386']] },
    { day: 'Mon', date: '16', items: [['ETA Tanjung Priok', 'SHP-2398']] },
  ],

  networkActivity: [
    { org: 'gudang', text: '<b>PT Gudang Sentosa</b> accepted your invitation as a warehouse vendor', time: '2h' },
    { org: 'fumi', text: '<b>CV Fumigasi Prima</b> uploaded a draft fumigation certificate for SHP-2411', time: '5h' },
    { org: 'truk', text: '<b>PT Truk Jaya</b> replied to RFQ-0194 with US$185 per truck', time: '6h' },
  ],
  pendingInvites: 2,

  laneUpdates: [
    { lane: 'ID → CN', title: 'GACC registration renewals open for overseas food producers', source: 'GACC notice', date: '8 Nov' },
    { lane: 'ID export', title: 'INSW adds a mandatory commodity field to PEB for HS 0901', source: 'INSW bulletin', date: '5 Nov' },
  ],

  inbox: {
    primary: [
      { org: 'truk', icon: 'message-square-reply', title: 'RFQ reply from PT Truk Jaya: US$185 per truck, pickup Wed 11 Nov', ref: 'RFQ-0194', tag: ['Reply', 'info'], visible: 'You, PT Truk Jaya', time: '10:24' },
      { org: 'kopi', icon: 'file-warning', title: 'Document missing: Phytosanitary certificate', ref: 'SHP-2411', tag: ['Missing', 'warning'], visible: 'You, PT Kopi Nusantara', time: '09:40' },
      { org: 'fumi', icon: 'file-x-2', title: 'Draft fumigation certificate needs a fix: one container number missing', ref: 'SHP-2411', tag: ['Needs fix', 'danger'], visible: 'You, CV Fumigasi Prima', time: '09:12' },
      { org: 'samudra', icon: 'badge-check', title: 'Booking confirmed: 2 × 40ft on SL Mahakam V.118N, ETD Sat 14 Nov', ref: 'SHP-2411', tag: ['Confirmed', 'success'], visible: 'You, Samudra Lines Agency, PT Kopi Nusantara', time: 'Yesterday' },
      { org: 'rempah', icon: 'message-circle', title: 'PT Rempah Jaya asked about the transit time on QT-0877', ref: 'QT-0877', tag: ['Question', 'neutral'], visible: 'You, PT Rempah Jaya', time: 'Yesterday' },
    ],
    other: [
      { org: 'gudang', icon: 'user-check', title: 'PT Gudang Sentosa accepted your invitation', ref: 'Network', tag: ['Connected', 'success'], visible: 'You, PT Gudang Sentosa', time: '2h' },
      { org: 'pacific', icon: 'ship', title: 'SHP-2398 departed Nagoya on PB Horizon V.042S', ref: 'SHP-2398', tag: ['In transit', 'neutral'], visible: 'You, Pacific Bridge Shipping, PT Sinar Elektronik', time: 'Sun' },
    ],
    later: [],
    cleared: [],
  },
};

/* ---------- Screen 4: prompt → structured request → draft RFQs ---------- */
Object.assign(window.LMData.orgs, {
  angkut:  { name: 'CV Angkut Timur',        initials: 'AT', role: 'vendor', type: 'Trucking · Surabaya', linkOnly: true },
  brantas: { name: 'PT Logistik Brantas',    initials: 'LB', role: 'vendor', type: 'Trucking · East Java' },
  surya:   { name: 'PPJK Surya Mandiri',     initials: 'SM', role: 'vendor', type: 'Customs broker · Surabaya', linkOnly: true },
});

window.LMData.request = {
  id: 'REQ-0311',
  title: '2 × 40ft coffee · SUB → SHA',
  prompt: '2x40ft coffee beans Surabaya to Shanghai mid-November, FOB. For Kopi Nusantara, pickup from their Rungkut warehouse.',
  customer: 'kopi',

  // value, provenance: prompt | profile | ai | missing
  fields: [
    { k: 'Customer', v: 'PT Kopi Nusantara', p: 'profile', note: 'Matched to your customer' },
    { k: 'Pickup', v: 'Kopi Nusantara warehouse, Rungkut, Surabaya', p: 'profile' },
    { k: 'Port of loading', v: 'Tanjung Perak, Surabaya (IDSUB)', p: 'ai' },
    { k: 'Port of discharge', v: 'Shanghai (CNSHA)', p: 'ai' },
    { k: 'Cargo', v: 'Green coffee beans (Arabica), not roasted', p: 'ai' },
    { k: 'HS code', v: '0901.11', p: 'ai', note: '92% confidence' },
    { k: 'Equipment', v: '2 × 40ft dry', p: 'prompt' },
    { k: 'Weight / packing', v: '~38.4 t · 640 jute bags × 60 kg', p: 'profile', note: 'From last 3 shipments' },
    { k: 'Incoterm', v: 'FOB Tanjung Perak', p: 'prompt' },
    { k: 'Cargo ready', v: 'Wed 11 Nov', p: 'ai', note: 'Assumed from ETD' },
    { k: 'Target ETD', v: '14–18 Nov', p: 'prompt' },
    { k: 'Consignee (Shanghai)', v: '', p: 'missing', note: 'Needed for B/L and Form E' },
  ],

  checks: [
    { tone: 'success', icon: 'circle-check', text: 'Green coffee (0901.11) is not restricted for export from Indonesia.' },
    { tone: 'info', icon: 'info', text: 'Import into China needs GACC registration for the overseas producer, plus inspection and quarantine on arrival.' },
    { tone: 'warning', icon: 'triangle-alert', text: 'Under FOB, ocean freight is usually booked and paid by the buyer. Confirm with PT Kopi Nusantara before quoting it.' },
  ],

  docs: [
    { name: 'Commercial invoice', by: 'PT Kopi Nusantara', status: 'missing' },
    { name: 'Packing list', by: 'PT Kopi Nusantara', status: 'missing' },
    { name: 'Export declaration (PEB)', by: 'Customs broker', status: 'rfq', note: 'In customs RFQ' },
    { name: 'Certificate of origin — Form E', by: 'Customs broker via e-SKA', status: 'rfq', note: 'In customs RFQ' },
    { name: 'Phytosanitary certificate', by: 'Indonesian Quarantine Agency', status: 'missing', note: 'Customer applies; inspection ~2 days' },
    { name: 'Fumigation certificate', by: 'Fumigation vendor', status: 'rfq', note: 'In fumigation RFQ' },
    { name: 'Bill of lading', by: 'Ocean carrier', status: 'later', note: 'Issued after loading' },
    { name: 'Exporter registration for China (GACC)', by: 'PT Kopi Nusantara', status: 'ready', note: 'On file · valid to Mar 2028' },
    { name: 'Importer registration in China', by: 'Consignee', status: 'verify', note: 'Ask consignee to confirm' },
  ],
  sources: [
    ['INSW — export procedures', '#'],
    ['GACC Decree 248 — overseas producer registration', '#'],
    ['ACFTA rules of origin (Form E)', '#'],
  ],

  replyBy: 'Wed 11 Nov, 12:00',

  legs: [
    {
      id: 'truck', n: 1, service: 'Trucking', icon: 'truck',
      route: 'Rungkut warehouse → Tanjung Perak', when: 'Stuffing Wed 11 – Thu 12 Nov',
      scope: ['2 × 40ft dry, empty pickup from depot', 'Stuffing at shipper warehouse (Rungkut)', 'Laden delivery to Tanjung Perak CY before VGM cut-off (Thu 12 Nov 16:00)'],
      vendors: [
        { org: 'truk', score: 94, pick: true, why: ['East Java lane', 'On-time 96%', 'Last US$180/truck'] },
        { org: 'brantas', score: 81, pick: true, why: ['East Java lane', 'On-time 89%', 'Last US$172/truck'] },
        { org: 'angkut', score: null, pick: true, why: ['Surabaya lane', 'No history yet'] },
      ],
    },
    {
      id: 'fumi', n: 2, service: 'Fumigation', icon: 'wind',
      route: 'At Rungkut warehouse', when: 'Wed 11 Nov, after stuffing',
      scope: ['Phosphine fumigation of 2 × 40ft stuffed containers', 'Fumigation certificate listing both container numbers', 'Certificate issued before Thu 12 Nov 12:00'],
      vendors: [
        { org: 'fumi', score: 88, pick: true, why: ['Surabaya', 'On-time 93%', 'Last US$95/container'] },
      ],
      thin: true,
    },
    {
      id: 'customs', n: 3, service: 'Export customs', icon: 'stamp',
      route: 'Tanjung Perak', when: 'PEB by Thu 12 Nov',
      scope: ['Lodge PEB (export declaration) via INSW', 'Apply for Form E certificate of origin (e-SKA)', 'Coordinate phytosanitary inspection schedule'],
      vendors: [
        { org: 'bea', score: 96, pick: true, why: ['Tanjung Perak', 'On-time 98%', 'Last US$140/shipment'] },
        { org: 'surya', score: null, pick: false, why: ['Tanjung Perak', 'No history yet'] },
      ],
    },
    {
      id: 'ocean', n: 4, service: 'Ocean freight', icon: 'ship',
      route: 'Tanjung Perak → Shanghai', when: 'ETD 14–18 Nov',
      scope: ['2 × 40ft dry, FCL, port-to-port', 'Include BAF, PSS and origin THC separately', 'Direct service preferred; state transit time and free days'],
      vendors: [
        { org: 'samudra', score: 90, pick: true, why: ['Direct SUB → SHA', 'On-time 91%', 'Last US$1,450/40ft'] },
        { org: 'pacific', score: 84, pick: true, why: ['Via Singapore', 'On-time 94%', 'Last US$1,190/40ft'] },
      ],
      confirm: 'FOB: confirm scope with customer',
    },
  ],
};

/* ---------- Screen 5: RFQ detail (replies in, Tue 10 Nov 15:40) ---------- */
// price: USD per unit; qty: units; extra: AI-estimated cost the vendor left out (normalization)
window.LMData.rfq = {
  id: 'RFQ-0194',
  request: 'REQ-0311',
  title: '2 × 40ft coffee · SUB → SHA',
  customer: 'kopi',
  sent: 'Tue 10 Nov, 09:05',
  replyBy: 'Wed 11 Nov, 12:00',
  timeLeft: '20h left',
  etd: '14–18 Nov',
  legs: [
    {
      id: 'truck', n: 1, service: 'Trucking', icon: 'truck', route: 'Rungkut warehouse → Tanjung Perak', unit: 'truck', qty: 2,
      offers: [
        { org: 'truk', status: 'replied', replied: '1h 20m', price: 185, rows: [['Pickup', 'Wed 11 Nov, 08:00'], ['Waiting time', 'Up to 4h included'], ['Valid until', 'Tue 17 Nov']], onTime: 96, note: 'Driver and plate numbers shared the evening before.', rec: true },
        { org: 'brantas', status: 'replied', replied: '3h 05m', price: 168, extra: 30, rows: [['Pickup', 'Wed 11 Nov, 07:00'], ['Waiting time', '2h included, then US$15/h'], ['Valid until', 'Fri 13 Nov']], onTime: 89, flags: ['Stuffing 640 bags usually takes 3–4h. Estimated +US$30/truck waiting charge.'] },
        { org: 'angkut', status: 'opened', seen: 'Opened the WhatsApp link 2h ago' },
      ],
      why: 'Cheapest once the likely waiting charge is added, and the best on-time record on this lane.',
    },
    {
      id: 'fumi', n: 2, service: 'Fumigation', icon: 'wind', route: 'At Rungkut warehouse', unit: 'container', qty: 2,
      offers: [
        { org: 'fumi', status: 'replied', replied: '45m', price: 95, rows: [['Method', 'Phosphine, 72h exposure'], ['Certificate', 'Same day, lists both containers'], ['Valid until', 'Mon 30 Nov']], onTime: 93, rec: true },
      ],
      why: 'Only offer. The price is within 3% of your last 5 jobs with this vendor.',
      single: true,
    },
    {
      id: 'customs', n: 3, service: 'Export customs', icon: 'stamp', route: 'Tanjung Perak', unit: 'shipment', qty: 1,
      offers: [
        { org: 'bea', status: 'replied', replied: '2h 10m', price: 175, rows: [['Includes', 'PEB lodgement + Form E application'], ['PEB ready', 'Thu 12 Nov, 10:00'], ['Valid until', 'Mon 30 Nov']], onTime: 98, rec: true },
      ],
      why: 'Only offer. Covers PEB and Form E, and is ready before the VGM cut-off.',
      single: true,
    },
    {
      id: 'ocean', n: 4, service: 'Ocean freight', icon: 'ship', route: 'Tanjung Perak → Shanghai', unit: '40ft', qty: 2,
      offers: [
        { org: 'samudra', status: 'replied', replied: '4h 30m', price: 1420, rows: [['Vessel', 'SL Mahakam V.118N, direct'], ['ETD / transit', 'Sat 14 Nov · 9 days'], ['Free days', '7 at destination'], ['Valid until', 'Mon 30 Nov']], onTime: 91, note: 'All-in: BAF, PSS and EBS included.', rec: true },
        { org: 'pacific', status: 'replied', replied: '5h 50m', price: 1150, extra: 165, rows: [['Vessel', 'PB Horizon V.051N, via Singapore'], ['ETD / transit', 'Mon 16 Nov · 14 days'], ['Free days', '14 at destination'], ['Valid until', 'Sun 15 Nov']], onTime: 94, flags: ['BAF not quoted. Estimated +US$165/40ft from their tariff.', 'Rate expires Sun 15 Nov, one day before this ETD.'] },
      ],
      why: 'Sails on the target date with 5 days’ shorter transit and an all-in rate that stays valid. Costs US$210 more than Pacific Bridge once BAF is added.',
    },
  ],
};

// ?state=expired variant: the deadline has passed and the ocean leg has no usable reply
window.LMData.rfqExpired = {
  timeLeft: 'Expired',
  ocean: [
    { org: 'samudra', status: 'none', seen: 'Viewed Tue 10 Nov, 11:20 · no reply' },
    { org: 'pacific', status: 'declined', seen: 'Declined: no space on the 16 Nov sailing' },
  ],
};

/* ---------- Screen 6: quote builder ---------- */
// Costs come from the awarded RFQ-0194 offers. margin is a %, or sell is fixed for own fees.
window.LMData.quote = {
  id: 'QT-0891',
  rfq: 'RFQ-0194',
  contact: 'Sari Wulandari',
  cargoValue: 96000,
  lines: [
    { id: 'truck', label: 'Origin trucking, Rungkut → Tanjung Perak (2 × 40ft)', vendor: 'truk', cost: 370, margin: 20 },
    { id: 'fumi', label: 'Container fumigation and certificate (2 × 40ft)', vendor: 'fumi', cost: 190, margin: 20 },
    { id: 'customs', label: 'Export customs: PEB and Form E', vendor: 'bea', cost: 175, margin: 20 },
    { id: 'ocean', label: 'Ocean freight Tanjung Perak → Shanghai, all-in (2 × 40ft)', vendor: 'samudra', cost: 2840, margin: 10, optional: 'FOB: the buyer usually books ocean freight', on: true },
    { id: 'docs', label: 'Documentation and shipment coordination', own: true, cost: 0, sell: 85 },
    { id: 'ins', label: 'Cargo insurance, 0.3% of cargo value', own: true, cost: 240, sell: 288, optional: 'Optional add-on', on: false },
  ],
  suggest: { truck: 20, fumi: 20, customs: 20, ocean: 10 },
  history: 'Your last 8 ID → CN quotes averaged 13.1% margin, and 6 of them were accepted.',
  floor: 8,
  laneRange: [11, 15],
  validity: 'Tue 17 Nov',
  validityWhy: 'Capped at the earliest vendor rate expiry (PT Truk Jaya, Tue 17 Nov).',
  includes: ['Empty container pickup and stuffing at your Rungkut warehouse', 'Fumigation certificate for both containers', 'Export declaration (PEB) and Form E application', 'Direct sailing on Sat 14 Nov, about 9 days to Shanghai'],
  excludes: ['Destination charges, duties and taxes in China', 'Phytosanitary certificate fees (paid by you)', 'Demurrage and detention beyond 7 free days at destination'],
  note: 'Rates are for the 14 Nov sailing and require cargo ready at your warehouse by Wed 11 Nov, 08:00.',
};

/* ---------- Screen 7: shipment workspace (SHP-2411, Tue 10 Nov 16:30) ---------- */
// visible: party keys that can see an item. 'you' = tenant staff (always).
window.LMData.shipment = {
  id: 'SHP-2411',
  title: '2 × 40ft coffee · Surabaya → Shanghai',
  customer: 'kopi',
  consignee: { name: 'Shanghai Aroma Trading Co.', initials: 'SA' },
  quote: 'QT-0891',
  facts: [
    { k: 'ETD', v: 'Sat 14 Nov · Tanjung Perak', visible: ['you', 'kopi', 'samudra', 'truk'] },
    { k: 'ETA', v: 'Mon 23 Nov · Shanghai', visible: ['you', 'kopi', 'samudra'] },
    { k: 'Vessel', v: 'SL Mahakam V.118N', alt: { kopi: 'Direct sailing' }, visible: ['you', 'kopi', 'samudra'] },
    { k: 'Containers', v: 'TGHU 872311-8, TGHU 872104-1', visible: ['you', 'kopi', 'truk', 'fumi', 'bea', 'samudra'] },
    { k: 'Incoterm', v: 'FOB Tanjung Perak', visible: ['you', 'kopi', 'bea'] },
    { k: 'Customer price', v: 'US$4,091 · QT-0891 accepted', visible: ['you', 'kopi'] },
    { k: 'Vendor cost', v: 'US$3,575 · margin 12.6%', visible: ['you'] },
  ],
  milestones: [
    { t: 'Booked', when: 'Tue 10 Nov', by: 'samudra', state: 'done', visible: ['you', 'kopi', 'samudra'] },
    { t: 'Empty pickup and stuffing', when: 'Wed 11 Nov, 08:00', by: 'truk', state: 'next', visible: ['you', 'kopi', 'truk'] },
    { t: 'Fumigation', when: 'Wed 11 Nov, 14:00', by: 'fumi', state: 'todo', visible: ['you', 'kopi', 'fumi'] },
    { t: 'PEB and Form E', when: 'Thu 12 Nov, 10:00', by: 'bea', state: 'risk', note: 'Waiting for the phytosanitary certificate', visible: ['you', 'kopi', 'bea'] },
    { t: 'Gate-in and VGM cut-off', when: 'Thu 12 Nov, 16:00', by: 'truk', state: 'todo', visible: ['you', 'kopi', 'truk', 'samudra'] },
    { t: 'Loaded, ETD', when: 'Sat 14 Nov', by: 'samudra', state: 'todo', visible: ['you', 'kopi', 'samudra'] },
    { t: 'Arrival Shanghai', when: 'Mon 23 Nov', by: 'samudra', state: 'todo', visible: ['you', 'kopi', 'samudra'] },
    { t: 'Import clearance', when: 'After arrival', by: 'consignee', state: 'todo', visible: ['you', 'kopi'] },
  ],
  docs: [
    { name: 'Commercial invoice', by: 'kopi', status: 'ready', ai: 'Matches the booking: 2 × 40ft, 38,400 kg, FOB value US$96,000.', visible: ['you', 'kopi', 'bea'] },
    { name: 'Packing list', by: 'kopi', status: 'ready', ai: '640 bags, 38.4 t gross. Matches the invoice.', visible: ['you', 'kopi', 'bea'] },
    { name: 'Draft fumigation certificate', by: 'fumi', status: 'fix', ai: 'Lists 1 container, but the booking has 2. TGHU 872104-1 is missing.', visible: ['you', 'fumi'], fix: true },
    { name: 'Phytosanitary certificate', by: 'kopi', status: 'missing', ai: 'Needed for the PEB by Thu 12 Nov, 10:00. Inspection is booked for Wed 11 Nov, 13:00.', visible: ['you', 'kopi', 'bea'] },
    { name: 'Export declaration (PEB)', by: 'bea', status: 'progress', ai: 'Drafted. Will be lodged once the phytosanitary certificate arrives.', visible: ['you', 'kopi', 'bea'] },
    { name: 'Certificate of origin — Form E', by: 'bea', status: 'progress', ai: 'Submitted to e-SKA on Tue 10 Nov. Usually issued within 1 working day.', visible: ['you', 'kopi', 'bea'] },
    { name: 'Booking confirmation', by: 'samudra', status: 'ready', ai: 'Vessel, containers and cut-offs match the quote.', visible: ['you', 'samudra'] },
    { name: 'VGM declaration', by: 'you', status: 'todo', ai: 'Submit by Thu 12 Nov, 16:00 using the weighbridge ticket from gate-in.', visible: ['you', 'truk', 'samudra'] },
    { name: 'House bill of lading', by: 'you', status: 'later', ai: 'Issued by Nusantara Cargo after loading. The carrier’s master B/L stays internal.', visible: ['you', 'kopi'] },
  ],
  parties: [
    { key: 'kopi', role: 'Customer · shipper', contact: 'Sari Wulandari', sees: 'Milestones, their documents, customer price', hides: 'Vendors, vendor costs, margin' },
    { key: 'truk', role: 'Trucking', contact: 'Budi Santoso', sees: 'Pickup and gate-in job, their own rate', hides: 'Customer, other vendors, customer price' },
    { key: 'fumi', role: 'Fumigation', contact: 'Rudi Hartono', sees: 'Fumigation job, their certificate', hides: 'Customer price, other vendors' },
    { key: 'bea', role: 'Customs broker', contact: 'Maya Kusuma', sees: 'Export documents, PEB and Form E', hides: 'Rates, margin, other vendors' },
    { key: 'samudra', role: 'Ocean carrier', contact: 'Hendra Wijaya', sees: 'Booking, containers, VGM', hides: 'Customer, customer price, other vendors' },
    { key: 'consignee', role: 'Consignee · Shanghai', contact: 'Not on LogiMind', linkOnly: true, sees: 'Arrival notice by email link', hides: 'Everything else' },
  ],
  threads: [
    { id: 'internal', label: 'Team', icon: 'lock', visible: ['you'], messages: [
      { who: 'Arief Hidayat', color: 1, time: '14:55', text: 'PT Kopi Nusantara accepted QT-0891.' },
      { who: 'Dewi Lestari', color: 0, time: '15:10', text: 'Booking confirmed with Samudra on the 14 Nov sailing. I’ll handle VGM.' },
    ] },
    { id: 'kopi', label: 'PT Kopi Nusantara', org: 'kopi', visible: ['you', 'kopi'], messages: [
      { who: 'Sari Wulandari', org: 'kopi', time: '15:32', text: 'The phyto inspection is booked for Wed 13:00. The certificate should be out Thursday morning.' },
      { who: 'Dewi Lestari', color: 0, time: '15:40', text: 'Thanks Sari. We need it by Thu 10:00 so the PEB can be lodged before cut-off.' },
    ] },
    { id: 'truk', label: 'PT Truk Jaya', org: 'truk', visible: ['you', 'truk'], messages: [
      { who: 'Budi Santoso', org: 'truk', time: '16:05', text: 'Drivers are Pak Joko (L 9123 UX) and Pak Agus (L 9087 KT). At the depot 07:00, Rungkut by 08:00.' },
    ] },
    { id: 'fumi', label: 'CV Fumigasi Prima', org: 'fumi', visible: ['you', 'fumi'], messages: [
      { who: 'Rudi Hartono', org: 'fumi', time: '11:20', text: 'Draft certificate uploaded for your review before fumigation tomorrow.' },
      { ai: true, time: '11:21', text: 'Check failed: the draft lists only TGHU 872311-8. TGHU 872104-1 is missing.' },
    ] },
    { id: 'bea', label: 'PT Bea Cepat', org: 'bea', visible: ['you', 'bea'], messages: [
      { who: 'Maya Kusuma', org: 'bea', time: '13:45', text: 'PEB is drafted. I’ll lodge it as soon as the phytosanitary certificate is uploaded.' },
    ] },
    { id: 'samudra', label: 'Samudra Lines Agency', org: 'samudra', visible: ['you', 'samudra'], messages: [
      { who: 'Hendra Wijaya', org: 'samudra', time: '15:05', text: 'Booking confirmed on SL Mahakam V.118N. Empties released from the Tanjung Perak depot.' },
    ] },
  ],
};

/* ---------- Screens 2–3: network directory, profiles, invitations ---------- */
Object.assign(window.LMData.orgs, {
  angkasa: { name: 'PT Angkasa Kargo',       initials: 'AK', role: 'vendor', type: 'Air freight agent · Jakarta' },
  teh:     { name: 'PT Teh Priangan',        initials: 'TP', role: 'customer', type: 'Tea exporter · Bandung' },
  karya:   { name: 'PT Karya Ekspor Mandiri', initials: 'KE', role: 'customer', type: 'Handicraft exporter · Yogyakarta' },
});

// status: connected | link (link-only, no account) | pending | expired
window.LMData.network = {
  types: ['Trucking', 'Warehouse', 'Packing / Fumigation', 'Customs broker', 'Shipping line / Agent', 'Air'],
  vendors: [
    { org: 'truk',    type: 'Trucking', lanes: ['Surabaya ↔ Tanjung Perak', 'Sidoarjo → Tanjung Perak', 'Malang → Surabaya'], rating: 4.8, jobs: 32, onTime: 96, last: '3 days ago', status: 'connected' },
    { org: 'brantas', type: 'Trucking', lanes: ['East Java → Tanjung Perak'], rating: 4.3, jobs: 11, onTime: 89, last: '2 weeks ago', status: 'connected' },
    { org: 'angkut',  type: 'Trucking', lanes: ['Surabaya'], rating: null, jobs: 0, onTime: null, last: 'Never', status: 'link' },
    { org: 'gudang',  type: 'Warehouse', lanes: ['Surabaya (Rungkut, Margomulyo)'], rating: 4.6, jobs: 8, onTime: 94, last: 'Today', status: 'connected' },
    { org: 'fumi',    type: 'Packing / Fumigation', lanes: ['Surabaya', 'Gresik'], rating: 4.5, jobs: 19, onTime: 93, last: 'Today', status: 'connected' },
    { org: 'bea',     type: 'Customs broker', lanes: ['Tanjung Perak', 'Juanda Airport'], rating: 4.9, jobs: 41, onTime: 98, last: 'Today', status: 'connected' },
    { org: 'surya',   type: 'Customs broker', lanes: ['Tanjung Perak'], rating: null, jobs: 0, onTime: null, last: 'Never', status: 'link' },
    { org: 'samudra', type: 'Shipping line / Agent', lanes: ['SUB → SHA', 'SUB → BUS', 'SUB → SIN'], rating: 4.4, jobs: 27, onTime: 91, last: 'Today', status: 'connected' },
    { org: 'pacific', type: 'Shipping line / Agent', lanes: ['SUB → SHA via SIN', 'JKT → RTM'], rating: 4.2, jobs: 14, onTime: 94, last: '1 week ago', status: 'connected' },
    { org: 'angkasa', type: 'Air', lanes: ['CGK → DXB', 'SUB → HKG'], rating: null, jobs: 0, onTime: null, last: 'Never', status: 'pending' },
  ],
  customers: [
    { org: 'kopi',   type: 'Exporter', lanes: ['ID → CN', 'ID → KR'], rating: null, jobs: 14, onTime: 95, last: 'Today', status: 'connected', spend: 'US$41,200 this year' },
    { org: 'rempah', type: 'Exporter', lanes: ['ID → NL', 'ID → AE'], rating: null, jobs: 6, onTime: 92, last: 'Yesterday', status: 'connected', spend: 'US$18,900 this year' },
    { org: 'mebel',  type: 'Exporter', lanes: ['ID → NL'], rating: null, jobs: 9, onTime: 88, last: '4 days ago', status: 'connected', spend: 'US$27,300 this year' },
    { org: 'sinar',  type: 'Importer', lanes: ['JP → ID'], rating: null, jobs: 12, onTime: 97, last: 'Today', status: 'connected', spend: 'US$36,500 this year' },
    { org: 'teh',    type: 'Exporter', lanes: ['ID → GB'], rating: null, jobs: 0, onTime: null, last: 'Never', status: 'expired' },
  ],
  invitations: {
    sent: [
      { org: 'angkasa', role: 'Vendor · Air', via: 'Email', to: 'Yusuf Pratama', when: 'Sent Sun 8 Nov', status: 'pending', note: 'Opened twice, not accepted yet' },
      { org: 'teh', role: 'Customer', via: 'WhatsApp', to: 'Laras Anindya', when: 'Sent Mon 26 Oct', status: 'expired', note: 'Expired after 14 days' },
      { org: 'gudang', role: 'Vendor · Warehouse', via: 'Email', to: 'Hadi Susanto', when: 'Accepted today, 14:10', status: 'accepted', note: 'Claimed their free LogiMind profile' },
      { org: 'angkut', role: 'Vendor · Trucking', via: 'WhatsApp', to: 'Wahyu', when: 'Link sent Tue 10 Nov', status: 'link', note: 'Replies by magic link, no account yet' },
    ],
    received: [
      { org: 'karya', role: 'Wants to connect as your customer', via: 'LogiMind', to: 'Dimas Prakoso', when: 'Received yesterday', status: 'received', note: 'Handicraft exports, LCL Semarang → Rotterdam' },
    ],
  },
  profiles: {
    truk: {
      since: 'March 2025',
      stats: [['Rating', '4.8', '32 jobs'], ['On-time', '96%', 'last 12 months'], ['Avg. reply to RFQs', '1h 40m', '18 RFQs'], ['Quote accuracy', '98%', 'invoiced vs quoted'], ['Last job', '3 days ago', 'SHP-2386']],
      services: ['FTL 20ft / 40ft container haulage', 'Empty pickup and depot return', 'Stuffing supervision', 'Weighbridge ticket for VGM'],
      lanes: [['Surabaya ↔ Tanjung Perak', 'Primary lane, 24 jobs'], ['Sidoarjo → Tanjung Perak', '5 jobs'], ['Malang → Surabaya', '3 jobs']],
      rates: [
        ['Rungkut → Tanjung Perak CY', '40ft', 180, 'Rate card', 'Mon 30 Nov'],
        ['Rungkut → Tanjung Perak CY', '20ft', 150, 'Rate card', 'Mon 30 Nov'],
        ['Sidoarjo → Tanjung Perak CY', '40ft', 210, 'Last quote', 'Fri 20 Nov'],
        ['Waiting time beyond 4h', 'per hour', 12, 'Rate card', 'Mon 30 Nov'],
      ],
      contacts: [['Budi Santoso', 'Operations', 'WhatsApp · Email', 1], ['Rina Hapsari', 'Billing', 'Email', 2]],
      history: [
        ['SHP-2411', 'Pickup and gate-in · 2 × 40ft', 'Wed 11 Nov', ['Upcoming', 'info']],
        ['RFQ-0194', 'Trucking Rungkut → Tanjung Perak', 'Tue 10 Nov', ['Won · US$185/truck', 'success']],
        ['SHP-2386', 'Pickup · 1 × 20ft', 'Sat 7 Nov', ['On time', 'success']],
        ['RFQ-0171', 'Trucking Sidoarjo → Tanjung Perak', 'Mon 26 Oct', ['Lost on price', 'neutral']],
        ['SHP-2350', 'Pickup · 3 × 40ft', 'Thu 15 Oct', ['2h late', 'warning']],
      ],
      sees: ['Jobs you award them, with pickup details', 'Their own rates and invoices', 'Documents they upload'],
      never: ['Your customer prices and margin', 'Other vendors and their quotes', 'Other legs of a shipment'],
    },
  },
};
