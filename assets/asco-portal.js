/* ==========================================================================
   LogiMind prototype — ASCO shipper portal (Lina Zhou, ABC Electronics).
   Customer words only. Never renders partner names, partner costs or margin:
   prices shown are the customer quotation in USD.
   ========================================================================== */
window.AscoPages = window.AscoPages || {};
(() => {
  if (!Asco.ctx.sender) return;
  const { $, $$, esc, tag, icons, toast } = LM;
  const X = Asco, A = X.A, T = X.T;
  const ro = !!LM.viewAs;                        // staff "View as customer": read-only
  const head = (title, sub, right) => `<div class="a-title"><h1 class="num">${esc(title)}</h1>${sub ? `<span class="caption">${sub}</span>` : ''}</div><div class="right">${right || ''}</div>`;
  const wrap = (html) => `<div class="a-wrap" style="max-width:1120px">${html}</div>`;
  const onStore = (fn) => window.addEventListener('storage', e => { if (e.key === 'lm.db') fn(); });
  const NOTE = 'Also sent to WhatsApp and email';
  const empty = (icon, title, body, action) => `<section class="card"><div class="empty" style="height:auto;padding:40px 16px"><div class="empty-tile"><i data-lucide="${icon}"></i></div>
    <h2 class="empty-title">${title}</h2><p class="empty-body">${body}</p>${action || ''}</div></section>`;
  document.title = 'ASCO customer portal';

  // What Lina should know or do next, in customer words
  function next(s) {
    const k = X.stage(s), q = X.latestSent(s);
    if (k === 0) return null;
    if (k <= 2) return { icon: 'hourglass', tone: 'info', t: 'ASCO is collecting partner costing', d: 'You’ll get a quotation by email and here, usually within 2 business days.' };
    if (k === 3) return q.status === 'negotiated'
      ? { icon: 'messages-square', tone: 'info', t: `You asked ASCO to revise version ${q.v}`, d: 'ASCO is preparing a new version. You’ll be notified when it’s ready.' }
      : { icon: 'receipt', tone: 'success', t: `Quotation v${q.v} is ready: ${X.usd(q.total)}`, d: `Valid until ${X.fmt(q.validUntil + 'T12:00', { date: true })}. Accept it or negotiate.`, href: 'quote.html', cta: 'Review quotation' };
    if (k === 4) { const bad = X.DOCS.filter(d => X.docStatus(s, d.k).status === 'fix').length;
      return bad ? { icon: 'file-warning', tone: 'danger', t: `${bad} document${bad > 1 ? 's' : ''} need${bad > 1 ? '' : 's'} a fix`, d: 'The AI check found a mismatch with your confirmed request. Fix and re-upload.', href: 'documents.html', cta: 'Fix documents' }
        : { icon: 'files', tone: 'warning', t: 'Next: shipper instruction and documents', d: 'Fill in the shipper instruction and upload the packing list and commercial invoice.', href: 'documents.html', cta: 'Open documents' }; }
    if (k === 5) return { icon: 'shield-check', tone: 'info', t: 'Documents submitted · ASCO is doing a final check', d: 'Execution starts as soon as ASCO approves.' };
    const iss = X.issues(s);
    if (k <= 8) return { icon: iss.length ? 'triangle-alert' : 'container', tone: iss.length ? 'warning' : 'info', t: `Execution started · ${X.dsid(s)}`, d: iss.length ? `${A.steps[iss[0].n].short}: ${iss[0].condition}. ${iss[0].notes}` : 'Nothing needed from you. Track each step here.', href: 'shipment.html?id=' + X.dsid(s), cta: 'Track shipment' };
    if (k === 9) return { icon: 'qr-code', tone: 'success', t: 'Delivered · proof of delivery ready', d: `Received by ${s.pod.receiver}, ${X.fmt(s.pod.at)}.`, href: '../pod.html?dsid=' + X.dsid(s), cta: 'View POD' };
    return { icon: 'circle-check', tone: 'success', t: 'Completed', d: 'Delivered and invoiced. Thank you for shipping with ASCO.', href: 'invoices.html', cta: 'View invoices' };
  }
  const nextHTML = (s) => { const n = next(s); if (!n) return '';
    return `<div class="banner ${n.tone === 'danger' ? 'danger' : n.tone === 'warning' ? 'warning' : n.tone === 'success' ? 'success' : 'info'}"><i data-lucide="${n.icon}"></i><div class="text"><b>${esc(n.t)}</b><br>${esc(n.d)}</div>${n.href ? `<a class="btn-primary" href="${n.href}">${esc(n.cta)}</a>` : ''}</div>`; };
  const reqCard = (s, editable) => `<section class="card"><div class="card-head"><i data-lucide="clipboard-list"></i><h3>Your request ${esc(s.req.id)}</h3><div class="right"><span class="caption">Sent ${X.fmt(s.req.at)}</span></div></div>
    <dl class="kv2">${X.FIELD_LABELS.map(([f, l]) => `<dt>${l}</dt><dd>${esc(X.fieldText(s.req.fields, f)) || '—'}</dd>`).join('')}</dl></section>`;
  const historyHTML = (s) => `<ul class="a-list">${s.events.filter(e => !e.internal && e.pub).slice().sort((a, b) => a.at < b.at ? 1 : -1).slice(0, 8).map(e => `<li><span class="icon-tile tone-neutral" style="width:28px;height:28px"><i data-lucide="history" style="width:14px;height:14px"></i></span>
    <div><div class="t" style="font-weight:400;font-size:13px">${esc(e.pub)}</div><div class="d">${X.fmt(e.at)}</div></div><span></span></li>`).join('')}</ul>`;

  /* ================================ Home ================================ */
  AscoPages['sender:index'] = function home() {
    const render = () => {
      const s = X.get();
      const body = wrap(`${s.req ? X.lifecycleHTML(s, { customer: true }) : ''}
        <section class="card" style="padding:24px"><h2 style="font-size:18px;font-weight:600;margin:0 0 4px">Welcome, Lina</h2>
          <p class="caption" style="margin:0 0 14px">Your requests go to ${esc(T.name)}. Prices come as confirmed quotations from ASCO.</p>
          <a class="composer" href="ask.html" style="min-height:64px;flex-direction:row;align-items:center;color:var(--muted)"><i data-lucide="sparkles" style="color:var(--primary)"></i><span style="flex:1">Describe a shipment, e.g. “${esc(A.example)}”</span><span class="btn-primary"><i data-lucide="plus"></i>New request</span></a></section>
        ${s.req ? nextHTML(s) : ''}
        <div class="a-grid">${s.req ? `<section class="card"><div class="card-head"><i data-lucide="container"></i><h3>${esc(X.dsid(s) || s.req.id)}</h3><div class="right">${tag(A.stagesCustomer[X.stage(s)], 'info')}</div></div>
            <dl class="kv2"><dt>Shipment</dt><dd>${esc(s.req.title)}</dd><dt>To</dt><dd>${esc(s.req.fields.consignee)}, ${esc(s.req.fields.consigneeLoc.split(',')[0])}</dd><dt>Departure</dt><dd>${esc(X.fieldText(s.req.fields, 'etd'))}</dd></dl>
            <a class="link-btn" href="${s.approval ? 'shipment.html?id=' + X.dsid(s) : 'request.html'}" style="margin-top:10px">Open<i data-lucide="arrow-right"></i></a></section>` : empty('package', 'No shipments yet', 'Send your first request to ASCO. You’ll get a confirmed quotation built from ASCO’s partner costing.', '<a class="btn-primary" href="ask.html"><i data-lucide="sparkles"></i>New request</a>')}
          <section class="card"><div class="card-head"><i data-lucide="inbox"></i><h3>Latest updates</h3><div class="right"><a class="link-btn" href="inbox.html">Inbox</a></div></div>
            ${s.notices.length ? `<ul class="a-list">${s.notices.slice().sort((a, b) => a.at < b.at ? 1 : -1).slice(0, 5).map(n => `<li><span class="icon-tile tone-${n.type === 'delay' ? 'warning' : n.type === 'quote' ? 'success' : 'info'}"><i data-lucide="${{ quote: 'receipt', doc: 'files', milestone: 'flag', delay: 'triangle-alert', invoice: 'receipt-text', sent: 'send' }[n.type] || 'bell'}"></i></span><div><div class="t">${esc(n.title)}</div><div class="d">${esc(n.meta || '')} · ${X.fmt(n.at)}</div></div><a class="link-btn" href="${n.href}">Open</a></li>`).join('')}</ul>` : '<p class="caption" style="margin:0">Nothing yet.</p>'}</section></div>`);
      X.frame({ rail: 'home', row: 'home', head: head('Home', esc(T.name)), body });
    };
    render(); onStore(render);
  };

  /* =================== Request intake: prompt + template =================== */
  AscoPages['sender:ask'] = function ask() {
    const s0 = X.get(), C = A.customer;
    let useTemplate = false, fields = null, prov = {}, sent = false, prompt = '';
    const PROV = { prompt: ['From your message', 'message-square', ''], ai: ['Suggested by AI', 'sparkles', 'ai'], profile: ['From your company profile', 'building-2', ''], edited: ['Edited by you', 'pencil', 'edited'], missing: ['Please complete', 'circle-alert', 'missing'] };
    function parse(t) {
      const f = {}, p = {}, set = (k, v, how) => { f[k] = v; p[k] = how; };
      const cbm = t.match(/(\d+(?:[.,]\d+)?)\s*cbm/i); if (cbm) set('cbm', cbm[1], 'prompt');
      const pol = /shanghai/i.test(t) ? 'Shanghai (CNSHA)' : /ningbo/i.test(t) ? 'Ningbo (CNNGB)' : /shenzhen/i.test(t) ? 'Shenzhen (CNSZX)' : null; if (pol) set('pol', pol, 'prompt');
      const pod = /jakarta|priok/i.test(t) ? 'Tanjung Priok, Jakarta (IDTPP)' : /surabaya/i.test(t) ? 'Tanjung Perak, Surabaya (IDSUB)' : null; if (pod) set('pod', pod, 'prompt');
      if (/bandung/i.test(t)) set('consigneeLoc', 'Bandung, West Java, Indonesia', 'prompt'); else if (pod) set('consigneeLoc', pod.split(' (')[0], 'ai');
      const ct = t.match(/(\d+)\s*[x×]\s*40\s*(?:ft)?\s*(hc|hq)?/i);
      if (ct) set('ctype', `${ct[1]} × 40ft${ct[2] ? ' HC' : ''}`, 'prompt'); else if (f.cbm) set('ctype', `${Math.max(1, Math.ceil(parseFloat(f.cbm) / 68))} × 40ft HC`, 'ai');
      const val = t.match(/(?:value|worth)[^\d]{0,12}(usd|us\$|\$|cny|rmb|idr)?\s*([\d.,]+)\s*(k|m)?/i);
      if (val) { let n = parseFloat(val[2].replace(/,/g, '')); if (/k/i.test(val[3] || '')) n *= 1000; if (/m/i.test(val[3] || '')) n *= 1e6;
        set('value', Math.round(n).toLocaleString('en-US'), 'prompt'); set('currency', /cny|rmb/i.test(val[1] || '') ? 'CNY' : /idr/i.test(val[1] || '') ? 'IDR' : 'USD', 'prompt'); }
      if (/electronic|tv|monitor/i.test(t)) set('hs', '8528.72', 'ai');
      const etd = /early\s+nov/i.test(t) ? '2026-11-02' : /mid[-\s]+nov/i.test(t) ? '2026-11-16' : /late\s+nov/i.test(t) ? '2026-11-23' : /dec/i.test(t) ? '2026-12-01' : null; if (etd) set('etd', etd, 'ai');
      set('pickup', 'No. 88 Jinqiao Road, Pudong, Shanghai', 'profile');
      if (/chan/i.test(t)) set('consignee', 'PT Chan Electronics', 'prompt');
      X.FIELD_LABELS.forEach(([k]) => { if (!f[k]) { f[k] = ''; p[k] = 'missing'; } });
      if (!f.currency) f.currency = 'USD';
      return { f, p };
    }
    const missing = () => X.FIELD_LABELS.filter(([k]) => !String(fields[k] || '').trim()).map(([k]) => k);
    const SUGGEST = { eta: ['2026-11-12', 'About 10 days after departure for this lane: Thu 12 Nov'], consignee: ['PT Chan Electronics', 'Your consignee in Bandung on file'], ctype: ['3 × 40ft HC', '200 CBM fits 3 × 40ft HC'], hs: ['8528.72', 'LED TVs and monitors'] };
    const fieldHTML = (k, l) => {
      const p = prov[k] || 'missing', miss = !String(fields[k] || '').trim();
      const type = k === 'etd' || k === 'eta' ? 'date' : 'text';
      const input = k === 'value' ? `<div style="display:flex;gap:6px"><select class="select" data-f="currency" style="height:34px">${['USD', 'CNY', 'IDR'].map(c => `<option ${fields.currency === c ? 'selected' : ''}>${c}</option>`).join('')}</select><input class="in${miss ? ' missing' : ''}" data-f="value" value="${esc(fields.value)}" placeholder="e.g. 480,000"></div>`
        : `<input class="in${miss ? ' missing' : ''}" data-f="${k}" type="${type}" value="${esc(fields[k] || '')}" placeholder="${miss ? 'Please complete' : ''}">`;
      const sug = miss && SUGGEST[k] ? `<button class="link-btn" data-sug="${k}" style="justify-content:flex-start"><i data-lucide="sparkles"></i>Use: ${esc(SUGGEST[k][1])}</button>` : '';
      return `<label class="lbl"><span>${l} <span class="prov ${miss ? 'missing' : PROV[p][2]}" title="${miss ? PROV.missing[0] : PROV[p][0]}"><i data-lucide="${miss ? PROV.missing[1] : PROV[p][1]}"></i>${miss ? 'Missing' : ''}</span></span>${input}${sug}</label>`;
    };
    const policy = () => X.get().settings.estimatePolicy;
    const cardHTML = () => {
      const m = missing();
      const pol = policy();
      const price = pol === 'confirmed' ? `<span class="caption" style="display:flex;gap:6px;align-items:center"><i data-lucide="badge-check" style="width:13px;height:13px"></i>No instant price: ASCO sends a confirmed quotation built from its partners’ costing.</span>`
        : pol === 'instant' ? `<span class="caption">Indicative estimate: <b style="font-weight:600;color:var(--ink)">US$8,900–10,400</b> door to door. Not a quote.</span>` : '<span class="caption">An estimate appears after ASCO reviews your request.</span>';
      return `<section class="card"><div class="card-head"><i data-lucide="clipboard-list"></i><h3>Operation request</h3><div class="right">${prompt ? '<span class="ai-label"><i data-lucide="sparkles"></i>Filled by AI from your message</span>' : ''}${m.length ? tag(`${m.length} to complete`, 'warning') : tag('Complete', 'success', 'check')}</div></div>
        <div class="grid3">${X.FIELD_LABELS.map(([k, l]) => fieldHTML(k, l)).join('')}</div>
        <div style="display:flex;align-items:center;gap:12px;margin-top:16px;padding-top:14px;border-top:1px solid var(--divider)"><div style="flex:1">${price}</div>
          <button class="btn-primary" data-act="send" ${m.length ? 'disabled title="Complete the highlighted fields first"' : ''}><i data-lucide="send"></i>Send request to ASCO</button></div></section>`;
    };
    const render = () => {
      const s = X.get();
      if (sent) {
        X.frame({ rail: 'ask', row: 'ask', head: head('New request', esc(T.name)), body: wrap(`${X.lifecycleHTML(s, { customer: true })}
          <div class="banner success"><i data-lucide="circle-check"></i><div class="text"><b>Request ${esc(s.req.id)} sent to ASCO.</b><br>ASCO is collecting partner costing. You’ll get a quotation by email and here.</div><a class="btn-primary" href="request.html">View request</a></div>${reqCard(s)}`) });
        return;
      }
      const body = wrap(`${s0.req ? `<div class="banner info"><i data-lucide="info"></i><div class="text">You already have request <b>${esc(s0.req.id)}</b> (${esc(A.stagesCustomer[X.stage(s0)])}). In this demo, sending a new request replaces it.</div><a class="btn-secondary" href="request.html">Open it</a></div>` : ''}
        <form class="composer" data-composer id="cmp"><textarea rows="2" placeholder="Describe your shipment: what, how much, from where to where, when, and its value">${esc(prompt)}</textarea>
          <div class="composer-actions"><div class="left"><label class="switch"><input type="checkbox" id="tpl" ${useTemplate ? 'checked' : ''}>Use template</label></div>
            <button class="send-btn" type="submit" title="Let AI fill the request" ${prompt ? '' : 'disabled'}><i data-lucide="arrow-up"></i></button></div></form>
        <div class="chips"><button class="pill" data-ex><i data-lucide="ship"></i>${esc(A.example)}</button></div>
        ${fields ? cardHTML() : `<p class="caption" style="margin:0;display:flex;gap:6px;align-items:center"><i data-lucide="lock" style="width:13px;height:13px"></i>Your request goes to ${esc(T.name)} only.</p>`}`);
      X.frame({ rail: 'ask', row: 'ask', head: head('New request', esc(T.name)), body });
      const f = $('#cmp');
      if (f && !f.dataset.bound) { f.dataset.bound = 1; LM.bindComposer(f, (text) => { prompt = text; fill(text, true); }); }
    };
    function fill(text, animate) {
      const r = parse(text);
      fields = Object.assign({}, r.f); prov = r.p;
      if (animate) {
        $('#aContent .a-wrap').insertAdjacentHTML('beforeend', `<div class="thinking" id="think"><span class="step"><i data-lucide="loader" class="spin"></i>Reading your message…</span></div>`); icons();
        setTimeout(() => { render(); const el = $('#aContent .card'); if (el) el.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); }, 700);
      } else render();
    }
    render();
    document.addEventListener('click', e => {
      if (e.target.closest('[data-ex]')) { prompt = A.example; fill(prompt, true); return; }
      const sg = e.target.closest('[data-sug]'); if (sg) { fields[sg.dataset.sug] = SUGGEST[sg.dataset.sug][0]; prov[sg.dataset.sug] = 'ai'; render(); return; }
      if (e.target.closest('[data-act="send"]') && !ro) {
        X.save(st => { const keep = st.settings; Object.keys(st).forEach(k => delete st[k]); Object.assign(st, { settings: keep, events: [], notices: [], emails: [] }); X.aSubmit(st, { prompt: prompt || '(Filled in with the template)', fields: { ...fields } }, X.at('request')); });
        sent = true; render(); toast('Request sent to ASCO', { note: NOTE });
      }
    });
    document.addEventListener('input', e => { if (e.target.matches('#cmp textarea')) prompt = e.target.value; });
    document.addEventListener('change', e => {
      if (e.target.id === 'tpl') { useTemplate = e.target.checked; if (useTemplate && !fields) { const r = parse(prompt || ''); fields = r.f; prov = r.p; } if (!useTemplate && !prompt) fields = null; render(); }
      const k = e.target.dataset && e.target.dataset.f;
      if (k) { fields[k] = e.target.value; prov[k] = e.target.value ? 'edited' : 'missing'; render(); }
    });
  };

  /* ============================== Requests ============================== */
  AscoPages['sender:requests'] = function requests() {
    const s = X.get();
    const body = wrap(s.req ? `<section class="card flush"><table class="table" style="margin-top:4px"><thead><tr><th>Request</th><th>Shipment</th><th>Sent</th><th>Status</th><th></th></tr></thead><tbody>
      <tr><td class="num">${esc(s.req.id)}${X.dsid(s) ? `<div class="sub">${esc(X.dsid(s))}</div>` : ''}</td><td>${esc(s.req.title)}</td><td>${X.fmt(s.req.at)}</td><td>${tag(A.stagesCustomer[X.stage(s)], 'info')}</td><td><a class="btn-secondary" href="request.html">Open</a></td></tr></tbody></table></section>`
      : empty('file-text', 'No requests yet', 'Your requests to ASCO appear here.', '<a class="btn-primary" href="ask.html"><i data-lucide="sparkles"></i>New request</a>'));
    X.frame({ rail: 'requests', row: 'requests', head: head('My requests', esc(T.name)), body });
  };

  /* =============================== Request =============================== */
  AscoPages['sender:request'] = function request() {
    const render = () => {
      const s = X.get();
      const body = wrap(!s.req ? empty('file-text', 'No request yet', 'Send a request to ASCO from Ask.', '<a class="btn-primary" href="ask.html"><i data-lucide="sparkles"></i>New request</a>')
        : `${X.lifecycleHTML(s, { customer: true })}${nextHTML(s)}
          <div class="a-grid"><div class="a-col">${reqCard(s)}${s.approval ? `<section class="card"><div class="card-head"><i data-lucide="fingerprint"></i><h3>Digital Shipment ID</h3></div>${X.dsidHTML(X.dsid(s))}<p class="caption" style="margin:8px 0 0">Quote it in any message about this shipment.</p></section>` : ''}</div>
          <div class="a-col">${(s.quotes || []).some(q => q.sentAt) ? `<section class="card"><div class="card-head"><i data-lucide="receipt"></i><h3>Quotation versions</h3><div class="right"><a class="link-btn" href="quote.html">Open</a></div></div>${X.versionsHTML(s)}</section>` : ''}
            <section class="card"><div class="card-head"><i data-lucide="history"></i><h3>History</h3></div>${historyHTML(s)}</section></div></div>`);
      X.frame({ rail: 'requests', row: 'requests', head: head(s.req ? s.req.id : 'Request', s.req ? esc(s.req.title) : ''), body });
    };
    render(); onStore(render);
  };

  /* ============================== Quotation ============================== */
  AscoPages['sender:quote'] = function quote() {
    let showV = +new URLSearchParams(location.search).get('v') || null;
    if (!ro) X.save(st => { const q = X.latestSent(st); if (q && !q.viewedAt) { q.viewedAt = X.when('quote1'); } });
    const render = () => {
      const s = X.get(), q = X.latestSent(s), list = (s.quotes || []).filter(x => x.sentAt), shown = (showV && list.find(x => x.v === showV)) || q;
      let action = '';
      if (q) {
        if (q.status === 'accepted') action = `<div class="banner success"><i data-lucide="circle-check"></i><div class="text"><b>You accepted version ${q.v}</b> on ${X.fmt(q.acceptedAt)}. Next: shipper instruction and documents.</div><a class="btn-primary" href="documents.html">Documents</a></div>`;
        else if (q.status === 'negotiated') action = `<div class="banner info"><i data-lucide="messages-square"></i><div class="text"><b>You asked for changes on version ${q.v}</b> (${X.fmt(q.negotiation.at)})${q.negotiation.target ? `, target ${X.usd(q.negotiation.target)}` : ''}. ASCO is preparing a new version.</div></div>`;
        else action = `<section class="card" style="border-color:var(--primary)"><div class="card-head"><i data-lucide="receipt"></i><h3>Version ${q.v} · ${X.usd(q.total)}</h3><div class="right"><span class="caption">Valid until ${X.fmt(q.validUntil + 'T12:00', { date: true })}</span></div></div>
          <p class="caption" style="margin:0 0 12px">Accepting confirms this version. To ask for a different price or terms, negotiate: ASCO replies with a new version.</p>
          <div style="display:flex;gap:8px;justify-content:flex-end"><button class="btn-secondary" data-act="neg"><i data-lucide="messages-square"></i>Negotiate</button><button class="btn-primary" data-act="accept"><i data-lucide="check"></i>Accept v${q.v}</button></div></section>`;
      }
      const body = wrap(!q ? `${s.req ? X.lifecycleHTML(s, { customer: true }) : ''}${empty('receipt', 'No quotation yet', s.req ? 'ASCO is collecting partner costing. You’ll get a quotation by email and here.' : 'Send a request first.', '')}`
        : `${X.lifecycleHTML(s, { customer: true })}<div class="a-grid"><div class="a-col">${X.quoteDocHTML(s, shown)}</div><div class="a-col">${action}
          <section class="card"><div class="card-head"><i data-lucide="history"></i><h3>Versions</h3></div>${X.versionsHTML(s)}
            ${list.length > 1 ? `<div class="chips" style="margin-top:10px">${list.map(x => `<button class="pill${x === shown ? ' selected' : ''}" data-v="${x.v}">View v${x.v}</button>`).join('')}</div>` : ''}</section></div></div>`);
      X.frame({ rail: 'requests', row: 'requests', head: head(q ? `Quotation ${A.quoteNo}` : 'Quotation', q ? `v${shown.v} · ${esc(T.name)}` : ''), body });
    };
    render(); onStore(render);
    document.addEventListener('click', e => {
      const b = e.target.closest('[data-act], [data-v]'); if (!b) return;
      if (b.dataset.v) { showV = +b.dataset.v; render(); return; }
      if (ro) return;
      const s = X.get(), q = X.latestSent(s);
      if (b.dataset.act === 'accept') {
        const m = X.openModal(`<div class="modal-head"><i data-lucide="check"></i><h2>Accept version ${q.v}?</h2><button class="icon-btn" data-close><i data-lucide="x"></i></button></div>
          <div class="modal-body"><p style="margin:0">You confirm <b>${X.usd(q.total)}</b> for ${esc(s.req.title)}. Payment terms: ${A.customer.terms.downPayment}% down payment when execution starts, balance after proof of delivery.</p></div>
          <div class="modal-foot"><button class="btn-secondary" data-close>Back</button><button class="btn-primary" id="goAcc"><i data-lucide="check"></i>Accept</button></div>`);
        m.querySelector('#goAcc').addEventListener('click', () => { X.save(st => X.aAccept(st, X.when('accept'))); X.closeModal(); render(); toast('Accepted. Next: documents', { note: NOTE }); });
      }
      if (b.dataset.act === 'neg') {
        const m = X.openModal(`<div class="modal-head"><i data-lucide="messages-square"></i><h2>Negotiate version ${q.v}</h2><button class="icon-btn" data-close><i data-lucide="x"></i></button></div>
          <div class="modal-body"><label class="lbl"><span>Message to ASCO</span><textarea class="ta2" id="nt" placeholder="What would you like changed?"></textarea></label>
            <label class="lbl"><span>Target price (optional, USD)</span><input class="in" id="np" type="number" min="0" step="50" placeholder="e.g. 9300"></label>
            <div class="chips"><button class="pill" data-nt="We have a competing offer around US$9,300 door to door. Can you get closer, and keep the price valid until early November?" data-np="9300">Competing offer ~US$9,300</button><button class="pill" data-nt="Can you extend the validity by one week?">Extend validity</button></div></div>
          <div class="modal-foot"><button class="btn-secondary" data-close>Cancel</button><button class="btn-primary" id="goNeg" disabled><i data-lucide="send"></i>Send to ASCO</button></div>`);
        const t = m.querySelector('#nt'), go = m.querySelector('#goNeg');
        t.addEventListener('input', () => { go.disabled = !t.value.trim(); });
        m.querySelectorAll('[data-nt]').forEach(x => x.addEventListener('click', () => { t.value = x.dataset.nt; if (x.dataset.np) m.querySelector('#np').value = x.dataset.np; go.disabled = false; }));
        go.addEventListener('click', () => { X.save(st => X.aNegotiate(st, { text: t.value.trim(), target: +m.querySelector('#np').value || null }, X.when('negotiate'))); X.closeModal(); render(); toast('Sent to ASCO. They’ll reply with a new version', { note: NOTE }); });
      }
    });
  };

  /* ============================== Documents ============================== */
  AscoPages['sender:documents'] = function documents() {
    const render = () => {
      const s = X.get(), q = X.accepted(s), ready = X.docsReady(s), done = s.docs && s.docs.submittedAt;
      const body = wrap(!q ? `${s.req ? X.lifecycleHTML(s, { customer: true }) : ''}${empty('files', 'Documents open after you accept a quotation', 'Then you fill in the shipper instruction and upload the packing list and commercial invoice. The AI checks them against your confirmed request.', '')}`
        : `${X.lifecycleHTML(s, { customer: true })}
          ${done ? `<div class="banner success"><i data-lucide="circle-check"></i><div class="text"><b>Documents submitted ${X.fmt(s.docs.submittedAt)}.</b> ${s.approval ? `ASCO approved them. Your shipment is ${esc(X.dsid(s))}.` : 'ASCO is doing a final check.'}</div></div>` : ''}
          <section class="card"><div class="card-head"><i data-lucide="files"></i><h3>Documents for ${esc(s.req.id)}</h3><div class="right"><span class="ai-label"><i data-lucide="scan-search"></i>AI Document Agent checks completeness and content</span></div></div>
            ${X.docsHTML(s, 'portal')}
            ${done ? '' : `<div style="display:flex;align-items:center;gap:12px;margin-top:6px;padding-top:14px;border-top:1px solid var(--divider)"><span class="caption" style="flex:1">${ready ? 'All checks pass. Submit to ASCO for approval.' : 'Submit unlocks when every required document passes the AI check.'}</span>
              <button class="btn-primary" data-act="submit" ${ready ? '' : 'disabled'}><i data-lucide="send"></i>Submit documents</button></div>`}</section>`);
      X.frame({ rail: 'documents', row: '', head: head('Documents', s.req ? esc(s.req.id) : ''), body });
    };
    render(); onStore(render);
    const siForm = () => {
      const s = X.get(), d = (s.docs && s.docs.si && s.docs.si.data) || { ...A.si, consignee: `${s.req.fields.consignee}, ${s.req.fields.consigneeLoc}`, volume: `${s.req.fields.cbm} CBM`, hs: s.req.fields.hs };
      const F = [['shipper', 'Shipper'], ['consignee', 'Consignee'], ['notify', 'Notify party'], ['pol', 'Port of loading'], ['pod', 'Port of discharge'], ['desc', 'Cargo description'], ['hs', 'HS code'], ['packages', 'Packages'], ['gross', 'Gross weight'], ['volume', 'Volume'], ['marks', 'Marks and numbers'], ['incoterm', 'Incoterm']];
      const m = X.openModal(`<div class="modal-head"><i data-lucide="clipboard-pen-line"></i><h2>Shipper instruction</h2><button class="icon-btn" data-close><i data-lucide="x"></i></button></div>
        <div class="modal-body"><span class="ai-label"><i data-lucide="sparkles"></i>Pre-filled from your confirmed request and profile. Check each field.</span>
          <div class="grid2">${F.map(([k, l]) => `<label class="lbl"><span>${l}</span><input class="in" data-si-f="${k}" value="${esc(d[k] || '')}"></label>`).join('')}</div>
          <div class="lbl"><span>Dangerous goods?</span><div style="display:flex;gap:16px">${['No', 'Yes'].map(v => `<label style="display:flex;gap:6px;align-items:center"><input type="radio" class="radio" name="dg" value="${v}" ${d.dg === v ? 'checked' : ''}>${v}</label>`).join('')}</div>
            <span class="caption">If Yes, an MSDS becomes required.</span></div></div>
        <div class="modal-foot"><button class="btn-secondary" data-close>Cancel</button><button class="btn-primary" id="goSi"><i data-lucide="save"></i>Save</button></div>`, true);
      m.querySelector('#goSi').addEventListener('click', () => {
        const data = {}; m.querySelectorAll('[data-si-f]').forEach(i => { data[i.dataset.siF] = i.value; }); data.dg = (m.querySelector('input[name=dg]:checked') || {}).value || 'No';
        X.save(st => X.aSaveSI(st, data, X.when('si'))); X.closeModal(); render(); toast('Shipper instruction saved');
      });
    };
    const upload = (k) => {
      const name = X.DOCS.find(d => d.k === k).name, s = X.get(), again = s.docs && s.docs[k];
      const m = X.openModal(`<div class="modal-head"><i data-lucide="upload"></i><h2>${again ? 'Upload corrected file' : 'Upload ' + esc(name.toLowerCase())}</h2><button class="icon-btn" data-close><i data-lucide="x"></i></button></div>
        <div class="modal-body"><label style="display:flex;flex-direction:column;align-items:center;gap:8px;padding:28px;border:1.5px dashed var(--border);border-radius:12px;background:var(--row-hover);text-align:center;cursor:pointer">
            <i data-lucide="file-up" style="width:24px;height:24px;color:var(--muted)"></i><b style="font-weight:500">Choose a PDF or photo</b><span class="caption">The AI checks it against your confirmed request before ASCO sees it.</span><input type="file" hidden accept=".pdf,image/*"></label>
          <button class="btn-secondary" data-sample style="align-self:center"><i data-lucide="file-text"></i>${again ? 'Upload corrected file (demo)' : 'Use the demo file'}</button></div>`);
      const run = () => {
        X.closeModal();
        const row = $(`[data-upload="${k}"]`); if (row) row.closest('li').querySelector('.acts').innerHTML = `<span class="tag info"><i data-lucide="loader" class="spin"></i>Checking…</span>`; icons();
        setTimeout(() => { X.save(st => X.aUpload(st, k, again ? X.when('upload2') : X.when('upload1'))); render(); const r = X.docStatus(X.get(), k);
          toast(r.status === 'ready' ? `${name}: check passed` : `${name}: mismatch found`, { note: r.status === 'ready' ? '' : 'Fix and re-upload' }); }, 1000);
      };
      m.querySelector('[data-sample]').addEventListener('click', run);
      m.querySelector('input[type=file]').addEventListener('change', run);
    };
    document.addEventListener('click', e => {
      if (ro) return;
      if (e.target.closest('[data-si]')) siForm();
      const u = e.target.closest('[data-upload]'); if (u) upload(u.dataset.upload);
      if (e.target.closest('[data-act="submit"]')) { X.save(st => X.aSubmitDocs(st, X.when('submit'))); render(); toast('Documents submitted to ASCO', { note: NOTE }); }
    });
  };

  /* =================== Shipment tracking (keyed by DSID) =================== */
  AscoPages['sender:shipment'] = function shipment() {
    const render = () => {
      const s = X.get(), id = new URLSearchParams(location.search).get('id');
      if (s.approval && id !== X.dsid(s) && id) { X.frame({ rail: 'shipments', row: 'shipment', head: head('Shipment', ''), body: wrap(empty('search-x', 'Shipment not found', 'It may belong to another account, or the link is out of date.', '<a class="btn-secondary" href="index.html">Back to Home</a>')) }); return; }
      if (!s.approval) { X.frame({ rail: 'shipments', row: 'shipment', head: head('Shipments', esc(T.name)), body: wrap(`${s.req ? X.lifecycleHTML(s, { customer: true }) : ''}${empty('container', 'No shipment in execution yet', 'Your shipment gets its Digital Shipment ID when ASCO approves your documents.', s.req ? '<a class="btn-secondary" href="request.html">Open your request</a>' : '')}`) }); return; }
      const st = s.steps || {};
      const at = st[6] ? 2 : st[5] ? 1 : st[4] ? 1 : st[3] ? 0 : 0, progress = st[6] ? 0 : st[5] ? 0.9 : st[4] ? 0.1 : st[3] ? 0.6 : st[1] ? 0.05 : 0;
      const route = Portal.routeLine({ nodes: ['Shanghai (your warehouse)', 'Tanjung Priok', 'Bandung'], legs: ['ship', 'truck'], at, progress }, { hereIcon: st[3] && !st[4] ? 'ship' : 'navigation' }).replace('Transshipment', 'Port of discharge');
      const iss = X.issues(s), bl = s.bl || {};
      const body = wrap(`${X.lifecycleHTML(s, { customer: true })}
        ${iss.map(x => `<div class="banner warning"><i data-lucide="triangle-alert"></i><div class="text"><b>${esc(A.steps[x.n].short)}: ${esc(x.condition)}${x.late ? ' · later than planned' : ''}</b><br>${esc(x.notes)} ASCO is following up.</div></div>`).join('')}
        <section class="card">${route}</section>
        <div class="a-grid"><section class="card"><div class="card-head"><i data-lucide="list-ordered"></i><h3>Steps</h3><div class="right"><span class="caption">Condition of your goods at each step</span></div></div>${X.stepsHTML(s, 'portal')}</section>
          <div class="a-col"><section class="card"><div class="card-head"><i data-lucide="folder-check"></i><h3>Documents</h3></div><ul class="cl">
              <li><span class="icon-tile tone-success"><i data-lucide="file-check-2"></i></span><div><div class="t">Your documents ${tag('Validated', 'success')}</div><div class="d">Shipper instruction, packing list, commercial invoice</div></div><a class="link-btn" href="documents.html">View</a></li>
              <li><span class="icon-tile tone-${bl.received ? 'success' : 'neutral'}"><i data-lucide="file-text"></i></span><div><div class="t">Bill of lading ${bl.received ? tag('Received', 'success') : tag(st[3] ? 'Being prepared' : 'After loading', 'neutral')}</div><div class="d">${bl.received ? `B/L ${esc(bl.received.no)} · ${X.fmt(bl.received.at)}` : 'Issued after loading on the vessel'}</div></div><span></span></li>
              <li><span class="icon-tile tone-${s.pod ? 'success' : 'neutral'}"><i data-lucide="qr-code"></i></span><div><div class="t">Proof of delivery ${s.pod ? tag('Signed', 'success') : tag('At delivery', 'neutral')}</div><div class="d">${s.pod ? `Received by ${esc(s.pod.receiver)} · ${X.fmt(s.pod.at)}` : 'Digital, with signature, photos and QR'}</div></div>${s.pod ? `<a class="btn-secondary" href="../pod.html?dsid=${X.dsid(s)}"><i data-lucide="qr-code"></i>View POD</a>` : '<span></span>'}</li></ul></section>
            <section class="card"><div class="card-head"><i data-lucide="receipt-text"></i><h3>Invoices</h3><div class="right"><a class="link-btn" href="invoices.html">Open</a></div></div>
              <dl class="kv2"><dt>Down payment</dt><dd>${X.usd(s.invoices.dp.amount)} · ${esc(s.invoices.dp.no)}</dd><dt>Balance</dt><dd>${s.invoices.bal && s.invoices.bal.issuedAt ? `${X.usd(s.invoices.bal.amount)} · ${esc(s.invoices.bal.no)}` : 'After proof of delivery'}</dd></dl></section></div></div>`);
      X.frame({ rail: 'shipments', row: 'shipment', head: `<div class="a-title"><h1>Shipment</h1>${X.dsidHTML(X.dsid(s))}<span class="caption">${esc(s.req.title)}</span></div>`, body });
    };
    render(); onStore(render);
  };

  /* ================================ Inbox ================================ */
  AscoPages['sender:inbox'] = function inbox() {
    const s = X.get(), list = s.notices.slice().sort((a, b) => a.at < b.at ? 1 : -1);
    if (!ro && list.length) X.save(st => { st.readAt = list[0].at; });
    const icon = { quote: ['receipt', 'success'], doc: ['files', 'warning'], milestone: ['flag', 'info'], delay: ['triangle-alert', 'warning'], invoice: ['receipt-text', 'info'], sent: ['send', 'neutral'] };
    const body = wrap(list.length ? `<section class="card"><ul class="a-list">${list.map(n => `<li><span class="icon-tile tone-${(icon[n.type] || icon.sent)[1]}"><i data-lucide="${(icon[n.type] || icon.sent)[0]}"></i></span>
      <div><div class="t">${esc(n.title)}</div><div class="d">${esc(n.meta || '')} · ${X.fmt(n.at)} · also sent to ${esc(A.customer.email)} and WhatsApp</div></div><a class="btn-secondary" href="${n.href}">Open</a></li>`).join('')}</ul></section>`
      : empty('inbox', 'No notifications yet', 'Quotations, document checks, step updates and invoices from ASCO appear here.', ''));
    X.frame({ rail: 'home', row: 'inbox', head: head('Inbox', esc(T.name)), body });
  };

  /* =============================== Invoices =============================== */
  AscoPages['sender:invoices'] = function invoices() {
    const s = X.get(), I = s.invoices, q = X.accepted(s);
    const doc = (inv, label, due) => `<div class="qdoc" style="--brand:${T.brand}"><div class="qdoc-top"><span class="qdoc-logo">${T.initials}</span><div><div class="qdoc-name">${esc(T.name)}</div><div class="qdoc-url">${T.portal}</div></div>
        <div class="qdoc-no"><b class="num">Invoice ${esc(inv.no)}</b>Issued ${X.fmt(inv.issuedAt, { date: true })}</div></div>
      <div class="qdoc-body"><div class="qdoc-meta"><div><span>Bill to</span> <b>${esc(A.customer.name)}</b></div><div><span>Shipment</span> <b>${esc(X.dsid(s))}</b></div><div><span>Quotation</span> <b>${esc(q.id)}</b></div><div><span>Due</span> <b>${esc(due)}</b></div></div>
        <table class="qdoc-lines"><tr><td>${esc(label)}</td><td>${X.usd(inv.amount)}</td></tr><tr class="total"><td>Amount due ${tag('Unpaid', 'warning')}</td><td>${X.usd(inv.amount)}</td></tr></table>
        <div class="qdoc-terms">Payment terms for ${esc(A.customer.name)}: ${A.customer.terms.downPayment}% down payment at approval, balance after proof of delivery (payment after POD: No). Bank transfer in USD.</div></div>
      <div class="qdoc-foot">Powered by LogiMind</div></div>`;
    const body = wrap(!I ? empty('receipt-text', 'No invoices yet', `Your first invoice is the ${A.customer.terms.downPayment}% down payment, issued when ASCO starts execution.`, '')
      : `<div class="a-grid"><div class="a-col"><div class="caption">Down payment</div>${doc(I.dp, `Down payment ${I.dp.pct}% of quotation ${q.id} (${X.usd(q.total)})`, 'Before pickup')}<button class="btn-secondary" data-mail="dp" style="align-self:flex-start"><i data-lucide="mail"></i>Email copy</button></div>
        <div class="a-col"><div class="caption">Balance</div>${I.bal && I.bal.issuedAt ? `${doc(I.bal, `Balance after proof of delivery (${X.usd(q.total)} less down payment ${X.usd(I.dp.amount)})`, '14 days after POD')}<button class="btn-secondary" data-mail="bal" style="align-self:flex-start"><i data-lucide="mail"></i>Email copy</button>`
          : empty('hourglass', 'Balance invoice after delivery', `${X.usd(q.total - I.dp.amount)} is invoiced once the consignee signs the proof of delivery.`, '')}</div></div>`);
    X.frame({ rail: 'invoices', row: 'invoices', head: head('Invoices', esc(T.name)), body });
    document.addEventListener('click', e => { const b = e.target.closest('[data-mail]'); if (b) X.openModal(`<div class="modal-head"><i data-lucide="mail"></i><h2>Email</h2><button class="icon-btn" data-close><i data-lucide="x"></i></button></div><div class="modal-body">${X.mailHTML(X.customerMail(b.dataset.mail, X.get()))}<div class="mail-sent"><i data-lucide="check"></i>Sent to ${esc(A.customer.email)}</div></div>`, true); });
  };
})();
