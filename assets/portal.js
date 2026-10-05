/* ==========================================================================
   LogiMind prototype — sender portal helpers (loaded after shell.js).
   Everything here is scoped to the signed-in sender and their ONE logistics
   company (LM.tenant). Nothing renders vendor names, vendor costs or margins.
   ========================================================================== */

window.Portal = (() => {
  const { $, esc, tag, icons, toast, store } = LM;
  const S = LM.sender;          // this sender's data only
  const T = LM.tenant;          // their logistics company
  const acc = LM.effective;
  if (!S) return {};            // page is redirecting

  const money = (n) => 'US$' + Math.round(n).toLocaleString('en-US');
  const range = ([a, b]) => `${money(a)}–${Math.round(b).toLocaleString('en-US')}`;

  /* ---------- shared demo backend (LM.db) ----------
     Requests the sender submits, quotes the logistics company issues, the
     sender's decisions and the shipments they create all live in LM.db, so
     both personas see the same thing. */
  const DB = LM.db;
  const SET = DB.settings();
  const D = LM.data;

  function requests() {
    const d = DB.read(), st = d.reqState || {}, dec = d.decisions || {}, issued = d.issued || {};
    const extra = (d.requests || []).filter(r => r.sender === acc.id);
    return [...extra, ...S.requests].map(r => {
      const s = st[r.id] || {};
      const x = { ...r, messages: s.messages || [] };
      if (s.declined) return { ...x, status: 'declined', declinedBy: 'tenant', declineReason: s.declineReason };
      if (issued[r.id]) { x.quote = issued[r.id].id; x.status = 'quote'; }
      else if (x.status === 'sent' && s.opened) x.status = 'review';
      const q = x.quote && dec[x.quote];
      if (q && q.status === 'accepted' && x.status === 'quote') { x.status = 'booked'; x.shipment = q.shipment; }
      if (q && q.status === 'declined' && x.status === 'quote') { x.status = 'declined'; x.declinedBy = 'customer'; x.declineReason = q.reason; }
      return x;
    });
  }
  function addRequest(r) {
    DB.update(d => { (d.requests = d.requests || []).unshift({ ...r, sender: acc.id, tenant: acc.tenant, org: acc.org, createdAt: Date.now() }); });
  }
  function nextRequestId() {
    const all = [...requests(), ...(D.staffRequests || []), ...(DB.read().requests || [])];
    const nums = all.filter(r => acc.id === 'sinta' ? /^REQ-S-/.test(r.id) : /^REQ-0/.test(r.id)).map(r => +(r.id.match(/(\d+)$/) || [0, 0])[1]);
    return (acc.id === 'sinta' ? 'REQ-S-' : 'REQ-0') + (Math.max(0, ...nums) + 1);
  }

  // Quotes: the seeded ones for this sender, plus quotes the logistics company issued in this demo
  function issuedQuote(id) {
    const q = Object.values(DB.read().issued || {}).find(x => x.id === id && x.sender === acc.id);
    if (!q) return null;
    const left = Math.max(0, 72 - (Date.now() - q.sentAt) / 36e5);
    return { ...q, status: 'ready', hoursLeft: left };
  }
  function quote(id) {
    const q = S.quotes[id] || issuedQuote(id);
    if (!q) return null;
    const dd = (DB.read().decisions || {})[id];
    return dd && q.status === 'ready' ? { ...q, status: dd.status, decidedReason: dd.reason, shipment: dd.shipment || q.shipment } : q;
  }
  function markViewed(id) {
    if (LM.viewAs) return;   // staff previews never count as "viewed by customer"
    DB.update(d => { Object.values(d.issued || {}).forEach(q => { if (q.id === id && !q.viewedAt) q.viewedAt = Date.now(); }); });
  }
  // Accepting turns the request into a booked shipment on both sides
  function decide(id, status, reason) {
    const q = quote(id);
    let shipment = null;
    DB.update(d => {
      d.decisions = d.decisions || {};
      if (status === 'accepted') {
        const used = [...S.shipments.map(x => x.id), ...(d.shipments || []).map(x => x.id)].map(x => +(x.match(/(\d+)$/) || [0, 0])[1]);
        shipment = (acc.id === 'sinta' ? 'SHP-S-0' : 'SHP-') + (Math.max(2430, ...used) + 1);
        (d.shipments = d.shipments || []).push({ id: shipment, sender: acc.id, tenant: acc.tenant, org: acc.org, request: q.request, quote: id,
          title: q.title, route: q.route, routeLabel: q.routeLabel, departure: q.departure, transit: q.transit, total: q.lines.reduce((a, l) => a + l[1], 0), createdAt: Date.now() });
      }
      d.decisions[id] = { status, reason: reason || null, at: Date.now(), shipment };
    });
    return shipment;
  }

  /* ---------- shipments (seeded + booked in this demo) ---------- */
  function genShipment(rec) {
    const sc = S.scenario;
    const legs = ['truck', ...rec.route.slice(1).map(() => 'ship')];
    return {
      id: rec.id, cargo: rec.title.split(' · ')[0], lane: [rec.route[0], rec.route[rec.route.length - 1]], mode: 'ship', fresh: true,
      status: ['Booked · confirming the sailing', 'neutral'], location: 'Your warehouse (not picked up yet)',
      etd: rec.departure, eta: `About ${rec.transit} after departure`, quote: rec.quote, request: rec.request,
      next: { text: 'Upload your shipping documents', due: sc.docsYou.find(x => x.due) ? sc.docsYou.find(x => x.due).due : null, href: 'documents.html' },
      route: { nodes: rec.route, legs, at: 0, progress: 0 },
      milestones: [
        { t: 'Booked', type: 'Booking', when: 'Just now', state: 'done' },
        { t: 'Sailing confirmed', type: 'Booking', when: 'Within 1 business day', state: 'next' },
        { t: 'Container pickup and loading', type: 'Trucking', when: 'Before departure', state: 'todo' },
        { t: 'Export customs', type: 'Customs', when: 'Before departure', state: 'todo' },
        { t: 'Departure', type: 'Ocean', when: rec.departure, state: 'todo' },
        { t: `Arrival in ${rec.route[rec.route.length - 1]}`, type: 'Ocean', when: `About ${rec.transit} later`, state: 'todo' },
      ],
      docsYou: sc.docsYou.map(x => ({ name: x.name, status: x.status, due: x.due, note: x.note })),
      docsThey: sc.docsThey.map(([n, by]) => ({ name: n, status: 'todo', note: `${T.short} handles this · ${by}` })),
      messages: [{ ai: true, time: 'Just now', text: `Your shipment is booked as ${rec.id}. ${T.short} will confirm the sailing within 1 business day. Next, please upload your shipping documents.` }],
    };
  }
  function shipments() {
    const d = DB.read(), extra = (d.shipments || []).filter(x => x.sender === acc.id).map(genShipment);
    const msgs = d.shipMessages || {};
    return [...extra, ...S.shipments].map(sh => ({ ...sh, messages: [...sh.messages, ...(msgs[sh.id] || [])] }));
  }

  /* ---------- what the logistics company lets customers see ---------- */
  const carrierFor = (optionId) => SET.showCarriers ? (D.optionCarriers || {})[optionId] || null : null;
  // Estimates use the tenant's own margin rules (Settings → Pricing). 12% is the data baseline.
  function priceFactor() {
    const org = D.orgs[acc.org] ? D.orgs[acc.org].name : '';
    const rules = SET.margins || [];
    const pick = rules.find(r => r.kind === '%' && r.scope === org)
      || rules.find(r => r.kind === '%' && S.scenario && /Shanghai/.test(S.scenario.lane[1]) && /ID → CN/.test(r.scope))
      || rules.find(r => r.kind === '%' && r.scope === 'All lanes');
    return pick ? (1 + pick.value / 100) / 1.12 : 1;
  }
  function estimateHTML(r) {
    if (SET.estimatePolicy === 'confirmed') return '<span class="caption">Price confirmed in your quote</span>';
    if (SET.estimatePolicy === 'pending') return `${range(r)} ${tag('Estimate · pending review', 'warning')}`;
    return `${range(r)} ${tag('Estimate', 'neutral')}`;
  }
  const estimateNoteText = () => SET.estimatePolicy === 'confirmed'
    ? `Prices come in a confirmed quote from ${T.short}`
    : SET.estimatePolicy === 'pending' ? `Estimate from ${T.short} · pending review by your account manager`
    : `Estimate from ${T.short} · final quote confirmed by your account manager`;

  /* ---------- request lifecycle ---------- */
  const STEPS = ['Sent', 'Under review', 'Quote ready', 'Accepted', 'Booked'];
  const STEP_OF = { sent: 0, review: 1, quote: 2, accepted: 3, booked: 4, expired: 2, declined: 2 };
  const STATUS_TAG = {
    sent: ['Sent', 'neutral', 'send'],
    review: ['Under review', 'info', 'hourglass'],
    quote: ['Quote ready', 'success', 'receipt'],
    accepted: ['Accepted', 'success', 'check'],
    booked: ['Booked', 'success', 'container'],
    expired: ['Quote expired', 'warning', 'timer-off'],
    declined: ['Declined', 'neutral', 'x'],
  };
  const statusTag = (r) => tag(...STATUS_TAG[r.status]);

  function stepper(r) {
    const cur = STEP_OF[r.status];
    const stop = r.status === 'expired' || r.status === 'declined';
    // "sent", "accepted" and "booked" are finished actions; "review" and "quote" are in progress
    const doneUpTo = ['sent', 'accepted', 'booked'].includes(r.status) ? cur : cur - 1;
    return `<div class="status-stepper">${STEPS.map((s, i) => {
      const done = i <= doneUpTo && !(stop && i === cur);
      const cls = done ? 'done' : stop && i === cur ? 'stop' : i === doneUpTo + 1 && !stop ? 'current' : '';
      const label = i === cur && stop ? (r.status === 'expired' ? 'Quote expired' : 'Declined') : s;
      return `<div class="ss ${cls}"><span class="d">${done ? '<i data-lucide="check"></i>' : i === cur && stop ? '!' : i + 1}</span><span class="l">${label}</span></div>`;
    }).join('')}</div>`;
  }

  /* ---------- route line (map-style) ---------- */
  const LEG_ICON = { truck: 'truck', ship: 'ship', plane: 'plane' };
  function routeLine(route, opts = {}) {
    const n = route.nodes.length;
    const pos = Math.min(n - 1, route.at + (route.progress || 0));
    const pct = n > 1 ? pos / (n - 1) * 100 : 0;
    const legs = route.legs.slice(-(n - 1));   // one icon per segment
    return `<div class="route-line" style="grid-template-columns:repeat(${n}, 1fr)">
      <span class="rl-track"></span>
      ${opts.showPosition !== false ? `<span class="rl-done" style="width:${pct}%"></span>` : ''}
      ${legs.map((l, i) => `<span class="rl-leg" style="left:${(i + 0.5) / (n - 1) * 100}%"><i data-lucide="${LEG_ICON[l] || 'ship'}"></i></span>`).join('')}
      ${route.nodes.map((name, i) => `<div class="rl-node${i === 0 ? ' first' : i === n - 1 ? ' last' : ''}${opts.showPosition !== false && i <= pos ? ' passed' : ''}">
        <span class="rl-dot"><i data-lucide="${i === 0 ? 'warehouse' : i === n - 1 ? 'flag' : 'repeat'}"></i></span>
        <span class="rl-name">${esc(name)}</span>${i > 0 && i < n - 1 ? '<span class="rl-sub">Transshipment</span>' : ''}</div>`).join('')}
      ${opts.showPosition !== false && opts.here !== false ? `<span class="rl-here" style="left:clamp(12px, ${pct}%, calc(100% - 12px))" title="Current position"><span class="pin"><i data-lucide="${opts.hereIcon || 'navigation'}"></i></span></span>` : ''}
    </div>`;
  }

  /* ---------- documents ---------- */
  const DOC = {
    ready: ['Ready', 'success', 'circle-check'],
    missing: ['Missing', 'warning', 'circle-alert'],
    fix: ['Needs fix', 'danger', 'circle-x'],
    progress: ['In progress', 'info', 'loader'],
    todo: ['Scheduled', 'neutral', 'calendar'],
    later: ['After loading', 'neutral', 'clock'],
    checking: ['Checking…', 'info', 'loader'],
  };
  const docTag = (st) => tag(DOC[st][0], DOC[st][1]);

  /* ---------- modal ---------- */
  function openModal(html) {
    let scrim = $('#pScrim');
    if (!scrim) {
      document.body.insertAdjacentHTML('beforeend', '<div class="scrim" id="pScrim"><div class="modal" role="dialog" aria-modal="true" id="pModal"></div></div>');
      scrim = $('#pScrim');
      scrim.addEventListener('click', e => { if (e.target.id === 'pScrim' || e.target.closest('[data-close]')) closeModal(); });
      document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
    }
    $('#pModal').innerHTML = html;
    scrim.classList.add('open');
    icons();
    return $('#pModal');
  }
  function closeModal() { const s = $('#pScrim'); if (s) { s.classList.remove('open'); $('#pModal').innerHTML = ''; } }

  /* Upload with AI pre-check. checks: { docName: [[status, reason], …] } per attempt */
  const attempts = {};
  function upload(docName, checks, onResult) {
    const file = docName.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '') + '.pdf';
    const m = openModal(`
      <div class="modal-head"><i data-lucide="upload"></i><h2>Upload ${esc(docName.toLowerCase())}</h2><button class="icon-btn" data-close title="Close"><i data-lucide="x"></i></button></div>
      <div class="modal-body">
        <label class="drop" style="display:flex;flex-direction:column;align-items:center;gap:8px;padding:28px;border:1.5px dashed var(--border);border-radius:12px;background:var(--row-hover);text-align:center;cursor:pointer">
          <i data-lucide="file-up" style="width:24px;height:24px;color:var(--muted)"></i>
          <b style="font-weight:500">Drop a PDF or photo here, or click to choose</b>
          <span class="caption">The AI checks it against your request before ${esc(T.short)} sees it.</span>
          <input type="file" hidden accept=".pdf,image/*">
        </label>
        <button class="btn-secondary" data-sample style="align-self:center"><i data-lucide="file-text"></i>Use a sample file: ${file}</button>
      </div>`);
    const run = () => {
      closeModal();
      onResult({ status: 'checking', note: 'AI pre-check running…' });
      const list = (checks && checks[docName]) || [['ready', 'Readable and matches your request.']];
      const i = Math.min(attempts[docName] || 0, list.length - 1);
      attempts[docName] = (attempts[docName] || 0) + 1;
      setTimeout(() => onResult({ status: list[i][0], note: list[i][1], file }), 1100);
    };
    m.querySelector('[data-sample]').addEventListener('click', run);
    m.querySelector('input[type=file]').addEventListener('change', run);
  }

  /* ---------- notifications ---------- */
  const NOTE = 'Also sent to WhatsApp and email';
  const NOTIF = { quote: ['receipt', 'success'], doc: ['file-warning', 'warning'], milestone: ['flag', 'info'], delay: ['clock-alert', 'warning'], rejected: ['file-x-2', 'danger'] };
  const notify = (msg) => toast(msg, { note: NOTE });

  function notFound(what) {
    return `<div class="empty" style="height:auto;padding:64px 24px"><div class="empty-tile"><i data-lucide="search-x"></i></div>
      <h2 class="empty-title">${esc(what)} not found</h2>
      <p class="empty-body">It may belong to another account, or the link is out of date.</p>
      <a class="btn-secondary" href="index.html"><i data-lucide="house"></i>Back to Home</a></div>`;
  }

  // Title: "<page> · <logistics company>"
  const title = (page) => { document.title = `${page} · ${T.short}`; };

  return { S, T, acc, money, range, requests, addRequest, nextRequestId, quote, decide, markViewed, shipments, statusTag, stepper, STATUS_TAG,
    SET, carrierFor, priceFactor, estimateHTML, estimateNoteText,
    routeLine, DOC, docTag, openModal, closeModal, upload, notify, NOTE, NOTIF, notFound, title };
})();
