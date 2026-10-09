/* ==========================================================================
   LogiMind prototype — ASCO staff pages (PIC Andi Pratama), after asco.js.
   Each entry renders one shared page file for ASCO accounts. Staff see
   partner names, costs and margins; none of that is sent to the shipper.
   ========================================================================== */
window.AscoPages = window.AscoPages || {};
(() => {
  if (!Asco.ctx.staff) return;
  const { $, $$, esc, tag, icons, toast, data: D } = LM;
  const X = Asco, A = X.A;
  const me = LM.account;
  const head = (title, sub, right) => `<div class="a-title"><h1 class="num">${esc(title)}</h1>${sub ? `<span class="caption">${sub}</span>` : ''}</div><div class="right">${right || ''}</div>`;
  const wrap = (html) => `<div class="a-wrap">${html}</div>`;
  const viewAs = (path, label) => `<a class="btn-secondary" href="${path}${path.includes('?') ? '&' : '?'}viewas=lina"><i data-lucide="eye"></i>${label || 'View as customer'}</a>`;
  const internal = '<span class="internal-tag"><i data-lucide="lock"></i>Internal only</span>';
  const onStore = (fn) => window.addEventListener('storage', e => { if (e.key === 'lm.db') fn(); });
  const partnerLink = (pid, kind) => X.P(kind === 'rfq' ? `partner/rfq-reply.html?token=rfq-${pid}` : kind === 'inv' ? `partner/invoice.html?token=inv-${pid}` : pid === 'jaya' ? 'partner/job.html?dsid=' + X.dsid(X.get()) : `partner/job.html?token=job-${pid}`);
  const emptyCard = (icon, title, body, action) => `<section class="card"><div class="empty" style="height:auto;padding:40px 16px"><div class="empty-tile"><i data-lucide="${icon}"></i></div>
    <h2 class="empty-title">${title}</h2><p class="empty-body">${body}</p>${action || ''}</div></section>`;
  const noRequest = () => emptyCard('inbox', 'No request from ABC Electronics yet', 'Sign in as Lina Zhou and send one from <b>Ask</b>, or use <b>Demo: jump to stage</b> above to fill the flow with realistic data.',
    `<a class="btn-secondary" href="${X.P('login.html')}"><i data-lucide="repeat"></i>Switch to Lina</a>`);
  function lastEvents(s, n) {
    return `<ul class="a-list">${s.events.slice().sort((a, b) => a.at < b.at ? 1 : -1).slice(0, n).map(e => `<li><span class="icon-tile tone-neutral" style="width:28px;height:28px"><i data-lucide="history" style="width:14px;height:14px"></i></span>
      <div><div class="t" style="font-weight:400;font-size:13px">${esc(e.text)}</div><div class="d">${esc(e.role)} · ${X.fmt(e.at)}</div></div><span></span></li>`).join('')}</ul>`;
  }

  /* ---------- AI delivery plan: 7 steps in 2 core-partner legs ---------- */
  function planHTML(s) {
    const st = (n) => X.stepState(s, n);
    const stepBox = (n) => `<div class="lane-step ${{ done: 'done', warn: 'warn', cur: 'cur' }[st(n)] || ''}"><span class="sn"><i data-lucide="${A.steps[n].icon}"></i>Step ${n}</span><b>${esc(A.steps[n].t)}</b>
      ${s.steps && s.steps[n] ? X.condTag(s.steps[n].condition) : ''}</div>`;
    const steps = (list) => list.map((n, i) => `${i ? '<span class="lane-arrow"><i data-lucide="arrow-right"></i></span>' : ''}${stepBox(n)}`).join('');
    const rows = (leg) => X.partnersOn(leg).map(pid => {
      const P = A.partners[pid], r = s.rfq && s.rfq.replies[pid], sel = s.approval && X.poFor(s, pid);
      const right = sel ? tag('Selected · ' + X.poFor(s, pid).no, 'success', 'badge-check')
        : r ? `<span class="amt">${X.cur(r.amount, r.currency)}</span><div class="x">≈ ${X.usd(X.toUSD(r.amount, r.currency))} · ${r.transit} days</div>`
        : s.rfq ? tag('Waiting for reply', 'neutral', 'hourglass') : `<span class="x">${P.mode === 'account' ? 'LogiMind account' : 'Magic link'}</span>`;
      return `<div class="cp-row">${LM.orgAvatar(pid)}<div><div class="n">${esc(X.pname(pid))} ${tag('Core partner', 'neutral')}</div>
        <div class="x">${esc(P.city)}, ${esc(P.country)} · ${X.stars(P.stars)} · <span class="ontime">${P.onTime}% on time</span></div></div><div class="c">${right}</div></div>`;
    }).join('');
    const lane = (leg) => `<div class="lane"><div class="lane-head"><i data-lucide="${leg === 'origin' ? 'plane-takeoff' : 'plane-landing'}" style="width:15px;height:15px;color:var(--muted)"></i>
        <b>${A.legs[leg].label}</b><span class="caption">${A.legs[leg].city} core partner · ${A.legs[leg].country}</span>
        <span class="right">${s.approval ? `<span class="caption">${esc(X.pname(X.accepted(s).sel[leg]))}</span>` : ''}</span></div>
      <div class="lane-steps">${steps(A.legs[leg].steps)}</div>
      <div class="lane-partners">${rows(leg)}</div></div>`;
    return `<section class="card plan" style="background:var(--primary-soft);border-color:transparent">
      <div class="card-head"><span class="ai-label"><i data-lucide="sparkles"></i>AI delivery plan</span><h3>7 steps in 2 core-partner legs</h3>
        <div class="right"><span class="caption">Partners from your network · agent type Core partner</span></div></div>
      <div class="lanes">${lane('origin')}${lane('dest')}
        <div class="lane system"><div class="lane-head"><i data-lucide="cpu" style="width:15px;height:15px;color:var(--primary)"></i><b>System</b><span class="caption">LogiMind</span></div>
          <div class="lane-steps">${stepBox(7)}<div style="flex:3 1 0;padding:10px 14px;font-size:12.5px;color:var(--muted);align-self:center">Signature, photos, QR code and the full audit trail are compiled automatically when the destination partner’s driver captures the delivery.</div></div></div>
      </div></section>`;
  }

  function customerCard() {
    const C = A.customer;
    return `<section class="card"><div class="card-head"><i data-lucide="building-2"></i><h3>Customer and consignee</h3><div class="right">${LM.visibility('ASCO only')}</div></div>
      <dl class="kv2"><dt>Shipper</dt><dd><b style="font-weight:600">${esc(C.name)}</b> · ${esc(C.contact)}, ${esc(C.role)}</dd>
        <dt>Address</dt><dd>${esc(C.address)}, ${esc(C.country)}</dd><dt>Contact</dt><dd>${esc(C.phone)} · WhatsApp ${esc(C.whatsapp)}<br>${esc(C.email)}</dd>
        <dt>Business registration</dt><dd class="num">${esc(C.brn)}</dd>
        <dt>Payment terms</dt><dd>${tag('Payment after POD: No', 'neutral')} ${tag(`Down payment: ${C.terms.downPayment}%`, 'info')}</dd>
        <dt>Consignee</dt><dd>${esc(A.consignee.name)} · ${esc(A.consignee.address)} <span class="caption">(party on the shipment, no login)</span></dd></dl></section>`;
  }

  /* ================================ Home ================================ */
  AscoPages['tenant:index'] = function home() {
    const render = () => {
      const s = X.get(), k = X.stage(s), items = X.actionItems(s), iss = X.issues(s), q = X.accepted(s) || X.latestSent(s);
      const replies = s.rfq ? Object.keys(s.rfq.replies).length : 0;
      const pay = s.payables ? Object.keys(s.payables).filter(p => s.payables[p].checkedAt && s.payables[p].matches).length : 0;
      const kpi = (i, l, v, sub, tone, href) => `<a class="kpi" href="${href}"><span class="k"><i data-lucide="${i}"></i>${l}</span><span class="v">${v}</span><span class="s ${tone || ''}">${sub}</span></a>`;
      const body = wrap(`
        ${X.lifecycleHTML(s, { right: s.req ? `<a class="link-btn" href="request.html">Open request<i data-lucide="arrow-right"></i></a>` : '' })}
        <nav class="kpis" style="grid-template-columns:repeat(5,minmax(0,1fr));background:var(--surface)">
          ${kpi('container', 'Open jobs', s.req && k < 10 ? 1 : 0, s.req ? (X.dsid(s) || s.req.id) : 'None yet', '', 'request.html')}
          ${kpi('git-compare-arrows', 'Partner replies', s.rfq ? `${replies}/4` : '—', s.rfq ? (replies < 4 ? 'Waiting for some partners' : 'All legs costed') : 'RFQ not sent', replies && replies < 4 ? 'warning' : '', 'rfq.html')}
          ${kpi('receipt', 'Quotation', q ? X.usd(q.total) : '—', q ? `v${q.v} · ${q.status === 'accepted' ? 'accepted' : q.status}` : 'Not sent', q && q.status === 'negotiated' ? 'warning' : '', 'quote.html')}
          ${kpi('triangle-alert', 'Delays and impact', iss.length, iss.length ? 'Needs a look' : 'None', iss.length ? 'warning' : '', '#delays')}
          ${kpi('wallet', 'Payables matched', s.approval ? `${pay}/2` : '—', s.invRequest ? 'Partner invoices vs PO' : 'After POD', '', 'payables.html')}
        </nav>
        <div class="a-grid wide-left"><div class="a-col">
          <section class="card"><div class="card-head"><i data-lucide="list-checks"></i><h3>Needs your action</h3><span class="caption">${items.length || ''}</span></div>
            ${items.length ? `<ul class="a-list">${items.map(([i, t, d, href, tone]) => `<li><span class="icon-tile tone-${tone}"><i data-lucide="${i}"></i></span><div><div class="t">${esc(t)}</div><div class="d">${esc(d)}</div></div><a class="btn-secondary" href="${href}">Open</a></li>`).join('')}</ul>`
              : `<p class="caption" style="margin:0">${s.req ? 'Nothing needs you right now. Partners and the shipper are on their steps.' : 'No requests yet. When ABC Electronics sends one from the portal it appears here.'}</p>`}</section>
          <section class="card" id="delays"><div class="card-head"><i data-lucide="clock-alert"></i><h3>Delays and impact</h3><div class="right"><span class="caption">Late steps or goods not in good condition</span></div></div>
            ${iss.length ? `<ul class="a-list">${iss.map(x => `<li><span class="icon-tile tone-warning"><i data-lucide="triangle-alert"></i></span>
                <div><div class="t">${esc(X.dsid(s))} · ${esc(A.steps[x.n].t)} ${X.condTag(x.condition)}${x.late ? tag('Late', 'warning') : ''}</div>
                  <div class="d">${esc(x.notes || '')} · reported by ${esc(X.pname(x.by === 'driver' ? s.approval.pos[1].partner : x.by))}, ${X.fmt(x.at)}</div>
                  <div class="d" style="color:var(--text-secondary)"><b style="font-weight:600">Impact:</b> ${x.condition !== 'Good' ? 'Possible cargo claim. Lina sees the condition in her portal; ask the driver to check these cartons at delivery and note it on the POD.' : 'Behind plan; check the knock-on to the next step.'}</div></div>
                <a class="btn-secondary" href="shipment.html">Open</a></li>`).join('')}</ul>` : '<p class="caption" style="margin:0">No delays or condition issues reported.</p>'}</section>
        </div><div class="a-col">
          ${s.req ? `<section class="card"><div class="card-head"><i data-lucide="container"></i><h3>Active job</h3><div class="right">${tag(A.stages[k], k === 10 ? 'success' : 'info')}</div></div>
            <dl class="kv2"><dt>${X.dsid(s) ? 'DSID' : 'Request'}</dt><dd>${X.dsid(s) ? X.dsidHTML(X.dsid(s)) : esc(s.req.id)}</dd><dt>Shipper</dt><dd>${esc(A.customer.name)}</dd><dt>Consignee</dt><dd>${esc(A.consignee.name)}, Bandung</dd>
              <dt>Cargo</dt><dd>${esc(s.req.title)} · ${esc(s.req.fields.ctype)}</dd><dt>PIC</dt><dd>${esc(me.name)}</dd></dl></section>` : ''}
          <section class="card"><div class="card-head"><i data-lucide="history"></i><h3>Recent activity</h3></div>${s.events.length ? lastEvents(s, 7) : '<p class="caption" style="margin:0">Nothing yet.</p>'}</section>
        </div></div>`);
      X.frame({ rail: 'home', row: 'overview', head: head('Home', `${esc(A.customer.name)} import · PIC view`, ''), body });
    };
    render(); onStore(() => location.reload());
  };

  /* ========================= Request + plan ========================= */
  AscoPages['tenant:request'] = function request() {
    let s = X.get();
    const nextCard = () => {
      const k = X.stage(s);
      if (k === 1) return `<section class="card"><div class="card-head"><i data-lucide="send"></i><h3>Next: partner costing</h3></div>
        <p style="margin:0 0 12px">Send the requirement to the two core partners on each leg. They reply by magic link with one amount in their currency.</p>
        <button class="btn-primary" data-act="rfq"><i data-lucide="send"></i>Send RFQ to core partners</button></section>`;
      if (k === 2) { const n = Object.keys(s.rfq.replies).length;
        return `<section class="card"><div class="card-head"><i data-lucide="hourglass"></i><h3>Partner costing · ${n} of 4 replies</h3></div>
        <p style="margin:0 0 12px" class="caption">RFQ sent ${X.fmt(s.rfq.sentAt)}. Each partner got its own link; you can quote once each leg has a reply.</p>
        <a class="btn-primary" href="rfq.html"><i data-lucide="git-compare-arrows"></i>Compare replies</a></section>`; }
      if (k === 3) return `<section class="card"><div class="card-head"><i data-lucide="receipt"></i><h3>Quotation</h3><div class="right"><a class="link-btn" href="quote.html">Open<i data-lucide="arrow-right"></i></a></div></div>${X.versionsHTML(s, { staff: true })}</section>`;
      if (k === 4) return `<section class="card"><div class="card-head"><i data-lucide="files"></i><h3>Waiting for ABC’s documents</h3></div>
        <p class="caption" style="margin:0">Quotation v${X.accepted(s).v} accepted ${X.fmt(X.accepted(s).acceptedAt)}. The AI Document Agent checks each upload against the confirmed request; results are on the left.</p></section>`;
      if (k === 5) return `<section class="card" style="border-color:var(--primary)"><div class="card-head"><i data-lucide="shield-check"></i><h3>Documents validated · awaiting your approval</h3></div>
        <p style="margin:0 0 12px">All checks passed and Lina submitted on ${X.fmt(s.docs.submittedAt)}. Approving issues the Digital Shipment ID, the purchase orders to the selected core partners and the ${A.customer.terms.downPayment}% down-payment invoice.</p>
        <button class="btn-primary" data-act="approve"><i data-lucide="badge-check"></i>Approve & start execution</button></section>`;
      return approvalCard();
    };
    const approvalCard = () => `<section class="card"><div class="card-head"><i data-lucide="badge-check"></i><h3>Approved ${X.fmt(s.approval.at)}</h3><div class="right"><a class="link-btn" href="shipment.html">Execution<i data-lucide="arrow-right"></i></a></div></div>
      <dl class="kv2"><dt>Digital Shipment ID</dt><dd>${X.dsidHTML(X.dsid(s))}</dd>
        ${s.approval.pos.map(p => `<dt>${esc(p.no)}</dt><dd>${esc(X.pname(p.partner))} · <b style="font-weight:600">${esc(X.cur(p.amount, p.currency))}</b> · steps ${A.legs[p.leg].steps.join(', ')} <button class="link-btn" data-po="${p.partner}">Email</button></dd>`).join('')}
        <dt>Down-payment invoice</dt><dd>${esc(s.invoices.dp.no)} · ${X.usd(s.invoices.dp.amount)} (${s.invoices.dp.pct}%) <button class="link-btn" data-mail="dp">Email</button></dd></dl></section>`;
    const render = () => {
      s = X.get();
      const k = X.stage(s);
      const body = wrap(`${X.lifecycleHTML(s, { jump: true })}
        ${!s.req ? noRequest() : `<div class="a-grid"><div class="a-col">
          <section class="card"><div class="card-head"><i data-lucide="message-square-quote"></i><h3>What the shipper typed</h3><div class="right"><span class="caption">${X.fmt(s.req.at)}</span></div></div>
            <div class="typed2"><span class="user-avatar" style="background:${LM.AVATAR_COLORS[0]}">LZ</span><div><div class="who">Lina Zhou · ABC Electronics · via the ASCO portal</div><div class="bubble">${esc(s.req.prompt)}</div></div></div></section>
          <section class="card"><div class="card-head"><i data-lucide="clipboard-list"></i><h3>Operation request</h3><div class="right"><span class="ai-label"><i data-lucide="sparkles"></i>AI-structured, confirmed by the shipper</span></div></div>
            <dl class="kv2">${X.FIELD_LABELS.map(([f, l]) => `<dt>${l}</dt><dd>${esc(X.fieldText(s.req.fields, f)) || '<span class="caption">—</span>'}</dd>`).join('')}<dt>Declared value</dt><dd>Used for customs and insurance only</dd></dl></section>
          ${k >= 4 ? `<section class="card"><div class="card-head"><i data-lucide="scan-search"></i><h3>Documents · AI Document Agent</h3><div class="right">${X.docsReady(s) ? tag('All checks pass', 'success', 'circle-check') : tag('Mismatches found', 'danger', 'triangle-alert')}</div></div>
            <p class="caption" style="margin:0 0 8px">Checked for completeness and against the confirmed request (200 CBM, USD). Same results as the shipper sees.</p>${X.docsHTML(s, 'staff')}</section>` : ''}
          ${customerCard()}
          <section class="card"><div class="card-head"><i data-lucide="history"></i><h3>Activity</h3><div class="right"><span class="caption">Full audit trail on the POD</span></div></div>${lastEvents(s, 8)}</section>
        </div><div class="a-col">${nextCard()}${planHTML(s)}${k > 3 ? `<section class="card"><div class="card-head"><i data-lucide="receipt"></i><h3>Quotation versions</h3></div>${X.versionsHTML(s, { staff: true })}</section>` : ''}</div></div>`}`);
      X.frame({ rail: 'requests', row: 'request', head: head(s.req ? s.req.id : 'Request', s.req ? `${esc(A.customer.name)} · ${esc(s.req.title)}` : esc(A.customer.name), s.req ? `${Staff.lockBadge ? Staff.lockBadge() : ''}${viewAs(X.P('portal/request.html'))}` : ''), body });
    };
    render(); onStore(render);

    document.addEventListener('click', e => {
      const a = e.target.closest('[data-act], [data-po], [data-mail]'); if (!a) return;
      if (a.dataset.act === 'rfq') {
        const m = X.openModal(`<div class="modal-head"><i data-lucide="send"></i><h2>Send RFQ to core partners</h2><button class="icon-btn" data-close><i data-lucide="x"></i></button></div>
          <div class="modal-body"><p class="caption" style="margin:0">Auto-generated by LogiMind. Each partner gets the requirement for its own leg only, with a personal “Open request” link. No shipper contact details are shared.</p>
            ${['origin', 'dest'].map(leg => `<b style="font-weight:600;font-size:13px">${A.legs[leg].label} · ${A.legs[leg].city}</b>${X.partnersOn(leg).map(p => X.mailHTML(X.rfqMail(s, p))).join('')}`).join('')}</div>
          <div class="modal-foot"><span class="left caption">4 emails · also sent by WhatsApp</span><button class="btn-secondary" data-close>Cancel</button><button class="btn-primary" id="goRfq"><i data-lucide="send"></i>Send to all 4 partners</button></div>`, true);
        m.querySelector('#goRfq').addEventListener('click', () => { X.save(st => X.aSendRfq(st, X.when('rfq'))); X.closeModal(); render(); toast('RFQ sent to 4 core partners', { note: 'Open each reply link from Partner costing → “Open as partner (demo)”' }); });
      }
      if (a.dataset.act === 'approve') {
        X.save(st => X.aApprove(st, X.when('approve')));
        s = X.get(); render();
        X.openModal(`<div class="modal-head"><i data-lucide="badge-check"></i><h2>Execution started</h2><button class="icon-btn" data-close><i data-lucide="x"></i></button></div>
          <div class="modal-body"><div class="banner success"><i data-lucide="fingerprint"></i><div class="text">Digital Shipment ID <b>${esc(X.dsid(s))}</b> issued. From now on every party, document and update is keyed to it.</div>${X.dsidHTML(X.dsid(s))}</div>
            ${s.approval.pos.map(p => X.mailHTML(X.poMail(s, p))).join('')}${X.mailHTML(X.customerMail('dp', s))}
            <div class="mail-sent"><i data-lucide="check"></i>Emails sent to ${s.approval.pos.map(p => esc(A.partners[p.partner].email)).join(', ')} and ${esc(A.customer.email)}</div></div>
          <div class="modal-foot"><button class="btn-secondary" data-close>Close</button><a class="btn-primary" href="shipment.html"><i data-lucide="container"></i>Open execution</a></div>`, true);
      }
      if (a.dataset.po) { const p = X.poFor(s, a.dataset.po); X.openModal(`<div class="modal-head"><i data-lucide="mail"></i><h2>${esc(p.no)}</h2><button class="icon-btn" data-close><i data-lucide="x"></i></button></div><div class="modal-body">${X.mailHTML(X.poMail(s, p))}<div class="mail-sent"><i data-lucide="check"></i>Sent ${X.fmt(p.issuedAt)}</div></div>`, true); }
      if (a.dataset.mail) X.openModal(`<div class="modal-head"><i data-lucide="mail"></i><h2>Email to the shipper</h2><button class="icon-btn" data-close><i data-lucide="x"></i></button></div><div class="modal-body">${X.mailHTML(X.customerMail(a.dataset.mail, s))}<div class="mail-sent"><i data-lucide="check"></i>Email sent to ${esc(A.customer.email)}</div></div>`, true);
    });
  };

  /* ===================== RFQ comparison and ranking ===================== */
  AscoPages['tenant:rfq'] = function rfq() {
    let s = X.get(), sort = 'price';
    const pick = { origin: null, dest: null };
    let margin = { kind: '%', value: s.settings.margin || 12 }, validDays = 7;
    const legCard = (leg) => {
      const rk = X.ranking(s, leg), ids = X.partnersOn(leg).slice();
      ids.sort((a, b) => {
        const ra = X.replyUSD(s, a), rb = X.replyUSD(s, b);
        if (ra == null || rb == null) return ra == null ? 1 : -1;
        return sort === 'price' ? ra - rb : A.partners[b].onTime - A.partners[a].onTime;
      });
      if (!pick[leg] && rk) pick[leg] = (s.sel && s.sel[leg]) || rk.best;
      const locked = !!X.latestSent(s);
      return `<section class="card flush"><div class="card-head"><i data-lucide="${leg === 'origin' ? 'plane-takeoff' : 'plane-landing'}"></i><h3>${A.legs[leg].label} · ${A.legs[leg].city}</h3>
          <span class="caption">Steps ${A.legs[leg].steps.map(n => A.steps[n].short).join(' → ')}</span></div>
        ${rk && rk.order.length ? `<div class="banner info" style="margin:12px 16px 0;padding:10px 12px"><i data-lucide="sparkles"></i><div class="text"><b>AI ranking:</b> ${rk.order.map((p, i) => `${i + 1}. ${esc(X.pname(p))}`).join(' · ')}<br>${esc(rk.why)}</div></div>` : ''}
        <table class="table cmp" style="margin-top:8px"><thead><tr><th style="width:34px"></th><th>Core partner</th><th>Reply</th><th>In USD</th><th>Validity</th><th>Transit</th><th></th></tr></thead><tbody>
        ${ids.map(pid => { const P = A.partners[pid], r = s.rfq.replies[pid];
          return `<tr class="${rk && rk.best === pid && r ? 'best' : ''}"><td><input type="radio" class="radio" name="pick-${leg}" value="${pid}" ${pick[leg] === pid ? 'checked' : ''} ${!r || locked ? 'disabled' : ''} aria-label="Pick ${esc(X.pname(pid))}"></td>
            <td><div class="primary-cell" style="display:flex;align-items:center;gap:8px">${LM.orgAvatar(pid)}<span>${esc(X.pname(pid))}</span>${rk && rk.best === pid && r ? tag('AI pick', 'brand', 'sparkles') : ''}</div>
              <div class="sub">${X.stars(P.stars)} <span class="ontime">${P.onTime}% on time</span> · ${P.mode === 'account' ? 'LogiMind account' : 'magic link'}</div>${r && r.notes ? `<div class="sub" style="max-width:340px;white-space:normal">${esc(r.notes)}</div>` : ''}</td>
            ${r ? `<td class="amt">${esc(X.cur(r.amount, r.currency))}<div class="sub">${X.fmt(r.at)}</div></td><td class="amt">${X.usd(X.toUSD(r.amount, r.currency))}</td><td>${X.fmt(r.validity + 'T12:00', { date: true })}</td><td>${r.transit} days</td>`
              : `<td colspan="4">${tag('Waiting for reply', 'neutral', 'hourglass')} <span class="caption">Sent ${X.fmt(s.rfq.sentAt)}</span></td>`}
            <td><a class="link-btn" href="${partnerLink(pid, 'rfq')}" target="_blank" rel="noopener" title="Opens the partner’s magic-link page">Open as partner (demo)<i data-lucide="external-link"></i></a></td></tr>`; }).join('')}
        </tbody></table></section>`;
    };
    const summary = () => {
      const q = X.latestSent(s);
      if (q) return `<section class="card"><div class="card-head"><i data-lucide="receipt"></i><h3>Quotation v${q.v} ${q.status === 'accepted' ? 'accepted' : 'sent'}</h3><div class="right"><a class="btn-primary" href="quote.html"><i data-lucide="receipt"></i>Open quotation</a></div></div>
        <p class="caption" style="margin:0">Built from ${esc(X.pname(q.sel.origin))} + ${esc(X.pname(q.sel.dest))}. To change partners or margin, revise the quotation.</p></section>`;
      const ok = pick.origin && pick.dest && X.replyUSD(s, pick.origin) != null && X.replyUSD(s, pick.dest) != null;
      const p = ok ? X.price(s, pick, margin) : null;
      return `<section class="card"><div class="card-head"><i data-lucide="calculator"></i><h3>Build the quotation</h3><div class="right">${internal}</div></div>
        <div class="grid3" style="align-items:end">
          <label class="lbl"><span>Margin type</span><div class="segmented"><button class="pill${margin.kind === '%' ? ' selected' : ''}" data-mk="%">%</button><button class="pill${margin.kind === 'fixed' ? ' selected' : ''}" data-mk="fixed">Fixed US$</button></div></label>
          <label class="lbl"><span>ASCO margin</span><input class="in" id="mv" type="number" min="0" step="${margin.kind === '%' ? '0.5' : '50'}" value="${margin.value}"></label>
          <label class="lbl"><span>Validity (days)</span><input class="in" id="vd" type="number" min="1" max="30" value="${validDays}"></label></div>
        ${p ? `<table class="table" style="margin-top:12px"><tbody>
          <tr><td>${A.legs.origin.label} · ${esc(X.pname(pick.origin))}</td><td class="amt" style="text-align:right">${X.usd(X.replyUSD(s, pick.origin))}</td></tr>
          <tr><td>${A.legs.dest.label} · ${esc(X.pname(pick.dest))}</td><td class="amt" style="text-align:right">${X.usd(X.replyUSD(s, pick.dest))}</td></tr>
          <tr><td>Partner cost</td><td class="amt" style="text-align:right">${X.usd(p.cost)}</td></tr>
          <tr><td>ASCO margin ${esc(X.marginText(margin))}</td><td class="amt" style="text-align:right">${X.usd(p.profit)}</td></tr>
          <tr><td><b style="font-weight:600">Customer price (USD)</b></td><td class="amt" style="text-align:right"><b style="font-weight:600">${X.usd(p.total)}</b></td></tr></tbody></table>` : '<p class="caption" style="margin:12px 0 0">Pick one replied partner per leg.</p>'}
        <div style="display:flex;gap:8px;align-items:center;margin-top:12px"><span class="caption" style="flex:1">The quotation shows a breakdown by service stage in USD. No partner names, costs or margin.</span>
          <button class="btn-primary" data-act="gen" ${ok ? '' : 'disabled'}><i data-lucide="sparkles"></i>Generate quotation</button></div></section>`;
    };
    const render = () => {
      s = X.get();
      const n = s.rfq ? Object.keys(s.rfq.replies).length : 0;
      const body = wrap(`${X.lifecycleHTML(s)}${!s.req ? noRequest() : !s.rfq ? emptyCard('send', 'No RFQ sent yet', 'Send the requirement to ASCO’s core partners from the request page.', '<a class="btn-primary" href="request.html"><i data-lucide="file-text"></i>Open request</a>')
        : `<div class="toolbar" style="padding:0;height:auto"><div class="left" style="display:flex;gap:8px;align-items:center"><span class="caption">Sort</span><div class="segmented"><button class="pill${sort === 'price' ? ' selected' : ''}" data-sort="price"><i data-lucide="arrow-down-0-1"></i>Lowest price</button><button class="pill${sort === 'ontime' ? ' selected' : ''}" data-sort="ontime"><i data-lucide="clock"></i>Best on-time</button></div></div>
            <div class="right" style="display:flex;gap:8px;align-items:center"><span class="fx-note"><i data-lucide="info"></i>${esc(A.fxNote)}</span>${n < 4 ? '<button class="btn-secondary" data-act="sim"><i data-lucide="wand-sparkles"></i>Demo: fill missing replies</button>' : ''}</div></div>
          ${legCard('origin')}${legCard('dest')}${summary()}`}`);
      X.frame({ rail: 'rfqs', row: 'rfq', head: head(s.req ? `Partner costing · ${s.req.id}` : 'Partner costing', s.rfq ? `${n} of 4 replies · sent ${X.fmt(s.rfq.sentAt)}` : ''), body });
    };
    render(); onStore(render);
    document.addEventListener('change', e => {
      if (e.target.matches('input.radio')) { pick[e.target.name.replace('pick-', '')] = e.target.value; render(); }
      if (e.target.id === 'mv') { margin = { ...margin, value: Math.max(0, +e.target.value || 0) }; render(); }
      if (e.target.id === 'vd') { validDays = Math.max(1, Math.min(30, +e.target.value || 7)); render(); }
    });
    document.addEventListener('click', e => {
      const b = e.target.closest('[data-sort], [data-mk], [data-act]'); if (!b) return;
      if (b.dataset.sort) { sort = b.dataset.sort; render(); }
      if (b.dataset.mk) { margin = b.dataset.mk === '%' ? { kind: '%', value: s.settings.margin || 12 } : { kind: 'fixed', value: 1000 }; render(); }
      if (b.dataset.act === 'sim') { X.save(st => X.partnersOn('origin').concat(X.partnersOn('dest')).forEach(p => { if (!st.rfq.replies[p]) X.aReply(st, p, A.replies[p], X.when('reply_' + p)); })); render(); toast('Missing replies filled with demo data'); }
      if (b.dataset.act === 'gen') { X.save(st => X.aGenerate(st, { sel: { ...pick }, margin, validDays }, X.when('quote1'))); location.href = 'quote.html'; }
    });
  };

  /* ===================== Quotation and negotiation ===================== */
  AscoPages['tenant:quote'] = function quote() {
    let s = X.get(), showV = null;
    const statusCard = (q) => {
      if (q.status === 'draft') return `<section class="card" style="border-color:var(--primary)"><div class="card-head"><i data-lucide="file-pen-line"></i><h3>Draft v${q.v} · review before sending</h3><div class="right">${internal}</div></div>
        <dl class="kv2"><dt>Partners</dt><dd>${esc(X.pname(q.sel.origin))} + ${esc(X.pname(q.sel.dest))}</dd><dt>Partner cost</dt><dd>${X.usd(q.cost)}</dd><dt>Margin</dt><dd>${esc(X.marginText(q.margin))} · ${X.usd(q.profit)}</dd>
          <dt>Customer price</dt><dd><b style="font-weight:600">${X.usd(q.total)}</b></dd><dt>Valid until</dt><dd>${X.fmt(q.validUntil + 'T12:00', { date: true })}</dd>${q.changes ? `<dt>Changes</dt><dd>${esc(q.changes)}</dd>` : ''}</dl>
        <div style="display:flex;gap:8px;margin-top:14px;justify-content:flex-end"><a class="btn-secondary" href="rfq.html"><i data-lucide="git-compare-arrows"></i>Back to costing</a><button class="btn-primary" data-act="send"><i data-lucide="send"></i>Confirm & send</button></div></section>`;
      if (q.status === 'negotiated') return `<section class="card" style="border-color:var(--warning)"><div class="card-head"><i data-lucide="messages-square"></i><h3>Lina asked to negotiate v${q.v}</h3><div class="right"><span class="caption">${X.fmt(q.negotiation.at)}</span></div></div>
        <div class="typed2"><span class="user-avatar" style="background:${LM.AVATAR_COLORS[0]}">LZ</span><div><div class="bubble">${esc(q.negotiation.text)}</div>${q.negotiation.target ? `<div class="caption" style="margin-top:6px">Target price: <b style="font-weight:600;color:var(--ink)">${X.usd(q.negotiation.target)}</b> · ${X.usd(q.total - q.negotiation.target)} below v${q.v}</div>` : ''}</div></div>
        <div style="display:flex;gap:8px;margin-top:14px;justify-content:flex-end"><button class="btn-primary" data-act="revise"><i data-lucide="file-pen-line"></i>Revise quotation</button></div></section>`;
      if (q.status === 'accepted') return `<div class="banner success"><i data-lucide="circle-check"></i><div class="text"><b>Lina accepted v${q.v} (${X.usd(q.total)})</b> on ${X.fmt(q.acceptedAt)}. Next: documents and AI validation.</div><a class="btn-secondary" href="request.html">Open request</a></div>`;
      return `<section class="card"><div class="card-head"><i data-lucide="send"></i><h3>v${q.v} sent ${X.fmt(q.sentAt)}</h3></div><p class="caption" style="margin:0 0 12px">Waiting for Lina to accept or negotiate. Email sent to ${esc(A.customer.email)}.</p>
        <div style="display:flex;gap:8px;justify-content:flex-end"><button class="btn-secondary" data-act="revise"><i data-lucide="file-pen-line"></i>Revise quotation</button></div></section>`;
    };
    const render = () => {
      s = X.get();
      const q = X.latest(s), shown = showV ? s.quotes.find(x => x.v === showV) || q : q;
      const body = wrap(`${X.lifecycleHTML(s)}${!q ? emptyCard('receipt', 'No quotation yet', 'Pick one partner per leg in Partner costing, set ASCO’s margin and press Generate quotation.', '<a class="btn-primary" href="rfq.html"><i data-lucide="git-compare-arrows"></i>Partner costing</a>')
        : `<div class="a-grid"><div class="a-col"><div class="caption" style="display:flex;align-items:center;gap:6px"><i data-lucide="eye" style="width:13px;height:13px"></i>Preview of v${shown.v}: exactly what Lina sees in the ASCO portal</div>${X.quoteDocHTML(s, shown)}</div>
          <div class="a-col">${statusCard(q)}<section class="card"><div class="card-head"><i data-lucide="history"></i><h3>Version history</h3><div class="right">${internal}</div></div>${X.versionsHTML(s, { staff: true })}
            ${s.quotes.length > 1 ? `<div class="chips" style="margin-top:10px">${s.quotes.map(x => `<button class="pill${x === shown ? ' selected' : ''}" data-v="${x.v}">Preview v${x.v}</button>`).join('')}</div>` : ''}</section></div></div>`}`);
      X.frame({ rail: 'rfqs', row: 'quote', head: head(q ? `Quotation ${A.quoteNo}` : 'Quotation', q ? `${esc(A.customer.name)} · v${q.v}` : '', q ? viewAs(X.P('portal/quote.html')) : ''), body });
    };
    render(); onStore(render);
    document.addEventListener('click', e => {
      const b = e.target.closest('[data-act], [data-v]'); if (!b) return;
      if (b.dataset.v) { showV = +b.dataset.v; render(); return; }
      if (b.dataset.act === 'send') {
        const m = X.openModal(`<div class="modal-head"><i data-lucide="send"></i><h2>Send v${X.latest(s).v} to Lina Zhou</h2><button class="icon-btn" data-close><i data-lucide="x"></i></button></div>
          <div class="modal-body">${X.mailHTML(X.customerMail('quote', s))}<span class="caption">Lina is also notified in her portal inbox and on WhatsApp.</span></div>
          <div class="modal-foot"><button class="btn-secondary" data-close>Cancel</button><button class="btn-primary" id="goSend"><i data-lucide="send"></i>Send</button></div>`, true);
        m.querySelector('#goSend').addEventListener('click', () => {
          X.save(st => X.aSendQuote(st, X.latest(st).v === 1 ? X.when('quote1') : X.addHours(X.when('quote2'), X.latest(st).v - 2)));
          m.querySelector('.modal-foot').innerHTML = `<span class="mail-sent left"><i data-lucide="check"></i>Email sent to ${esc(A.customer.email)}</span><button class="btn-primary" data-close>Done</button>`;
          icons(); render();
        });
      }
      if (b.dataset.act === 'revise') {
        const prev = X.latestSent(s); let mg = { ...prev.margin }, ext = 7, sel = { ...prev.sel };
        const tgt = prev.negotiation && prev.negotiation.target;
        const draw = () => {
          const p = X.price(s, sel, mg);
          const changes = [prev.margin.kind !== mg.kind || prev.margin.value !== mg.value ? `Margin ${X.marginText(prev.margin)} → ${X.marginText(mg)}` : null,
            prev.sel.origin !== sel.origin ? `Origin partner → ${X.pname(sel.origin)}` : null, prev.sel.dest !== sel.dest ? `Destination partner → ${X.pname(sel.dest)}` : null, ext ? `validity +${ext} days` : null].filter(Boolean).join(', ');
          const legSel = (leg) => `<select class="select" data-leg="${leg}" style="height:34px;width:100%">${X.partnersOn(leg).filter(pid => s.rfq.replies[pid]).map(pid => `<option value="${pid}" ${sel[leg] === pid ? 'selected' : ''}>${esc(X.pname(pid))} · ${X.usd(X.replyUSD(s, pid))}</option>`).join('')}</select>`;
          return `<div class="modal-head"><i data-lucide="file-pen-line"></i><h2>Revise quotation · v${prev.v + 1}</h2><button class="icon-btn" data-close><i data-lucide="x"></i></button></div>
            <div class="modal-body">${tgt ? `<div class="banner info"><i data-lucide="target"></i><div class="text">Lina’s target is <b>${X.usd(tgt)}</b>. That needs a margin of about ${((tgt / p.cost - 1) * 100).toFixed(1)}% on this partner cost.</div></div>` : ''}
              <div class="grid2"><label class="lbl"><span>Origin partner</span>${legSel('origin')}</label><label class="lbl"><span>Destination partner</span>${legSel('dest')}</label></div>
              <div class="grid3"><label class="lbl"><span>Margin type</span><select class="select" id="rk" style="height:34px"><option value="%" ${mg.kind === '%' ? 'selected' : ''}>%</option><option value="fixed" ${mg.kind === 'fixed' ? 'selected' : ''}>Fixed US$</option></select></label>
                <label class="lbl"><span>Margin</span><input class="in" id="rv" type="number" min="0" step="0.5" value="${mg.value}"></label><label class="lbl"><span>Extend validity (days)</span><input class="in" id="re" type="number" min="0" max="30" value="${ext}"></label></div>
              <dl class="kv2"><dt>New customer price</dt><dd><b style="font-weight:600">${X.usd(p.total)}</b> <span class="caption">(v${prev.v}: ${X.usd(prev.total)} · profit ${X.usd(p.profit)})</span></dd><dt>Change log</dt><dd>${esc(changes.replace(/^./, c => c.toUpperCase())) || '—'}</dd></dl></div>
            <div class="modal-foot"><button class="btn-secondary" data-close>Cancel</button><button class="btn-primary" id="goRev"><i data-lucide="file-plus-2"></i>Create v${prev.v + 1} draft</button></div>`;
        };
        const m = X.openModal(draw());
        const rebind = () => {
          m.querySelectorAll('[data-leg]').forEach(x => x.addEventListener('change', () => { sel[x.dataset.leg] = x.value; m.innerHTML = draw(); icons(); rebind(); }));
          m.querySelector('#rk').addEventListener('change', ev2 => { mg = { kind: ev2.target.value, value: ev2.target.value === '%' ? 9 : 800 }; m.innerHTML = draw(); icons(); rebind(); });
          m.querySelector('#rv').addEventListener('change', ev2 => { mg = { ...mg, value: Math.max(0, +ev2.target.value || 0) }; m.innerHTML = draw(); icons(); rebind(); });
          m.querySelector('#re').addEventListener('change', ev2 => { ext = Math.max(0, Math.min(30, +ev2.target.value || 0)); m.innerHTML = draw(); icons(); rebind(); });
          m.querySelector('#goRev').addEventListener('click', () => { X.save(st => X.aGenerate(st, { sel, margin: mg, validDays: ext }, X.when('quote2'))); X.closeModal(); showV = null; render(); toast(`Draft v${prev.v + 1} created`, { note: 'Review it, then Confirm & send' }); });
        };
        rebind();
      }
    });
  };

  /* ====================== Execution (keyed by DSID) ====================== */
  AscoPages['tenant:shipment'] = function shipment() {
    let s = X.get();
    const docsCard = () => {
      const bl = s.bl || { reminders: [] }, k = X.stage(s), pod = s.pod;
      const blRow = bl.received ? `${tag('Received', 'success', 'circle-check')}<div class="d">${esc(bl.received.file)} · ${bl.received.via === 'email' ? 'recorded by ASCO (came by email)' : 'uploaded by ' + esc(X.pname(s.approval.pos[0].partner))} · ${X.fmt(bl.received.at)}</div>`
        : s.steps && s.steps[3] ? `${tag(`Awaited · reminder sent ${bl.reminders.length}×`, 'warning', 'file-clock')}<div class="d">${bl.reminders.length ? `Last reminder ${X.fmt(bl.reminders[bl.reminders.length - 1])} to ${esc(X.pname(s.approval.pos[0].partner))}` : `First reminder goes out ${X.fmt(X.blDue(s) + 'T09:00', { date: true })}, ${s.settings.blDays} days before arrival on ${X.fmt(A.eta, { date: true })}`}</div>`
        : `${tag('After ocean loading', 'neutral')}<div class="d">Requested from the origin partner ${s.settings.blDays} days before arrival (setting)</div>`;
      const blActs = !bl.received && s.steps && s.steps[3] ? `${bl.reminders.length ? `<button class="btn-secondary" data-act="remind"><i data-lucide="bell-ring"></i>Remind again</button>` : `<button class="btn-secondary" data-act="remind"><i data-lucide="fast-forward"></i>Demo: advance to ${X.fmt(X.blDue(s) + 'T09:00', { date: true })}</button>`}
        ${bl.reminders.length ? '<button class="link-btn" data-act="blmail">Email</button>' : ''}<button class="btn-primary" data-act="blrec"><i data-lucide="mail-check"></i>Received by email</button>` : '';
      return `<section class="card" id="bl"><div class="card-head"><i data-lucide="folder-check"></i><h3>Document checklist</h3><span class="caption">${esc(X.dsid(s))}</span></div><ul class="cl">
        <li><span class="icon-tile tone-success"><i data-lucide="file-check-2"></i></span><div><div class="t">Shipper documents ${tag('Validated', 'success')}</div><div class="d">Shipper instruction, packing list, commercial invoice · AI checks passed, approved ${X.fmt(s.approval.at)}</div></div><a class="link-btn" href="request.html">View</a></li>
        <li><span class="icon-tile tone-success"><i data-lucide="file-signature"></i></span><div><div class="t">Purchase orders ${tag('2 sent', 'success')}</div><div class="d">${s.approval.pos.map(p => `${esc(p.no)} → ${esc(X.pname(p.partner))}`).join(' · ')}</div></div><span></span></li>
        <li><span class="icon-tile tone-${bl.received ? 'success' : s.steps && s.steps[3] ? 'warning' : 'neutral'}"><i data-lucide="file-text"></i></span><div><div class="t">Bill of lading</div>${blRow}</div><div class="acts">${blActs}</div></li>
        <li><span class="icon-tile tone-${pod ? 'success' : 'neutral'}"><i data-lucide="qr-code"></i></span><div><div class="t">Digital POD ${pod ? tag('Signed', 'success') : tag(k >= 8 ? 'Next' : 'At delivery', 'neutral')}</div><div class="d">${pod ? `Received by ${esc(pod.receiver)} · ${X.fmt(pod.at)}` : 'Captured on the destination driver’s phone: signature, photos, condition'}</div></div>
          <div class="acts">${pod ? `<a class="btn-secondary" href="pod.html?dsid=${X.dsid(s)}"><i data-lucide="qr-code"></i>View POD</a>` : k >= 8 ? `<a class="link-btn" href="${X.P('partner/pod.html?dsid=' + X.dsid(s))}" target="_blank" rel="noopener">Open driver POD (demo)<i data-lucide="external-link"></i></a>` : ''}</div></li></ul></section>`;
    };
    const invCard = () => {
      const I = s.invoices, bal = I.bal;
      return `<section class="card" id="invoices"><div class="card-head"><i data-lucide="receipt-text"></i><h3>Customer invoices</h3><span class="caption">Down payment ${A.customer.terms.downPayment}% · balance after POD</span></div><ul class="cl">
        <li><span class="icon-tile tone-success"><i data-lucide="receipt-text"></i></span><div><div class="t">${esc(I.dp.no)} · down payment ${tag('Issued', 'success')}</div><div class="d">${X.usd(I.dp.amount)} · ${X.fmt(I.dp.issuedAt)}</div></div><button class="link-btn" data-mail="dp">Email</button></li>
        <li><span class="icon-tile tone-${bal && bal.issuedAt ? 'success' : bal ? 'info' : 'neutral'}"><i data-lucide="receipt-text"></i></span><div><div class="t">${esc(A.invoices.bal)} · balance ${bal ? (bal.issuedAt ? tag('Issued', 'success') : tag('Ready to issue', 'info')) : tag('After POD', 'neutral')}</div>
          <div class="d">${bal ? `${X.usd(bal.amount)}${bal.issuedAt ? ' · ' + X.fmt(bal.issuedAt) : ' · drafted when the POD was signed'}` : `${X.usd(X.accepted(s).total - I.dp.amount)} · issued once the POD is signed`}</div></div>
          <div class="acts">${bal && !bal.issuedAt ? '<button class="btn-primary" data-act="balance"><i data-lucide="send"></i>Issue balance invoice</button>' : bal ? '<button class="link-btn" data-mail="bal">Email</button>' : ''}</div></li></ul>
        <p class="caption" style="margin:8px 0 0">Partner invoices against the POs are in <a class="link-btn" href="payables.html">Payables</a>.</p></section>`;
    };
    const render = () => {
      s = X.get();
      const iss = X.issues(s);
      const body = wrap(`${X.lifecycleHTML(s)}${!s.approval ? emptyCard('container', 'Execution starts after approval', 'When the shipper’s documents pass the AI checks and you approve, LogiMind issues the Digital Shipment ID and the purchase orders.', '<a class="btn-primary" href="request.html"><i data-lucide="file-text"></i>Open request</a>')
        : `${iss.map(x => `<div class="banner warning"><i data-lucide="triangle-alert"></i><div class="text"><b>${esc(A.steps[x.n].t)}: ${esc(x.condition)}${x.late ? ' · late' : ''}</b> · ${esc(x.notes)} <span class="caption">Reported by ${esc(X.pname(x.by === 'driver' ? s.approval.pos[1].partner : x.by))}. Lina sees “${esc(x.condition)}” in her portal.</span></div></div>`).join('')}
          <div class="a-grid"><div class="a-col"><section class="card"><div class="card-head"><i data-lucide="list-ordered"></i><h3>Steps</h3><div class="right">
            <a class="link-btn" href="${partnerLink(s.approval.pos[0].partner, 'job')}" target="_blank" rel="noopener">Origin partner view<i data-lucide="external-link"></i></a>
            <a class="link-btn" href="${partnerLink(s.approval.pos[1].partner, 'job')}" target="_blank" rel="noopener">Destination partner view<i data-lucide="external-link"></i></a></div></div>${X.stepsHTML(s, 'staff')}</section>
            <section class="card"><div class="card-head"><i data-lucide="history"></i><h3>Audit trail</h3><div class="right">${s.pod ? `<a class="link-btn" href="pod.html?dsid=${X.dsid(s)}&view=audit">Full trail on the POD</a>` : ''}</div></div>${lastEvents(s, 10)}</section></div>
          <div class="a-col">${docsCard()}${invCard()}</div></div>`}`);
      X.frame({ rail: 'shipments', row: 'shipment', head: s.approval ? `<div class="a-title"><h1>Execution</h1>${X.dsidHTML(X.dsid(s))}<span class="caption">${esc(A.customer.name)} → ${esc(A.consignee.name)} · 3 × 40ft HC</span></div>
        <div class="right">${viewAs(X.P('portal/shipment.html?id=' + X.dsid(s)))}</div>` : head('Execution', ''), body });
    };
    render(); onStore(render);
    document.addEventListener('click', e => {
      const b = e.target.closest('[data-act], [data-mail]'); if (!b) return;
      if (b.dataset.mail) { X.openModal(`<div class="modal-head"><i data-lucide="mail"></i><h2>Email to the shipper</h2><button class="icon-btn" data-close><i data-lucide="x"></i></button></div><div class="modal-body">${X.mailHTML(X.customerMail(b.dataset.mail, s))}<div class="mail-sent"><i data-lucide="check"></i>Email sent to ${esc(A.customer.email)}</div></div>`, true); return; }
      const act = b.dataset.act;
      if (act === 'remind') {
        X.save(st => { const r = st.bl ? st.bl.reminders : [], n = r.length; X.aBlRemind(st, n < 3 ? X.when('bl' + (n + 1)) : X.addHours(r[n - 1], 24)); });
        s = X.get(); render();
        X.openModal(`<div class="modal-head"><i data-lucide="bell-ring"></i><h2>B/L reminder ${s.bl.reminders.length} sent</h2><button class="icon-btn" data-close><i data-lucide="x"></i></button></div><div class="modal-body">${X.mailHTML(X.blMail(s))}<div class="mail-sent"><i data-lucide="check"></i>Sent with a magic link to upload against ${esc(X.dsid(s))}</div></div>`, true);
      }
      if (act === 'blmail') X.openModal(`<div class="modal-head"><i data-lucide="mail"></i><h2>Last B/L reminder</h2><button class="icon-btn" data-close><i data-lucide="x"></i></button></div><div class="modal-body">${X.mailHTML(X.blMail(s))}</div>`, true);
      if (act === 'blrec') {
        const m = X.openModal(`<div class="modal-head"><i data-lucide="mail-check"></i><h2>Record B/L received by email</h2><button class="icon-btn" data-close><i data-lucide="x"></i></button></div>
          <div class="modal-body"><label class="lbl"><span>B/L file</span><input type="file" class="in" style="padding-top:6px" accept=".pdf,image/*" id="blf"></label><span class="caption">Or use the sample: BL_PACU26118E0412.pdf</span></div>
          <div class="modal-foot"><button class="btn-secondary" data-close>Cancel</button><button class="btn-primary" id="goBl"><i data-lucide="check"></i>Mark received</button></div>`);
        m.querySelector('#goBl').addEventListener('click', () => { const f = m.querySelector('#blf').files[0]; X.save(st => X.aBlReceived(st, { via: 'email', when: X.when('blReceived'), file: f ? f.name : null })); X.closeModal(); render(); toast('Bill of lading recorded', { note: 'Import customs can start at Tanjung Priok' }); });
      }
      if (act === 'balance') {
        const m = X.openModal(`<div class="modal-head"><i data-lucide="send"></i><h2>Issue balance invoice</h2><button class="icon-btn" data-close><i data-lucide="x"></i></button></div>
          <div class="modal-body">${X.mailHTML(X.customerMail('bal', (() => { const t = X.get(); return t; })()))}</div>
          <div class="modal-foot"><button class="btn-secondary" data-close>Cancel</button><button class="btn-primary" id="goBal"><i data-lucide="send"></i>Issue and send</button></div>`, true);
        m.querySelector('#goBal').addEventListener('click', () => { X.save(st => X.aIssueBalance(st, X.when('balance'))); X.closeModal(); render(); toast('Balance invoice sent · shipment closed', { note: `Email sent to ${A.customer.email}` }); });
      }
    });
  };

  /* ============================== Payables ============================== */
  AscoPages['tenant:payables'] = function payables() {
    let s = X.get();
    const render = () => {
      s = X.get();
      const rows = s.approval ? s.approval.pos.map(p => {
        const inv = (s.payables || {})[p.partner], st = X.payStatus(s, p.partner);
        return `<tr><td class="num">${esc(p.no)}<div class="sub">${A.legs[p.leg].label}</div></td><td><div style="display:flex;align-items:center;gap:8px">${LM.orgAvatar(p.partner)}${esc(X.pname(p.partner))}</div></td>
          <td class="amt">${esc(X.cur(p.amount, p.currency))}<div class="sub">≈ ${X.usd(X.toUSD(p.amount, p.currency))}</div></td>
          <td>${inv ? `<span class="num">${esc(inv.no)}</span><div class="sub">${X.fmt(inv.at)} · ${esc(inv.file)}</div>` : '<span class="caption">—</span>'}</td>
          <td class="amt">${inv ? esc(X.cur(inv.amount, inv.currency)) + (inv.checkedAt && !inv.matches ? `<div class="sub" style="color:var(--warning)">${esc(X.cur(inv.amount - p.amount, p.currency))} vs PO</div>` : '') : '<span class="caption">—</span>'}</td>
          <td>${tag(...st)}</td>
          <td style="text-align:right;white-space:nowrap">${inv && !inv.checkedAt ? `<button class="btn-secondary" data-match="${p.partner}"><i data-lucide="scan-search"></i>Match to PO</button>` : ''}
            ${!inv && s.invRequest ? `<button class="link-btn" data-req="${p.partner}">Email</button> <a class="link-btn" href="${partnerLink(p.partner, 'inv')}" target="_blank" rel="noopener">Open as partner (demo)<i data-lucide="external-link"></i></a>` : ''}</td></tr>`;
      }).join('') : '';
      const body = wrap(`<section class="card flush"><div class="card-head"><i data-lucide="wallet"></i><h3>Partner invoices against purchase orders</h3><div class="right"><span class="caption">At POD, LogiMind asks both core partners to invoice ASCO</span></div></div>
        ${s.approval ? `<table class="table cmp" style="margin-top:8px"><thead><tr><th>PO</th><th>Partner</th><th>PO amount</th><th>Invoice</th><th>Invoiced</th><th>Status</th><th></th></tr></thead><tbody>${rows}</tbody></table>
          <p class="fx-note" style="padding:8px 16px 14px;margin:0"><i data-lucide="info"></i>Partners invoice in their PO currency. ${esc(A.fxNote)}</p>`
          : '<div class="empty" style="height:auto;padding:40px 16px"><div class="empty-tile"><i data-lucide="wallet"></i></div><h2 class="empty-title">No purchase orders yet</h2><p class="empty-body">Purchase orders are issued when you approve a shipment.</p></div>'}</section>
        ${s.payables && Object.values(s.payables).some(i => i.checkedAt && !i.matches) ? `<div class="banner warning"><i data-lucide="triangle-alert"></i><div class="text"><b>${esc(X.pname('jaya'))} invoiced ${esc(X.cur(A.partnerInvoices.jaya.amount - A.replies.jaya.amount, 'IDR'))} more than the PO.</b> Their note: ${esc(A.partnerInvoices.jaya.note)}. Approve the difference or ask for a credit note.</div></div>` : ''}`);
      X.frame({ rail: 'payables', row: 'payables', head: head('Payables', s.approval ? esc(X.dsid(s)) : ''), body });
    };
    render(); onStore(render);
    document.addEventListener('click', e => {
      const m = e.target.closest('[data-match]'); if (m) { X.save(st => X.aMatch(st, m.dataset.match, X.addHours(st.payables[m.dataset.match].at, 0.2))); render(); toast('Invoice matched against the PO'); return; }
      const r = e.target.closest('[data-req]'); if (r) X.openModal(`<div class="modal-head"><i data-lucide="mail"></i><h2>Invoice request</h2><button class="icon-btn" data-close><i data-lucide="x"></i></button></div><div class="modal-body">${X.mailHTML(X.invMail(s, r.dataset.req))}<div class="mail-sent"><i data-lucide="check"></i>Sent ${X.fmt(s.invRequest)}</div></div>`, true);
    });
  };

  /* ====================== Core partners (network) ====================== */
  AscoPages['tenant:network'] = function network() {
    const s = X.get();
    const card = (pid) => { const P = A.partners[pid], r = s.rfq && s.rfq.replies[pid];
      return `<section class="card" id="${pid}"><div class="card-head">${LM.orgAvatar(pid)}<h3>${esc(X.pname(pid))}</h3>${tag('Core partner', 'brand')}<div class="right">${X.stars(P.stars)}<span class="ontime">${P.onTime}% on time</span></div></div>
        <dl class="kv2"><dt>Agent type</dt><dd>Core partner · ${P.leg === 'origin' ? 'outbound (export) agent' : 'inbound (import) agent'}</dd><dt>City, country</dt><dd>${esc(P.city)}, ${esc(P.country)}</dd>
          <dt>Business registration</dt><dd class="num">${esc(P.brn)}</dd><dt>Contact</dt><dd>${esc(P.contact)} · ${esc(P.email)}</dd><dt>WhatsApp</dt><dd>${esc(P.whatsapp)}</dd>
          <dt>Works through</dt><dd>${P.mode === 'account' ? 'LogiMind partner account (ops@jayacargo.co.id)' : 'Magic links by email and WhatsApp, no account'}</dd>
          <dt>Usual currency</dt><dd>${P.currency}</dd>${r ? `<dt>Latest reply</dt><dd>${esc(X.cur(r.amount, r.currency))} for ${esc(s.req.id)}</dd>` : ''}</dl></section>`; };
    const body = wrap(`<div class="banner info"><i data-lucide="network"></i><div class="text"><b>Core partners</b> are ASCO’s inbound and outbound agents in the origin and destination countries. The AI plan matches them to each leg by city and country.</div><button class="btn-secondary" data-soon="Invite core partner"><i data-lucide="user-plus"></i>Invite core partner</button></div>
      <h2 style="font-size:14px;font-weight:600;margin:4px 0 0">Shanghai, China · origin leg</h2><div class="a-grid">${X.partnersOn('origin').map(card).join('')}</div>
      <h2 style="font-size:14px;font-weight:600;margin:4px 0 0">Jakarta, Indonesia · destination leg</h2><div class="a-grid">${X.partnersOn('dest').map(card).join('')}</div>`);
    X.frame({ rail: 'network', row: '', head: head('Core partners', '4 partners · 2 per leg'), body });
    if (location.hash) setTimeout(() => { const el = $(location.hash); if (el) el.scrollIntoView({ block: 'center' }); }, 50);
  };

  /* ============================== Customers ============================== */
  AscoPages['tenant:customers'] = function customers() {
    const s = X.get(), C = A.customer;
    const body = wrap(`<div class="a-grid"><div class="a-col">
        <section class="card"><div class="card-head"><span class="org-avatar">${D.orgs.abc.initials}</span><h3>${esc(C.name)}</h3>${tag('Portal active', 'success')}<div class="right">${viewAs(X.P('portal/index.html'))}</div></div>
          <dl class="kv2"><dt>Address</dt><dd>${esc(C.address)}</dd><dt>Country</dt><dd>${esc(C.country)}</dd><dt>Contact</dt><dd>${esc(C.contact)}, ${esc(C.role)}</dd><dt>Contact number</dt><dd>${esc(C.phone)}</dd>
            <dt>WhatsApp</dt><dd>${esc(C.whatsapp)}</dd><dt>Email</dt><dd>${esc(C.email)}</dd><dt>Business registration</dt><dd class="num">${esc(C.brn)}</dd><dt>Customer since</dt><dd>${esc(C.since)}</dd></dl></section>
        <section class="card"><div class="card-head"><i data-lucide="hand-coins"></i><h3>Payment terms</h3></div>
          <dl class="kv2"><dt>Payment after POD</dt><dd>${tag('No', 'neutral')}</dd><dt>Down payment</dt><dd>${tag(C.terms.downPayment + '%', 'info')} at approval · balance after POD</dd><dt>Currency</dt><dd>USD</dd></dl></section>
      </div><div class="a-col">
        <section class="card"><div class="card-head"><i data-lucide="map-pin"></i><h3>Consignee</h3>${tag('Party on shipments · no login', 'neutral')}</div>
          <dl class="kv2"><dt>Name</dt><dd>${esc(A.consignee.name)}</dd><dt>Address</dt><dd>${esc(A.consignee.address)}</dd><dt>Receiving</dt><dd>${esc(A.consignee.contact)}</dd></dl></section>
        <section class="card"><div class="card-head"><i data-lucide="container"></i><h3>Requests and shipments</h3></div>
          ${s.req ? `<ul class="a-list"><li><span class="icon-tile tone-info"><i data-lucide="file-text"></i></span><div><div class="t">${esc(X.dsid(s) || s.req.id)} · ${esc(s.req.title)}</div><div class="d">${esc(A.stages[X.stage(s)])}</div></div><a class="btn-secondary" href="${s.approval ? 'shipment.html' : 'request.html'}">Open</a></li></ul>` : '<p class="caption" style="margin:0">No requests yet.</p>'}</section>
      </div></div>
      <div class="lock-note" style="border-radius:var(--r-md);border:1px solid var(--divider)"><i data-lucide="lock"></i><span>ABC Electronics belongs to ASCO only. It never sees other logistics companies, and other logistics companies never see it.</span></div>`);
    X.frame({ rail: 'customers', row: '', head: head('Customers', '1 customer'), body });
  };

  /* ============================== Settings ============================== */
  AscoPages['tenant:settings-portal'] = function settings() {
    const render = () => {
      const s = X.get(), S = s.settings;
      const pol = [['instant', 'Show instant estimates', 'Price ranges and route options while the shipper types.'], ['pending', 'Show estimates after review', 'Ranges appear once ASCO has looked at the request.'], ['confirmed', 'Only show confirmed quotes', 'No prices or route-price options. The shipper sees a price only when ASCO sends a quotation built from partner costing.']];
      const body = wrap(`<section class="card"><div class="card-head"><i data-lucide="eye"></i><h3>What customers see · prices</h3>${tag('Product decision pending', 'warning')}</div>
          <p class="caption" style="margin:0 0 10px">Per logistics company. ASCO prices from core-partner costing, so its shippers only see confirmed quotations. Product decision pending.</p>
          <div style="display:flex;flex-direction:column;gap:8px">${pol.map(([v, l, d]) => `<label style="display:grid;grid-template-columns:20px 1fr;gap:8px;align-items:start;cursor:pointer"><input type="radio" class="radio" name="pol" value="${v}" ${S.estimatePolicy === v ? 'checked' : ''} style="margin-top:2px"><span><b style="font-weight:500">${l}</b><br><span class="caption">${d}</span></span></label>`).join('')}</div></section>
        <section class="card"><div class="card-head"><i data-lucide="file-clock"></i><h3>Pre-arrival documents</h3></div>
          <label style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">Remind origin partner <input class="in" id="bld" type="number" min="1" max="10" value="${S.blDays}" style="width:64px"> days before arrival at destination port to upload the B/L (sea) or AWB (air).</label>
          <p class="caption" style="margin:8px 0 0">Reminders repeat daily until the document is received. The PIC can also record a B/L that arrived by email.</p></section>
        <section class="card"><div class="card-head"><i data-lucide="percent"></i><h3>Default margin</h3>${internal}</div>
          <label style="display:flex;align-items:center;gap:8px">Suggest <input class="in" id="dm" type="number" min="0" max="50" step="0.5" value="${S.margin}" style="width:72px">% on partner cost when building a quotation.</label></section>`);
      X.frame({ rail: 'settings', row: '', head: head('Settings', 'ASCO customer portal and operations'), body });
    };
    render();
    document.addEventListener('change', e => {
      if (e.target.name === 'pol') { X.save(s => { s.settings.estimatePolicy = e.target.value; }); toast('Saved. Applies to ASCO’s shippers only'); }
      if (e.target.id === 'bld') { X.save(s => { s.settings.blDays = Math.max(1, Math.min(10, +e.target.value || 3)); }); toast('B/L reminder timing saved'); }
      if (e.target.id === 'dm') { X.save(s => { s.settings.margin = Math.max(0, +e.target.value || 0); }); toast('Default margin saved'); }
    });
  };
})();
