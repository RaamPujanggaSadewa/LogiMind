/* ==========================================================================
   LogiMind prototype — sample data (DESIGN brief §8).
   Illustrative only: real rules, rates and schedules come from maintained data.
   Prototype "today" is fixed so dates and deadlines stay consistent.
   ========================================================================== */

window.LMData = {
  today: 'Tuesday, 10 November 2026',

  tenant: { name: 'PT Nusantara Cargo', short: 'Nusantara Cargo', initial: 'N', type: 'Freight forwarder · Jakarta', brand: '#0E6E5C', portal: 'portal.nusantaracargo.co.id' },

  me: { name: 'Dewi Lestari', role: 'Ops Manager', initial: 'D' },

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

/* ==========================================================================
   Personas and demo accounts (v0.5) — ILLUSTRATIVE SAMPLE DATA
   Rule: a sender belongs to exactly ONE logistics company (the one that
   invited them) and must never see another logistics company, a partner /
   vendor name, vendor costs or margins. In production the server scopes this
   data per account; the prototype keeps everything in this one file.
   ========================================================================== */

// Logistics companies (tenants). Sender portals are branded as these.
window.LMData.tenants = {
  nusantara: {
    key: 'nusantara', name: 'PT Nusantara Cargo', short: 'Nusantara Cargo', initials: 'NC', city: 'Jakarta',
    brand: '#0E6E5C', brandDark: '#0A5A4B', brandDeep: '#073F35', brandSoft: '#E3F1EE',
    portal: 'portal.nusantaracargo.co.id',
  },
  samudralog: {
    key: 'samudralog', name: 'PT Samudra Logistik', short: 'Samudra Logistik', initials: 'SL', city: 'Semarang',
    brand: '#1D4F91', brandDark: '#173F74', brandDeep: '#102D54', brandSoft: '#E6EEF8',
    portal: 'portal.samudralogistik.co.id',
  },
};

Object.assign(window.LMData.orgs, {
  batik: { name: 'PT Batik Makmur', initials: 'BM', role: 'customer', type: 'Batik textile exporter · Pekalongan' },
});

window.LMData.demoPassword = 'demo1234';

// persona: sender | tenant (logistics company) | partner
window.LMData.accounts = [
  { id: 'rina', persona: 'sender', personaLabel: 'Sender', email: 'rina@kopinusantara.co.id', name: 'Rina Wijaya', role: 'Logistics coordinator',
    company: 'PT Kopi Nusantara', org: 'kopi', tenant: 'nusantara', home: 'portal/index.html', color: 0,
    desc: 'Coffee exporter in Surabaya. A customer of Nusantara Cargo.' },
  { id: 'dewi', persona: 'tenant', personaLabel: 'Logistics company', email: 'ops@nusantaracargo.co.id', name: 'Dewi Lestari', role: 'Ops Manager',
    company: 'PT Nusantara Cargo', tenant: 'nusantara', home: 'index.html', color: 2,
    desc: 'Freight forwarder in Jakarta: the paying LogiMind customer. Full workspace.' },
  { id: 'truk', persona: 'partner', personaLabel: 'Partner', email: 'dispatch@trukjaya.co.id', name: 'Dispatch team', role: 'Trucking partner',
    company: 'PT Truk Jaya', org: 'truk', home: 'partner/index.html', color: 1,
    desc: 'Trucking partner working with several logistics companies. Sees its own jobs only.' },
  { id: 'sinta', persona: 'sender', personaLabel: 'Sender', email: 'sinta@batikmakmur.co.id', name: 'Sinta Maharani', role: 'Export admin',
    company: 'PT Batik Makmur', org: 'batik', tenant: 'samudralog', home: 'portal/index.html', color: 2,
    desc: 'Batik exporter. A customer of PT Samudra Logistik, a different logistics company.' },
];

/* ---------- Sender portal data, per sender account ---------- */
window.LMData.senders = {
  rina: {
    firstVisitPrompt: '2 x 40ft coffee beans from Surabaya to Shanghai, mid-November',
    suggestions: [
      ['ship', 'Coffee to Shanghai', '2 x 40ft coffee beans from Surabaya to Shanghai, mid-November'],
      ['package', 'Roasted coffee to Busan', '1 x 20ft roasted coffee from Surabaya to Busan in January'],
      ['file-search', 'Documents for China', 'Which documents do I need to export green coffee to China?'],
    ],
    accountManager: { name: 'Arief Hidayat', role: 'Your account manager', initials: 'AH', color: 1, hours: 'Replies within 1 business hour' },
    staff: [
      { name: 'Arief Hidayat', role: 'Account manager', color: 1, online: true },
      { name: 'Dewi Lestari', role: 'Operations', color: 2 },
    ],
    chats: [
      { title: 'Coffee to Shanghai, mid-Nov', href: 'ask.html?chat=0' },
      { title: 'Roasted coffee to Busan, Jan', href: 'request.html?id=REQ-0330' },
    ],

    shipments: [
      {
        id: 'SHP-2411', cargo: '2 × 40ft green coffee', lane: ['Surabaya', 'Shanghai'], mode: 'ship',
        status: ['Booked · loading this week', 'neutral'], location: 'Your warehouse, Rungkut, Surabaya',
        etd: 'Sat 14 Nov', eta: 'Mon 23 Nov', quote: 'QT-0891', request: 'REQ-0311',
        next: { text: 'Upload the phytosanitary certificate', due: 'Thu 12 Nov, 10:00', href: 'documents.html' },
        route: { nodes: ['Rungkut (you)', 'Tanjung Perak', 'Shanghai'], legs: ['truck', 'ship'], at: 0, progress: 0 },
        milestones: [
          { t: 'Booked', type: 'Booking', when: 'Tue 10 Nov', state: 'done' },
          { t: 'Container pickup and loading', type: 'Trucking', when: 'Wed 11 Nov, 08:00', state: 'next' },
          { t: 'Fumigation', type: 'Fumigation', when: 'Wed 11 Nov, 14:00', state: 'todo' },
          { t: 'Export customs', type: 'Customs', when: 'Thu 12 Nov, 10:00', state: 'risk', note: 'Waiting for your phytosanitary certificate' },
          { t: 'Delivered to port', type: 'Trucking', when: 'Thu 12 Nov, 16:00', state: 'todo' },
          { t: 'Departure', type: 'Ocean', when: 'Sat 14 Nov', state: 'todo' },
          { t: 'Arrival in Shanghai', type: 'Ocean', when: 'Mon 23 Nov', state: 'todo' },
          { t: 'Import clearance', type: 'Customs', when: 'By your buyer', state: 'todo' },
        ],
        docsYou: [
          { name: 'Commercial invoice', status: 'ready', note: 'Matches the booking: 2 × 40ft, 38,400 kg, FOB value US$96,000.' },
          { name: 'Packing list', status: 'ready', note: '640 bags, 38.4 t gross. Matches the invoice.' },
          { name: 'Phytosanitary certificate', status: 'missing', due: 'Thu 12 Nov, 10:00', note: 'Needed before export customs can be lodged. Inspection is booked for Wed 11 Nov, 13:00.' },
          { name: 'Exporter registration for China (GACC)', status: 'ready', note: 'On file, valid until Mar 2028.' },
        ],
        docsThey: [
          { name: 'Export declaration (PEB)', status: 'progress', note: 'Drafted; lodged once your phytosanitary certificate arrives.' },
          { name: 'Certificate of origin (Form E)', status: 'progress', note: 'Submitted on Tue 10 Nov. Usually issued within 1 working day.' },
          { name: 'Fumigation certificate', status: 'todo', note: 'Issued after fumigation on Wed 11 Nov.' },
          { name: 'Bill of lading', status: 'later', note: 'Issued after loading on Sat 14 Nov.' },
        ],
        messages: [
          { ai: true, time: 'Tue 15:12', text: 'Your 2 containers are booked on a direct sailing on Sat 14 Nov, arriving in Shanghai on Mon 23 Nov. The one thing we need from you is the phytosanitary certificate by Thu 12 Nov, 10:00.' },
          { who: 'Arief Hidayat', staff: true, time: 'Tue 15:40', text: 'Hi Rina, the trucks will be at your Rungkut warehouse at 08:00 on Wednesday. Please have the 640 bags ready for loading.' },
        ],
      },
      {
        id: 'SHP-2386', cargo: '1 × 20ft roasted coffee', lane: ['Surabaya', 'Busan'], mode: 'ship',
        status: ['In transit · delayed', 'warning'], location: 'At sea, approaching Kaohsiung (Taiwan)',
        etd: 'Tue 3 Nov', eta: 'Mon 16 Nov', etaWas: 'Sat 14 Nov', delayed: true,
        delay: { days: 2, reason: 'Port congestion at Kaohsiung, where your container changes vessel. The connecting sailing leaves 2 days later.' },
        next: { text: 'Nothing needed from you. You may want to tell your buyer the new ETA.', due: null, href: null },
        route: { nodes: ['Surabaya', 'Kaohsiung', 'Busan'], legs: ['ship', 'ship'], at: 0, progress: 0.8 },
        milestones: [
          { t: 'Picked up', type: 'Trucking', when: 'Sat 31 Oct', state: 'done' },
          { t: 'Export customs cleared', type: 'Customs', when: 'Mon 2 Nov', state: 'done' },
          { t: 'Departed Surabaya', type: 'Ocean', when: 'Tue 3 Nov', state: 'done' },
          { t: 'Transshipment at Kaohsiung', type: 'Ocean', when: 'Wed 11 Nov (was Mon 9 Nov)', state: 'risk', note: 'Delayed 2 days by port congestion' },
          { t: 'Arrival in Busan', type: 'Ocean', when: 'Mon 16 Nov (was Sat 14 Nov)', state: 'todo' },
          { t: 'Import clearance', type: 'Customs', when: 'By your buyer', state: 'todo' },
        ],
        docsYou: [
          { name: 'Commercial invoice', status: 'ready', note: 'Checked on Fri 30 Oct.' },
          { name: 'Packing list', status: 'ready', note: 'Checked on Fri 30 Oct.' },
        ],
        docsThey: [
          { name: 'Export declaration (PEB)', status: 'ready', note: 'Lodged Mon 2 Nov.' },
          { name: 'Bill of lading', status: 'ready', note: 'Issued Tue 3 Nov. Original sent to your buyer by courier.' },
        ],
        messages: [
          { ai: true, time: 'Yesterday', text: 'Your container is delayed by 2 days because of port congestion at Kaohsiung, where it changes vessel. The new ETA in Busan is Mon 16 Nov. There is no extra cost to you.' },
        ],
      },
    ],

    // status: sent | review | quote | accepted | booked | expired | declined
    requests: [
      { id: 'REQ-0325', title: '2 × 40ft green coffee · Surabaya → Shanghai', when: 'December sailing', created: 'Mon 9 Nov', status: 'quote', quote: 'QT-0902',
        option: 'Via Ho Chi Minh City · 12 days', estimate: [3850, 4100] },
      { id: 'REQ-0330', title: '1 × 20ft roasted coffee · Surabaya → Busan', when: 'January', created: 'Mon 9 Nov, 15:10', status: 'review', reviewDays: 1,
        option: 'Direct · 9 days', estimate: [1650, 1800] },
      { id: 'REQ-0311', title: '2 × 40ft green coffee · Surabaya → Shanghai', when: 'Mid-November', created: 'Tue 10 Nov, 09:02', status: 'booked', quote: 'QT-0891', shipment: 'SHP-2411',
        option: 'Direct · 9 days', estimate: [4000, 4300] },
      { id: 'REQ-0298', title: '2 × 40ft green coffee · Surabaya → Yokohama', when: 'Early November', created: 'Mon 19 Oct', status: 'expired', quote: 'QT-0870',
        option: 'Direct · 11 days', estimate: [4400, 4700] },
    ],

    quotes: {
      'QT-0902': {
        request: 'REQ-0325', status: 'ready', title: '2 × 40ft green coffee · Surabaya → Shanghai',
        route: ['Surabaya', 'Ho Chi Minh City', 'Shanghai'], routeLabel: 'Ocean freight · 1 transshipment', transit: '12 days', departure: 'Wed 9 – Sat 12 Dec',
        issued: 'Tue 10 Nov, 11:20', expires: 'Fri 13 Nov, 17:00', hoursLeft: 72.5,
        lines: [['Origin trucking, Rungkut → Tanjung Perak (2 × 40ft)', 444], ['Container fumigation and certificate', 228], ['Export customs: PEB and Form E', 210], ['Ocean freight to Shanghai, all-in (2 × 40ft)', 2980], ['Documentation and shipment coordination', 85]],
        includes: ['Empty container pickup and loading at your Rungkut warehouse', 'Fumigation certificate for both containers', 'Export declaration (PEB) and Form E application', 'Ocean freight to Shanghai with one transshipment in Ho Chi Minh City'],
        excludes: ['Destination charges, duties and taxes in China', 'Phytosanitary certificate fees', 'Demurrage and detention beyond 7 free days at destination'],
        terms: 'Payment 30 days after the bill of lading date. Rates assume cargo ready at your warehouse 2 days before departure.',
      },
      'QT-0891': {
        request: 'REQ-0311', status: 'accepted', shipment: 'SHP-2411', title: '2 × 40ft green coffee · Surabaya → Shanghai',
        route: ['Surabaya', 'Shanghai'], routeLabel: 'Ocean freight · direct', transit: '9 days', departure: 'Sat 14 Nov',
        issued: 'Tue 10 Nov, 13:05', expires: 'Tue 17 Nov', accepted: 'Tue 10 Nov, 14:55',
        lines: [['Origin trucking, Rungkut → Tanjung Perak (2 × 40ft)', 444], ['Container fumigation and certificate', 228], ['Export customs: PEB and Form E', 210], ['Ocean freight to Shanghai, all-in (2 × 40ft)', 3124], ['Documentation and shipment coordination', 85]],
        includes: ['Empty container pickup and loading at your Rungkut warehouse', 'Fumigation certificate for both containers', 'Export declaration (PEB) and Form E application', 'Direct sailing on Sat 14 Nov, about 9 days to Shanghai'],
        excludes: ['Destination charges, duties and taxes in China', 'Phytosanitary certificate fees', 'Demurrage and detention beyond 7 free days at destination'],
        terms: 'Payment 30 days after the bill of lading date.',
      },
      'QT-0870': {
        request: 'REQ-0298', status: 'expired', title: '2 × 40ft green coffee · Surabaya → Yokohama',
        route: ['Surabaya', 'Yokohama'], routeLabel: 'Ocean freight · direct', transit: '11 days', departure: 'Fri 6 Nov',
        issued: 'Tue 20 Oct', expires: 'Mon 2 Nov', expiredOn: 'Mon 2 Nov',
        lines: [['Origin trucking (2 × 40ft)', 444], ['Container fumigation and certificate', 228], ['Export customs: PEB', 180], ['Ocean freight to Yokohama, all-in (2 × 40ft)', 3690], ['Documentation and shipment coordination', 85]],
        includes: ['Pickup at your warehouse', 'Fumigation', 'Export customs', 'Direct sailing to Yokohama'],
        excludes: ['Destination charges, duties and taxes in Japan'],
        terms: 'Payment 30 days after the bill of lading date.',
      },
    },

    // type: quote | doc | milestone | delay | rejected
    inbox: [
      { type: 'quote', title: 'Your quote for REQ-0325 is ready: US$3,947', meta: 'Valid until Fri 13 Nov, 17:00', time: '2h ago', href: 'quote.html?id=QT-0902', attention: true },
      { type: 'doc', title: 'Please upload the phytosanitary certificate for SHP-2411', meta: 'Due Thu 12 Nov, 10:00', time: '5h ago', href: 'documents.html', attention: true },
      { type: 'delay', title: 'SHP-2386 to Busan is delayed 2 days', meta: 'New ETA Mon 16 Nov · port congestion at Kaohsiung', time: 'Yesterday', href: 'shipment.html?id=SHP-2386', attention: true },
      { type: 'rejected', title: 'Your NIB upload needs a fix', meta: 'The business ID number isn’t readable in the scan', time: 'Mon', href: 'documents.html', attention: true },
      { type: 'milestone', title: 'SHP-2411 is booked on the 14 Nov sailing', meta: 'Arrival in Shanghai Mon 23 Nov', time: 'Tue 10 Nov', href: 'shipment.html?id=SHP-2411' },
      { type: 'milestone', title: 'SHP-2386 departed Surabaya', meta: 'On its way to Busan via Kaohsiung', time: 'Tue 3 Nov', href: 'shipment.html?id=SHP-2386' },
    ],

    companyDocs: [
      { name: 'NIB (business identification number)', status: 'fix', note: 'The scan is cut off at the bottom, so the 13-digit NIB number isn’t readable. Please upload a full-page scan.', updated: 'Mon 9 Nov' },
      { name: 'NPWP (tax ID)', status: 'ready', note: 'Valid. Name matches your company profile.', updated: 'Jun 2024' },
      { name: 'GACC exporter registration (China)', status: 'ready', note: 'Registration CIDN0012345 · valid until Mar 2028.', updated: 'Mar 2025' },
      { name: 'Halal certificate', status: 'ready', note: 'Valid until Jan 2027 · you’ll be reminded 60 days before.', updated: 'Jan 2025' },
    ],

    scenario: {
      prompt: '2 x 40ft coffee beans from Surabaya to Shanghai, mid-November',
      units: 2, unitLabel: '40ft', addLabel: 'Add 1 container', cargoValue: 96000,
      unitFormat: '{n} × 40ft', goods: 'green coffee', lane: ['Surabaya', 'Shanghai'], keyword: 'coffee', when: 'Mid-November',
      summary: [
        ['Origin', 'Your Rungkut warehouse, Surabaya', 'profile'],
        ['Destination', 'Shanghai, China', 'prompt'],
        ['Goods', 'Green coffee beans (Arabica), not roasted', 'ai'],
        ['HS code', '0901.11', 'ai'],
        ['Volume', '~38.4 t · 640 bags × 60 kg', 'profile'],
        ['Containers', '2 × 40ft dry', 'prompt'],
        ['Ready date', 'Wed 11 Nov', 'ai'],
        ['Incoterm', 'FOB Surabaya', 'profile'],
      ],
      baseDepart: '2026-11-14',
      options: [
        { id: 'hcm', tag: 'Recommended', nodes: ['Surabaya', 'Ho Chi Minh City', 'Shanghai'], legs: ['truck', 'ship', 'ship'], label: 'Ocean freight · 1 transshipment',
          transit: 12, window: [0, 3], price: [3850, 4100], notes: [['info', 'Two departures a week, so a missed cut-off only costs 3 days.']] },
        { id: 'direct', tag: 'Fastest', nodes: ['Surabaya', 'Shanghai'], legs: ['truck', 'ship'], label: 'Ocean freight · direct',
          transit: 9, window: [0, 4], price: [4300, 4600], notes: [['warning', 'Space is tight on the 14 Nov sailing: about 2 slots left.']] },
        { id: 'lcb', tag: 'Cheapest', nodes: ['Surabaya', 'Laem Chabang', 'Shanghai'], legs: ['truck', 'ship', 'ship'], label: 'Ocean freight · 1 transshipment',
          transit: 16, window: [2, 6], price: [3450, 3700], notes: [['warning', 'Longer transit. Ask for ventilated containers to protect green coffee from moisture.']] },
      ],
      airOptions: [
        { id: 'air', tag: 'Fastest', nodes: ['Surabaya (SUB)', 'Shanghai (PVG)'], legs: ['truck', 'plane'], label: 'Air freight · direct',
          transit: 2, window: [0, 2], price: [118000, 132000], notes: [['warning', 'About 30× the sea cost for 38 t. Air suits samples, not full containers.']] },
        { id: 'airsin', tag: 'Cheapest', nodes: ['Surabaya (SUB)', 'Singapore', 'Shanghai (PVG)'], legs: ['truck', 'plane', 'plane'], label: 'Air freight · 1 stop',
          transit: 3, window: [0, 3], price: [104000, 116000], notes: [['info', 'Consider air only for an urgent sample of a few bags.']] },
      ],
      docsYou: [
        { name: 'Commercial invoice', due: 'Wed 11 Nov', status: 'missing' },
        { name: 'Packing list', due: 'Wed 11 Nov', status: 'missing' },
        { name: 'Phytosanitary certificate', due: 'Thu 12 Nov, 10:00', status: 'missing' },
        { name: 'Exporter registration for China (GACC)', due: null, status: 'ready', note: 'Already on file, valid until Mar 2028.' },
      ],
      docsThey: [
        ['Export declaration (PEB)', 'Thu 12 Nov'], ['Certificate of origin (Form E)', 'Thu 12 Nov'], ['Fumigation and certificate', 'Wed 11 Nov'], ['Bill of lading', 'After loading'],
      ],
      // AI pre-check results by document, per attempt
      checks: {
        'Commercial invoice': [['ready', 'Matches your request: 2 × 40ft, 38,400 kg, FOB value US$96,000.']],
        'Packing list': [['fix', 'Gross weight is 38,000 kg, but your request and invoice say 38,400 kg. Please correct and upload again.'], ['ready', '640 bags, 38.4 t gross. Matches the invoice.']],
        'Phytosanitary certificate': [['fix', 'This is the application form, not the issued certificate. Upload the certificate after the inspection on Wed 11 Nov.'], ['ready', 'Issued certificate for 2 containers of green coffee. Matches your invoice.']],
      },
    },
  },

  sinta: {
    firstVisitPrompt: '6 CBM batik textiles from Semarang to Dubai, early December',
    suggestions: [
      ['package', 'Batik to Dubai', '6 CBM batik textiles from Semarang to Dubai, early December'],
      ['ship', 'Batik to Rotterdam', '8 CBM batik textiles from Semarang to Rotterdam in January'],
      ['file-search', 'Documents for the UAE', 'Which documents do I need to export textiles to the UAE?'],
    ],
    accountManager: { name: 'Yoga Pratama', role: 'Your account manager', initials: 'YP', color: 0, hours: 'Replies within 2 business hours' },
    staff: [
      { name: 'Yoga Pratama', role: 'Account manager', color: 0, online: true },
      { name: 'Hana Kurniawati', role: 'Operations', color: 2 },
    ],
    chats: [{ title: 'Batik to Dubai, early Dec', href: 'ask.html?chat=0' }],

    shipments: [
      {
        id: 'SHP-S-0418', cargo: 'LCL 8 CBM batik textiles', lane: ['Semarang', 'Rotterdam'], mode: 'ship',
        status: ['In transit', 'info'], location: 'Singapore, waiting for the connecting vessel',
        etd: 'Mon 2 Nov', eta: 'Thu 3 Dec',
        next: { text: 'Nothing needed from you right now.', due: null, href: null },
        route: { nodes: ['Semarang', 'Singapore', 'Rotterdam'], legs: ['ship', 'ship'], at: 1, progress: 0 },
        milestones: [
          { t: 'Picked up', type: 'Trucking', when: 'Thu 29 Oct', state: 'done' },
          { t: 'Export customs cleared', type: 'Customs', when: 'Fri 30 Oct', state: 'done' },
          { t: 'Departed Semarang', type: 'Ocean', when: 'Mon 2 Nov', state: 'done' },
          { t: 'Transshipment at Singapore', type: 'Ocean', when: 'Thu 12 Nov', state: 'next' },
          { t: 'Arrival in Rotterdam', type: 'Ocean', when: 'Thu 3 Dec', state: 'todo' },
          { t: 'Import clearance', type: 'Customs', when: 'By your buyer', state: 'todo' },
        ],
        docsYou: [
          { name: 'Commercial invoice', status: 'ready', note: 'Checked on Wed 28 Oct.' },
          { name: 'Packing list', status: 'ready', note: '42 cartons, 1,650 kg.' },
        ],
        docsThey: [
          { name: 'Export declaration (PEB)', status: 'ready', note: 'Lodged Fri 30 Oct.' },
          { name: 'Bill of lading', status: 'ready', note: 'Issued Mon 2 Nov.' },
        ],
        messages: [
          { ai: true, time: 'Today', text: 'Your cargo reached Singapore on schedule and connects to the Rotterdam vessel on Thu 12 Nov. ETA Rotterdam is Thu 3 Dec.' },
        ],
      },
    ],

    requests: [
      { id: 'REQ-S-117', title: 'LCL 6 CBM batik textiles · Semarang → Dubai', when: 'Early December', created: 'Mon 9 Nov', status: 'quote', quote: 'QT-S-205',
        option: 'Via Port Klang · 14 days', estimate: [820, 910] },
      { id: 'REQ-S-121', title: 'LCL 8 CBM batik textiles · Semarang → Rotterdam', when: 'January', created: 'Tue 10 Nov, 10:15', status: 'review', reviewDays: 0,
        option: 'Via Singapore · 30 days', estimate: [1150, 1300] },
    ],

    quotes: {
      'QT-S-205': {
        request: 'REQ-S-117', status: 'ready', title: 'LCL 6 CBM batik textiles · Semarang → Dubai',
        route: ['Semarang', 'Port Klang', 'Jebel Ali (Dubai)'], routeLabel: 'Ocean freight · LCL · 1 transshipment', transit: '14 days', departure: 'Thu 3 – Sat 5 Dec',
        issued: 'Tue 10 Nov, 09:40', expires: 'Mon 16 Nov, 17:00', hoursLeft: 144.5,
        lines: [['Pickup in Pekalongan and delivery to the CFS', 95], ['Export customs: PEB', 120], ['Ocean freight LCL to Jebel Ali (6 CBM)', 540], ['Documentation and coordination', 60]],
        includes: ['Pickup at your Pekalongan workshop', 'Export declaration (PEB)', 'LCL ocean freight to Jebel Ali via Port Klang'],
        excludes: ['Destination charges, duties and VAT in the UAE', 'Cargo insurance'],
        terms: 'Payment 14 days after invoice.',
      },
    },

    inbox: [
      { type: 'quote', title: 'Your quote for REQ-S-117 is ready: US$815', meta: 'Valid until Mon 16 Nov, 17:00', time: '3h ago', href: 'quote.html?id=QT-S-205', attention: true },
      { type: 'milestone', title: 'SHP-S-0418 arrived in Singapore', meta: 'Connecting vessel on Thu 12 Nov', time: 'Today', href: 'shipment.html?id=SHP-S-0418' },
      { type: 'milestone', title: 'SHP-S-0418 departed Semarang', meta: 'On its way to Rotterdam via Singapore', time: 'Mon 2 Nov', href: 'shipment.html?id=SHP-S-0418' },
    ],

    companyDocs: [
      { name: 'NIB (business identification number)', status: 'ready', note: 'Valid. Matches your company profile.', updated: 'Feb 2025' },
      { name: 'NPWP (tax ID)', status: 'ready', note: 'Valid.', updated: 'Feb 2025' },
      { name: 'Batik mark certificate', status: 'ready', note: 'Valid until Aug 2027.', updated: 'Aug 2024' },
    ],

    scenario: {
      prompt: '6 CBM batik textiles from Semarang to Dubai, early December',
      units: 6, unitLabel: 'CBM', addLabel: 'Add 2 CBM', addStep: 2, cargoValue: 18500,
      unitFormat: 'LCL {n} CBM', goods: 'batik textiles', lane: ['Semarang', 'Dubai'], keyword: 'batik', when: 'Early December',
      summary: [
        ['Origin', 'Your Pekalongan workshop', 'profile'],
        ['Destination', 'Dubai, United Arab Emirates', 'prompt'],
        ['Goods', 'Hand-drawn batik textiles, cotton', 'ai'],
        ['HS code', '5208.52', 'ai'],
        ['Volume', '6 CBM · ~1,200 kg', 'prompt'],
        ['Containers', 'LCL (shared container)', 'ai'],
        ['Ready date', 'Mon 30 Nov', 'ai'],
        ['Incoterm', 'FOB Semarang', 'profile'],
      ],
      baseDepart: '2026-12-03',
      options: [
        { id: 'pkl', tag: 'Recommended', nodes: ['Semarang', 'Port Klang', 'Dubai'], legs: ['truck', 'ship', 'ship'], label: 'Ocean freight · LCL · 1 transshipment',
          transit: 14, window: [0, 2], price: [820, 910], notes: [['info', 'Weekly consolidation with a good on-time record on this lane.']] },
        { id: 'sin', tag: 'Fastest', nodes: ['Semarang', 'Singapore', 'Dubai'], legs: ['truck', 'ship', 'ship'], label: 'Ocean freight · LCL · 1 transshipment',
          transit: 11, window: [1, 3], price: [930, 1020], notes: [['info', 'Faster connection, slightly higher consolidation fee.']] },
        { id: 'cmb', tag: 'Cheapest', nodes: ['Semarang', 'Colombo', 'Dubai'], legs: ['truck', 'ship', 'ship'], label: 'Ocean freight · LCL · 1 transshipment',
          transit: 19, window: [3, 6], price: [720, 800], notes: [['warning', 'Longer dwell in Colombo. Use sealed, moisture-proof packing.']] },
      ],
      airOptions: [
        { id: 'air', tag: 'Fastest', nodes: ['Semarang (SRG)', 'Dubai (DXB)'], legs: ['truck', 'plane'], label: 'Air freight · 1 stop',
          transit: 3, window: [0, 2], price: [3900, 4400], notes: [['info', 'For 1,200 kg, air is about 5× the LCL cost but arrives 11 days sooner.']] },
      ],
      docsYou: [
        { name: 'Commercial invoice', due: 'Mon 30 Nov', status: 'missing' },
        { name: 'Packing list', due: 'Mon 30 Nov', status: 'missing' },
      ],
      docsThey: [['Export declaration (PEB)', 'Wed 2 Dec'], ['Certificate of origin', 'Wed 2 Dec'], ['Bill of lading', 'After loading']],
      checks: {
        'Commercial invoice': [['ready', 'Matches your request: 6 CBM, FOB value US$18,500.']],
        'Packing list': [['ready', '42 cartons, 1,200 kg. Matches the invoice.']],
      },
    },
  },
};

/* ---------- Partner workspace (placeholder) ---------- */
window.LMData.partner = {
  truk: {
    fleet: { total: 100, allocations: [
      { tenant: 'nusantara', trucks: 10, until: 'Fri 20 Nov' },
      { tenant: 'samudralog', trucks: 6, until: 'Mon 16 Nov, 12:00' },
    ] },
    jobs: [
      { id: 'JOB-8841', tenant: 'nusantara', what: 'Container pickup and port delivery · 2 × 40ft', where: 'Rungkut → Tanjung Perak', when: 'Wed 11 Nov, 08:00', status: ['Assigned', 'info'] },
      { id: 'JOB-8846', tenant: 'nusantara', what: 'Pickup · 3 × 40ft', where: 'Cikarang → Tanjung Priok', when: 'Fri 13 Nov, 07:00', status: ['Assigned', 'info'] },
      { id: 'JOB-8790', tenant: 'nusantara', what: 'Pickup · 1 × 20ft', where: 'Rungkut → Tanjung Perak', when: 'Sat 7 Nov', status: ['Completed', 'success'] },
      { id: 'SL-3321', tenant: 'samudralog', what: 'Pickup · 2 × 20ft', where: 'Pekalongan → Tanjung Emas', when: 'Thu 12 Nov, 09:00', status: ['Assigned', 'info'] },
      { id: 'SL-3307', tenant: 'samudralog', what: 'Port delivery · 1 × 40ft', where: 'Semarang → Tanjung Emas', when: 'Mon 9 Nov', status: ['In progress', 'warning'] },
    ],
  },
};

/* ==========================================================================
   v0.6 — Logistics company update — ILLUSTRATIVE SAMPLE DATA
   ========================================================================== */
(function (D) {
  /* ---------- Customers: the tenant's own customer base (never shared) ---------- */
  // portal: active | invited | expired | none (not yet invited, still uses WhatsApp)
  D.network.customers = [
    { org: 'kopi', type: 'Exporter', contact: 'Rina Wijaya', contactRole: 'Logistics coordinator', sender: 'rina', lanes: ['ID → CN', 'ID → KR'],
      active: 2, openRequests: 2, revenueQ: 24850, last: 'Today, 15:32', portal: 'active', since: 'June 2024', manager: 'Arief Hidayat', lanesKey: ['SUB-SHA', 'SUB-BUS'] },
    { org: 'sinar', type: 'Importer', contact: 'Hendro Gunawan', contactRole: 'Supply chain lead', lanes: ['JP → ID'],
      active: 2, openRequests: 0, revenueQ: 21300, last: 'Today, 09:12', portal: 'active', since: 'Feb 2025', manager: 'Putri Anggraini' },
    { org: 'rempah', type: 'Exporter', contact: 'Ayu Lestari', contactRole: 'Export manager', lanes: ['ID → NL', 'ID → AE'],
      active: 1, openRequests: 1, revenueQ: 9800, last: 'Yesterday', portal: 'active', since: 'Mar 2025', manager: 'Arief Hidayat' },
    { org: 'mebel', type: 'Exporter', contact: 'Bayu Setiawan', contactRole: 'Owner', lanes: ['ID → NL'],
      active: 1, openRequests: 0, revenueQ: 14200, last: '4 days ago', portal: 'none', since: 'Aug 2024', manager: 'Putri Anggraini', note: 'Still sends requests by WhatsApp' },
    { org: 'teh', type: 'Exporter', contact: 'Laras Anindya', contactRole: 'Director', lanes: ['ID → GB'],
      active: 0, openRequests: 0, revenueQ: 0, last: 'Never', portal: 'expired', since: null, manager: 'Arief Hidayat', invitedOn: 'Mon 26 Oct' },
  ];
  // Customers are never discoverable: no "wants to connect" requests from customers
  D.network.invitations.received = [];
  D.network.invitations.sent = D.network.invitations.sent.filter(i => !/customer/i.test(i.role));
  D.customerInvites = [
    { org: 'teh', to: 'Laras Anindya', via: 'WhatsApp', when: 'Sent Mon 26 Oct', status: 'expired' },
    { org: 'rempah', to: 'Ayu Lestari', via: 'Email', when: 'Accepted Wed 12 Mar 2025', status: 'accepted' },
  ];
  D.customerNotes = {
    kopi: ['Prefers direct sailings for green coffee; will pay a premium for speed.', 'Harvest peaks Oct–Dec: expect 2–4 containers a month.', 'Payment always on time (30 days after B/L).'],
  };

  /* ---------- Partner integrations and live availability ---------- */
  // api = live availability + direct booking · offline = API down, fall back to RFQ · manual = RFQ by link · pending = invite pending
  D.integrations = { truk: 'api', gudang: 'api', samudra: 'offline', pacific: 'manual', brantas: 'manual', fumi: 'manual', bea: 'manual', angkut: 'manual', surya: 'manual', angkasa: 'pending' };
  D.availability = {
    truk: {
      unit: 'trucks', total: 100, allocatedToYou: { trucks: 10, until: 'Fri 20 Nov' },
      // 14 days from Tue 10 Nov: [trucks free, 40ft trailers free]
      days: [[18, 7], [15, 5], [9, 3], [12, 5], [30, 11], [32, 12], [20, 8], [14, 6], [11, 4], [16, 6], [22, 9], [35, 14], [36, 14], [25, 10]],
      start: '2026-11-10', rate: 185,
    },
    gudang: { unit: 'pallet positions', total: 800, allocatedToYou: { trucks: 120, until: 'Mon 30 Nov', unitLabel: 'pallet positions' },
      days: [[210, 0], [205, 0], [198, 0], [190, 0], [240, 0], [240, 0], [230, 0], [220, 0], [215, 0], [210, 0], [205, 0], [260, 0], [260, 0], [250, 0]], start: '2026-11-10', rate: 4 },
    samudra: { offlineSince: 'Tue 10 Nov, 14:05' },
  };
  D.bookingRefs = { truk: 'TJ-88231', gudang: 'GS-40317' };

  /* ---------- Request plans (AI suggestion for staff), keyed by lane ---------- */
  D.requestPlans = {
    'SUB-SHA': {
      legs: [
        { id: 'truck', service: 'Trucking', icon: 'truck', route: 'Rungkut → Tanjung Perak', qty: 2, unit: 'truck',
          partners: [{ org: 'truk', rate: 185, note: '12 trucks free Wed 11 Nov · 5 × 40ft trailers' }, { org: 'brantas', rate: 172, note: 'Last quote US$172 + waiting' }] },
        { id: 'fumi', service: 'Fumigation', icon: 'wind', route: 'At Rungkut warehouse', qty: 2, unit: 'container',
          partners: [{ org: 'fumi', rate: 95, note: 'Rate card, valid to 30 Nov' }] },
        { id: 'customs', service: 'Export customs', icon: 'stamp', route: 'Tanjung Perak', qty: 1, unit: 'shipment',
          partners: [{ org: 'bea', rate: 175, note: 'PEB + Form E, rate card' }] },
        { id: 'ocean', service: 'Ocean freight', icon: 'ship', route: 'Tanjung Perak → Shanghai', qty: 2, unit: '40ft',
          partners: [{ org: 'samudra', rate: 1420, note: 'API offline since 14:05 · last rate US$1,420' }, { org: 'pacific', rate: 1315, note: 'Via Ho Chi Minh City, incl. est. BAF' }] },
      ],
      risks: [
        ['warning', 'Phytosanitary certificate missing, 5 days to ETD. The customer applies; inspection takes about 2 days.'],
        ['info', 'Incoterm FOB: confirm the customer wants you to book the sea leg.'],
        ['info', 'Direct sailings on 14 Nov have about 2 slots left. Book ocean first.'],
      ],
    },
    'SUB-BUS': {
      legs: [
        { id: 'truck', service: 'Trucking', icon: 'truck', route: 'Rungkut → Tanjung Perak', qty: 1, unit: 'truck',
          partners: [{ org: 'truk', rate: 150, note: '20ft trailers available in January' }] },
        { id: 'customs', service: 'Export customs', icon: 'stamp', route: 'Tanjung Perak', qty: 1, unit: 'shipment',
          partners: [{ org: 'bea', rate: 140, note: 'PEB, rate card' }] },
        { id: 'ocean', service: 'Ocean freight', icon: 'ship', route: 'Tanjung Perak → Busan', qty: 1, unit: '20ft',
          partners: [{ org: 'samudra', rate: 980, note: 'API offline · last rate US$980' }, { org: 'pacific', rate: 1040, note: 'Direct, weekly' }] },
      ],
      risks: [
        ['danger', 'Waiting 25 hours. Past your 24-hour reply target.'],
        ['info', 'January sailings fill up before Lunar New Year. Book 2 weeks ahead.'],
      ],
    },
  };

  /* ---------- Seeded customer requests on the staff side (Nusantara only) ---------- */
  // Sender-submitted requests created during a demo are added from LM.db at run time.
  D.staffRequests = [
    { id: 'REQ-0330', sender: 'rina', org: 'kopi', lane: 'SUB-BUS', prompt: '1 x 20ft roasted coffee from Surabaya to Busan in January',
      title: '1 × 20ft roasted coffee · Surabaya → Busan', when: 'January', option: 'Direct · 9 days', estimate: [1650, 1800],
      createdAt: '2026-11-09T15:10:00', status: 'review', docs: [['Commercial invoice', 'missing'], ['Packing list', 'missing']],
      events: [['send', 'Rina Wijaya sent the request from the portal', 'Mon 9 Nov, 15:10'], ['eye', 'Arief Hidayat opened it', 'Mon 9 Nov, 16:02']] },
    { id: 'REQ-0325', sender: 'rina', org: 'kopi', lane: 'SUB-SHA', prompt: '2 x 40ft coffee beans from Surabaya to Shanghai, December sailing',
      title: '2 × 40ft green coffee · Surabaya → Shanghai', when: 'December sailing', option: 'Via Ho Chi Minh City · 12 days', estimate: [3850, 4100],
      createdAt: '2026-11-09T09:30:00', status: 'quote', quote: 'QT-0902', viewedAt: 'Tue 10 Nov, 10:42',
      docs: [['Commercial invoice', 'missing'], ['Packing list', 'missing'], ['Phytosanitary certificate', 'missing'], ['Exporter registration for China (GACC)', 'ready']],
      events: [['send', 'Rina Wijaya sent the request from the portal', 'Mon 9 Nov, 09:30'], ['eye', 'Arief Hidayat opened it', 'Mon 9 Nov, 10:05'], ['file-stack', 'RFQs sent to 5 partners', 'Mon 9 Nov, 11:20'], ['receipt', 'Quote QT-0902 sent (US$3,947)', 'Tue 10 Nov, 11:20'], ['eye', 'Quote viewed by customer', 'Tue 10 Nov, 10:42']] },
  ];

  /* ---------- Operations dashboard ---------- */
  D.ops = {
    kpis: { active: 21, atRisk: 3, quotesAwaiting: 3, margin: 18420, marginPct: 12.8, overrun: 605, overrunCount: 3 },
    delays: [
      { id: 'SHP-2402', org: 'mebel', cargo: 'LCL 12 CBM furniture', lane: ['Semarang', 'Rotterdam'], cause: 'The feeder vessel from Semarang reached Singapore 2 days late.',
        days: 2, eta: 'Thu 10 Dec', etaWas: 'Thu 3 Dec', severity: 'danger',
        knock: ['Misses the Rotterdam vessel cut-off (Wed 11 Nov) → next sailing Wed 18 Nov, +7 days', 'Customer’s store launch on Tue 1 Dec is at risk'],
        cost: { extra: 300, items: [['Storage in Singapore, 7 days', 180], ['Rebooking fee', 120]], marginBefore: 610, marginAfter: 310 },
        fixes: [
          { id: 'klang', title: 'Reroute via Port Klang', detail: 'Truck to Port Klang, load on Fri 13 Nov vessel', eta: 'Sat 5 Dec', days: '+2 days', cost: 420, recommended: true },
          { id: 'wait', title: 'Wait for the next sailing', detail: 'Stay on the planned route, sail Wed 18 Nov', eta: 'Thu 10 Dec', days: '+7 days', cost: 300 },
          { id: 'split', title: 'Split the shipment', detail: 'Air-freight 2 CBM of launch stock, rest by sea', eta: 'Fri 20 Nov (air part)', days: 'Launch stock on time', cost: 1900 },
        ],
        comms: [['WhatsApp', 'Tue 10 Nov, 08:10', 'Sent to Bayu Setiawan: “Your furniture is delayed in Singapore. We are checking options and will update you today.”']] },
      { id: 'SHP-2386', org: 'kopi', sender: 'rina', cargo: '1 × 20ft roasted coffee', lane: ['Surabaya', 'Busan'], cause: 'Port congestion at Kaohsiung, where the container changes vessel.',
        days: 2, eta: 'Mon 16 Nov', etaWas: 'Sat 14 Nov', severity: 'warning',
        knock: ['Arrives after the consignee’s customs slot (Sat 14 Nov) → cleared Wed 18 Nov', 'Demurrage risk from Fri 20 Nov if the container isn’t collected'],
        cost: { extra: 140, items: [['Transshipment storage at Kaohsiung', 140]], marginBefore: 240, marginAfter: 100 },
        fixes: [
          { id: 'free', title: 'Ask the carrier for 3 extra free days', detail: 'Avoids demurrage if collection slips', eta: 'Mon 16 Nov', days: '+2 days', cost: 0, recommended: true },
          { id: 'broker', title: 'Pre-book a new customs slot', detail: 'Through the buyer’s broker for Mon 16 Nov', eta: 'Mon 16 Nov', days: '+2 days', cost: 60 },
        ],
        comms: [['Portal', 'Mon 9 Nov, 17:20', 'AI update: “Your container is delayed by 2 days because of port congestion at Kaohsiung…”']] },
    ],
    hold: { id: 'SHP-2390', org: 'rempah', cause: 'Held for customs inspection in Dubai', days: 1 },
    overruns: [
      { id: 'SHP-2402', org: 'mebel', quoted: 5480, actual: 5780, cause: 'Storage and rebooking after a missed connection' },
      { id: 'SHP-2390', org: 'rempah', quoted: 2140, actual: 2360, cause: 'Customs inspection fee in Dubai' },
      { id: 'SHP-2398', org: 'sinar', quoted: 1890, actual: 1975, cause: 'Port congestion surcharge at Tanjung Priok' },
    ],
    board: [
      { stage: 'Booked', count: 5, items: ['SHP-2411', 'SHP-2415'] },
      { stage: 'Pickup', count: 2, items: ['SHP-2417'] },
      { stage: 'Export customs', count: 3, items: ['SHP-2409'] },
      { stage: 'In transit', count: 8, items: ['SHP-2402', 'SHP-2386', 'SHP-2398'] },
      { stage: 'Import customs', count: 2, items: ['SHP-2390'] },
      { stage: 'Delivered', count: 23, items: [], note: 'Last 30 days' },
    ],
    lost: [
      { quote: 'QT-0855', org: 'kopi', value: 3880, reason: 'Price too high: “We found a cheaper direct rate.”', when: 'Mon 12 Oct' },
      { quote: 'QT-0861', org: 'sinar', value: 1720, reason: 'Timing: the buyer moved the order to January', when: 'Thu 22 Oct' },
    ],
  };

  /* ---------- Customer portal settings (the tenant decides what senders see) ---------- */
  D.portalDefaults = {
    showCarriers: false, showTransship: true, estimatePolicy: 'instant', slaHours: 24,
    inviteText: 'Hi {name}, {company} has set up a customer portal for you. Request shipments, approve quotes and track your cargo in one place.',
    margins: [
      { scope: 'All lanes', kind: '%', value: 12 },
      { scope: 'ID → CN (sea)', kind: '%', value: 12.5 },
      { scope: 'PT Kopi Nusantara', kind: '%', value: 11 },
      { scope: 'Documentation fee, all customers', kind: 'fixed', value: 85 },
    ],
    rates: [
      ['Surabaya → Shanghai', 'Ocean FCL 40ft', 1350, 'Mon 30 Nov'],
      ['Surabaya → Busan', 'Ocean FCL 20ft', 980, 'Mon 30 Nov'],
      ['Rungkut → Tanjung Perak', 'Trucking 40ft', 185, 'Mon 30 Nov'],
      ['Tanjung Perak', 'Export customs (PEB + Form E)', 175, 'Thu 31 Dec'],
      ['Surabaya area', 'Fumigation per container', 95, 'Mon 30 Nov'],
    ],
    lanes: [['Surabaya', 'Shanghai', 'Sea FCL'], ['Surabaya', 'Busan', 'Sea FCL'], ['Tanjung Priok', 'Rotterdam', 'Sea FCL/LCL'], ['Semarang', 'Rotterdam', 'Sea LCL'], ['Nagoya', 'Tanjung Priok', 'Sea FCL (import)'], ['Makassar', 'Dubai', 'Air']],
  };
  // Carriers behind each customer route option (shown only when "Show carrier names" is on)
  D.optionCarriers = { hcm: 'Pacific Bridge Shipping', direct: 'Samudra Lines Agency', lcb: 'Pacific Bridge Shipping', air: 'Garuda Cargo', airsin: 'Singapore Airlines Cargo' };
})(window.LMData);

/* ---------- Delay detail: planned vs actual (illustrative) ---------- */
(function (D) {
  const slip = {
    'SHP-2402': [['Departed Semarang (feeder)', 'Mon 2 Nov', 'Mon 2 Nov', 0], ['Arrival in Singapore', 'Mon 9 Nov', 'Wed 11 Nov', 2], ['Rotterdam vessel cut-off', 'Wed 11 Nov, 12:00', 'Missed', null],
      ['Departure from Singapore', 'Wed 11 Nov', 'Wed 18 Nov', 7], ['Arrival in Rotterdam', 'Thu 3 Dec', 'Thu 10 Dec', 7]],
    'SHP-2386': [['Departed Surabaya', 'Tue 3 Nov', 'Tue 3 Nov', 0], ['Arrival in Kaohsiung', 'Sun 8 Nov', 'Tue 10 Nov', 2], ['Connecting vessel to Busan', 'Mon 9 Nov', 'Wed 11 Nov', 2],
      ['Arrival in Busan', 'Sat 14 Nov', 'Mon 16 Nov', 2], ['Consignee customs slot', 'Sat 14 Nov', 'Wed 18 Nov', 4]],
  };
  const chain = {
    'SHP-2402': ['Feeder 2 days late into Singapore', 'Misses Rotterdam cut-off', 'Next sailing +7 days', 'ETA Thu 10 Dec', 'Store launch 1 Dec at risk'],
    'SHP-2386': ['Congestion at Kaohsiung', 'Connection +2 days', 'ETA Mon 16 Nov', 'Customs slot moves to Wed 18 Nov', 'Demurrage risk from Fri 20 Nov'],
  };
  const quotedCost = { 'SHP-2402': 5480, 'SHP-2386': 1450 };
  D.ops.delays.forEach(d => { d.slip = slip[d.id]; d.chain = chain[d.id]; d.quotedCost = quotedCost[d.id]; });
})(window.LMData);
