/* ==========================================================================
   LogiMind prototype — logistics-company (staff) helpers, after shell.js.
   Customer requests, reply timers, direct booking with API partners,
   AI-drafted customer notifications and the own-customer picker.
   Everything is scoped to the signed-in tenant: other logistics companies'
   customers never appear here.
   ========================================================================== */

window.Staff = (() => {
  const { $, $$, esc, tag, icons, toast, db, data: D } = LM;
  const me = LM.account;
  if (!me || me.persona !== 'tenant') return {};
  const TENANT = me.tenant;
  const T = D.tenants[TENANT];

  // The prototype's clock for seeded data; requests made during a demo use real time.
  const DEMO_NOW = new Date('2026-11-10T16:30:00').getTime();
  const money = (n) => (n < 0 ? '−' : '') + 'US$' + Math.abs(Math.round(n)).toLocaleString('en-US');
  const clock = (ms) => new Date(ms).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  const when = (ms) => ms ? `Today, ${clock(ms)}` : '';

  /* ---------- own customers only ---------- */
  const customers = () => { const d = db.read(), ov = d.customerOverrides || {};
    return D.network.customers.concat(d.customers || []).map(c => ov[c.org] ? { ...c, portal: ov[c.org] } : c); };
  const customer = (org) => customers().find(c => c.org === org) || null;
  const senderOf = (org) => { const c = customer(org); return c && c.sender ? D.accounts.find(a => a.id === c.sender) : null; };

  /* ---------- customer requests (seeded + sent from the portal in this demo) ---------- */
  function requests() {
    const d = db.read(), st = d.reqState || {}, issued = d.issued || {}, dec = d.decisions || {};
    const fromPortal = (d.requests || []).filter(r => r.tenant === TENANT).map(r => ({
      id: r.id, sender: r.sender, org: r.org, lane: r.laneKey, prompt: r.prompt, title: r.title, when: r.when, option: r.option,
      estimate: r.estimate, route: r.route, transit: r.transit, window: r.window, incoterm: r.incoterm, created: r.createdAt, live: true,
      docs: r.docs || [], notes: r.notes || [], status: 'new', events: [['send', `${senderName(r.sender)} sent the request from the portal`, when(r.createdAt)]],
    }));
    const seeded = (TENANT === 'nusantara' ? D.staffRequests || [] : []).map(r => ({ ...r, created: new Date(r.createdAt).getTime(), live: false, events: [...r.events] }));
    return [...fromPortal, ...seeded].map(r => {
      const s = st[r.id] || {};
      const q = issued[r.id] || (r.quote ? { id: r.quote, seeded: true } : null);
      const x = { ...r, state: s, quote: q };
      if (s.declined) x.status = 'declined';
      else if (q) {
        const dd = dec[q.id];
        x.status = dd ? (dd.status === 'accepted' ? 'booked' : 'lost') : 'quoted';
        x.decision = dd || null;
      } else if (s.opened || r.status === 'review') x.status = 'review';
      // timeline
      if (s.openedAt) x.events.push(['eye', `${me.name} opened it`, when(s.openedAt)]);
      (d.bookings || []).filter(b => b.request === r.id).forEach(b => x.events.push(['zap', `Booked ${b.service.toLowerCase()} directly with ${D.orgs[b.org].name} · ${b.ref}`, when(b.at)]));
      if (s.rfqAt) x.events.push(['file-stack', 'RFQs sent to manual partners', when(s.rfqAt)]);
      (s.messages || []).forEach(m => x.events.push([m.from === 'customer' ? 'message-circle' : 'help-circle', m.from === 'customer' ? `${m.who} replied: “${m.text}”` : `You asked: “${m.text}”`, m.time]));
      if (q && !q.seeded) {
        x.events.push(['receipt', `Quote ${q.id} sent (${money(q.lines.reduce((a, l) => a + l[1], 0))})`, when(q.sentAt)]);
        if (q.viewedAt) x.events.push(['eye', `Quote viewed by customer ${clock(q.viewedAt)}`, when(q.viewedAt)]);
      }
      if (x.decision) x.events.push(x.decision.status === 'accepted'
        ? ['badge-check', `Customer accepted · booked as ${x.decision.shipment}`, when(x.decision.at)]
        : ['x', `Customer declined: “${x.decision.reason}”`, when(x.decision.at)]);
      if (s.declined) x.events.push(['circle-x', `You declined: “${s.declineReason}”`, when(s.declinedAt)]);
      return x;
    });
  }
  const request = (id) => requests().find(r => r.id === id) || null;
  const senderName = (id) => { const a = D.accounts.find(x => x.id === id); return a ? a.name : 'Customer'; };

  // Reply timer against the tenant's response target (Settings → Response targets)
  function waitingHours(r) { return ((r.live ? Date.now() : DEMO_NOW) - r.created) / 36e5; }
  function timerHTML(r) {
    if (!['new', 'review'].includes(r.status)) return '';
    const sla = db.settings().slaHours, h = waitingHours(r);
    const w = h < 1 ? `${Math.max(1, Math.round(h * 60))} min` : `${Math.floor(h)}h`;
    const cls = h > sla ? 'overdue' : h > sla * 0.75 ? 'soon' : '';
    return `<span class="timer ${cls}"><i data-lucide="${h > sla ? 'alarm-clock-off' : 'timer'}"></i>Waiting ${w} · ${h > sla ? `past ${sla}h target` : `reply within ${sla}h`}</span>`;
  }
  const STATUS = { new: ['New', 'success', 'sparkles'], review: ['In review', 'info', 'eye'], quoted: ['Quote sent', 'neutral', 'send'], booked: ['Booked', 'success', 'container'], lost: ['Declined by customer', 'warning', 'x'], declined: ['Declined by you', 'neutral', 'circle-x'] };
  const statusTag = (r) => tag(...STATUS[r.status]);

  function touch(id, fn) { db.update(d => { d.reqState = d.reqState || {}; const s = d.reqState[id] = d.reqState[id] || {}; fn(s, d); }); }

  /* ---------- partners: integration + availability ---------- */
  const INTEG = { api: ['API connected', 'Live availability and direct booking'], offline: ['API offline', 'Fall back to RFQ'], manual: ['Manual', 'RFQ by email or WhatsApp link'], pending: ['Invite pending', 'Not connected yet'] };
  const integ = (org) => D.integrations[org] || 'manual';
  const integHTML = (org) => { const k = integ(org); return `<span class="integ ${k}" title="${INTEG[k][1]}"><span class="dot"></span>${INTEG[k][0]}</span>`; };
  function availabilityOn(org, dayIndex) { const a = D.availability[org]; return a && a.days ? a.days[Math.max(0, Math.min(a.days.length - 1, dayIndex))] : null; }
  const dayLabel = (org, i) => { const a = D.availability[org]; const d = new Date(a.start + 'T00:00:00'); d.setDate(d.getDate() + i); return d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' }); };
  const isWeekend = (org, i) => { const a = D.availability[org]; const d = new Date(a.start + 'T00:00:00'); d.setDate(d.getDate() + i); return d.getDay() === 0 || d.getDay() === 6; };

  /* ---------- modal ---------- */
  function openModal(html, wide) {
    let s = $('#sScrim');
    if (!s) {
      document.body.insertAdjacentHTML('beforeend', '<div class="scrim" id="sScrim"><div class="modal" role="dialog" aria-modal="true" id="sModal"></div></div>');
      s = $('#sScrim');
      s.addEventListener('click', e => { if (e.target.id === 'sScrim' || e.target.closest('[data-close]')) closeModal(); });
      document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
    }
    $('#sModal').style.maxWidth = wide ? '680px' : '';
    $('#sModal').innerHTML = html; s.classList.add('open'); icons();
    return $('#sModal');
  }
  function closeModal() { const s = $('#sScrim'); if (s) { s.classList.remove('open'); $('#sModal').innerHTML = ''; } }

  /* ---------- Book directly (API-connected partners) ----------
     Outcome: Confirmed (weekday, enough capacity) · Pending confirmation (weekend) ·
     Rejected: no capacity (suggests an alternative partner) · Offline (fall back to RFQ). */
  function bookDirect({ org, service = 'Trucking', qty = 2, route = 'Rungkut → Tanjung Perak', day = 1, request = null, onDone }) {
    const o = D.orgs[org], k = integ(org);
    if (k === 'offline') {
      openModal(`<div class="modal-head"><i data-lucide="plug-zap"></i><h2>${esc(o.name)} is offline</h2><button class="icon-btn" data-close><i data-lucide="x"></i></button></div>
        <div class="modal-body"><div class="banner danger"><i data-lucide="wifi-off"></i><div class="text"><b>Their API hasn’t responded since ${D.availability[org].offlineSince}.</b> Live availability and direct booking are paused.</div></div>
          <p style="margin:0;font-size:13.5px">Send them an RFQ by email or WhatsApp link instead. It reaches the same people.</p></div>
        <div class="modal-foot"><button class="btn-secondary" data-close>Close</button><a class="btn-primary" href="rfq.html${request ? '?request=' + request : ''}"><i data-lucide="send"></i>Send RFQ instead</a></div>`);
      return;
    }
    const days = D.availability[org].days;
    const m = openModal(`
      <div class="modal-head"><i data-lucide="zap"></i><h2>Book ${esc(service.toLowerCase())} with ${esc(o.name)}</h2><button class="icon-btn" data-close><i data-lucide="x"></i></button></div>
      <div class="modal-body">
        <div style="display:flex;align-items:center;gap:8px">${integHTML(org)}<span class="caption">The booking goes straight into their system.</span></div>
        <div style="display:grid;grid-template-columns:1fr 110px;gap:12px">
          <label style="display:flex;flex-direction:column;gap:6px"><span class="caption" style="font-weight:500">Date</span>
            <select class="select" id="bdDay" style="height:34px">${days.map((d2, i) => `<option value="${i}"${i === day ? ' selected' : ''}>${dayLabel(org, i)} · ${d2[1] || d2[0]} free</option>`).join('')}</select></label>
          <label style="display:flex;flex-direction:column;gap:6px"><span class="caption" style="font-weight:500">Quantity</span>
            <input class="select" id="bdQty" type="number" min="1" max="40" value="${qty}" style="height:34px;padding-right:10px"></label>
        </div>
        <label style="display:flex;flex-direction:column;gap:6px"><span class="caption" style="font-weight:500">Route</span><input class="select" id="bdRoute" value="${esc(route)}" style="height:34px;padding-right:10px"></label>
        <div id="bdAvail" class="caption"></div>
      </div>
      <div class="modal-foot"><span class="caption left">Rate US$${D.availability[org].rate} per ${D.availability[org].unit === 'trucks' ? 'truck' : 'unit'} · your rate card</span>
        <button class="btn-secondary" data-close>Cancel</button><button class="btn-primary" id="bdGo"><i data-lucide="zap"></i>Confirm booking</button></div>`);
    const upd = () => { const i = +m.querySelector('#bdDay').value, q = +m.querySelector('#bdQty').value; const a = days[i][1] || days[i][0];
      m.querySelector('#bdAvail').innerHTML = q > a ? `<span style="color:var(--danger)">Only ${a} free on ${dayLabel(org, i)}: this will be rejected.</span>` : `${a} free on ${dayLabel(org, i)}${isWeekend(org, i) ? ' · weekend bookings need manual confirmation' : ''}.`; };
    m.querySelector('#bdDay').addEventListener('change', upd); m.querySelector('#bdQty').addEventListener('input', upd); upd();
    m.querySelector('#bdGo').addEventListener('click', () => {
      const i = +m.querySelector('#bdDay').value, q = +m.querySelector('#bdQty').value, r2 = m.querySelector('#bdRoute').value;
      const a = days[i][1] || days[i][0];
      const status = q > a ? 'rejected' : isWeekend(org, i) ? 'pending' : 'confirmed';
      const ref = D.bookingRefs[org] ? D.bookingRefs[org].replace(/\d+$/, n => String(+n + (db.read().bookings || []).length)) : 'REF-1';
      if (status !== 'rejected') db.update(d => { (d.bookings = d.bookings || []).push({ org, service, qty: q, route: r2, day: dayLabel(org, i), ref, status, request, at: Date.now() }); });
      showResult({ org, status, ref, q, day: dayLabel(org, i), service, request });
      if (status !== 'rejected' && onDone) onDone({ ref, status });
    });
  }
  function showResult({ org, status, ref, q, day, service, request }) {
    const o = D.orgs[org];
    const body = {
      confirmed: `<div class="banner success"><i data-lucide="badge-check"></i><div class="text"><b>Booking sent to ${esc(o.name)}’s system · Reference ${ref} · Confirmed</b><br>${q} × ${esc(service.toLowerCase())} on ${day}.</div></div>`,
      pending: `<div class="banner info"><i data-lucide="hourglass"></i><div class="text"><b>Booking sent · Reference ${ref} · Pending confirmation</b><br>Weekend jobs are confirmed by their dispatcher, usually within 2 hours.</div></div>`,
      rejected: `<div class="banner danger"><i data-lucide="circle-x"></i><div class="text"><b>Rejected: no capacity</b><br>${esc(o.name)} doesn’t have ${q} free on ${day}.</div></div>
        <div class="card" style="display:flex;align-items:center;gap:10px;padding:12px">${LM.orgAvatar('brantas')}<div style="flex:1"><b style="font-weight:600">Suggested alternative: ${esc(D.orgs.brantas.name)}</b><div class="caption">Manual partner · East Java lane · last quote US$172 per truck</div></div>
          <a class="btn-secondary" href="rfq.html${request ? '?request=' + request : ''}"><i data-lucide="send"></i>Send RFQ</a></div>`,
    }[status];
    openModal(`<div class="modal-head"><i data-lucide="${status === 'rejected' ? 'circle-x' : 'zap'}"></i><h2>${status === 'rejected' ? 'Booking rejected' : 'Booking sent'}</h2><button class="icon-btn" data-close><i data-lucide="x"></i></button></div>
      <div class="modal-body">${body}</div><div class="modal-foot">${status === 'rejected' ? '<button class="btn-secondary" data-retry>Try another date</button>' : ''}<button class="btn-secondary" data-close>Done</button></div>`);
    const retry = $('#sModal [data-retry]'); if (retry) retry.addEventListener('click', () => bookDirect({ org, service, qty: q, day: 4, request }));
    if (status !== 'rejected') toast(status === 'confirmed' ? `${ref} confirmed by ${o.name}` : `${ref} sent, pending confirmation`);
  }

  /* ---------- Notify customer (AI draft, editable, goes to the portal) ---------- */
  function notifyCustomer({ shipment, org, draft, onSent }) {
    const c = customer(org), s = senderOf(org);
    const channel = c && c.portal === 'active' && s ? `${T.short} portal + WhatsApp` : 'WhatsApp (not on the portal yet)';
    const m = openModal(`
      <div class="modal-head"><i data-lucide="send"></i><h2>Notify ${esc(D.orgs[org].name)}</h2><button class="icon-btn" data-close><i data-lucide="x"></i></button></div>
      <div class="modal-body">
        <span class="ai-label"><i data-lucide="sparkles"></i>AI draft. Edit before sending.</span>
        <textarea class="textarea" id="ncText" rows="6" style="border:1px solid var(--border);border-radius:6px;padding:8px 10px;line-height:1.45;resize:vertical">${esc(draft)}</textarea>
        <div class="caption">To <b style="font-weight:500">${esc(c ? c.contact : 'customer')}</b> · via ${esc(channel)}</div>
        ${LM.visibility('You, ' + esc(D.orgs[org].name))}
        <div class="caption" style="display:flex;gap:6px;align-items:center"><i data-lucide="shield-check" style="width:12px;height:12px"></i>Partner names and costs are never included in customer messages.</div>
      </div>
      <div class="modal-foot"><button class="btn-secondary" data-close>Cancel</button><button class="btn-primary" id="ncSend"><i data-lucide="send"></i>Send to customer</button></div>`, true);
    m.querySelector('#ncSend').addEventListener('click', () => {
      const text = m.querySelector('#ncText').value.trim();
      db.update(d => { d.shipMessages = d.shipMessages || {}; (d.shipMessages[shipment] = d.shipMessages[shipment] || []).push({ who: me.name, staff: true, time: 'Just now', text }); });
      closeModal(); toast(`Sent to ${D.orgs[org].name}`, { note: `Via ${channel}` }); if (onSent) onSent(text);
    });
  }

  /* ---------- pick one of YOUR customers ---------- */
  function pickCustomer(onPick, title = 'Who is this request for?') {
    const list = customers().filter(c => c.portal !== 'expired');
    const m = openModal(`
      <div class="modal-head"><i data-lucide="building-2"></i><h2>${esc(title)}</h2><button class="icon-btn" data-close><i data-lucide="x"></i></button></div>
      <div class="modal-body">
        <input class="select" id="pcQ" placeholder="Search your customers" style="height:34px;padding-right:10px">
        <div id="pcList" style="display:flex;flex-direction:column;gap:6px"></div>
        <div class="caption" style="display:flex;gap:6px;align-items:center"><i data-lucide="lock" style="width:12px;height:12px"></i>Only ${esc(T.short)}’s own customers are listed. There’s no search across other companies.</div>
      </div>`);
    const draw = (q = '') => { m.querySelector('#pcList').innerHTML = list.filter(c => D.orgs[c.org].name.toLowerCase().includes(q.toLowerCase())).map(c => `
      <button class="card" data-pick="${c.org}" style="display:flex;align-items:center;gap:10px;padding:10px 12px;text-align:left">${LM.orgAvatar(c.org)}
        <span style="flex:1"><b style="font-weight:600">${esc(D.orgs[c.org].name)}</b><span class="caption" style="display:block">${esc(c.contact)} · ${c.lanes.join(', ')}</span></span>
        ${c.portal === 'none' ? tag('WhatsApp only', 'neutral') : ''}</button>`).join('') || '<span class="caption">No match among your customers.</span>'; icons(); };
    draw();
    m.querySelector('#pcQ').addEventListener('input', e => draw(e.target.value));
    m.addEventListener('click', e => { const b = e.target.closest('[data-pick]'); if (b) { closeModal(); onPick(b.dataset.pick); } });
  }

  /* ---------- "View as customer" ---------- */
  function viewAsHref(org, portalPath) { const s = senderOf(org); return s ? `portal/${portalPath}${portalPath.includes('?') ? '&' : '?'}viewas=${s.id}` : null; }
  function viewAsLink(org, portalPath, label = 'View as customer') {
    const h = viewAsHref(org, portalPath);
    return h ? `<a class="link-btn" href="${h}" title="Opens the customer’s portal page, read-only"><i data-lucide="eye"></i>${label}</a>`
      : `<span class="caption" title="This customer isn’t on the portal yet">Not on the portal yet</span>`;
  }
  const lockBadge = () => `<span class="lock-badge"><i data-lucide="lock"></i>Only visible to ${esc(T.short)}</span>`;

  return { T, money, customers, customer, senderOf, requests, request, timerHTML, waitingHours, statusTag, STATUS, touch,
    integ, integHTML, availabilityOn, dayLabel, bookDirect, notifyCustomer, pickCustomer, viewAsHref, viewAsLink, lockBadge,
    openModal, closeModal, when };
})();
