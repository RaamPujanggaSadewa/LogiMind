/* ==========================================================================
   LogiMind prototype — ASCO core partners and public pages, after asco.js.
   - partner/rfq-reply.html?token=   magic-link RFQ reply (no login)
   - partner/job.html?token= | ?dsid= own leg steps (magic link, or Jaya login)
   - partner/pod.html?dsid=          driver POD with signature pad (mobile)
   - partner/invoice.html?token=     partner invoice against the PO
   - pod.html?dsid=                  generated POD with QR and audit trail
   Partners see only their own leg. They never see the customer price,
   ASCO's margin, the other partners or the shipper's contact details.
   ========================================================================== */
window.AscoPages = window.AscoPages || {};
window.AscoPublic = (() => {
  const { $, $$, esc, tag, icons, toast } = LM;
  const X = Asco, A = X.A, T = X.T;
  const q = new URLSearchParams(location.search);
  const root = () => $('#root');
  const top = (sub) => `<div class="m-top"><span class="logo" style="background:${T.brand}">${T.initials}</span><div><b>${esc(T.name)}</b><span class="caption">${sub}</span></div></div>`;
  const foot = `<div class="m-foot"><img src="${X.P('assets/logo.svg')}" alt="">Sent through LogiMind · no account needed</div>`;
  const page = (html) => { root().innerHTML = `<div class="m-page">${html}</div>`; icons(); };
  const invalid = (title, body) => page(`${top('Link')}<section class="card"><div class="empty" style="height:auto;padding:32px 8px"><div class="empty-tile"><i data-lucide="link-2-off"></i></div>
    <h2 class="empty-title">${title}</h2><p class="empty-body">${body}</p><span class="caption">Questions? ${esc(A.coordinator.name)}, ${esc(A.coordinator.role)} · ${esc(A.coordinator.email)}</span></div></section>${foot}`);
  const tokenPid = (prefix) => { const t = q.get('token') || ''; const m = t.match(new RegExp('^' + prefix + '-(pudong|huangpu|jaya|priok)$')); return m ? m[1] : null; };
  const legBox = (s, leg) => `<section class="card"><div class="card-head"><i data-lucide="${leg === 'origin' ? 'plane-takeoff' : 'plane-landing'}"></i><h3>Your leg: ${A.legs[leg].label.toLowerCase()}</h3></div>
    <ol class="tl">${A.legs[leg].steps.map(n => `<li class="todo"><span class="dot">${n}</span><div><div class="t">${esc(A.steps[n].t)}</div><div class="d">Planned ${X.fmt(A.steps[n].due)} · ${esc(A.steps[n].loc)}</div></div><span></span></li>`).join('')}</ol></section>`;
  const requirement = (s, leg) => { const f = s.req.fields;
    return `<section class="card"><div class="card-head"><i data-lucide="clipboard-list"></i><h3>Requirement</h3></div><dl class="kv2">
      <dt>Cargo</dt><dd>Consumer electronics (LED TVs, monitors) · HS ${esc(f.hs)}</dd><dt>Volume</dt><dd>${esc(f.cbm)} CBM · ${esc(f.ctype)} · about 38.7 t</dd>
      <dt>${leg === 'origin' ? 'Pickup area' : 'Arrives at'}</dt><dd>${leg === 'origin' ? 'Jinqiao, Pudong, Shanghai (address shared with the PO)' : `Tanjung Priok, ETA ${X.fmt(A.eta, { date: true })}`}</dd>
      <dt>${leg === 'origin' ? 'Hand-over' : 'Deliver to'}</dt><dd>${leg === 'origin' ? 'Loaded on vessel at Shanghai for Tanjung Priok, Jakarta' : 'Bandung, West Java (consignee details shared with the PO)'}</dd>
      <dt>Timing</dt><dd>${leg === 'origin' ? `Departure ${esc(X.fieldText(f, 'etd'))}` : `Delivered by ${esc(X.fieldText(f, 'eta'))}`}</dd><dt>Incoterm</dt><dd>FOB Shanghai</dd></dl></section>`; };

  /* ---------------- RFQ reply by magic link ---------------- */
  function rfqReply() {
    document.title = 'RFQ from ASCO';
    if (q.get('token') === 'expired') return invalid('This link has expired', 'RFQ links stay open for 72 hours. Ask ASCO for a new link if you still want to quote.');
    const pid = tokenPid('rfq'), s = X.get();
    if (!pid) return invalid('This link isn’t valid', 'Check that you opened the full link from the email.');
    if (!s.rfq) return invalid('This RFQ isn’t open yet', 'ASCO hasn’t sent this request yet, or it was withdrawn.');
    const leg = X.legOf(pid), P = A.partners[pid], r = s.rfq.replies[pid];
    if (X.latestSent(s) && X.accepted(s) && !r) return invalid('This RFQ is closed', 'ASCO has already completed costing for this shipment. Thank you.');
    if (r && q.get('edit') !== '1') return page(`${top(`RFQ ${esc(s.req.id)} · for ${esc(X.pname(pid))}`)}
      <section class="card"><div class="empty" style="height:auto;padding:24px 8px"><div class="empty-tile" style="background:var(--success-soft);color:var(--success)"><i data-lucide="circle-check"></i></div>
        <h2 class="empty-title">Thank you, your costing was sent</h2><p class="empty-body">${esc(X.cur(r.amount, r.currency))} · valid to ${X.fmt(r.validity + 'T12:00', { date: true })} · ${r.transit} days. ASCO will contact you if your offer is selected.</p>
        ${X.latestSent(s) ? '' : `<a class="btn-secondary" href="?token=${esc(q.get('token'))}&edit=1"><i data-lucide="pencil"></i>Change my reply</a>`}</div></section>
      ${P.mode === 'link' ? `<section class="card"><div class="card-head"><i data-lucide="sparkles"></i><h3>Create a free LogiMind account</h3></div><p class="caption" style="margin:0 0 10px">See all your RFQs and jobs from ASCO and other logistics companies in one place.</p><button class="btn-secondary" onclick="LM.toast('Account sign-up is designed in a later screen')"><i data-lucide="user-plus"></i>Create account</button></section>` : ''}${foot}`);
    const d = r || { amount: '', currency: P.currency, validity: A.replies[pid].validity, transit: '', notes: '' };
    page(`${top(`RFQ ${esc(s.req.id)} · for ${esc(X.pname(pid))}`)}
      <div><h1>Your costing for the ${esc(A.legs[leg].label.toLowerCase())}</h1><p class="caption" style="margin:4px 0 0">One amount for all your steps. Reply by ${X.fmt(X.addHours(s.rfq.sentAt, 24))}.</p></div>
      ${legBox(s, leg)}${requirement(s, leg)}
      <form class="card" id="rf" novalidate style="display:flex;flex-direction:column;gap:12px">
        <div class="grid2" style="grid-template-columns:minmax(0,1fr) 110px"><label class="lbl"><span>Cost amount</span><input class="in" name="amount" inputmode="decimal" required value="${esc(d.amount)}" placeholder="${pid === 'pudong' ? 'e.g. 31,200' : 'Total for your leg'}"></label>
          <label class="lbl"><span>Currency</span><select class="select" name="currency" style="height:34px">${['CNY', 'USD', 'IDR'].map(c => `<option ${d.currency === c ? 'selected' : ''}>${c}</option>`).join('')}</select></label></div>
        <div class="grid2"><label class="lbl"><span>Valid until</span><input class="in" type="date" name="validity" required value="${esc(d.validity)}"></label>
          <label class="lbl"><span>Estimated transit (days)</span><input class="in" type="number" min="1" max="60" name="transit" required value="${esc(d.transit)}" placeholder="${A.replies[pid].transit}"></label></div>
        <label class="lbl"><span>Notes (optional)</span><textarea class="ta2" name="notes" placeholder="What’s included or excluded">${esc(d.notes)}</textarea></label>
        <span class="error caption" id="rfErr" style="color:var(--danger);display:none">Enter an amount, a validity date and the transit days.</span>
        <button class="btn-secondary" type="button" data-fill style="align-self:flex-start"><i data-lucide="wand-sparkles"></i>Demo: fill typical reply</button>
        <button class="btn-primary wide" type="submit"><i data-lucide="send"></i>Submit costing</button>
        <span class="caption" style="display:flex;gap:6px;align-items:center"><i data-lucide="lock" style="width:13px;height:13px"></i>Only ASCO sees your price. Other partners don’t.</span></form>${foot}`);
    const f = $('#rf');
    $('[data-fill]').addEventListener('click', () => { const R = A.replies[pid]; f.amount.value = R.amount.toLocaleString('en-US'); f.currency.value = R.currency; f.validity.value = R.validity; f.transit.value = R.transit; f.notes.value = R.notes; });
    f.addEventListener('submit', e => {
      e.preventDefault();
      const amount = parseFloat(String(f.amount.value).replace(/[^\d.]/g, ''));
      if (!amount || !f.validity.value || !+f.transit.value) { $('#rfErr').style.display = 'block'; return; }
      X.save(st => X.aReply(st, pid, { amount, currency: f.currency.value, validity: f.validity.value, transit: +f.transit.value, notes: f.notes.value.trim() }, X.when('reply_' + pid)));
      location.replace('?token=' + encodeURIComponent(q.get('token')));
    });
  }

  /* ---------------- Job: own leg steps ---------------- */
  function stepForm(s, pid, n) {
    const S = A.steps[n], seed = A.stepDone[n] || [S.due, S.loc, 'Good', ''];
    return `<form class="card" data-step-form="${n}" style="display:flex;flex-direction:column;gap:12px;border-color:var(--primary)">
      <div class="card-head" style="margin:0"><i data-lucide="${S.icon}"></i><h3>Mark step ${n} done: ${esc(S.t)}</h3></div>
      <div class="grid2"><label class="lbl"><span>Time</span><input class="in" type="datetime-local" name="at" value="${seed[0]}"></label><label class="lbl"><span>Location</span><input class="in" name="location" value="${esc(seed[1])}"></label></div>
      <div class="lbl"><span>Goods condition</span><div class="segmented" style="flex-wrap:wrap">${X.CONDITIONS.map(([c]) => `<label class="pill${c === seed[2] ? ' selected' : ''}"><input type="radio" name="condition" value="${c}" ${c === seed[2] ? 'checked' : ''} hidden>${c}</label>`).join('')}</div></div>
      <label class="lbl"><span>Notes</span><textarea class="ta2" name="notes" placeholder="e.g. 2 cartons dented">${esc(seed[3])}</textarea></label>
      <label class="lbl"><span>Photos (up to 3)</span><input type="file" name="photos" accept="image/*" multiple class="in" style="padding-top:6px"></label><div class="thumbs" data-thumbs></div>
      <button class="btn-primary wide" type="submit"><i data-lucide="check"></i>Mark done</button></form>`;
  }
  const thumbsFrom = (files) => Promise.all([...files].slice(0, 3).map(f => new Promise(res => {
    const img = new Image(), url = URL.createObjectURL(f);
    img.onload = () => { const c = document.createElement('canvas'), k = 96 / Math.max(img.width, img.height); c.width = img.width * k; c.height = img.height * k; c.getContext('2d').drawImage(img, 0, 0, c.width, c.height); res({ name: f.name, src: c.toDataURL('image/jpeg', 0.7) }); };
    img.onerror = () => res({ name: f.name }); img.src = url;
  })));
  function bindStepForms(pid, after) {
    $$('[data-step-form]').forEach(f => {
      f.addEventListener('change', e => {
        if (e.target.name === 'condition') $$('.pill', f).forEach(p => p.classList.toggle('selected', p.querySelector('input').checked));
        if (e.target.name === 'photos') thumbsFrom(e.target.files).then(t => { f._photos = t; $('[data-thumbs]', f).innerHTML = t.map(p => `<span class="thumb" style="${p.src ? `background-image:url(${p.src})` : ''}">${p.src ? '' : '<i data-lucide="image"></i>'}</span>`).join(''); icons(); });
      });
      f.addEventListener('submit', e => {
        e.preventDefault();
        const n = +f.dataset.stepForm;
        X.save(st => X.aStep(st, n, { at: f.at.value, location: f.location.value.trim() || A.steps[n].loc, condition: f.condition.value, notes: f.notes.value.trim(), photos: f._photos || [], by: pid }));
        toast(`Step ${n} marked done`, { note: 'ASCO sees it now; the shipper sees the step and condition' }); after();
      });
    });
  }
  function jobBody(s, pid) {
    const leg = X.legOf(pid), po = X.poFor(s, pid), last = A.legs[leg].steps.every(n => s.steps && s.steps[n]);
    const nextN = A.legs[leg].steps.find(n => !(s.steps && s.steps[n]));
    const locked = nextN === 4 && !(s.bl && s.bl.received);
    const bl = leg === 'origin' && s.steps && s.steps[3] ? `<section class="card" id="bl"><div class="card-head"><i data-lucide="file-text"></i><h3>Bill of lading</h3><div class="right">${s.bl && s.bl.received ? tag('Received by ASCO', 'success') : tag(`Requested${s.bl && s.bl.reminders.length ? ` · ${s.bl.reminders.length}×` : ''}`, 'warning')}</div></div>
      ${s.bl && s.bl.received ? `<p class="caption" style="margin:0">${esc(s.bl.received.file)} · ${X.fmt(s.bl.received.at)}</p>` : `<p class="caption" style="margin:0 0 10px">Upload the B/L against ${esc(X.dsid(s))} so import customs can be lodged before the vessel arrives on ${X.fmt(A.eta, { date: true })}.</p>
        <label class="lbl"><span>B/L file (PDF)</span><input type="file" class="in" id="blFile" accept=".pdf,image/*" style="padding-top:6px"></label><button class="btn-primary wide" data-bl style="margin-top:10px"><i data-lucide="upload"></i>Upload B/L</button>`}</section>` : '';
    const contact = `<section class="card"><div class="card-head"><i data-lucide="headset"></i><h3>Questions about this job</h3></div><dl class="kv2"><dt>Coordinator</dt><dd>${esc(A.coordinator.name)}, ${esc(A.coordinator.role)}</dd><dt>Phone / WhatsApp</dt><dd>${esc(A.coordinator.phone)}</dd><dt>Email</dt><dd>${esc(A.coordinator.email)}</dd></dl></section>`;
    const site = leg === 'origin' ? `<dt>Pickup</dt><dd>Warehouse, ${esc(s.req.fields.pickup)} · from 08:00</dd><dt>Hand-over</dt><dd>Vessel at Yangshan, cut-off ${X.fmt(A.steps[3].due)}</dd>`
      : `<dt>Arrives</dt><dd>Tanjung Priok, ETA ${X.fmt(A.eta)} · B/L ${s.bl && s.bl.received ? esc(s.bl.received.no) : 'to follow'}</dd><dt>Deliver to</dt><dd>${esc(A.consignee.name)}, ${esc(A.consignee.address)}</dd><dt>Receiving</dt><dd>${esc(A.consignee.contact)} · 08:00–17:00</dd>`;
    return `<section class="card"><div class="card-head"><i data-lucide="file-signature"></i><h3>${esc(po.no)}</h3><div class="right">${X.dsidHTML(X.dsid(s))}</div></div>
        <dl class="kv2"><dt>Your amount</dt><dd><b style="font-weight:600">${esc(X.cur(po.amount, po.currency))}</b></dd><dt>Your leg</dt><dd>${A.legs[leg].label} · steps ${A.legs[leg].steps.join(', ')}</dd>
          <dt>Cargo</dt><dd>${esc(s.req.fields.ctype)} · ${esc(s.req.fields.cbm)} CBM consumer electronics · 1,840 cartons</dd>${site}<dt>Terms</dt><dd>${esc(po.terms)}</dd></dl>
        <p class="caption" style="margin:10px 0 0;display:flex;gap:6px;align-items:center"><i data-lucide="eye" style="width:13px;height:13px"></i>Shared by ASCO for this job only.</p></section>
      ${bl}
      <section class="card"><div class="card-head"><i data-lucide="list-ordered"></i><h3>Your steps</h3><div class="right">${last ? tag('Leg complete', 'success') : ''}</div></div>${X.stepsHTML(s, pid)}</section>
      ${!last && nextN && !(nextN === 6) ? (locked ? `<div class="banner warning"><i data-lucide="lock"></i><div class="text"><b>Import customs waits for the B/L.</b> ASCO has requested it from the origin side.</div></div>` : stepForm(s, pid, nextN)) : ''}
      ${nextN === 6 ? `<section class="card"><div class="card-head"><i data-lucide="smartphone"></i><h3>Consignee confirmation</h3></div><p class="caption" style="margin:0 0 10px">Your driver captures the signature, photos and condition on the phone at the consignee. LogiMind then generates the POD.</p>
        <a class="btn-primary wide" href="pod.html?dsid=${X.dsid(s)}"><i data-lucide="pen-line"></i>Open driver POD</a></section>` : ''}
      ${s.invRequest ? `<section class="card"><div class="card-head"><i data-lucide="receipt-text"></i><h3>Invoice ASCO</h3><div class="right">${tag(...X.payStatus(s, pid))}</div></div><a class="btn-secondary" href="invoice.html?token=inv-${pid}"><i data-lucide="upload"></i>Upload invoice against ${esc(po.no)}</a></section>` : ''}
      ${contact}`;
  }
  function bindJob(pid, rerender) {
    bindStepForms(pid, rerender);
    const b = $('[data-bl]');
    if (b) b.addEventListener('click', () => { const f = $('#blFile').files[0]; X.save(st => X.aBlReceived(st, { via: 'partner', when: X.when('blReceived'), file: f ? f.name : null })); toast('B/L uploaded', { note: 'ASCO and the destination agent can lodge import customs' }); rerender(); });
  }
  function job() {
    document.title = 'Job · ASCO';
    const s = X.get(), dsidQ = q.get('dsid');
    // signed-in partner (Jaya Cargo) opens by DSID inside the partner shell
    if (dsidQ && Asco.ctx.partner) return AscoPages['partner:job']();
    if (dsidQ && !LM.account) { location.replace(X.P('login.html?next=' + encodeURIComponent('partner/job.html?dsid=' + dsidQ))); return; }
    const pid = tokenPid('job');
    if (!pid) return invalid('This link isn’t valid', 'Check that you opened the full link from the purchase order email.');
    if (!s.approval || !X.poFor(s, pid)) return invalid('No job for you on this shipment', 'This link works once ASCO has sent you a purchase order.');
    const render = () => { const st = X.get(); page(`${top(`Job for ${esc(X.pname(pid))}`)}<div><h1>${esc(A.legs[X.legOf(pid)].label)} · ${esc(A.legs[X.legOf(pid)].city)}</h1></div>${jobBody(st, pid)}${foot}`); bindJob(pid, render);
      if (location.hash === '#bl' && $('#bl')) $('#bl').scrollIntoView({ block: 'center' }); };
    render();
  }

  /* ---------------- Driver POD with signature pad ---------------- */
  function driverPod() {
    document.title = 'Proof of delivery · driver';
    const s = X.get(), id = q.get('dsid');
    if (!s.approval || id !== X.dsid(s)) return invalid('Shipment not found', 'Check the DSID on your delivery order.');
    if (s.pod) return page(`${top('Driver · ' + esc(X.pname(s.approval.pos[1].partner)))}<section class="card"><div class="empty" style="height:auto;padding:24px 8px"><div class="empty-tile" style="background:var(--success-soft);color:var(--success)"><i data-lucide="circle-check"></i></div>
      <h2 class="empty-title">Delivered · job closed</h2><p class="empty-body">Signed by ${esc(s.pod.receiver)} at ${X.fmt(s.pod.at)}. The POD is with ASCO and the shipper.</p><a class="btn-secondary" href="${X.P('pod.html?dsid=' + id)}"><i data-lucide="qr-code"></i>View POD</a></div></section>${foot}`);
    if (!(s.steps && s.steps[4])) return invalid('Not ready for delivery', 'Import customs (step 4) must be done before the POD can be captured.');
    page(`${top('Driver · ' + esc(X.pname(s.approval.pos[1].partner)))}<div><h1>Proof of delivery</h1>${X.dsidHTML(id)}</div>
      <section class="card"><dl class="kv2"><dt>Consignee</dt><dd><b style="font-weight:600">${esc(A.consignee.name)}</b></dd><dt>Address</dt><dd>${esc(A.consignee.address)}</dd><dt>Cargo</dt><dd>3 × 40ft HC · 1,840 cartons</dd>
        ${s.steps[4].condition !== 'Good' ? `<dt>Note</dt><dd style="color:var(--warning)">${esc(s.steps[4].notes)}</dd>` : ''}</dl></section>
      <form class="card" id="pf" style="display:flex;flex-direction:column;gap:12px" novalidate>
        <label style="display:flex;gap:10px;align-items:center;font-weight:500"><input type="checkbox" class="check" name="got" checked>Goods received by the consignee</label>
        <div class="lbl"><span>Condition</span><div class="segmented" style="flex-wrap:wrap">${X.CONDITIONS.map(([c], i) => `<label class="pill${i ? '' : ' selected'}"><input type="radio" name="condition" value="${c}" ${i ? '' : 'checked'} hidden>${c}</label>`).join('')}</div></div>
        <label class="lbl"><span>Notes</span><textarea class="ta2" name="notes">1,840 cartons received. The 2 dented cartons from customs were checked: contents intact.</textarea></label>
        <label class="lbl"><span>Receiver name</span><input class="in" name="receiver" value="" placeholder="Full name of the person signing"></label>
        <div class="lbl"><span>Signature <button type="button" class="link-btn" data-clear style="margin-left:auto">Clear</button></span><canvas class="sigpad" id="sig"></canvas></div>
        <label class="lbl"><span>Photos (up to 3)</span><input type="file" name="photos" accept="image/*" capture="environment" multiple class="in" style="padding-top:6px"></label><div class="thumbs" data-thumbs></div>
        <span class="caption" id="pfErr" style="color:var(--danger);display:none">Add the receiver’s name and a signature.</span>
        <button class="btn-primary wide" type="submit"><i data-lucide="check"></i>Submit POD and close the job</button></form>${foot}`);
    const c = $('#sig'), ctx = c.getContext('2d');
    let drawing = false, inked = false;
    const size = () => { const r = c.getBoundingClientRect(), d = window.devicePixelRatio || 1; c.width = r.width * d; c.height = r.height * d; ctx.scale(d, d); ctx.lineWidth = 2.2; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.strokeStyle = '#1F1F23'; };
    size();
    const pt = (e) => { const r = c.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };
    c.addEventListener('pointerdown', e => { drawing = true; c.setPointerCapture(e.pointerId); ctx.beginPath(); ctx.moveTo(...pt(e)); });
    c.addEventListener('pointermove', e => { if (!drawing) return; ctx.lineTo(...pt(e)); ctx.stroke(); inked = true; });
    ['pointerup', 'pointercancel'].forEach(t => c.addEventListener(t, () => { drawing = false; }));
    $('[data-clear]').addEventListener('click', () => { ctx.clearRect(0, 0, c.width, c.height); inked = false; });
    const f = $('#pf');
    f.addEventListener('change', e => {
      if (e.target.name === 'condition') $$('.pill', f).forEach(p => p.classList.toggle('selected', p.querySelector('input').checked));
      if (e.target.name === 'photos') thumbsFrom(e.target.files).then(t => { f._photos = t; $('[data-thumbs]', f).innerHTML = t.map(p => `<span class="thumb" style="${p.src ? `background-image:url(${p.src})` : ''}">${p.src ? '' : '<i data-lucide="image"></i>'}</span>`).join(''); icons(); });
    });
    f.addEventListener('submit', e => {
      e.preventDefault();
      if (!f.receiver.value.trim() || !inked) { $('#pfErr').style.display = 'block'; return; }
      const sig = c.toDataURL('image/png');
      X.save(st => X.aPod(st, { at: X.when('pod'), receiver: f.receiver.value.trim(), condition: f.condition.value, notes: f.notes.value.trim(), signature: sig, photos: f._photos || [] }));
      location.reload();
    });
  }

  /* ---------------- Partner invoice against the PO ---------------- */
  function invoice() {
    document.title = 'Invoice · ASCO';
    const s = X.get(), pid = tokenPid('inv');
    if (!pid) return invalid('This link isn’t valid', 'Check that you opened the full link from the email.');
    if (!s.invRequest || !X.poFor(s, pid)) return invalid('No invoice requested yet', 'ASCO asks you to invoice once the proof of delivery is signed.');
    const po = X.poFor(s, pid), inv = (s.payables || {})[pid];
    if (inv) return page(`${top('Invoice · ' + esc(X.pname(pid)))}<section class="card"><div class="empty" style="height:auto;padding:24px 8px"><div class="empty-tile" style="background:var(--success-soft);color:var(--success)"><i data-lucide="circle-check"></i></div>
      <h2 class="empty-title">Invoice ${esc(inv.no)} received</h2><p class="empty-body">${esc(X.cur(inv.amount, inv.currency))} against ${esc(po.no)}. Status: ${esc(X.payStatus(s, pid)[0])}.</p></div></section>${foot}`);
    const sample = A.partnerInvoices[pid] || { no: `${D_INIT(pid)}-INV-0001`, amount: po.amount };
    page(`${top('Invoice · ' + esc(X.pname(pid)))}<div><h1>Invoice ASCO for ${esc(po.no)}</h1>${X.dsidHTML(X.dsid(s))}</div>
      <section class="card"><dl class="kv2"><dt>PO amount</dt><dd><b style="font-weight:600">${esc(X.cur(po.amount, po.currency))}</b></dd><dt>Your leg</dt><dd>${A.legs[po.leg].label}</dd><dt>Delivered</dt><dd>${X.fmt(s.pod.at)}</dd></dl></section>
      <form class="card" id="inf" style="display:flex;flex-direction:column;gap:12px" novalidate>
        <div class="grid2"><label class="lbl"><span>Invoice number</span><input class="in" name="no" value="${esc(sample.no)}"></label><label class="lbl"><span>Amount (${po.currency})</span><input class="in" name="amount" inputmode="decimal" value="${Math.round(sample.amount).toLocaleString('en-US')}"></label></div>
        <label class="lbl"><span>Invoice file</span><input type="file" class="in" name="file" accept=".pdf,image/*" style="padding-top:6px"></label>
        ${sample.note ? `<span class="caption">Demo value includes: ${esc(sample.note)}</span>` : ''}
        <button class="btn-primary wide" type="submit"><i data-lucide="upload"></i>Upload invoice</button></form>${foot}`);
    $('#inf').addEventListener('submit', e => {
      e.preventDefault(); const f = e.target, amount = parseFloat(String(f.amount.value).replace(/[^\d.]/g, ''));
      if (!amount || !f.no.value.trim()) return;
      X.save(st => X.aPartnerInvoice(st, pid, { no: f.no.value.trim(), amount, currency: po.currency, at: X.when('inv_' + (pid === 'jaya' ? 'jaya' : 'pudong')), file: f.file.files[0] ? f.file.files[0].name : null }));
      location.reload();
    });
  }
  const D_INIT = (pid) => LM.data.orgs[pid].initials;

  /* ---------------- Generated POD: QR + full audit trail ---------------- */
  function pod() {
    document.title = 'Proof of delivery · LogiMind';
    const s = X.get(), id = q.get('dsid');
    if (!s.pod || id !== X.dsid(s)) return invalid('Proof of delivery not found', 'It may not be generated yet, or the link is out of date.');
    const url = location.origin + location.pathname + '?dsid=' + encodeURIComponent(id) + '&view=audit';
    const P = s.pod, back = LM.account ? (LM.account.persona === 'sender' ? X.P('portal/shipment.html?id=' + id) : LM.account.persona === 'tenant' ? X.P('shipment.html') : X.P('partner/index.html')) : null;
    root().innerHTML = `<div class="m-page" style="max-width:860px">
      <div style="display:flex;align-items:center;gap:8px">${back ? `<a class="btn-secondary" href="${back}"><i data-lucide="arrow-left"></i>Back</a>` : ''}<span style="flex:1"></span><button class="btn-secondary" onclick="window.print()"><i data-lucide="printer"></i>Print</button></div>
      <section class="qdoc" style="--brand:${T.brand}"><div class="qdoc-top"><span class="qdoc-logo">${T.initials}</span><div><div class="qdoc-name">${esc(T.name)}</div><div class="qdoc-url">Digital proof of delivery</div></div>
        <div class="qdoc-no"><b class="num">${esc(P.no)}</b>${X.fmt(P.at)}</div></div>
        <div class="qdoc-body"><div style="display:grid;grid-template-columns:minmax(0,1fr) 140px;gap:16px;align-items:start">
          <div><div class="qdoc-route"><i data-lucide="package-check"></i>${esc(id)}</div>
            <div class="qdoc-meta"><div><span>Shipper</span> <b>${esc(A.customer.name)}</b></div><div><span>Consignee</span> <b>${esc(A.consignee.name)}</b></div><div><span>Route</span> <b>Shanghai → Tanjung Priok → Bandung</b></div>
              <div><span>Cargo</span> <b>3 × 40ft HC · 1,840 cartons · 200 CBM</b></div><div><span>Received by</span> <b>${esc(P.receiver)}</b></div><div><span>Condition</span> <b>${esc(P.condition)}</b></div></div></div>
          <div style="text-align:center"><div class="qrbox" style="margin:0 auto">${X.qrHTML(url)}</div><span class="caption">Scan for the audit trail</span></div></div>
          ${P.notes ? `<div class="qdoc-terms">${esc(P.notes)}</div>` : ''}
          <div style="display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:16px;margin-top:14px">
            <div><div class="caption">Signature</div><img class="sigimg" src="${P.signature}" alt="Receiver signature"><div class="caption">${esc(P.receiver)} · ${X.fmt(P.at)}</div></div>
            <div><div class="caption">Photos</div><div class="thumbs" style="margin-top:6px">${(P.photos.length ? P.photos : [{}, {}]).map(p => `<span class="thumb" style="${p.src ? `background-image:url(${p.src})` : ''}">${p.src ? '' : '<i data-lucide="image"></i>'}</span>`).join('')}</div>${P.photos.length ? '' : '<div class="caption">Placeholders: no photos attached</div>'}</div></div></div>
        <div class="qdoc-foot">Generated by LogiMind · verify at ${esc(location.host || 'logimind')}</div></section>
      <section class="card" id="audit"><div class="card-head"><i data-lucide="history"></i><h3>Audit trail</h3><div class="right"><span class="caption">Every event from request to POD · actor role and what changed</span></div></div>${X.auditHTML(s, { pub: true })}</section>${foot.replace(' · no account needed', '')}</div>`;
    icons();
    if (q.get('view') === 'audit') setTimeout(() => $('#audit').scrollIntoView({ block: 'start' }), 50);
  }

  /* ---------------- Jaya Cargo signed in (partner shell) ---------------- */
  const head = (t, sub) => `<div class="a-title"><h1>${esc(t)}</h1>${sub ? `<span class="caption">${sub}</span>` : ''}</div>`;
  AscoPages['partner:index'] = function () {
    const me = LM.account.org, s = X.get(), r = s.rfq && s.rfq.replies[me], po = X.poFor(s, me);
    const rows = [];
    if (s.rfq) rows.push(['file-question', `RFQ ${s.req.id} · ${A.legs[X.legOf(me)].label.toLowerCase()} · Jakarta → Bandung`, r ? `You replied ${X.cur(r.amount, r.currency)} · ${X.fmt(r.at)}` : `Sent ${X.fmt(s.rfq.sentAt)} · reply in 24 hours`, r ? tag('Replied', 'success') : tag('Reply needed', 'warning'), `rfq-reply.html?token=rfq-${me}`, r ? 'View' : 'Reply']);
    if (po) rows.push(['truck', `${po.no} · ${X.dsid(s)}`, `${X.cur(po.amount, po.currency)} · steps ${A.legs[po.leg].steps.join(', ')}`, tag(A.legs[po.leg].steps.every(n => s.steps && s.steps[n]) ? 'Leg complete' : 'In progress', 'info'), 'job.html?dsid=' + X.dsid(s), 'Open job']);
    if (s.invRequest && po) rows.push(['receipt-text', `Invoice ASCO for ${po.no}`, 'Requested after POD', tag(...X.payStatus(s, me)), `invoice.html?token=inv-${me}`, 'Open']);
    if (s.rfq && X.accepted(s) && s.approval && !po) rows.push(['circle-x', `RFQ ${s.req.id} · not selected`, 'ASCO chose another offer for this shipment', tag('Closed', 'neutral'), null, null]);
    const body = `<div class="a-wrap"><section class="card" id="jobs"><div class="card-head"><span class="space-avatar" style="background:${T.brand}">A</span><h3>From ${esc(T.name)}</h3></div>
      ${rows.length ? `<ul class="a-list">${rows.map(([i, t, d, tg, href, cta]) => `<li><span class="icon-tile tone-info"><i data-lucide="${i}"></i></span><div><div class="t">${esc(t)} ${tg}</div><div class="d">${esc(d)}</div></div>${href ? `<a class="btn-secondary" href="${href}">${cta}</a>` : '<span></span>'}</li>`).join('')}</ul>`
        : '<p class="caption" style="margin:0">No RFQs or jobs yet. When ASCO sends one, it appears here and by email.</p>'}</section>
      <div class="lock-note" style="border-radius:var(--r-md);border:1px solid var(--divider)"><i data-lucide="lock"></i><span>You see your own leg, your own price and the ASCO coordinator. Customer prices and other partners are not shared.</span></div></div>`;
    X.frame({ rail: 'home', row: 'overview', head: head('Overview', esc(X.pname(me))), body });
  };
  AscoPages['partner:job'] = function () {
    const me = LM.account.org;
    const render = () => {
      const s = X.get();
      if (!s.approval || !X.poFor(s, me) || q.get('dsid') !== X.dsid(s)) {
        X.frame({ rail: 'jobs', row: '', head: head('Job', ''), body: `<div class="a-wrap"><section class="card"><div class="empty" style="height:auto;padding:40px 16px"><div class="empty-tile"><i data-lucide="search-x"></i></div><h2 class="empty-title">Job not found</h2><p class="empty-body">You can only open jobs that a logistics company has awarded to you.</p><a class="btn-secondary" href="index.html">Overview</a></div></section></div>` });
        return;
      }
      X.frame({ rail: 'jobs', row: '', head: `<div class="a-title"><h1>Job</h1>${X.dsidHTML(X.dsid(s))}<span class="caption">${esc(T.short)} · ${esc(A.legs[X.legOf(me)].label)}</span></div>`,
        body: `<div class="a-wrap" style="max-width:820px">${jobBody(s, me)}</div>` });
      bindJob(me, render);
    };
    render();
  };

  return { rfqReply, job, driverPod, invoice, pod };
})();
