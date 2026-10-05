/* ==========================================================================
   LogiMind prototype — shared app shell (icon rail + Home context sidebar)
   Page markup: <div class="app" data-rail="home" data-row="overview">
                  <div class="workspace"><main class="main">…</main></div>
                </div>
   ========================================================================== */

window.LM = (() => {
  const D = window.LMData;

  /* ---------- demo session (prototype only) ----------
     Pages under /portal/ belong to senders, /partner/ to partners, everything
     else to logistics-company staff. A page opened without a session goes to
     login.html; a page from another persona goes to that account's own home.
     Public pages (login, invite acceptance) set window.LM_PUBLIC = true. */
  const BASE = /\/(portal|partner)\//.test(location.pathname) ? '../' : '';
  const PAGE_PERSONA = /\/portal\//.test(location.pathname) ? 'sender' : /\/partner\//.test(location.pathname) ? 'partner' : 'tenant';
  const SESSION_KEY = 'lm.session';
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return (window.name.startsWith(k + '=') && window.name.slice(k.length + 1)) || null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) { window.name = k + '=' + v; } },
    remove(k) { try { localStorage.removeItem(k); } catch (e) { if (window.name.startsWith(k + '=')) window.name = ''; } },
  };
  function currentAccount() {
    try { const s = JSON.parse(store.get(SESSION_KEY) || 'null'); return s && D.accounts.find(a => a.id === s.id) || null; } catch (e) { return null; }
  }
  function signIn(id) { store.set(SESSION_KEY, JSON.stringify({ id, at: Date.now() })); }
  function signOut() { store.remove(SESSION_KEY); }
  const account = currentAccount();
  // Staff "View as customer": ?viewas=<sender id> on a portal page, own customers only, read-only
  const viewAsId = new URLSearchParams(location.search).get('viewas');
  const viewAs = account && account.persona === 'tenant' && PAGE_PERSONA === 'sender' && viewAsId
    ? D.accounts.find(a => a.id === viewAsId && a.persona === 'sender' && a.tenant === account.tenant) || null : null;
  const effective = viewAs || account;
  let redirecting = false;
  if (!window.LM_PUBLIC) {
    const go = (url) => { redirecting = true; document.documentElement.style.visibility = 'hidden'; location.replace(url); };
    // remember the page so login can return here (root-relative, e.g. "chat.html?x=1")
    const file = location.pathname.split('/').filter(Boolean).pop() || '';
    const here = file ? { sender: 'portal/', partner: 'partner/' }[PAGE_PERSONA] || '' : '';
    const nextPath = file ? here + file + location.search : '';
    if (!account) go(BASE + 'login.html' + (nextPath && nextPath !== 'index.html' ? '?next=' + encodeURIComponent(nextPath) : ''));
    else if (account.persona !== PAGE_PERSONA && !viewAs) go(BASE + account.home);
  }
  // Senders see only their own logistics company
  const tenant = effective && effective.tenant ? D.tenants[effective.tenant] : D.tenants.nusantara;

  /* ---------- shared demo backend (prototype only) ----------
     Both personas read and write one JSON document in this browser, so a
     request sent in the portal shows up in the staff Inbox, and so on. */
  const DB_KEY = 'lm.db';
  const db = {
    read() { try { return JSON.parse(store.get(DB_KEY) || '{}'); } catch (e) { return {}; } },
    write(d) { store.set(DB_KEY, JSON.stringify(d)); },
    update(fn) { const d = db.read(); fn(d); db.write(d); return d; },
    reset() { store.remove(DB_KEY); },
    settings() { return Object.assign({}, D.portalDefaults, db.read().settings || {}); },
  };
  // customers invited during a demo (stored in LM.db) become known organisations for this tenant
  (db.read().customers || []).forEach(c => { if (c.orgInfo && !D.orgs[c.org]) D.orgs[c.org] = c.orgInfo; });

  const RAIL = [
    { id: 'home', label: 'Home', icon: 'house', href: 'index.html' },
    { id: 'shipments', label: 'Shipments', icon: 'container', href: 'shipment.html' },
    { id: 'customers', label: 'Customers', icon: 'building-2', href: 'customers.html' },
    { id: 'rfqs', label: 'RFQs', title: 'RFQs & Quotes', icon: 'file-stack', href: 'rfq.html' },
    { id: 'network', label: 'Partners', title: 'Partner network', icon: 'network', href: 'network.html' },
    { id: 'assistant', label: 'Assistant', icon: 'sparkles', href: 'chat.html' },
    { id: 'docs', label: 'Docs', icon: 'file-text' },
    { id: 'planner', label: 'Planner', icon: 'calendar-days' },
  ];

  const HOME_ROWS = [
    { id: 'overview', label: 'Overview', icon: 'layout-panel-top', href: 'index.html' },
    { id: 'inbox', label: 'Inbox', icon: 'inbox', href: 'inbox.html', count: D.inbox.primary.length, requests: true },
    { id: 'replies', label: 'Replies', icon: 'reply' },
    { id: 'assigned', label: 'Assigned to me', icon: 'at-sign', count: 4 },
    { id: 'actions', label: 'Action items', icon: 'list-checks', count: D.attention.length },
    { id: 'tasks', label: 'My tasks', icon: 'circle-check' },
  ];

  const AVATAR_COLORS = ['var(--avatar-teal)', 'var(--avatar-indigo)', 'var(--avatar-violet)'];

  /* ---------- helpers ---------- */
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const esc = (s) => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const icons = () => window.lucide && lucide.createIcons({ attrs: { 'stroke-width': 1.6 } });
  const tag = (label, tone, icon) => `<span class="tag ${tone}">${icon ? `<i data-lucide="${icon}"></i>` : ''}${label}</span>`;
  const visibility = (who) => `<span class="visibility" title="Who can see this"><i data-lucide="eye"></i>Visible to: <b>${who}</b></span>`;
  const orgAvatar = (key) => { const o = D.orgs[key]; return `<span class="org-avatar" title="${o.name}">${o.initials}</span>`; };

  let toastTimer;
  function toast(msg, opts = {}) {
    let t = $('#toast');
    if (!t) {
      document.body.insertAdjacentHTML('beforeend', '<div class="toast" id="toast"><i data-lucide="info"></i><span class="toast-body"><span class="toast-msg"></span><small class="toast-note"></small></span></div>');
      t = $('#toast');
      icons();
    }
    $('.toast-msg', t).textContent = msg;
    $('.toast-note', t).textContent = opts.note || '';
    $('.toast-note', t).style.display = opts.note ? 'block' : 'none';
    t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove('show'), opts.note ? 4200 : 2400);
  }
  const soon = (what) => toast(`${what} — designed in a later screen`);

  /* ---------- rail ---------- */
  function railHTML(active) {
    const item = (r) => {
      const tagName = r.href ? 'a' : 'button';
      const attrs = r.href ? `href="${r.href}"` : `data-soon="${r.title || r.label}"`;
      return `<${tagName} class="rail-item${r.id === active ? ' active' : ''}" ${attrs} title="${r.title || r.label}">
        <span class="glyph"><i data-lucide="${r.icon}"></i></span>
        <span class="label">${r.label}</span>
      </${tagName}>`;
    };
    return `
      <nav class="rail" aria-label="Primary">
        <a class="rail-logo" href="index.html" title="LogiMind"><img src="assets/logo.svg" alt="LogiMind"></a>
        <div class="rail-list">${RAIL.map(item).join('')}</div>
        <div class="rail-spacer"></div>
        <a class="rail-item${active === 'settings' ? ' active' : ''}" href="settings-portal.html" title="Settings">
          <span class="glyph"><i data-lucide="settings"></i></span>
          <span class="label">Settings</span>
        </a>
        <button class="rail-item" data-soon="Invite partner" title="Invite partner">
          <span class="glyph"><i data-lucide="user-plus"></i></span>
          <span class="label">Invite</span>
        </button>
        ${railAvatarHTML()}
      </nav>`;
  }

  /* ---------- account avatar + menu (all personas) ---------- */
  const initialsOf = (name) => name.split(/\s+/).map(w => w[0]).join('').slice(0, 2).toUpperCase();
  function railAvatarHTML() {
    if (!account) return '';
    return `<button class="rail-avatar" data-action="user-menu" title="${esc(account.name)} · ${esc(account.company)}" aria-haspopup="menu" aria-expanded="false">
      <span class="user-avatar" style="background:${AVATAR_COLORS[account.color || 0]}">${initialsOf(account.name)}</span></button>`;
  }
  function userMenuHTML() {
    if (!account) return '';
    return `<div class="user-menu" role="menu" id="userMenu">
      <div class="um-head">
        <span class="user-avatar" style="background:${AVATAR_COLORS[account.color || 0]}">${initialsOf(account.name)}</span>
        <div><b>${esc(account.name)}</b><div class="caption">${esc(account.role)} · ${esc(account.company)}</div></div>
      </div>
      <div class="um-persona"><span class="tag neutral">${esc(account.personaLabel)}</span><span class="caption">${esc(account.email)}</span></div>
      <a role="menuitem" href="${BASE}login.html"><i data-lucide="repeat"></i>Switch demo account</a>
      <button role="menuitem" data-action="sign-out"><i data-lucide="log-out"></i>Sign out</button>
    </div>`;
  }
  function demoChipHTML() {
    if (!account) return '';
    let hidden = false;
    try { hidden = sessionStorage.getItem('lm.chip.hidden') === '1'; } catch (e) {}
    if (hidden) return '';
    return `<div class="demo-chip" id="demoChip"><span class="dot"></span>Demo mode · signed in as <b>${esc(account.personaLabel)}</b><span class="who">${esc(account.name)}, ${esc(account.company)}${viewAs ? ` · previewing ${esc(viewAs.name)}’s portal` : ''}</span>
      <button data-action="dismiss-chip" title="Hide" aria-label="Hide demo banner"><i data-lucide="x"></i></button></div>`;
  }

  /* ---------- customer requests waiting for this tenant ---------- */
  function awaitingRequests() {
    if (!account || account.persona !== 'tenant') return 0;
    const d = db.read(); const st = d.reqState || {};
    const mine = (D.staffRequests || []).filter(r => r.status === 'review' && !(st[r.id] && (st[r.id].quoteSent || st[r.id].declined)));
    const fromPortal = (d.requests || []).filter(r => r.tenant === account.tenant && !(st[r.id] && (st[r.id].quoteSent || st[r.id].declined)));
    return mine.length + fromPortal.length;
  }

  /* ---------- Home context sidebar ---------- */
  // ?state=new renders a brand-new tenant: no chats, lanes, partners or counts yet.
  const isNewTenant = new URLSearchParams(location.search).get('state') === 'new';

  function sidebarHTML(activeRow) {
    const row = (r) => {
      const tagName = r.href ? 'a' : 'button';
      const attrs = r.href ? `href="${r.href}"` : `data-soon="${r.label}"`;
      return `<${tagName} class="row${r.id === activeRow ? ' active' : ''}" ${attrs}>
        <i data-lucide="${r.icon}"></i><span class="text">${r.label}</span>${r.requests && !isNewTenant && awaitingRequests() ? `<span class="tag success" title="New customer requests" style="margin-left:auto;padding:0 5px">${awaitingRequests()} new</span>` : ''}${r.count && !isNewTenant ? `<span class="count"${r.requests && awaitingRequests() ? ' style="margin-left:6px"' : ''}>${r.count}</span>` : ''}
      </${tagName}>`;
    };
    const t = D.tenant;
    return `
      <aside class="sidebar" aria-label="Home">
        <div class="sidebar-header">
          <h1 class="sidebar-title" title="${t.name}">${t.short}</h1>
          <div class="split-add">
            <button title="New request by prompt" data-action="new-prompt"><i data-lucide="plus"></i></button>
            <button title="More create options" data-action="toggle-menu" aria-haspopup="menu" aria-expanded="false"><i data-lucide="chevron-down"></i></button>
            <div class="menu" role="menu">
              <button role="menuitem" data-action="new-prompt"><i data-lucide="sparkles"></i>New request by prompt</button>
              <button role="menuitem" data-soon="New RFQ"><i data-lucide="file-plus-2"></i>New RFQ</button>
              <button role="menuitem" data-soon="Invite partner"><i data-lucide="user-plus"></i>Invite partner</button>
              <button role="menuitem" data-soon="Upload document"><i data-lucide="upload"></i>Upload document</button>
            </div>
          </div>
        </div>

        <div class="sidebar-scroll">
          <div class="nav">${HOME_ROWS.map(row).join('')}</div>

          <div class="divider"></div>

          <div class="section">
            <div class="section-head"><span class="section-label">AI Chats</span></div>
            <div class="nav">
              <button class="row placeholder" data-action="new-prompt"><i data-lucide="plus"></i><span class="text">Ask, Plan, Ship</span></button>
              ${isNewTenant ? '' : `
              <a class="row${activeRow === 'chat-coffee' ? ' active' : ''}" href="chat.html"><i data-lucide="sparkles"></i><span class="text">2 × 40ft coffee · SUB → SHA</span></a>
              <button class="row" data-soon="AI chat"><i data-lucide="sparkles"></i><span class="text">3 trucks Cikarang → Priok</span></button>
              <button class="row" data-soon="AI chat"><i data-lucide="sparkles"></i><span class="text">LCL furniture · SRG → RTM</span></button>`}
            </div>
          </div>

          <div class="section">
            <div class="section-head">
              <span class="section-label">Trade Lanes</span>
              <button class="section-add" title="New trade lane" data-soon="New trade lane"><i data-lucide="plus"></i></button>
            </div>
            <div class="nav">
              <button class="row" data-soon="Shipments"><i data-lucide="container"></i><span class="text">All shipments <span class="suffix">— ${t.short}</span></span></button>
              ${isNewTenant ? '' : `
              <button class="row" data-soon="Trade lane"><span class="space-avatar">I</span><span class="text">ID → CN</span></button>
              <button class="row" data-soon="Trade lane"><span class="space-avatar">S</span><span class="text">Surabaya → Jakarta</span></button>
              <button class="row" data-soon="Trade lane"><span class="space-avatar">J</span><span class="text">JP → ID</span></button>`}
              <button class="row placeholder" data-soon="New trade lane"><i data-lucide="plus"></i><span class="text">New Trade Lane</span></button>
            </div>
          </div>

          <div class="section">
            <div class="section-head">
              <span class="section-label">Channels</span>
              <button class="section-add" title="Add channel" data-soon="Add channel"><i data-lucide="plus"></i></button>
            </div>
            <div class="nav">
              <button class="row" data-soon="Channel"><span class="channel-glyph"><i data-lucide="hash"></i><span class="badge">${t.initial}</span></span><span class="text">ops-surabaya</span></button>
              ${isNewTenant ? '' : `<button class="row" data-soon="Channel"><span class="channel-glyph"><i data-lucide="hash"></i><span class="badge">${t.initial}</span></span><span class="text">sales</span></button>`}
              <button class="row placeholder" data-soon="Add channel"><i data-lucide="plus"></i><span class="text">Add Channel</span></button>
            </div>
          </div>

          <div class="section">
            <div class="section-head">
              <span class="section-label">Direct Messages</span>
              <button class="section-add" title="New message" data-soon="New message"><i data-lucide="plus"></i></button>
            </div>
            <div class="nav">
              ${dm('Arief Hidayat', 0, { online: true })}
              ${dm('Putri Anggraini', 2)}
              ${isNewTenant ? `<button class="row placeholder" data-soon="Invite partner"><i data-lucide="plus"></i><span class="text">Invite a partner</span></button>` : `
              ${dm('Budi Santoso', 1, { org: 'truk' })}
              ${dm('Sari Wulandari', 0, { org: 'kopi' })}`}
            </div>
          </div>
        </div>
      </aside>`;
  }

  /* ---------- RFQs & Quotes context sidebar ---------- */
  const RFQ_ROWS = [
    { id: 'all', label: 'All RFQs', icon: 'file-stack', count: 7 },
    { id: 'compare', label: 'Ready to compare', icon: 'git-compare-arrows', count: 3 },
    { id: 'waiting', label: 'Awaiting replies', icon: 'hourglass', count: 2 },
    { id: 'awarded', label: 'Awarded', icon: 'award' },
    { id: 'expired', label: 'Expired', icon: 'timer-off', count: 1 },
  ];
  const QUOTE_ROWS = [
    { id: 'q-drafts', label: 'Drafts', icon: 'file-pen-line', count: 2, href: 'quote.html' },
    { id: 'q-sent', label: 'Sent to customer', icon: 'send', count: 4 },
    { id: 'q-accepted', label: 'Accepted', icon: 'circle-check' },
  ];
  const RECENT_RFQS = [
    { id: 'RFQ-0194', label: '2 × 40ft coffee · SUB → SHA', href: 'rfq.html', row: 'rfq-0194' },
    { id: 'RFQ-0193', label: 'LCL furniture · SRG → RTM' },
    { id: 'RFQ-0192', label: '3 trucks Cikarang → Priok' },
  ];

  function rfqSidebarHTML(activeRow) {
    const row = (r) => {
      const tagName = r.href ? 'a' : 'button';
      const attrs = r.href ? `href="${r.href}"` : `data-soon="${r.label}"`;
      return `<${tagName} class="row${r.id === activeRow ? ' active' : ''}" ${attrs}>
        <i data-lucide="${r.icon}"></i><span class="text">${r.label}</span>${r.count ? `<span class="count">${r.count}</span>` : ''}</${tagName}>`;
    };
    const recent = (r) => {
      const tagName = r.href ? 'a' : 'button';
      const attrs = r.href ? `href="${r.href}"` : `data-soon="${r.id}"`;
      return `<${tagName} class="row${r.row === activeRow ? ' active' : ''}" ${attrs}>
        <i data-lucide="file-text"></i><span class="text"><span class="num">${r.id}</span> <span class="suffix">${r.label}</span></span></${tagName}>`;
    };
    return `
      <aside class="sidebar" aria-label="RFQs & Quotes">
        <div class="sidebar-header">
          <h1 class="sidebar-title">RFQs & Quotes</h1>
          <div class="split-add">
            <button title="New request by prompt" data-action="new-prompt"><i data-lucide="plus"></i></button>
            <button title="More create options" data-action="toggle-menu" aria-haspopup="menu" aria-expanded="false"><i data-lucide="chevron-down"></i></button>
            <div class="menu" role="menu">
              <button role="menuitem" data-action="new-prompt"><i data-lucide="sparkles"></i>New request by prompt</button>
              <button role="menuitem" data-soon="New RFQ"><i data-lucide="file-plus-2"></i>New RFQ (manual)</button>
              <button role="menuitem" data-soon="New quote"><i data-lucide="receipt"></i>New quote</button>
            </div>
          </div>
        </div>
        <div class="sidebar-scroll">
          <div class="nav">${RFQ_ROWS.map(row).join('')}</div>
          <div class="divider"></div>
          <div class="section">
            <div class="section-head"><span class="section-label">Customer quotes</span></div>
            <div class="nav">${QUOTE_ROWS.map(row).join('')}</div>
          </div>
          <div class="section">
            <div class="section-head"><span class="section-label">Recent RFQs</span></div>
            <div class="nav">${RECENT_RFQS.map(recent).join('')}</div>
          </div>
        </div>
      </aside>`;
  }

  /* ---------- Shipments context sidebar ---------- */
  function shipmentsSidebarHTML(activeRow) {
    const rows = [
      { id: 'active', label: 'Active', icon: 'container', count: 21 },
      { id: 'attention', label: 'Needs attention', icon: 'flag', count: 3 },
      { id: 'departing', label: 'Departing this week', icon: 'ship', count: 4 },
      { id: 'arriving', label: 'Arriving this week', icon: 'anchor', count: 3 },
      { id: 'completed', label: 'Completed', icon: 'circle-check' },
    ];
    const recent = [
      { id: 'SHP-2411', label: 'Coffee · SUB → SHA', href: 'shipment.html', row: 'shp-2411' },
      { id: 'SHP-2398', label: 'Electronics · NGO → TPP' },
      { id: 'SHP-2402', label: 'Furniture · SRG → RTM' },
      { id: 'SHP-2415', label: 'Trucking · CKR → TPP' },
    ];
    const link = (r, inner) => r.href
      ? `<a class="row${r.row === activeRow ? ' active' : ''}" href="${r.href}">${inner}</a>`
      : `<button class="row${r.id === activeRow ? ' active' : ''}" data-soon="${r.label}">${inner}</button>`;
    return `
      <aside class="sidebar" aria-label="Shipments">
        <div class="sidebar-header">
          <h1 class="sidebar-title">Shipments</h1>
          <div class="split-add">
            <button title="New request by prompt" data-action="new-prompt"><i data-lucide="plus"></i></button>
            <button title="More create options" data-action="toggle-menu" aria-haspopup="menu" aria-expanded="false"><i data-lucide="chevron-down"></i></button>
            <div class="menu" role="menu">
              <button role="menuitem" data-action="new-prompt"><i data-lucide="sparkles"></i>New request by prompt</button>
              <button role="menuitem" data-soon="New shipment"><i data-lucide="container"></i>New shipment (manual)</button>
              <button role="menuitem" data-soon="Upload document"><i data-lucide="upload"></i>Upload document</button>
            </div>
          </div>
        </div>
        <div class="sidebar-scroll">
          <div class="nav">${rows.map(r => link(r, `<i data-lucide="${r.icon}"></i><span class="text">${r.label}</span>${r.count ? `<span class="count">${r.count}</span>` : ''}`)).join('')}</div>
          <div class="divider"></div>
          <div class="section">
            <div class="section-head"><span class="section-label">Recent</span></div>
            <div class="nav">${recent.map(r => link(r, `<i data-lucide="container"></i><span class="text"><span class="num">${r.id}</span> <span class="suffix">${r.label}</span></span>`)).join('')}</div>
          </div>
          <div class="section">
            <div class="section-head"><span class="section-label">Trade Lanes</span></div>
            <div class="nav">
              <button class="row" data-soon="Trade lane"><span class="space-avatar">I</span><span class="text">ID → CN</span></button>
              <button class="row" data-soon="Trade lane"><span class="space-avatar">S</span><span class="text">Surabaya → Jakarta</span></button>
              <button class="row" data-soon="Trade lane"><span class="space-avatar">J</span><span class="text">JP → ID</span></button>
            </div>
          </div>
        </div>
      </aside>`;
  }

  /* ---------- Customers context sidebar ---------- */
  function customersSidebarHTML(activeRow) {
    const C = D.network.customers.concat(db.read().customers || []);
    const n = (p) => C.filter(c => !p || c.portal === p).length;
    const row = (id, href, icon, label, count) => `<a class="row${activeRow === id ? ' active' : ''}" href="${href}"><i data-lucide="${icon}"></i><span class="text">${label}</span>${count ? `<span class="count">${count}</span>` : ''}</a>`;
    return `
      <aside class="sidebar" aria-label="Customers">
        <div class="sidebar-header">
          <h1 class="sidebar-title">Customers</h1>
          <div class="split-add">
            <button title="Invite customer" data-action="invite-customer"><i data-lucide="plus"></i></button>
            <button title="More" data-action="toggle-menu" aria-haspopup="menu" aria-expanded="false"><i data-lucide="chevron-down"></i></button>
            <div class="menu" role="menu">
              <button role="menuitem" data-action="invite-customer"><i data-lucide="user-plus"></i>Invite customer</button>
              <a role="menuitem" href="chat.html"><i data-lucide="sparkles"></i>New request for a customer</a>
            </div>
          </div>
        </div>
        <div class="sidebar-scroll">
          <div class="nav">
            ${row('all', 'customers.html', 'building-2', 'All customers', n())}
            ${row('active', 'customers.html?portal=active', 'circle-check', 'Portal active', n('active'))}
            ${row('invited', 'customers.html?portal=invited', 'mail', 'Invited', n('invited') + n('expired'))}
            ${row('none', 'customers.html?portal=none', 'message-circle', 'Not yet invited', n('none'))}
          </div>
          <div class="divider"></div>
          <div class="section">
            <div class="section-head"><span class="section-label">Your customers</span></div>
            <div class="nav">${C.filter(c => c.portal !== 'expired').map(c => `<a class="row${activeRow === 'c-' + c.org ? ' active' : ''}" href="customer.html?id=${c.org}">
              <span class="org-avatar" style="width:18px;height:18px;font-size:8px;border-radius:4px">${D.orgs[c.org].initials}</span><span class="text">${esc(D.orgs[c.org].name)}</span></a>`).join('')}</div>
          </div>
        </div>
        <div class="lock-note"><i data-lucide="lock"></i><span>Your customers are only visible to ${esc(D.tenant.short)}. They’re never listed in the marketplace or shared with other logistics companies.</span></div>
      </aside>`;
  }

  /* ---------- Settings context sidebar ---------- */
  function settingsSidebarHTML() {
    const rows = [['branding', 'Branding', 'palette'], ['visibility', 'What customers see', 'eye'], ['pricing', 'Pricing and margins', 'receipt'], ['lanes', 'Lanes served', 'route'], ['guardrails', 'AI guardrails', 'shield-check'], ['sla', 'Response targets', 'timer']];
    return `
      <aside class="sidebar" aria-label="Settings">
        <div class="sidebar-header"><h1 class="sidebar-title">Settings</h1></div>
        <div class="sidebar-scroll">
          <div class="nav"><a class="row active" href="settings-portal.html"><i data-lucide="monitor-smartphone"></i><span class="text">Customer portal</span></a>
            <button class="row" data-soon="Team settings"><i data-lucide="users"></i><span class="text">Team</span></button>
            <button class="row" data-soon="Integrations"><i data-lucide="plug"></i><span class="text">Integrations</span></button>
            <button class="row" data-soon="Billing"><i data-lucide="credit-card"></i><span class="text">Billing</span></button></div>
          <div class="divider"></div>
          <div class="section"><div class="section-head"><span class="section-label">Customer portal</span></div>
            <div class="nav">${rows.map(([id, l, i]) => `<a class="row" href="#${id}"><i data-lucide="${i}"></i><span class="text">${l}</span></a>`).join('')}</div></div>
        </div>
      </aside>`;
  }

  /* ---------- Network context sidebar ---------- */
  function networkSidebarHTML(activeRow) {
    const N = D.network;
    const noCounts = isNewTenant || new URLSearchParams(location.search).get('state') === 'empty';
    const pending = N.invitations.sent.filter(i => i.status === 'pending').length;
    const rows = [
      { id: 'vendors', label: 'My partners', icon: 'truck', href: 'network.html?tab=vendors', count: N.vendors.length },
      { id: 'invitations', label: 'Invitations', icon: 'mail', href: 'network.html?tab=invitations', count: pending },
      { id: 'marketplace', label: 'Marketplace', icon: 'store', href: 'network.html?tab=marketplace', soon: true },
    ];
    const typeIcon = { 'Trucking': 'truck', 'Warehouse': 'warehouse', 'Packing / Fumigation': 'wind', 'Customs broker': 'stamp', 'Shipping line / Agent': 'ship', 'Air': 'plane' };
    return `
      <aside class="sidebar" aria-label="Network">
        <div class="sidebar-header">
          <h1 class="sidebar-title">Partners</h1>
          <div class="split-add">
            <button title="Invite partner" data-action="invite"><i data-lucide="plus"></i></button>
            <button title="More options" data-action="toggle-menu" aria-haspopup="menu" aria-expanded="false"><i data-lucide="chevron-down"></i></button>
            <div class="menu" role="menu">
              <button role="menuitem" data-action="invite"><i data-lucide="user-plus"></i>Invite partner</button>
              <button role="menuitem" data-soon="Import contacts (CSV)"><i data-lucide="file-up"></i>Import from spreadsheet</button>
            </div>
          </div>
        </div>
        <div class="sidebar-scroll">
          <div class="nav">${rows.map(r => `<a class="row${r.id === activeRow ? ' active' : ''}" href="${r.href}">
            <i data-lucide="${r.icon}"></i><span class="text">${r.label}</span>${r.soon ? '<span class="count">Soon</span>' : r.count && !noCounts ? `<span class="count">${r.count}</span>` : ''}</a>`).join('')}</div>
          <div class="divider"></div>
          <div class="section">
            <div class="section-head"><span class="section-label">Partners by type</span></div>
            <div class="nav">${N.types.map(t => {
              const n = N.vendors.filter(v => v.type === t).length;
              return `<a class="row${activeRow === 'type:' + t ? ' active' : ''}" href="network.html?tab=vendors&type=${encodeURIComponent(t)}">
                <i data-lucide="${typeIcon[t]}"></i><span class="text">${t}</span>${n && !noCounts ? `<span class="count">${n}</span>` : ''}</a>`;
            }).join('')}</div>
          </div>
        </div>
      </aside>`;
  }

  /* ==========================================================================
     Sender portal shell — branded as the sender's logistics company.
     No trade lanes, channels, network, marketplace, RFQs, margins or vendors.
     ========================================================================== */
  const SENDER_RAIL = [
    { id: 'home', label: 'Home', icon: 'house', href: 'index.html' },
    { id: 'ask', label: 'Ask', icon: 'sparkles', href: 'ask.html' },
    { id: 'requests', label: 'Requests', icon: 'file-text', href: 'requests.html' },
    { id: 'shipments', label: 'Shipments', icon: 'container', href: 'shipment.html' },
    { id: 'documents', label: 'Documents', icon: 'files', href: 'documents.html' },
    { id: 'settings', label: 'Settings', icon: 'settings' },
  ];
  const sender = effective && effective.persona === 'sender' ? D.senders[effective.id] : null;

  function senderRailHTML(active) {
    const item = (r) => {
      const tagName = r.href ? 'a' : 'button';
      const attrs = r.href ? `href="${r.href}"` : `data-soon="${r.label}"`;
      return `<${tagName} class="rail-item${r.id === active ? ' active' : ''}" ${attrs} title="${r.label}">
        <span class="glyph"><i data-lucide="${r.icon}"></i></span><span class="label">${r.label}</span></${tagName}>`;
    };
    return `
      <nav class="rail" aria-label="Primary">
        <a class="rail-logo tenant-logo" href="index.html" title="${esc(tenant.name)}" style="color:${tenant.brand}">${tenant.initials}</a>
        <div class="rail-list">${SENDER_RAIL.map(item).join('')}</div>
        <div class="rail-spacer"></div>
        ${railAvatarHTML()}
      </nav>`;
  }

  function senderSidebarHTML(activeRow) {
    const first = isNewTenant;   // ?state=new = a sender's first visit
    const dbShips = (db.read().shipments || []).filter(x => x.sender === effective.id).map(x => ({ id: x.id, lane: [x.route[0], x.route[x.route.length - 1]] }));
    const S = first ? { ...sender, inbox: [], requests: [], chats: [], shipments: [] } : { ...sender, shipments: [...dbShips, ...sender.shipments] };
    const unread = S.inbox.filter(n => n.attention).length;
    const openReq = S.requests.filter(r => ['sent', 'review', 'quote'].includes(r.status)).length;
    const am = S.accountManager;
    const row = (id, href, icon, label, count) => `<a class="row${activeRow === id ? ' active' : ''}" href="${href}"><i data-lucide="${icon}"></i><span class="text">${label}</span>${count ? `<span class="count">${count}</span>` : ''}</a>`;
    return `
      <aside class="sidebar" aria-label="${esc(tenant.short)} portal">
        <div class="sidebar-header">
          <h1 class="sidebar-title" title="${esc(tenant.name)} customer portal">${esc(tenant.short)}</h1>
          <div class="split-add">
            <a href="ask.html" title="New request" class="split-main"><i data-lucide="plus"></i></a>
            <button title="More" data-action="toggle-menu" aria-haspopup="menu" aria-expanded="false"><i data-lucide="chevron-down"></i></button>
            <div class="menu" role="menu">
              <a role="menuitem" href="ask.html"><i data-lucide="sparkles"></i>New request</a>
              <a role="menuitem" href="documents.html"><i data-lucide="upload"></i>Upload a document</a>
            </div>
          </div>
        </div>
        <div class="sidebar-scroll">
          <div class="nav">
            ${row('home', 'index.html', 'house', 'Home')}
            ${row('inbox', 'inbox.html', 'inbox', 'Inbox', unread)}
            ${row('requests', 'requests.html', 'file-text', 'My requests', openReq)}
          </div>
          <div class="divider"></div>
          <div class="section">
            <div class="section-head"><span class="section-label">AI Chats</span></div>
            <div class="nav">
              <a class="row placeholder${activeRow === 'ask' ? ' active' : ''}" href="ask.html"><i data-lucide="plus"></i><span class="text">New request</span></a>
              ${S.chats.map((c, i) => `<a class="row${activeRow === 'chat-' + i ? ' active' : ''}" href="${c.href}"><i data-lucide="sparkles"></i><span class="text">${esc(c.title)}</span></a>`).join('')}
            </div>
          </div>
          <div class="section">
            <div class="section-head"><span class="section-label">Active shipments</span></div>
            <div class="nav">${first ? '<span class="row placeholder"><i data-lucide="container"></i><span class="text">None yet</span></span>' : ''}${S.shipments.map(sh => `<a class="row${activeRow === 'shp-' + sh.id ? ' active' : ''}" href="shipment.html?id=${sh.id}">
              <i data-lucide="container"></i><span class="text"><span class="num">${sh.id}</span> <span class="suffix">${sh.lane[1]}</span></span>${sh.delayed ? '<span class="count" style="color:var(--warning)">Delayed</span>' : ''}</a>`).join('')}</div>
          </div>
          <div class="section">
            <div class="section-head"><span class="section-label">Direct Messages</span></div>
            <div class="nav">${S.staff.map(p => `<button class="row" data-soon="Messages with ${esc(p.name)}">
              <span class="user-avatar" style="background:${AVATAR_COLORS[p.color]}">${p.name[0]}<span class="presence${p.online ? ' online' : ''}"></span></span>
              <span class="text">${esc(p.name)} <span class="org">· ${esc(p.role)}</span></span></button>`).join('')}</div>
          </div>
        </div>
        <div class="am-card">
          <span class="user-avatar am-avatar" style="background:${AVATAR_COLORS[am.color]}">${am.initials}<span class="presence online"></span></span>
          <div class="am-text"><span class="caption">${esc(am.role)}</span><b>${esc(am.name)}</b><span class="caption">${esc(tenant.short)} · ${esc(am.hours)}</span></div>
          <div class="am-actions">
            <button class="icon-btn" title="WhatsApp ${esc(am.name)}" data-contact="WhatsApp"><i data-lucide="message-circle"></i></button>
            <button class="icon-btn" title="Email ${esc(am.name)}" data-contact="Email"><i data-lucide="mail"></i></button>
          </div>
        </div>
      </aside>`;
  }

  /* Staff previewing a customer's portal page: banner + read-only + keep ?viewas on links */
  function enableViewAs() {
    document.body.classList.add('view-as');
    const main = $('.main');
    main.insertAdjacentHTML('afterbegin', `<div class="viewas-banner"><i data-lucide="eye"></i>
      <span>You are viewing what <b>${esc(viewAs.name)}</b> sees · ${esc(viewAs.company)} · read-only</span>
      <a href="${BASE}index.html">Back to staff view</a></div>`);
    document.addEventListener('click', e => {
      const a = e.target.closest('a[href]');
      if (a && !a.closest('.viewas-banner') && !a.closest('#userMenu')) {
        const href = a.getAttribute('href');
        if (!/^(https?:|#|mailto:)/.test(href) && !href.startsWith('../')) {
          e.preventDefault();
          location.href = href + (href.includes('?') ? '&' : '?') + 'viewas=' + viewAs.id;
        }
        return;
      }
      const ctl = e.target.closest('button, input, textarea, select, label, [data-opt], [data-fill]');
      if (ctl && !ctl.closest('.viewas-banner, #userMenu, .rail, #demoChip') && !ctl.matches('[data-action="user-menu"], [data-action="sign-out"], [data-action="dismiss-chip"]')) {
        e.preventDefault(); e.stopImmediatePropagation();
        toast('Read-only preview of the customer’s portal');
      }
    }, true);
    document.addEventListener('submit', e => { e.preventDefault(); e.stopImmediatePropagation(); }, true);
  }

  function applyTenantTheme() {
    const r = document.documentElement.style;
    r.setProperty('--primary', tenant.brand);
    r.setProperty('--primary-hover', tenant.brandDark);
    r.setProperty('--primary-pressed', tenant.brandDeep);
    r.setProperty('--primary-soft', tenant.brandSoft);
    r.setProperty('--rail-top', tenant.brand);
    r.setProperty('--rail-bottom', tenant.brandDeep);
    // favicon = the logistics company's initials, never the LogiMind mark
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="7" fill="${tenant.brand}"/><text x="16" y="21" font-family="Arial" font-weight="700" font-size="13" fill="#fff" text-anchor="middle">${tenant.initials}</text></svg>`;
    let link = document.querySelector('link[rel="icon"]');
    if (!link) { link = document.createElement('link'); link.rel = 'icon'; document.head.appendChild(link); }
    link.type = 'image/svg+xml';
    link.href = 'data:image/svg+xml,' + encodeURIComponent(svg);
  }

  /* ==========================================================================
     Partner shell (placeholder) — job status and own allocations only.
     ========================================================================== */
  function partnerRailHTML(active) {
    const items = [
      { id: 'jobs', label: 'Jobs', icon: 'truck', href: 'index.html' },
      { id: 'fleet', label: 'Fleet', icon: 'gauge' },
      { id: 'availability', label: 'Availability', icon: 'calendar-days' },
      { id: 'api', label: 'API', icon: 'plug' },
    ];
    return `
      <nav class="rail" aria-label="Primary">
        <a class="rail-logo" href="index.html" title="LogiMind"><img src="${BASE}assets/logo.svg" alt="LogiMind"></a>
        <div class="rail-list">${items.map(r => r.href
          ? `<a class="rail-item${r.id === active ? ' active' : ''}" href="${r.href}" title="${r.label}"><span class="glyph"><i data-lucide="${r.icon}"></i></span><span class="label">${r.label}</span></a>`
          : `<button class="rail-item" data-soon="${r.label}" title="${r.label}"><span class="glyph"><i data-lucide="${r.icon}"></i></span><span class="label">${r.label}</span></button>`).join('')}</div>
        <div class="rail-spacer"></div>
        ${railAvatarHTML()}
      </nav>`;
  }
  function partnerSidebarHTML(activeRow) {
    const P = D.partner[account.id];
    const count = (t) => P.jobs.filter(j => !t || j.tenant === t).length;
    return `
      <aside class="sidebar" aria-label="Partner workspace">
        <div class="sidebar-header"><h1 class="sidebar-title">${esc(account.company)}</h1></div>
        <div class="sidebar-scroll">
          <div class="nav">
            <a class="row${activeRow === 'all' ? ' active' : ''}" href="index.html"><i data-lucide="list"></i><span class="text">All jobs</span><span class="count">${count()}</span></a>
          </div>
          <div class="divider"></div>
          <div class="section">
            <div class="section-head"><span class="section-label">Logistics companies</span></div>
            <div class="nav">${P.fleet.allocations.map(a => `<a class="row${activeRow === a.tenant ? ' active' : ''}" href="index.html?lc=${a.tenant}">
              <span class="space-avatar" style="background:${D.tenants[a.tenant].brand}">${D.tenants[a.tenant].initials[0]}</span><span class="text">${esc(D.tenants[a.tenant].short)}</span><span class="count">${count(a.tenant)}</span></a>`).join('')}</div>
          </div>
        </div>
      </aside>`;
  }

  function dm(name, color, opts = {}) {
    const o = opts.org && D.orgs[opts.org];
    const mark = o
      ? `<span class="org-badge" title="${o.name}">${o.initials}</span>`
      : `<span class="presence${opts.online ? ' online' : ''}"></span>`;
    return `<button class="row" data-soon="Direct message">
      <span class="user-avatar" style="background:${AVATAR_COLORS[color]}">${name[0]}${mark}</span>
      <span class="text">${name}${o ? ` <span class="org">· ${o.name.replace(/^(PT|CV) /, '')}</span>` : ''}</span>
    </button>`;
  }

  /* ---------- branded quote document ----------
     One renderer for the staff preview (quote.html) and the customer's page
     (portal/quote.html), so both always match. Uses the tenant brand, never
     LogiMind violet, and shows only customer prices. */
  function quoteDocHTML(q, T, opts = {}) {
    const money = opts.money || ((n) => 'US$' + Math.round(n).toLocaleString('en-US'));
    const set = db.settings();
    const total = q.lines.reduce((s2, l) => s2 + l[1], 0);
    const nodes = set.showTransship ? q.route : [q.route[0], ...(q.route.length > 2 ? ['1 transshipment'] : []), q.route[q.route.length - 1]];
    const lines = q.display === 'allin'
      ? `<tr><td>${esc(q.allinLabel || 'All-in price for this shipment')}</td><td>${money(total)}</td></tr>`
      : q.lines.map(([l, a2]) => `<tr><td>${esc(l)}</td><td>${money(a2)}</td></tr>`).join('');
    return `<div class="qdoc" style="--brand:${T.brand}">
      <div class="qdoc-top"><span class="qdoc-logo">${T.initials}</span>
        <div><div class="qdoc-name">${esc(T.name)}</div><div class="qdoc-url">${T.portal}</div></div>
        <div class="qdoc-no"><b class="num">Quotation ${esc(q.id)}</b>Issued ${esc(q.issued)}</div></div>
      <div class="qdoc-body">
        <div class="qdoc-route"><i data-lucide="${q.mode === 'air' ? 'plane' : 'ship'}"></i>${esc(q.route[0])} → ${esc(q.route[q.route.length - 1])}</div>
        <div class="qdoc-meta"><div><span>Cargo</span> <b>${esc(q.cargo)}</b></div><div><span>Service</span> <b>${esc(q.routeLabel)}</b></div>
          <div><span>Transit</span> <b>${esc(q.transit)}</b></div><div><span>Departure</span> <b>${esc(q.departure)}</b></div>
          ${set.showCarriers && q.carrier ? `<div><span>Carrier</span> <b>${esc(q.carrier)}</b></div>` : ''}</div>
        <div class="qdoc-path">${nodes.map((n, i) => `${i ? '<i data-lucide="arrow-right"></i>' : ''}<span>${esc(n)}</span>`).join('')}</div>
        <table class="qdoc-lines">${lines}<tr class="total"><td>Total <span class="tag success"><i data-lucide="badge-check"></i>Confirmed</span></td><td>${money(total)}</td></tr></table>
        <div class="qdoc-inc">
          <div><h4>Included</h4><ul class="y">${q.includes.map(x => `<li><i data-lucide="check"></i>${esc(x)}</li>`).join('')}</ul></div>
          <div><h4>Not included</h4><ul class="n">${q.excludes.map(x => `<li><i data-lucide="minus"></i>${esc(x)}</li>`).join('')}</ul></div>
        </div>
        ${q.note ? `<div class="qdoc-terms">${esc(q.note)}</div>` : ''}
        <div class="qdoc-terms">Valid until ${esc(q.expires)}. ${esc(q.terms)}</div>
      </div>
      <div class="qdoc-foot">Powered by LogiMind</div>
    </div>`;
  }

  /* ---------- flow stepper (request lifecycle) ---------- */
  const FLOW = ['Request', 'Checklist', 'RFQs', 'Compare', 'Quote'];
  function stepperHTML(current) {
    return FLOW.map((s, i) => {
      const cls = i < current ? 'done' : i === current ? 'current' : '';
      const dot = i < current ? '<i data-lucide="check"></i>' : i + 1;
      return `${i ? '<span class="sep"></span>' : ''}<span class="s ${cls}"><span class="dot">${dot}</span>${s}</span>`;
    }).join('');
  }

  /* ---------- composer ---------- */
  function bindComposer(form, onSubmit) {
    const ta = $('textarea', form), send = $('[type="submit"]', form);
    const sync = () => {
      send.disabled = !ta.value.trim();
      ta.style.height = 'auto';
      ta.style.height = Math.min(ta.scrollHeight, 200) + 'px';
    };
    ta.addEventListener('input', sync);
    ta.addEventListener('keydown', e => {
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); if (!send.disabled) form.requestSubmit(); }
    });
    form.addEventListener('submit', e => {
      e.preventDefault();
      const text = ta.value.trim(); if (!text) return;
      onSubmit(text);
      ta.value = ''; sync();
    });
    form.addEventListener('click', e => { if (e.target.closest('.attach-btn')) toast('File picker would open here'); });
    return { fill(text) { ta.value = text; sync(); ta.focus(); }, focus() { ta.focus(); } };
  }

  /* ---------- mount ---------- */
  function mount() {
    if (redirecting) return;
    const app = $('.app');
    const workspace = $('.workspace', app);
    let rail, sidebar;
    if (PAGE_PERSONA === 'sender') { applyTenantTheme(); rail = senderRailHTML; sidebar = senderSidebarHTML; }
    else if (PAGE_PERSONA === 'partner') { rail = partnerRailHTML; sidebar = partnerSidebarHTML; }
    else { rail = railHTML; sidebar = { rfqs: rfqSidebarHTML, shipments: shipmentsSidebarHTML, network: networkSidebarHTML, customers: customersSidebarHTML, settings: settingsSidebarHTML }[app.dataset.rail] || sidebarHTML; }
    workspace.insertAdjacentHTML('beforebegin', rail(app.dataset.rail));
    workspace.insertAdjacentHTML('afterbegin', sidebar(app.dataset.row));

    if (viewAs) enableViewAs();

    // demo chip + account menu
    const chip = demoChipHTML();
    if (chip) { document.body.insertAdjacentHTML('afterbegin', chip); document.body.classList.add('demo-on'); }
    document.body.insertAdjacentHTML('beforeend', userMenuHTML());
    const userMenu = $('#userMenu');
    const closeUserMenu = () => { if (userMenu) userMenu.classList.remove('open'); const b = $('[data-action="user-menu"]'); if (b) b.setAttribute('aria-expanded', 'false'); };

    const menu = $('.split-add .menu');
    const menuBtn = $('[data-action="toggle-menu"]');
    const closeMenu = () => { if (!menu) return; menu.classList.remove('open'); menuBtn.setAttribute('aria-expanded', 'false'); };

    document.addEventListener('click', e => {
      const t = e.target.closest('[data-soon], [data-action], [data-contact]');
      if (!e.target.closest('.split-add')) closeMenu();
      if (!e.target.closest('#userMenu, [data-action="user-menu"]')) closeUserMenu();
      if (!t) return;
      if (t.dataset.contact) { toast(`Opens ${t.dataset.contact} with ${sender ? sender.accountManager.name : 'your contact'}`); return; }
      if (t.dataset.action === 'user-menu') {
        const open = userMenu.classList.toggle('open');
        t.setAttribute('aria-expanded', String(open));
        return;
      }
      if (t.dataset.action === 'sign-out') { signOut(); location.href = BASE + 'login.html'; return; }
      if (t.dataset.action === 'dismiss-chip') {
        try { sessionStorage.setItem('lm.chip.hidden', '1'); } catch (e2) {}
        $('#demoChip').remove(); document.body.classList.remove('demo-on');
        return;
      }
      if (t.dataset.soon === 'Invite partner') t.dataset.action = 'invite';
      else if (t.dataset.soon) { closeMenu(); soon(t.dataset.soon); return; }
      switch (t.dataset.action) {
        case 'toggle-menu': {
          const open = menu.classList.toggle('open');
          menuBtn.setAttribute('aria-expanded', String(open));
          break;
        }
        case 'invite-customer': {
          closeMenu();
          if (window.openInviteCustomer) window.openInviteCustomer();
          else location.href = 'customers.html?invite=1';
          break;
        }
        case 'invite': {
          closeMenu();
          if (window.openInvite) window.openInvite();
          else location.href = 'network.html?invite=1';
          break;
        }
        case 'new-prompt': {
          closeMenu();
          const composer = $('[data-composer] textarea');
          if (composer) { composer.focus(); composer.scrollIntoView({ block: 'center', behavior: 'smooth' }); }
          else location.href = PAGE_PERSONA === 'sender' ? 'ask.html' : 'index.html#prompt';
          break;
        }
      }
    });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') { closeMenu(); closeUserMenu(); } });
    icons();
  }

  return { $, $$, esc, icons, tag, visibility, orgAvatar, toast, soon, bindComposer, stepperHTML, mount, data: D,
    account, tenant, sender, base: BASE, persona: PAGE_PERSONA, store, signIn, signOut, currentAccount, initialsOf, AVATAR_COLORS,
    db, viewAs, effective, quoteDocHTML, awaitingRequests };
})();
