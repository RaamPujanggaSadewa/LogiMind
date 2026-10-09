/* ==========================================================================
   LogiMind prototype — ASCO import scenario (main demo), loaded after shell.js
   One shipment request from ABC Electronics (Shanghai) to PT Chan Electronics
   (Bandung), run end to end by ASCO with two core partners per leg.

   The whole flow lives in LM.db under "asco", so the shipper portal, the ASCO
   staff pages and the partner pages read and write the same record.
   Rules kept here:
   - the shipper never sees partner names, partner costs or margins
   - a partner sees only its own leg and never the customer price
   - nothing from ASCO appears for Nusantara Cargo or its senders, and back
   ========================================================================== */

window.Asco = (() => {
  const D = window.LMData, A = D.asco, T = D.tenants.asco;
  const { $, $$, esc, tag, icons, toast, db } = LM;
  const acct = LM.account, eff = LM.effective, persona = LM.persona;
  const FILE = (location.pathname.split('/').pop() || 'index.html').replace(/\.html$/, '') || 'index';
  const ctx = {
    staff: !!(acct && acct.persona === 'tenant' && acct.tenant === 'asco' && persona === 'tenant'),
    sender: !!(eff && eff.persona === 'sender' && eff.tenant === 'asco' && persona === 'sender'),
    partner: !!(acct && acct.id === 'jaya' && persona === 'partner'),
  };
  const active = ctx.staff || ctx.sender || ctx.partner;
  const P = (path) => LM.base + path;          // root-relative link from any folder

  /* ---------- state in LM.db ---------- */
  const blank = () => ({ settings: { blDays: 3, estimatePolicy: 'confirmed', margin: 12 }, events: [], notices: [], emails: [] });
  function get() { const d = db.read(); return Object.assign(blank(), d.asco || {}); }
  function save(fn) { const d = db.read(); const s = Object.assign(blank(), d.asco || {}); fn(s); d.asco = s; db.write(d); return s; }
  function put(s) { db.update(d => { d.asco = s; }); }

  /* ---------- formatting ---------- */
  const at = (k) => A.clock[k];
  // demo clock for live actions: the story time of that event, never before the last event
  function when(k) { const last = get().events.reduce((m, e) => e.at > m ? e.at : m, ''); return !last || at(k) > last ? at(k) : addHours(last, 0.25); }
  function fmt(iso, opts = {}) {
    if (!iso) return '';
    const d = new Date(iso);
    const day = d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' }).replace(',', '');
    return opts.date ? day : `${day}, ${d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}`;
  }
  const addDays = (iso, n) => { const d = new Date(iso); d.setDate(d.getDate() + n); return d.toISOString().slice(0, 10); };
  const addHours = (iso, h) => localIso(new Date(new Date(iso).getTime() + h * 3600000));
  const localIso = (d) => { const p = (n) => String(n).padStart(2, '0'); return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`; };
  const usd = (n) => (n < 0 ? '−' : '') + 'US$' + Math.abs(Math.round(n)).toLocaleString('en-US');
  const cur = (n, c) => c === 'USD' ? usd(n) : `${c} ${Math.round(n).toLocaleString('en-US')}`;
  const toUSD = (n, c) => n / (A.fx[c] || 1);
  const pname = (pid) => D.orgs[pid].name;
  const stars = (n) => `<span class="stars" title="${n} of 5">${[1, 2, 3, 4, 5].map(i => `<i data-lucide="star"${i > n ? ' class="off"' : ''}></i>`).join('')}</span>`;
  const partnersOn = (leg) => Object.keys(A.partners).filter(p => A.partners[p].leg === leg);
  const legOf = (pid) => A.partners[pid].leg;
  const ROLE = { origin: 'Origin core partner', dest: 'Destination core partner' };

  /* ---------- audit trail, notices, emails ---------- */
  // text = staff wording (may name partners); pub = shipper-safe wording (no partner names, costs or margin)
  function ev(s, when, role, text, pub, extra = {}) { s.events.push({ at: when, role, text, pub: pub === undefined ? text : pub, ...extra }); }
  function notice(s, when, n) { s.notices.push({ at: when, ...n }); }
  function mail(s, when, m) { s.emails.push({ at: when, ...m }); }

  /* ---------- lifecycle ---------- */
  function stage(s) {
    if (!s.req) return 0;
    if (!s.rfq) return 1;
    const q = s.quotes || [];
    if (!q.some(x => x.sentAt)) return 2;
    if (!q.some(x => x.status === 'accepted')) return 3;
    if (!(s.docs && s.docs.submittedAt)) return 4;
    if (!s.approval) return 5;
    const st = s.steps || {};
    if (!st[3]) return 6;
    if (!(s.bl && s.bl.received)) return 7;
    if (!s.pod) return 8;
    if (!(s.invoices && s.invoices.bal && s.invoices.bal.issuedAt)) return 9;
    return 10;
  }
  function lifecycleHTML(s, opts = {}) {
    const k = stage(s), names = opts.customer ? A.stagesCustomer : A.stages, closed = k === 10;
    const steps = names.map((n, i) => {
      const done = i < k || closed, cur = i === k && !closed;
      return `<div class="ss ${done ? 'done' : cur ? 'current' : ''}"><span class="d">${done ? '<i data-lucide="check"></i>' : i + 1}</span><span class="l">${esc(n)}</span></div>`;
    }).join('');
    const label = closed ? (opts.customer ? 'Completed' : 'Closed') : names[k];
    return `<section class="lifecycle" aria-label="Shipment lifecycle">
      <div class="lc-head"><i data-lucide="route" style="width:14px;height:14px"></i><span>${opts.customer ? 'Where your shipment is' : 'Lifecycle'}: <b>${esc(label)}</b>${closed ? '' : ` · step ${k + 1} of ${names.length}`}</span>
        <div class="right">${opts.right || ''}${opts.jump ? jumpHTML(k) : ''}</div></div>
      <div class="status-stepper">${steps}</div></section>`;
  }
  const JUMP_HINT = ['Clears the flow: Lina has not sent the request yet', 'Lina has sent the request', 'RFQs sent to the 4 core partners, no replies yet', 'All replies in · v1 sent and negotiated by Lina',
    'v2 accepted · packing list and invoice uploaded with mismatches', 'Documents fixed and submitted', 'Approved: DSID, POs, down payment · pickup done', 'Origin leg done · B/L reminder sent 2×',
    'B/L received · import customs done with minor damage', 'Driver POD signed · partners asked to invoice', 'Balance invoice issued'];
  function jumpHTML(k) {
    return `<button class="btn-secondary" data-jump-toggle style="height:28px" title="Demo mode only"><i data-lucide="fast-forward"></i>Demo: jump to stage</button>
      <div class="jump-menu" id="jumpMenu"><div class="jm-note">Demo mode only. Fills the flow with realistic data up to that stage, on all three personas.</div>
      ${A.stages.map((n, i) => `<button data-jump="${i}" class="${i === k ? 'cur' : ''}" title="${esc(JUMP_HINT[i])}"><span class="n">${i + 1}</span><span><b style="font-weight:500">${esc(n)}</b><br><span class="caption">${esc(JUMP_HINT[i])}</span></span></button>`).join('')}</div>`;
  }
  document.addEventListener('click', e => {
    const tgl = e.target.closest('[data-jump-toggle]'), m = $('#jumpMenu');
    if (tgl && m) { m.classList.toggle('open'); return; }
    const j = e.target.closest('[data-jump]');
    if (j) { put(seedTo(+j.dataset.jump)); toast(`Demo jumped to: ${A.stages[+j.dataset.jump]}`); setTimeout(() => location.reload(), 350); return; }
    if (m && !e.target.closest('#jumpMenu')) m.classList.remove('open');
    const c = e.target.closest('[data-copy]');
    if (c) { try { navigator.clipboard.writeText(c.dataset.copy); } catch (e2) {} toast('Copied ' + c.dataset.copy); }
  });

  /* ---------- request ---------- */
  const DEFAULT_FIELDS = { pol: 'Shanghai (CNSHA)', pod: 'Tanjung Priok, Jakarta (IDTPP)', cbm: '200', ctype: '3 × 40ft HC', value: '480,000', currency: 'USD', hs: '8528.72',
    etd: '2026-11-02', eta: '2026-11-12', pickup: 'No. 88 Jinqiao Road, Pudong, Shanghai', consignee: 'PT Chan Electronics', consigneeLoc: 'Bandung, West Java, Indonesia' };
  const FIELD_LABELS = [['pol', 'Port of loading'], ['pod', 'Port of destination'], ['cbm', 'Volume (CBM)'], ['ctype', 'Container type'], ['value', 'Cargo value'], ['hs', 'HS code'],
    ['etd', 'Expected departure'], ['eta', 'Expected arrival'], ['pickup', 'Pickup location'], ['consignee', 'Consignee'], ['consigneeLoc', 'Consignee location']];
  function reqTitle(f) { return `${f.cbm || '?'} CBM electronics · ${(f.pol || '').replace(/ \(.*\)/, '')} → ${(f.consigneeLoc || f.pod || '').split(',')[0]}`; }
  function fieldText(f, k) {
    if (k === 'value') return f.value ? `${f.currency || 'USD'} ${f.value}` : '';
    if (k === 'etd' || k === 'eta') return f[k] ? fmt(f[k] + 'T12:00', { date: true }) + ' 2026' : '';
    return f[k] || '';
  }
  function aSubmit(s, { prompt, fields }, when) {
    s.req = { id: A.requestId, prompt, fields, at: when, title: reqTitle(fields) };
    ev(s, when, 'Shipper', `Lina Zhou (ABC Electronics) sent request ${A.requestId}: ${reqTitle(fields)}`, `Request ${A.requestId} sent: ${reqTitle(fields)}`);
    ev(s, addHours(when, 0.4), 'LogiMind', 'AI delivery plan drafted: 7 steps in 2 core-partner legs', 'Delivery plan drafted');
    notice(s, when, { type: 'sent', title: `Request ${A.requestId} sent to ASCO`, meta: 'ASCO is collecting partner costing. You’ll get a quotation by email and here.', href: 'request.html' });
  }

  /* ---------- RFQ and replies ---------- */
  function aSendRfq(s, when) {
    s.rfq = { sentAt: when, to: Object.keys(A.partners), replies: {} };
    Object.keys(A.partners).forEach(p => mail(s, when, { to: A.partners[p].email, kind: 'rfq', partner: p, subject: rfqSubject(p) }));
    ev(s, when, 'ASCO PIC', 'RFQ sent by magic link to 4 core partners: Pudong Link, Huangpu Freight (origin) · Jaya Cargo, Priok Express (destination)', 'Partner costing requested for both legs');
  }
  function aReply(s, pid, r, when) {
    s.rfq.replies[pid] = { ...r, at: when };
    const n = Object.keys(s.rfq.replies).length;
    ev(s, when, ROLE[legOf(pid)], `${pname(pid)} replied: ${cur(r.amount, r.currency)} (≈ ${usd(toUSD(r.amount, r.currency))}), ${r.transit} days, valid to ${fmt(r.validity + 'T12:00', { date: true })}`,
      `Partner costing received (${n} of 4)`, { partner: pid });
  }
  const replyUSD = (s, pid) => { const r = s.rfq && s.rfq.replies[pid]; return r ? toUSD(r.amount, r.currency) : null; };

  // AI ranking per leg: on-time and rating weighed against the price premium
  function ranking(s, leg) {
    const ids = partnersOn(leg).filter(p => replyUSD(s, p) != null);
    if (!ids.length) return null;
    const min = Math.min(...ids.map(p => replyUSD(s, p)));
    const score = (p) => A.partners[p].onTime + A.partners[p].stars * 2 - (replyUSD(s, p) - min) / min * 120;
    const best = ids.slice().sort((a, b) => score(b) - score(a))[0];
    const cheapest = ids.slice().sort((a, b) => replyUSD(s, a) - replyUSD(s, b))[0];
    const r = s.rfq.replies, B = A.partners[best];
    let why;
    if (ids.length < 2) why = `${pname(best)}: the only reply so far (${B.stars}★, ${B.onTime}% on time).`;
    else if (best === cheapest) why = `${pname(best)}: lowest price and ${B.stars}★, ${B.onTime}% on time.`;
    else {
      const dOn = B.onTime - A.partners[cheapest].onTime, dT = r[cheapest].transit - r[best].transit;
      why = `${pname(best)}: ${usd(replyUSD(s, best) - replyUSD(s, cheapest))} more than the cheapest, but ${dOn} points better on time${dT > 0 ? ` and ${dT} day${dT > 1 ? 's' : ''} faster` : ''}${B.stars > A.partners[cheapest].stars ? ` (${B.stars}★ vs ${A.partners[cheapest].stars}★)` : ''}.`;
    }
    return { best, cheapest, why, order: ids.slice().sort((a, b) => score(b) - score(a)) };
  }

  /* ---------- quotation ---------- */
  const STAGE_LINES = ['Pickup at your warehouse in Shanghai and origin handling', 'Export customs clearance (China)', 'Ocean freight Shanghai → Tanjung Priok, 3 × 40ft HC',
    'Import customs clearance and port charges (Indonesia)', 'Inland delivery Jakarta → Bandung and hand-over to the consignee'];
  function price(s, sel, margin) {
    const o = replyUSD(s, sel.origin), d = replyUSD(s, sel.dest);
    const costs = [...A.legs.origin.split.map(x => o * x), ...A.legs.dest.split.map(x => d * x)];
    const cost = o + d;
    const total = Math.round(margin.kind === '%' ? cost * (1 + margin.value / 100) : cost + margin.value);
    const lines = costs.map((c, i) => [STAGE_LINES[i], Math.round(c * total / cost)]);
    lines[2][1] += total - lines.reduce((a, l) => a + l[1], 0);
    return { lines, cost, total, profit: total - cost };
  }
  const marginText = (m) => m.kind === '%' ? `${m.value}%` : `${usd(m.value)} fixed`;
  function aGenerate(s, { sel, margin, validDays }, when) {
    s.quotes = s.quotes || [];
    const prev = s.quotes.filter(q => q.sentAt).slice(-1)[0];
    s.quotes = s.quotes.filter(q => q.sentAt);           // a new draft replaces an unsent one
    const v = s.quotes.length + 1, p = price(s, sel, margin);
    const validUntil = prev ? addDays(prev.validUntil, validDays) : addDays(when.slice(0, 10), validDays);
    const changes = [];
    if (prev) {
      if (prev.margin.kind !== margin.kind || prev.margin.value !== margin.value) changes.push(`Margin ${marginText(prev.margin)} → ${marginText(margin)}`);
      if (prev.sel.origin !== sel.origin) changes.push(`Origin partner ${pname(prev.sel.origin)} → ${pname(sel.origin)}`);
      if (prev.sel.dest !== sel.dest) changes.push(`Destination partner ${pname(prev.sel.dest)} → ${pname(sel.dest)}`);
      if (validDays) changes.push(`validity +${validDays} days`);
    }
    const transit = s.rfq.replies[sel.origin].transit + s.rfq.replies[sel.dest].transit;
    s.quotes.push({ v, id: `${A.quoteNo}-v${v}`, createdAt: when, sel: { ...sel }, margin: { ...margin }, validDays, validUntil, transit, ...p,
      changes: changes.join(', ').replace(/^./, c => c.toUpperCase()), status: 'draft' });
    s.sel = { ...sel }; s.margin = { ...margin };
    return s.quotes[s.quotes.length - 1];
  }
  const latest = (s) => (s.quotes || []).slice(-1)[0] || null;
  const latestSent = (s) => (s.quotes || []).filter(q => q.sentAt).slice(-1)[0] || null;
  const accepted = (s) => (s.quotes || []).find(q => q.status === 'accepted') || null;
  function aSendQuote(s, when) {
    const q = latest(s); q.sentAt = when; q.status = 'sent';
    s.quotes.forEach(x => { if (x !== q && x.status === 'sent') x.status = 'superseded'; });
    ev(s, when, 'ASCO PIC', `Quotation v${q.v} sent to Lina Zhou: ${usd(q.total)} (partner cost ${usd(q.cost)}, margin ${marginText(q.margin)})${q.changes ? ` · ${q.changes}` : ''}`,
      `Quotation v${q.v} sent: ${usd(q.total)}`);
    notice(s, when, { type: 'quote', title: `Quotation v${q.v} is ready: ${usd(q.total)}`, meta: `Valid until ${fmt(q.validUntil + 'T12:00', { date: true })}${q.v > 1 ? ' · replaces v' + (q.v - 1) : ''}`, href: 'quote.html' });
    mail(s, when, { to: A.customer.email, kind: 'quote', subject: `ASCO quotation ${q.id} · ${usd(q.total)}` });
  }
  function aNegotiate(s, { text, target }, when) {
    const q = latestSent(s); q.status = 'negotiated'; q.negotiation = { text, target: target || null, at: when };
    ev(s, when, 'Shipper', `Lina Zhou asked to negotiate v${q.v}${target ? `: target ${usd(target)}` : ''} · “${text}”`, `Negotiation requested on v${q.v}${target ? ` (target ${usd(target)})` : ''}`);
  }
  function aAccept(s, when) {
    const q = latestSent(s); q.status = 'accepted'; q.acceptedAt = when;
    ev(s, when, 'Shipper', `Lina Zhou accepted quotation v${q.v}: ${usd(q.total)}`);
    notice(s, when, { type: 'doc', title: 'Next: shipper instruction and documents', meta: 'Fill in the shipper instruction and upload the packing list and commercial invoice', href: 'documents.html' });
  }

  /* ---------- documents and AI Document Agent ---------- */
  const DOCS = [
    { k: 'si', name: 'Shipper instruction', form: true, req: true },
    { k: 'pl', name: 'Draft packing list', req: true },
    { k: 'ci', name: 'Commercial invoice', req: true },
    { k: 'msds', name: 'MSDS (safety data sheet)', req: 'dg' },
    { k: 'coo', name: 'Certificate of origin', req: false },
  ];
  const dg = (s) => s.docs && s.docs.si && s.docs.si.data.dg === 'Yes';
  function docStatus(s, k) {
    const d = (s.docs || {})[k];
    if (k === 'si') return d ? { status: 'ready', note: `Saved ${fmt(d.at)}. Matches the confirmed request: 200 CBM, US$480,000, HS 8528.72.` } : { status: 'missing' };
    if (k === 'msds' && !dg(s)) return { status: 'na' };
    return d ? { status: d.status, note: d.note, file: d.file, attempt: d.attempt } : { status: 'missing' };
  }
  function docsReady(s) { return DOCS.every(d => { const st = docStatus(s, d.k).status; return d.req === false ? st !== 'fix' : st === 'ready' || st === 'na'; }); }
  function aSaveSI(s, data, when) { s.docs = s.docs || {}; s.docs.si = { data, at: when }; ev(s, when, 'Shipper', 'Shipper instruction saved in the portal'); }
  function aUpload(s, k, when) {
    s.docs = s.docs || {};
    const n = s.docs[k] ? s.docs[k].attempt + 1 : 0, list = A.docChecks[k], r = list[Math.min(n, list.length - 1)];
    s.docs[k] = { attempt: n, status: r[0], note: r[1], file: r[2], at: when };
    const name = DOCS.find(d => d.k === k).name;
    ev(s, when, 'Shipper', `${name} uploaded (${r[2]})`);
    ev(s, addHours(when, 0.02), 'LogiMind', `AI Document Agent: ${name} ${r[0] === 'ready' ? 'passed' : 'mismatch'}: ${r[1]}`);
  }
  function aSubmitDocs(s, when) {
    s.docs.submittedAt = when;
    ev(s, when, 'Shipper', 'Documents submitted: all AI checks passed');
  }

  /* ---------- approval: DSID, purchase orders, down payment ---------- */
  function newDsid() {
    const abc = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789', r = new Uint8Array(8);
    (window.crypto || {}).getRandomValues ? crypto.getRandomValues(r) : r.forEach((_, i) => { r[i] = Math.random() * 256; });
    const c = [...r].map(x => abc[x % abc.length]).join('');
    return `DSID-${c.slice(0, 4)}-${c.slice(4)}-ASCO`;
  }
  function aApprove(s, when, dsid) {
    const q = accepted(s), sel = q.sel;
    const po = (leg) => { const pid = sel[leg], r = s.rfq.replies[pid];
      return { no: A.po[leg], leg, partner: pid, amount: r.amount, currency: r.currency, steps: A.legs[leg].steps, issuedAt: when,
        terms: `Payment 30 days after a matching invoice. Valid for ${q.id.replace(/-v\d+$/, '')} only. Quote the DSID on every document.` }; };
    s.approval = { at: when, dsid: dsid || newDsid(), pos: [po('origin'), po('dest')] };
    const dp = Math.round(q.total * A.customer.terms.downPayment / 100);
    s.invoices = { dp: { no: A.invoices.dp, amount: dp, issuedAt: when, pct: A.customer.terms.downPayment }, bal: null };
    ev(s, when, 'ASCO PIC', 'Andi Pratama approved the documents and started execution', 'Documents approved by ASCO · execution started');
    ev(s, when, 'LogiMind', `Digital Shipment ID ${s.approval.dsid} issued`);
    s.approval.pos.forEach(p => {
      ev(s, when, 'LogiMind', `${p.no} sent to ${pname(p.partner)}: ${cur(p.amount, p.currency)} (${A.legs[p.leg].label.toLowerCase()})`, `Purchase order issued for the ${A.legs[p.leg].label.toLowerCase()}`, { partner: p.partner });
      mail(s, when, { to: A.partners[p.partner].email, kind: 'po', partner: p.partner, subject: `${p.no} · ${s.approval.dsid}` });
    });
    ev(s, when, 'LogiMind', `Down-payment invoice ${A.invoices.dp} issued: ${usd(dp)} (${A.customer.terms.downPayment}%)`);
    notice(s, when, { type: 'milestone', title: `Execution started · ${s.approval.dsid}`, meta: 'Your shipment now has a Digital Shipment ID', href: 'shipment.html?id=' + s.approval.dsid });
    notice(s, when, { type: 'invoice', title: `Down-payment invoice ${A.invoices.dp}: ${usd(dp)}`, meta: `${A.customer.terms.downPayment}% of ${usd(q.total)} · payment terms`, href: 'invoices.html' });
    mail(s, when, { to: A.customer.email, kind: 'dp', subject: `Invoice ${A.invoices.dp} · down payment ${usd(dp)}` });
  }
  const dsid = (s) => s.approval ? s.approval.dsid : null;
  const poFor = (s, pid) => s.approval ? s.approval.pos.find(p => p.partner === pid) || null : null;

  /* ---------- execution steps ---------- */
  const CONDITIONS = [['Good', 'success', 'circle-check'], ['Minor damage', 'warning', 'triangle-alert'], ['Damaged', 'danger', 'octagon-alert'], ['Short', 'danger', 'package-minus']];
  const condTag = (c) => { const x = CONDITIONS.find(y => y[0] === c) || CONDITIONS[0]; return tag(x[0] === 'Short' ? 'Short shipped' : x[0], x[1], x[2]); };
  function stepState(s, n) {
    const st = (s.steps || {})[n];
    if (st) return st.condition !== 'Good' || st.late ? 'warn' : 'done';
    if (!s.approval) return 'todo';
    if (n === 1) return 'cur';
    if (n === 4 && !(s.bl && s.bl.received)) return (s.steps || {})[3] ? 'locked' : 'todo';
    if (n === 7) return (s.steps || {})[6] ? 'cur' : 'todo';
    return (s.steps || {})[n - 1] ? 'cur' : 'todo';
  }
  function aStep(s, n, d) {
    const S = A.steps[n];
    s.steps = s.steps || {};
    const late = new Date(d.at) > new Date(S.due);
    s.steps[n] = { at: d.at, location: d.location, condition: d.condition || 'Good', notes: d.notes || '', photos: d.photos || [], by: d.by, late };
    const role = d.by === 'driver' ? 'Driver (destination core partner)' : ROLE[S.leg] || 'LogiMind';
    const cond = s.steps[n].condition !== 'Good' ? ` · condition: ${s.steps[n].condition}${d.notes ? ` (${d.notes})` : ''}` : ' · condition: Good';
    ev(s, d.at, role, `Step ${n} ${S.t} done at ${d.location}${cond}${late ? ' · late' : ''}`, `${S.cust}${cond}${late ? ' · later than planned' : ''}`, { partner: d.by === 'driver' ? s.approval.pos[1].partner : d.by, step: n });
    if (n <= 6) notice(s, d.at, { type: s.steps[n].condition !== 'Good' ? 'delay' : 'milestone', title: `${dsid(s)}: ${S.cust}`, meta: s.steps[n].condition !== 'Good' ? `${s.steps[n].condition}: ${d.notes}` : fmt(d.at), href: 'shipment.html?id=' + dsid(s) });
  }

  /* ---------- pre-arrival B/L ---------- */
  const blDue = (s) => addDays(A.eta.slice(0, 10), -(s.settings.blDays || 3));
  function aBlRemind(s, when) {
    s.bl = s.bl || { reminders: [] };
    s.bl.reminders.push(when);
    const pid = s.approval.pos[0].partner, n = s.bl.reminders.length;
    mail(s, when, { to: A.partners[pid].email, kind: 'bl', partner: pid, subject: `${n > 1 ? `Reminder ${n}: ` : ''}Upload the B/L for ${dsid(s)} · ETA Tanjung Priok ${fmt(A.eta, { date: true })}` });
    ev(s, when, 'LogiMind', `B/L reminder ${n} sent to ${pname(pid)} (${s.settings.blDays} days before arrival)`, `Bill of lading requested from the origin partner (reminder ${n})`, { partner: pid });
  }
  function aBlReceived(s, { via, when, file }) {
    s.bl = s.bl || { reminders: [] };
    s.bl.received = { at: when, via, file: file || 'BL_PACU26118E0412.pdf', no: 'PACU26118E0412' };
    const pid = s.approval.pos[0].partner;
    ev(s, when, via === 'email' ? 'ASCO PIC' : ROLE.origin, via === 'email' ? `B/L PACU26118E0412 recorded by Andi Pratama (received by email from ${pname(pid)})` : `B/L PACU26118E0412 uploaded by ${pname(pid)}`,
      'Bill of lading received', { partner: pid });
    notice(s, when, { type: 'milestone', title: `${dsid(s)}: bill of lading received`, meta: 'Import customs can start when the vessel arrives', href: 'shipment.html?id=' + dsid(s) });
  }

  /* ---------- POD, invoices, payables ---------- */
  function aPod(s, d) {
    const dest = s.approval.pos[1].partner;
    if (!s.steps[5]) aStep(s, 5, { at: addHours(d.at, -4), location: A.stepDone[5][1], condition: 'Good', notes: A.stepDone[5][3], by: dest });
    aStep(s, 6, { at: d.at, location: A.steps[6].loc, condition: d.condition, notes: d.notes, photos: d.photos, by: 'driver' });
    s.pod = { at: d.at, receiver: d.receiver, condition: d.condition, notes: d.notes, signature: d.signature, photos: d.photos || [], no: `POD-${dsid(s).slice(5, 14)}` };
    const pAt = addHours(d.at, 0.3);
    s.steps[7] = { at: pAt, location: 'LogiMind', condition: d.condition, notes: '', photos: [], by: 'system' };
    ev(s, pAt, 'LogiMind', `Digital POD ${s.pod.no} generated with QR and audit trail`);
    const q = accepted(s), bal = q.total - s.invoices.dp.amount;
    s.invoices.bal = { no: A.invoices.bal, amount: bal, draftAt: pAt, issuedAt: null };
    s.invRequest = addHours(d.at, 0.5);
    s.approval.pos.forEach(p => {
      mail(s, s.invRequest, { to: A.partners[p.partner].email, kind: 'inv', partner: p.partner, subject: `Please invoice ${p.no} · ${dsid(s)} delivered` });
      ev(s, s.invRequest, 'LogiMind', `${pname(p.partner)} asked to upload its invoice against ${p.no}`, 'Partners asked to invoice', { partner: p.partner });
    });
    notice(s, pAt, { type: 'milestone', title: `${dsid(s)} delivered · proof of delivery ready`, meta: `Received by ${d.receiver} · ${d.condition}`, href: '../pod.html?dsid=' + dsid(s) });
  }
  function aIssueBalance(s, when) {
    s.invoices.bal.issuedAt = when; s.closedAt = when;
    ev(s, when, 'ASCO PIC', `Balance invoice ${A.invoices.bal} issued: ${usd(s.invoices.bal.amount)} · shipment closed`, `Balance invoice issued: ${usd(s.invoices.bal.amount)} · shipment closed`);
    notice(s, when, { type: 'invoice', title: `Balance invoice ${A.invoices.bal}: ${usd(s.invoices.bal.amount)}`, meta: 'After proof of delivery · payment terms', href: 'invoices.html' });
    mail(s, when, { to: A.customer.email, kind: 'bal', subject: `Invoice ${A.invoices.bal} · balance ${usd(s.invoices.bal.amount)}` });
  }
  function aPartnerInvoice(s, pid, d) {
    s.payables = s.payables || {};
    s.payables[pid] = { no: d.no, amount: d.amount, currency: d.currency, at: d.at, file: d.file || `${d.no.replace(/[^\w-]/g, '_')}.pdf` };
    ev(s, d.at, ROLE[legOf(pid)], `${pname(pid)} uploaded invoice ${d.no}: ${cur(d.amount, d.currency)} against ${poFor(s, pid).no}`, 'Partner invoice received', { partner: pid });
  }
  function aMatch(s, pid, when) {
    const inv = s.payables[pid], po = poFor(s, pid);
    inv.checkedAt = when; inv.matches = inv.currency === po.currency && Math.round(inv.amount) === Math.round(po.amount);
    ev(s, when, 'LogiMind', `Invoice ${inv.no} ${inv.matches ? 'matches' : 'differs from'} ${po.no}${inv.matches ? '' : `: ${cur(inv.amount - po.amount, po.currency)}`}`, null, { partner: pid, internal: true });
  }
  function payStatus(s, pid) {
    const inv = (s.payables || {})[pid];
    if (!inv) return s.invRequest ? ['Awaiting invoice', 'neutral', 'hourglass'] : ['Not yet requested', 'neutral', 'clock'];
    if (!inv.checkedAt) return ['Received', 'info', 'inbox'];
    return inv.matches ? ['Matches PO', 'success', 'circle-check'] : ['Differs from PO', 'warning', 'triangle-alert'];
  }

  /* ---------- demo seeds: realistic data up to a stage ---------- */
  const SIG = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 90"><path d="M14 62c18-30 30-44 36-38 7 7-12 40-4 42 9 2 20-32 30-30 8 2-1 28 6 29 10 1 18-22 27-21 7 1 2 17 9 17 9 0 14-14 22-13 6 1 3 11 9 11 12 0 27-9 40-12M60 74c40-6 90-8 160-6" fill="none" stroke="#1F1F23" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>');
  function seedTo(k) {
    const keep = get().settings;
    const s = blank(); s.settings = keep;
    if (k < 1) return s;
    aSubmit(s, { prompt: A.example, fields: { ...DEFAULT_FIELDS } }, at('request'));
    if (k < 2) return s;
    aSendRfq(s, at('rfq'));
    if (k < 3) return s;
    ['pudong', 'huangpu', 'jaya', 'priok'].forEach(p => aReply(s, p, A.replies[p], at('reply_' + p)));
    aGenerate(s, { sel: { origin: 'pudong', dest: 'jaya' }, margin: { kind: '%', value: 12 }, validDays: 7 }, at('quote1'));
    aSendQuote(s, at('quote1'));
    aNegotiate(s, { text: 'We have a competing offer around US$9,300 door to door. Can you get closer, and keep the price valid until early November?', target: 9300 }, at('negotiate'));
    if (k < 4) return s;
    aGenerate(s, { sel: { origin: 'pudong', dest: 'jaya' }, margin: { kind: '%', value: 9 }, validDays: 7 }, at('quote2'));
    aSendQuote(s, at('quote2'));
    aAccept(s, at('accept'));
    aSaveSI(s, { ...A.si }, at('si'));
    aUpload(s, 'pl', at('upload1')); aUpload(s, 'ci', addHours(at('upload1'), 0.1));
    if (k < 5) return s;
    aUpload(s, 'pl', at('upload2')); aUpload(s, 'ci', addHours(at('upload2'), 0.1));
    aSubmitDocs(s, at('submit'));
    if (k < 6) return s;
    aApprove(s, at('approve'), A.fixedDsid);
    const step = (n) => aStep(s, n, { at: A.stepDone[n][0], location: A.stepDone[n][1], condition: A.stepDone[n][2], notes: A.stepDone[n][3], by: n <= 3 ? 'pudong' : 'jaya' });
    step(1);
    if (k < 7) return s;
    step(2); step(3);
    aBlRemind(s, at('bl1')); aBlRemind(s, at('bl2'));
    if (k < 8) return s;
    aBlReceived(s, { via: 'partner', when: at('blReceived') });
    step(4);
    if (k < 9) return s;
    step(5);
    aPod(s, { at: '2026-11-12T15:40', receiver: 'Hendra Wijaya (warehouse supervisor)', condition: 'Good', notes: '1,840 cartons received. The 2 dented cartons from customs were checked: contents intact.', signature: SIG, photos: [] });
    aPartnerInvoice(s, 'pudong', { no: A.partnerInvoices.pudong.no, amount: A.partnerInvoices.pudong.amount, currency: 'CNY', at: at('inv_pudong') });
    aMatch(s, 'pudong', addHours(at('inv_pudong'), 0.1));
    if (k < 10) return s;
    aIssueBalance(s, at('balance'));
    aPartnerInvoice(s, 'jaya', { no: A.partnerInvoices.jaya.no, amount: A.partnerInvoices.jaya.amount, currency: 'IDR', at: at('inv_jaya') });
    return s;
  }

  /* ---------- shared UI pieces ---------- */
  function openModal(html, wide) {
    let sc = $('#aScrim');
    if (!sc) {
      document.body.insertAdjacentHTML('beforeend', '<div class="scrim" id="aScrim"><div class="modal" role="dialog" aria-modal="true" id="aModal"></div></div>');
      sc = $('#aScrim');
      sc.addEventListener('click', e => { if (e.target.id === 'aScrim' || e.target.closest('[data-close]')) closeModal(); });
      document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
    }
    $('#aModal').style.maxWidth = wide ? '760px' : '';
    $('#aModal').innerHTML = html; sc.classList.add('open'); icons();
    return $('#aModal');
  }
  function closeModal() { const sc = $('#aScrim'); if (sc) { sc.classList.remove('open'); $('#aModal').innerHTML = ''; } }

  function mailHTML(m) {
    return `<div class="mail"><div class="mail-head"><span>From</span><b>${esc(m.from || 'ASCO via LogiMind <noreply@logimind.app>')}</b><span>To</span><b>${esc(m.to)}</b><span>Subject</span><b>${esc(m.subject)}</b></div>
      <div class="mail-body">${m.body}${m.link ? `<a class="mail-link" href="${m.link.href}" target="_blank" rel="noopener"><i data-lucide="${m.link.icon || 'external-link'}"></i>${esc(m.link.label)}</a>` : ''}
      ${m.foot ? `<p class="caption">${m.foot}</p>` : ''}</div></div>`;
  }
  const legStepsList = (leg) => `<ul>${A.legs[leg].steps.map(n => `<li>${n}. ${esc(A.steps[n].t)}</li>`).join('')}</ul>`;
  const requirementLines = (s) => {
    const f = s.req.fields;
    return `<ul><li>Cargo: consumer electronics, ${esc(f.cbm)} CBM, ${esc(f.ctype)}, HS ${esc(f.hs)}</li><li>Route: ${esc(f.pol)} → ${esc(f.pod)} → ${esc(f.consigneeLoc.split(',')[0])}</li><li>Departure: ${esc(fieldText(f, 'etd'))} · arrival needed by ${esc(fieldText(f, 'eta'))}</li></ul>`;
  };
  // email previews
  const rfqSubject = (pid) => `RFQ ${A.requestId} · ${A.legs[legOf(pid)].label} · Shanghai → Bandung · reply in 24 hours`;
  function rfqMail(s, pid) {
    const leg = legOf(pid);
    return { to: `${A.partners[pid].contact} <${A.partners[pid].email}>`, subject: rfqSubject(pid),
      body: `<p>Dear ${esc(A.partners[pid].contact)},</p><p>ASCO asks for your costing for the <b>${esc(A.legs[leg].label.toLowerCase())}</b> (${esc(A.legs[leg].city)}) of a sea import:</p>${requirementLines(s)}<p>Your steps:</p>${legStepsList(leg)}<p>Reply with one amount in your currency (CNY, USD or IDR), the validity and your estimated transit days. No account needed.</p>`,
      link: { href: P(`partner/rfq-reply.html?token=rfq-${pid}`), label: 'Open request' }, foot: 'This link is personal to your company and expires after 72 hours.' };
  }
  function poMail(s, p) {
    return { to: `${A.partners[p.partner].contact} <${A.partners[p.partner].email}>`, subject: `${p.no} · ${dsid(s)}`,
      body: `<p>Dear ${esc(A.partners[p.partner].contact)},</p><p>ASCO has awarded you the <b>${esc(A.legs[p.leg].label.toLowerCase())}</b> for shipment <b>${esc(dsid(s))}</b>.</p>
        <ul><li>Purchase order: ${esc(p.no)}</li><li>Amount: <b>${esc(cur(p.amount, p.currency))}</b></li><li>Your steps: ${A.legs[p.leg].steps.map(n => esc(A.steps[n].short)).join(', ')}</li><li>Terms: ${esc(p.terms)}</li></ul>
        <p>Mark each step done with time, place and goods condition from the job page.</p>`,
      link: { href: p.partner === 'jaya' ? P('partner/job.html?dsid=' + dsid(s)) : P(`partner/job.html?token=job-${p.partner}`), label: p.partner === 'jaya' ? 'Open job in LogiMind' : 'Open job (no account needed)' } };
  }
  function customerMail(kind, s) {
    const q = kind === 'quote' ? latest(s) : accepted(s), inv = s.invoices || {};
    const base = { to: `Lina Zhou <${A.customer.email}>`, from: 'ASCO <ops@asco.co.id> via LogiMind' };
    if (kind === 'quote') return { ...base, subject: `ASCO quotation ${q.id} · ${usd(q.total)}`, body: `<p>Dear Lina,</p><p>Your quotation for <b>${esc(s.req.title)}</b> is ready: <b>${usd(q.total)}</b>, valid until ${fmt(q.validUntil + 'T12:00', { date: true })}.</p><p>You can accept it or ask for changes in the portal.</p>`, link: { href: P('portal/quote.html'), label: 'Open quotation' } };
    if (kind === 'dp') return { ...base, subject: `Invoice ${inv.dp.no} · down payment ${usd(inv.dp.amount)}`, body: `<p>Dear Lina,</p><p>Execution has started for <b>${esc(dsid(s))}</b>. As agreed in your payment terms, here is the ${inv.dp.pct}% down-payment invoice: <b>${usd(inv.dp.amount)}</b>.</p>`, link: { href: P('portal/invoices.html'), label: 'View invoice' } };
    return { ...base, subject: `Invoice ${inv.bal.no} · balance ${usd(inv.bal.amount)}`, body: `<p>Dear Lina,</p><p>Your shipment <b>${esc(dsid(s))}</b> was delivered and signed for. Here is the balance invoice: <b>${usd(inv.bal.amount)}</b> (total ${usd(q.total)} less the down payment of ${usd(inv.dp.amount)}).</p>`, link: { href: P('portal/invoices.html'), label: 'View invoice' } };
  }
  function blMail(s) {
    const pid = s.approval.pos[0].partner, n = (s.bl && s.bl.reminders.length) || 1;
    return { to: `${A.partners[pid].contact} <${A.partners[pid].email}>`, subject: `${n > 1 ? `Reminder ${n}: ` : ''}Upload the B/L for ${dsid(s)} · ETA Tanjung Priok ${fmt(A.eta, { date: true })}`,
      body: `<p>Dear ${esc(A.partners[pid].contact)},</p><p>The vessel for <b>${esc(dsid(s))}</b> arrives at Tanjung Priok on <b>${fmt(A.eta, { date: true })}</b>. Please upload the bill of lading now so import customs can be lodged before arrival.</p>`,
      link: { href: P(`partner/job.html?token=job-${pid}#bl`), label: 'Upload B/L' }, foot: `Sent automatically ${s.settings.blDays} days before arrival (ASCO setting).` };
  }
  function invMail(s, pid) {
    const p = poFor(s, pid);
    return { to: `${A.partners[pid].contact} <${A.partners[pid].email}>`, subject: `Please invoice ${p.no} · ${dsid(s)} delivered`,
      body: `<p>Dear ${esc(A.partners[pid].contact)},</p><p>Shipment <b>${esc(dsid(s))}</b> was delivered with a signed POD. Please upload your invoice against <b>${esc(p.no)}</b> (${esc(cur(p.amount, p.currency))}).</p>`,
      link: { href: P(`partner/invoice.html?token=inv-${pid}`), label: 'Upload invoice' } };
  }

  const dsidHTML = (id) => `<span class="dsid" title="Digital Shipment ID">${esc(id)}<button data-copy="${esc(id)}" title="Copy"><i data-lucide="copy"></i></button></span>`;

  // Documents checklist. mode: 'portal' (actions) | 'staff' (read-only results)
  function docsHTML(s, mode) {
    const rows = DOCS.map(d => {
      const st = docStatus(s, d.k);
      const tone = { ready: 'success', fix: 'danger', missing: d.req === false ? 'neutral' : 'warning', na: 'neutral' }[st.status];
      const icon = { ready: 'file-check-2', fix: 'file-x-2', missing: d.form ? 'clipboard-list' : 'file-up', na: 'file-minus' }[st.status];
      const label = { ready: ['Passed', 'success'], fix: ['Mismatch', 'danger'], missing: d.req === false ? ['Optional', 'neutral'] : ['Required', 'warning'], na: ['Not required', 'neutral'] }[st.status];
      const sub = d.k === 'si' ? 'Structured form: parties, ports, cargo, packages, Incoterm, dangerous goods'
        : d.k === 'msds' ? (st.status === 'na' ? 'Only needed when the shipper instruction says dangerous goods = Yes' : 'Required: dangerous goods = Yes')
        : d.k === 'coo' ? 'Optional. A Form E can lower import duty in Indonesia' : 'PDF or photo · checked by the AI Document Agent';
      let acts = '';
      if (mode === 'portal' && !(s.docs && s.docs.submittedAt)) {
        if (d.k === 'si') acts = `<button class="btn-secondary" data-si>${st.status === 'ready' ? '<i data-lucide="pencil"></i>Edit' : '<i data-lucide="clipboard-pen-line"></i>Fill in'}</button>`;
        else if (st.status === 'fix') acts = `<button class="btn-primary" data-upload="${d.k}"><i data-lucide="upload"></i>Upload corrected file</button>`;
        else if (st.status === 'missing') acts = `<button class="btn-secondary" data-upload="${d.k}"><i data-lucide="upload"></i>Upload</button>`;
      }
      return `<li><span class="icon-tile tone-${tone}"><i data-lucide="${icon}"></i></span>
        <div><div class="t">${esc(d.name)} ${tag(label[0], label[1])}${st.file ? `<span class="caption">${esc(st.file)}</span>` : ''}</div><div class="d">${esc(sub)}</div>
          ${st.status === 'fix' ? `<div class="warnline"><i data-lucide="triangle-alert"></i><span><b style="font-weight:600">${esc(st.note)}</b> Fix and re-upload.</span></div>` : ''}
          ${st.status === 'ready' && st.note ? `<div class="warnline ok"><i data-lucide="sparkles"></i><span>${esc(st.note)}</span></div>` : ''}</div>
        <div class="acts">${acts}</div></li>`;
    }).join('');
    return `<ul class="cl">${rows}</ul>`;
  }

  // Execution steps. mode: 'staff' (partner names) | 'portal' (customer words, no names) | partner id (own leg only)
  function stepsHTML(s, mode, opts = {}) {
    const isPartner = mode !== 'staff' && mode !== 'portal';
    const nums = isPartner ? A.legs[legOf(mode)].steps : [1, 2, 3, 4, 5, 6, 7];
    return `<ol class="tl">${nums.map(n => {
      const S = A.steps[n], st = (s.steps || {})[n], state = stepState(s, n);
      const who = mode === 'staff' && s.approval ? (S.leg === 'system' ? 'LogiMind' : `${pname(s.approval.pos[S.leg === 'origin' ? 0 : 1].partner)} · ${A.legs[S.leg].label.toLowerCase()}`) : '';
      const title = mode === 'portal' ? (st ? S.cust : S.short) : S.t;
      const lock = state === 'locked' ? '<span class="caption">Waiting for the B/L</span>' : '';
      const photos = st && st.photos && st.photos.length ? `<div class="thumbs" style="margin-top:6px">${st.photos.map(p => `<span class="thumb" style="${p.src ? `background-image:url(${p.src})` : ''}">${p.src ? '' : '<i data-lucide="image"></i>'}</span>`).join('')}</div>` : '';
      const note = st && st.notes && (mode !== 'portal' || st.condition !== 'Good') ? `<div class="note${st.condition !== 'Good' ? ' warn' : ''}">${esc(st.notes)}</div>` : '';
      const action = opts.action && (state === 'cur' || state === 'locked') ? opts.action(n, state) : '';
      return `<li class="${state === 'done' ? 'done' : state === 'warn' ? 'done warn' : state}">
        <span class="dot">${st ? `<i data-lucide="${state === 'warn' ? 'triangle-alert' : 'check'}"></i>` : n}</span>
        <div><div class="t">${esc(title)} ${st ? condTag(st.condition) : state === 'cur' ? tag('Next', 'info') : ''}${st && st.late ? tag('Late', 'warning', 'clock-alert') : ''}${lock}</div>
          <div class="d">${st ? `${fmt(st.at)} · ${esc(st.location)}` : `Planned ${fmt(S.due)}`}${who ? ` · ${esc(who)}` : ''}</div>${note}${photos}${action}</div>
        <span class="w">${mode === 'portal' ? '' : `Step ${n}`}</span></li>`;
    }).join('')}</ol>`;
  }

  // Audit trail. pub = shipper-safe wording only (also used on the public POD page)
  function auditHTML(s, opts = {}) {
    const list = s.events.filter(e => !(opts.pub && (e.internal || e.pub === null))).slice().sort((a, b) => a.at < b.at ? -1 : 1);
    return `<table class="table"><thead><tr><th style="width:150px">Time</th><th style="width:190px">Actor</th><th>What changed</th></tr></thead><tbody>
      ${list.map(e => `<tr><td class="num" style="white-space:nowrap">${fmt(e.at)}</td><td>${esc(e.role)}</td><td>${esc(opts.pub ? e.pub : e.text)}</td></tr>`).join('')}</tbody></table>`;
  }

  // Customer quotation document (same renderer for staff and portal)
  function quoteDocHTML(s, q) {
    const doc = { id: q.id, issued: fmt(q.sentAt || q.createdAt), mode: 'sea', route: A.lane.nodes, routeLabel: 'Sea FCL import · door to door', cargo: '3 × 40ft HC · 200 CBM consumer electronics',
      transit: `About ${q.transit} days door to door`, departure: 'Mon 2 Nov from Shanghai', lines: q.lines,
      includes: ['Pickup at your Jinqiao warehouse and export customs in Shanghai', 'Ocean freight to Tanjung Priok, 3 × 40ft HC', 'Import customs clearance (PIB) and port charges', 'Trucking to PT Chan Electronics, Bandung, with a digital POD'],
      excludes: ['Import duty, VAT and income tax prepayment in Indonesia (billed at cost)', 'Cargo insurance', 'Customs inspection fees if the cargo is selected (billed at cost)'],
      expires: fmt(q.validUntil + 'T12:00', { date: true }), terms: `Payment: ${A.customer.terms.downPayment}% down payment at approval, balance after proof of delivery. Prices in USD.`,
      note: q.v > 1 ? `Version ${q.v}. Replaces version ${q.v - 1}.` : null };
    const badge = q.status === 'draft' ? tag('Draft · not sent', 'neutral') : q.status === 'superseded' ? tag('Replaced by a newer version', 'neutral') : q.status === 'negotiated' ? tag('Changes requested', 'warning') : null;
    return LM.quoteDocHTML(doc, T, { money: usd, settings: { showTransship: true, showCarriers: false }, badge });
  }
  function versionsHTML(s, opts = {}) {
    const list = (s.quotes || []).filter(q => opts.staff || q.sentAt).slice().reverse();
    if (!list.length) return '<p class="caption" style="margin:0">No versions yet.</p>';
    const st = { draft: ['Draft', 'neutral'], sent: ['Sent', 'info'], negotiated: ['Negotiated', 'warning'], accepted: ['Accepted', 'success'], superseded: ['Replaced', 'neutral'] };
    return `<ul class="vh">${list.map((q, i) => `<li class="${i === 0 ? 'cur' : ''}"><span class="v">v${q.v}</span>
      <div><div style="display:flex;gap:6px;align-items:center;flex-wrap:wrap">${tag(...st[q.status])}<span class="caption">${q.sentAt ? 'Sent ' + fmt(q.sentAt) : 'Created ' + fmt(q.createdAt)}</span></div>
        ${q.changes ? `<div class="x">${esc(opts.staff ? q.changes : q.changes.replace(/Margin [^,]+,?\s*/i, 'Price revised, ').replace(/(Origin|Destination) partner [^,]+,?\s*/g, '').replace(/,\s*$/, ''))}</div>` : ''}
        ${q.negotiation ? `<div class="x">${opts.staff ? 'Lina' : 'You asked'}: “${esc(q.negotiation.text)}”${q.negotiation.target ? ` · target ${usd(q.negotiation.target)}` : ''}</div>` : ''}
        ${opts.staff ? `<div class="x">Cost ${usd(q.cost)} · margin ${marginText(q.margin)} · profit ${usd(q.profit)}</div>` : ''}</div>
      <span class="c">${usd(q.total)}</span></li>`).join('')}</ul>`;
  }

  // QR code (qrcode-generator from jsDelivr; placeholder pattern when offline)
  function qrHTML(text) {
    try {
      if (window.qrcode) { const q = qrcode(0, 'M'); q.addData(text); q.make(); return q.createSvgTag({ cellSize: 3, margin: 0, scalable: true }); }
    } catch (e) {}
    let h = 7, cells = '';
    for (let y = 0; y < 21; y++) for (let x = 0; x < 21; x++) { h = (h * 31 + x * 7 + y * 13 + text.length) % 97; const finder = (x < 7 && y < 7) || (x > 13 && y < 7) || (x < 7 && y > 13);
      const on = finder ? (x % 6 === 0 || y % 6 === 0 || (x % 7 > 1 && x % 7 < 5 && y % 7 > 1 && y % 7 < 5) || x === 20 || y === 20 || x === 14 || y === 14) : h % 2 === 0; if (on) cells += `<rect x="${x}" y="${y}" width="1" height="1"/>`; }
    return `<svg viewBox="0 0 21 21" fill="#1F1F23" title="QR placeholder (offline)">${cells}</svg>`;
  }

  /* ---------- shells (rail + sidebar) for the three ASCO personas ---------- */
  function railItem(r, active) {
    const tagName = r.href ? 'a' : 'button', attrs = r.href ? `href="${r.href}"` : `data-soon="${r.label}"`;
    return `<${tagName} class="rail-item${r.id === active ? ' active' : ''}" ${attrs} title="${r.title || r.label}"><span class="glyph"><i data-lucide="${r.icon}"></i></span><span class="label">${r.label}</span></${tagName}>`;
  }
  const navRow = (id, active, href, icon, label, right) => `<a class="row${id === active ? ' active' : ''}" href="${href}"><i data-lucide="${icon}"></i><span class="text">${label}</span>${right || ''}</a>`;
  function staffShell() {
    const s = get(), k = stage(s);
    const rail = (active) => `<nav class="rail" aria-label="Primary">
        <a class="rail-logo" href="index.html" title="LogiMind"><img src="assets/logo.svg" alt="LogiMind"></a>
        <div class="rail-list">${[
          { id: 'home', label: 'Home', icon: 'house', href: 'index.html' },
          { id: 'requests', label: 'Requests', icon: 'file-text', href: 'request.html' },
          { id: 'shipments', label: 'Shipments', icon: 'container', href: 'shipment.html' },
          { id: 'customers', label: 'Customers', icon: 'building-2', href: 'customers.html' },
          { id: 'rfqs', label: 'RFQs', title: 'RFQs & quotations', icon: 'file-stack', href: 'rfq.html' },
          { id: 'network', label: 'Partners', title: 'Core partners', icon: 'network', href: 'network.html' },
          { id: 'payables', label: 'Payables', icon: 'wallet', href: 'payables.html' },
        ].map(r => railItem(r, active)).join('')}</div>
        <div class="rail-spacer"></div>
        ${railItem({ id: 'settings', label: 'Settings', icon: 'settings', href: 'settings-portal.html' }, active)}
        ${LM.railAvatarHTML()}</nav>`;
    const actions = actionItems(s).length;
    const sidebar = (row) => `<aside class="sidebar" aria-label="ASCO">
        <div class="sidebar-header"><h1 class="sidebar-title" title="${esc(T.name)}">${esc(T.short)}</h1></div>
        <div class="sidebar-scroll">
          <div class="nav">
            ${navRow('overview', row, 'index.html', 'layout-panel-top', 'Overview', actions ? `<span class="count">${actions}</span>` : '')}
            ${navRow('request', row, 'request.html', 'file-text', 'Request & plan', s.req && k === 1 ? '<span class="tag success" style="margin-left:auto;padding:0 5px">New</span>' : '')}
            ${navRow('rfq', row, 'rfq.html', 'git-compare-arrows', 'Partner costing', s.rfq ? `<span class="count">${Object.keys(s.rfq.replies).length}/4</span>` : '')}
            ${navRow('quote', row, 'quote.html', 'receipt', 'Quotation', latest(s) ? `<span class="count">v${latest(s).v}</span>` : '')}
            ${navRow('shipment', row, 'shipment.html', 'container', 'Execution')}
            ${navRow('payables', row, 'payables.html', 'wallet', 'Payables')}
          </div>
          <div class="divider"></div>
          <div class="section"><div class="section-head"><span class="section-label">Jobs</span></div>
            <div class="nav">${s.req ? `<a class="row" href="${s.approval ? 'shipment.html' : 'request.html'}"><i data-lucide="container"></i><span class="text"><span class="num">${esc(dsid(s) || s.req.id)}</span> <span class="suffix">${esc(A.stages[k])}</span></span></a>`
              : '<span class="row placeholder"><i data-lucide="inbox"></i><span class="text">No open requests</span></span>'}</div></div>
          <div class="section"><div class="section-head"><span class="section-label">Core partners</span></div>
            <div class="nav">${Object.keys(A.partners).map(p => `<a class="row${row === 'p-' + p ? ' active' : ''}" href="network.html#${p}"><span class="org-avatar" style="width:18px;height:18px;font-size:8px;border-radius:4px">${D.orgs[p].initials}</span><span class="text">${esc(pname(p))}</span><span class="count">${A.partners[p].city}</span></a>`).join('')}</div></div>
        </div>
        <div class="lock-note"><i data-lucide="lock"></i><span>Your customers, core partners and their rates are only visible to ASCO.</span></div>
      </aside>`;
    return { rail, sidebar };
  }
  function senderShell() {
    const s = get(), unread = s.notices.filter(n => !(s.readAt && n.at <= s.readAt)).length;
    const rail = (active) => `<nav class="rail" aria-label="Primary">
        <a class="rail-logo tenant-logo" href="index.html" title="${esc(T.name)}" style="color:${T.brand}">${T.initials}</a>
        <div class="rail-list">${[
          { id: 'home', label: 'Home', icon: 'house', href: 'index.html' }, { id: 'ask', label: 'Ask', icon: 'sparkles', href: 'ask.html' },
          { id: 'requests', label: 'Requests', icon: 'file-text', href: 'requests.html' }, { id: 'shipments', label: 'Shipments', icon: 'container', href: 'shipment.html' },
          { id: 'documents', label: 'Documents', icon: 'files', href: 'documents.html' }, { id: 'invoices', label: 'Invoices', icon: 'receipt-text', href: 'invoices.html' },
          { id: 'settings', label: 'Settings', icon: 'settings' }].map(r => railItem(r, active)).join('')}</div>
        <div class="rail-spacer"></div>${LM.railAvatarHTML()}</nav>`;
    const am = D.senders.lina.accountManager;
    const sidebar = (row) => `<aside class="sidebar" aria-label="ASCO portal">
        <div class="sidebar-header"><h1 class="sidebar-title" title="${esc(T.name)} customer portal">${esc(T.short)}</h1>
          <div class="split-add"><a href="ask.html" title="New request" class="split-main"><i data-lucide="plus"></i></a></div></div>
        <div class="sidebar-scroll">
          <div class="nav">${navRow('home', row, 'index.html', 'house', 'Home')}${navRow('inbox', row, 'inbox.html', 'inbox', 'Inbox', unread ? `<span class="count">${unread}</span>` : '')}
            ${navRow('requests', row, 'requests.html', 'file-text', 'My requests', s.req ? '<span class="count">1</span>' : '')}${navRow('invoices', row, 'invoices.html', 'receipt-text', 'Invoices')}</div>
          <div class="divider"></div>
          <div class="section"><div class="section-head"><span class="section-label">Shipments</span></div>
            <div class="nav">${s.approval ? `<a class="row${row === 'shipment' ? ' active' : ''}" href="shipment.html?id=${dsid(s)}"><i data-lucide="container"></i><span class="text"><span class="num">${esc(dsid(s))}</span></span></a>`
              : s.req ? `<a class="row" href="request.html"><i data-lucide="file-text"></i><span class="text"><span class="num">${esc(s.req.id)}</span> <span class="suffix">${esc(A.stagesCustomer[stage(s)])}</span></span></a>` : '<span class="row placeholder"><i data-lucide="container"></i><span class="text">None yet</span></span>'}</div></div>
        </div>
        <div class="am-card"><span class="user-avatar am-avatar" style="background:${LM.AVATAR_COLORS[am.color]}">${am.initials}<span class="presence online"></span></span>
          <div class="am-text"><span class="caption">${esc(am.role)}</span><b>${esc(am.name)}</b><span class="caption">${esc(am.hours)}</span></div>
          <div class="am-actions"><button class="icon-btn" title="WhatsApp ${esc(am.name)}" data-contact="WhatsApp"><i data-lucide="message-circle"></i></button><button class="icon-btn" title="Email ${esc(am.name)}" data-contact="Email"><i data-lucide="mail"></i></button></div></div>
      </aside>`;
    return { rail, sidebar };
  }
  function partnerShell() {
    const me = acct.org, s = get();
    const rail = (active) => `<nav class="rail" aria-label="Primary">
        <a class="rail-logo tenant-logo" href="index.html" title="${esc(pname(me))}" style="color:#3F3F46">${D.orgs[me].initials}</a>
        <div class="rail-list">${[{ id: 'home', label: 'Overview', icon: 'house', href: 'index.html' }, { id: 'jobs', label: 'Jobs', icon: 'truck', href: s.approval && poFor(s, me) ? 'job.html?dsid=' + dsid(s) : 'index.html#jobs' },
          { id: 'settings', label: 'Settings', icon: 'settings' }].map(r => railItem(r, active)).join('')}</div>
        <div class="rail-spacer"></div>${LM.railAvatarHTML()}</nav>`;
    const sidebar = (row) => `<aside class="sidebar" aria-label="Partner workspace">
        <div class="sidebar-header"><h1 class="sidebar-title">${esc(pname(me))}</h1></div>
        <div class="sidebar-scroll"><div class="nav">${navRow('overview', row, 'index.html', 'layout-panel-top', 'Overview')}</div>
          <div class="divider"></div>
          <div class="section"><div class="section-head"><span class="section-label">Logistics companies</span></div>
            <div class="nav"><a class="row" href="index.html"><span class="space-avatar" style="background:${T.brand}">A</span><span class="text">${esc(T.short)}</span></a></div></div></div>
        <div class="lock-note"><i data-lucide="lock"></i><span>You see only your own leg of each job. Customer prices and other partners stay with the logistics company.</span></div>
      </aside>`;
    return { rail, sidebar };
  }
  function shell() { if (!active) return null; return ctx.staff ? staffShell() : ctx.sender ? senderShell() : partnerShell(); }

  /* ---------- what needs the PIC (Home + sidebar count) ---------- */
  function actionItems(s) {
    const k = stage(s), out = [], q = latest(s);
    if (k === 1) out.push(['file-text', 'New request from ABC Electronics', 'Review the AI plan and send RFQs to core partners', 'request.html', 'info']);
    if (k === 2) { const n = Object.keys(s.rfq.replies).length; out.push(['git-compare-arrows', n < 4 ? `Partner costing: ${n} of 4 replies` : 'All 4 partner replies are in', n < 4 ? 'Waiting for replies · you can quote once each leg has one' : 'Pick one partner per leg and generate the quotation', 'rfq.html', n ? 'info' : 'neutral']); }
    if (q && q.status === 'draft') out.push(['receipt', `Quotation v${q.v} is a draft`, 'Review and press Confirm & send', 'quote.html', 'info']);
    if (q && q.status === 'negotiated') out.push(['messages-square', `Lina asked to negotiate v${q.v}`, q.negotiation.target ? `Target ${usd(q.negotiation.target)} · revise the quotation` : 'Revise the quotation', 'quote.html', 'warning']);
    if (k === 4) out.push(['files', 'Waiting for ABC’s documents', docsReady(s) ? 'All checks pass · waiting for Lina to submit' : 'AI Document Agent found mismatches · Lina was asked to fix them', 'request.html', 'neutral']);
    if (k === 5) out.push(['shield-check', 'Documents validated · awaiting your approval', 'Approve to issue the DSID and purchase orders', 'request.html', 'warning']);
    if (k === 7) out.push(['file-clock', `Bill of lading: awaited · reminder sent ${(s.bl && s.bl.reminders.length) || 0}×`, `Vessel arrives ${fmt(A.eta, { date: true })}. Record it if it came by email.`, 'shipment.html#bl', 'warning']);
    if (k === 9) out.push(['receipt-text', 'Issue the balance invoice', `${usd(s.invoices.bal.amount)} to ABC Electronics after POD`, 'shipment.html#invoices', 'info']);
    if (s.payables) Object.keys(s.payables).forEach(p => { if (!s.payables[p].checkedAt) out.push(['wallet', `Invoice from ${pname(p)} received`, 'Match it to the purchase order', 'payables.html', 'info']); });
    return out;
  }
  // Delays and impact: late steps or goods not in good condition
  function issues(s) {
    return Object.keys(s.steps || {}).map(Number).filter(n => n <= 6).map(n => ({ n, ...s.steps[n] })).filter(x => x.condition !== 'Good' || x.late);
  }

  /* ---------- page takeover ----------
     Shared page files (request.html, portal/quote.html, …) call
     Asco.takeover() first. For ASCO accounts the ASCO version renders and the
     second-scenario code is skipped. */
  function takeover() {
    if (!active || LM.redirecting()) return false;
    const R = window.AscoPages || {}, key = persona + ':' + FILE;
    if (R[key]) { R[key](); return true; }
    document.documentElement.style.visibility = 'hidden';
    location.replace(ctx.staff && FILE === 'customer' ? 'customers.html' : 'index.html');
    return true;
  }
  // Replace the page body with the ASCO frame, then mount the shell
  let mounted = false;
  function frame({ rail, row, head, body, foot }) {
    const tmp = document.createElement('div'); tmp.innerHTML = head;
    const h1 = tmp.querySelector('h1'); if (h1) document.title = h1.textContent + (ctx.sender ? ' · ASCO' : ' · LogiMind');
    if (mounted) {     // re-render: keep the shell, swap the page
      $('.page-head').innerHTML = head; $('#aContent').innerHTML = body;
      if ($('#aFoot')) $('#aFoot').innerHTML = foot || '';
      icons(); return;
    }
    mounted = true;
    $$('head style').forEach(el => el.remove());   // page styles belong to the second-scenario markup
    let app = $('.app');
    if (!app) { document.body.classList.remove('m-body'); document.body.insertAdjacentHTML('afterbegin', '<div class="app"></div>'); app = $('.app'); }
    app.dataset.rail = rail; app.dataset.row = row || '';
    app.innerHTML = `<div class="workspace"><main class="main">
      <header class="page-head">${head}</header>
      <div class="content" id="aContent">${body}</div>${foot ? `<div style="flex:none;padding:0 24px 16px"><div style="max-width:1176px;margin:0 auto" id="aFoot">${foot}</div></div>` : ''}</main></div>`;
    LM.mount();
  }

  return { active, ctx, A, T, P, get, save, put, at, when, fmt, addDays, addHours, usd, cur, toUSD, pname, stars, partnersOn, legOf, ROLE,
    stage, lifecycleHTML, DEFAULT_FIELDS, FIELD_LABELS, fieldText, reqTitle, ranking, replyUSD, price, marginText, latest, latestSent, accepted,
    DOCS, docStatus, docsReady, dg, CONDITIONS, condTag, stepState, blDue, dsid, poFor, payStatus, issues, actionItems,
    aSubmit, aSendRfq, aReply, aGenerate, aSendQuote, aNegotiate, aAccept, aSaveSI, aUpload, aSubmitDocs, aApprove, aStep, aBlRemind, aBlReceived, aPod, aIssueBalance, aPartnerInvoice, aMatch,
    seedTo, SIG, openModal, closeModal, mailHTML, rfqMail, poMail, customerMail, blMail, invMail, dsidHTML, docsHTML, stepsHTML, auditHTML, quoteDocHTML, versionsHTML, qrHTML,
    shell, takeover, frame };
})();
