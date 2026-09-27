/* ==========================================================================
   LogiMind prototype — shared app shell (icon rail + Home context sidebar)
   Page markup: <div class="app" data-rail="home" data-row="overview">
                  <div class="workspace"><main class="main">…</main></div>
                </div>
   ========================================================================== */

window.LM = (() => {
  const D = window.LMData;

  const RAIL = [
    { id: 'home', label: 'Home', icon: 'house', href: 'index.html' },
    { id: 'shipments', label: 'Shipments', icon: 'container', href: 'shipment.html' },
    { id: 'assistant', label: 'Assistant', icon: 'sparkles' },
    { id: 'rfqs', label: 'RFQs', title: 'RFQs & Quotes', icon: 'file-stack', href: 'rfq.html' },
    { id: 'network', label: 'Network', icon: 'network', href: 'network.html' },
    { id: 'docs', label: 'Docs', icon: 'file-text' },
    { id: 'planner', label: 'Planner', icon: 'calendar-days' },
    { id: 'more', label: 'More', icon: 'layout-grid' },
  ];

  const HOME_ROWS = [
    { id: 'overview', label: 'Overview', icon: 'layout-panel-top', href: 'index.html' },
    { id: 'inbox', label: 'Inbox', icon: 'inbox', href: 'inbox.html', count: D.inbox.primary.length },
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
  function toast(msg) {
    let t = $('#toast');
    if (!t) {
      document.body.insertAdjacentHTML('beforeend', '<div class="toast" id="toast"><i data-lucide="info"></i><span></span></div>');
      t = $('#toast');
      icons();
    }
    $('span', t).textContent = msg;
    t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove('show'), 2400);
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
        <button class="rail-item" data-soon="Invite partner" title="Invite partner">
          <span class="glyph"><i data-lucide="user-plus"></i></span>
          <span class="label">Invite</span>
        </button>
      </nav>`;
  }

  /* ---------- Home context sidebar ---------- */
  // ?state=new renders a brand-new tenant: no chats, lanes, partners or counts yet.
  const isNewTenant = new URLSearchParams(location.search).get('state') === 'new';

  function sidebarHTML(activeRow) {
    const row = (r) => {
      const tagName = r.href ? 'a' : 'button';
      const attrs = r.href ? `href="${r.href}"` : `data-soon="${r.label}"`;
      return `<${tagName} class="row${r.id === activeRow ? ' active' : ''}" ${attrs}>
        <i data-lucide="${r.icon}"></i><span class="text">${r.label}</span>${r.count && !isNewTenant ? `<span class="count">${r.count}</span>` : ''}
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

  /* ---------- Network context sidebar ---------- */
  function networkSidebarHTML(activeRow) {
    const N = D.network;
    const noCounts = isNewTenant || new URLSearchParams(location.search).get('state') === 'empty';
    const pending = N.invitations.sent.filter(i => i.status === 'pending').length + N.invitations.received.length;
    const rows = [
      { id: 'vendors', label: 'My vendors', icon: 'truck', href: 'network.html?tab=vendors', count: N.vendors.length },
      { id: 'customers', label: 'My customers', icon: 'building-2', href: 'network.html?tab=customers', count: N.customers.length },
      { id: 'invitations', label: 'Invitations', icon: 'mail', href: 'network.html?tab=invitations', count: pending },
      { id: 'marketplace', label: 'Marketplace', icon: 'store', href: 'network.html?tab=marketplace', soon: true },
    ];
    const typeIcon = { 'Trucking': 'truck', 'Warehouse': 'warehouse', 'Packing / Fumigation': 'wind', 'Customs broker': 'stamp', 'Shipping line / Agent': 'ship', 'Air': 'plane' };
    return `
      <aside class="sidebar" aria-label="Network">
        <div class="sidebar-header">
          <h1 class="sidebar-title">Network</h1>
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
            <div class="section-head"><span class="section-label">Vendors by type</span></div>
            <div class="nav">${N.types.map(t => {
              const n = N.vendors.filter(v => v.type === t).length;
              return `<a class="row${activeRow === 'type:' + t ? ' active' : ''}" href="network.html?tab=vendors&type=${encodeURIComponent(t)}">
                <i data-lucide="${typeIcon[t]}"></i><span class="text">${t}</span>${n && !noCounts ? `<span class="count">${n}</span>` : ''}</a>`;
            }).join('')}</div>
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
    const app = $('.app');
    const workspace = $('.workspace', app);
    workspace.insertAdjacentHTML('beforebegin', railHTML(app.dataset.rail));
    const sidebar = { rfqs: rfqSidebarHTML, shipments: shipmentsSidebarHTML, network: networkSidebarHTML }[app.dataset.rail] || sidebarHTML;
    workspace.insertAdjacentHTML('afterbegin', sidebar(app.dataset.row));

    const menu = $('.split-add .menu');
    const menuBtn = $('[data-action="toggle-menu"]');
    const closeMenu = () => { menu.classList.remove('open'); menuBtn.setAttribute('aria-expanded', 'false'); };

    document.addEventListener('click', e => {
      const t = e.target.closest('[data-soon], [data-action]');
      if (!e.target.closest('.split-add')) closeMenu();
      if (!t) return;
      if (t.dataset.soon === 'Invite partner') t.dataset.action = 'invite';
      else if (t.dataset.soon) { closeMenu(); soon(t.dataset.soon); return; }
      switch (t.dataset.action) {
        case 'toggle-menu': {
          const open = menu.classList.toggle('open');
          menuBtn.setAttribute('aria-expanded', String(open));
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
          else location.href = 'index.html#prompt';
          break;
        }
      }
    });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
    icons();
  }

  return { $, $$, esc, icons, tag, visibility, orgAvatar, toast, soon, bindComposer, stepperHTML, mount, data: D };
})();
