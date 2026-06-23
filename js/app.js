/* app.js — core application logic */

/* ── Inspect / DevTools deterrent ── */
document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('keydown', e => {
  if (
    e.key === 'F12' ||
    (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) ||
    (e.ctrlKey && e.key === 'u') ||
    (e.ctrlKey && e.key === 's')
  ) {
    e.preventDefault();
  }
});

/* ── Utility ── */
function getParam(name) {
  return new URLSearchParams(window.location.search).get(name);
}

function makeDragScrollable(slider) {
  if (!slider) return;
  let isDown = false;
  let startX;
  let scrollLeft;
  let hasDragged = false;

  slider.addEventListener('mousedown', (e) => {
    isDown = true;
    startX = e.pageX - slider.offsetLeft;
    scrollLeft = slider.scrollLeft;
    hasDragged = false;
  });
  slider.addEventListener('mouseleave', () => { isDown = false; });
  slider.addEventListener('mouseup', () => { isDown = false; });
  slider.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - slider.offsetLeft;
    const walk = (x - startX) * 1.5;
    slider.scrollLeft = scrollLeft - walk;
    if (Math.abs(walk) > 3) hasDragged = true;
  });
  slider.addEventListener('click', (e) => {
    if (hasDragged) { e.preventDefault(); e.stopPropagation(); }
  }, true);
}

/* ── Shared navbar HTML ── */
const NAVBAR_HTML = `
  <nav class="navbar">
    <a href="./" class="navbar-logo">
      <img src="https://cdn.jsdelivr.net/gh/feumm/feumrp@main/images/logo.png" alt="feumrp logo" />
    </a>
    <div class="navbar-actions">
      <div class="support-wrap">
        <a href="https://feum.gumroad.com/coffee" target="_blank" rel="noopener" class="btn-support">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M18 8h1a4 4 0 0 1 0 8h-1"/>
            <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/>
            <line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/>
          </svg>
          <span>Support</span>
        </a>
        <div class="support-tooltip">Love what feum's doing? Give feum some support ☕</div>
      </div>
      <a href="collections.html" class="btn-collections">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
        </svg>
        <span>Collections</span>
      </a>
      <a href="browse.html" class="btn-browse">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <span>Browse Packs</span>
      </a>
    </div>
  </nav>
`;

/* ── SPA Router Templates ── */
const TEMPLATES = {
  home: `
    <section class="hero">
      <div class="hero-bg"></div>
      <div class="hero-content">
        <h1 class="hero-title">
          Elevate your<br /><span>Bedrock</span> experience
        </h1>
        <p class="hero-sub">
          Browse curated premium texture packs for Minecraft Bedrock.
        </p>
        <div class="hero-actions">
          <a href="browse.html" class="btn-primary">Browse Packs</a>
          <a href="https://feum.gumroad.com/coffee" target="_blank" rel="noopener" class="btn-secondary">Support feum</a>
        </div>
      </div>
    </section>
    <main class="page">
      <section class="section">
        <div class="section-header">
          <h2 class="section-title">Featured Packs</h2>
          <p class="section-sub">Selected by feum</p>
        </div>
        <div class="pack-grid" id="featured-grid"></div>
      </section>

      <section class="section" id="collections-section" style="display:none">
        <div class="section-header">
          <h2 class="section-title">Collections</h2>
          <p class="section-sub">Multi-pack bundles</p>
        </div>
        <div class="pack-grid" id="collections-grid"></div>
      </section>

      <section class="discord-section">
        <div class="discord-card">
          <div class="discord-main">
            <div class="discord-icon-wrapper">
              <svg class="discord-logo-svg" viewBox="0 0 127.14 96.36">
                <path fill="currentColor" d="M107.7,8.07A105.15,105.15,0,0,0,77.26,0a77.19,77.19,0,0,0-3.3,6.83A96.67,96.67,0,0,0,52.18,6.83,77.19,77.19,0,0,0,48.88,0,105.15,105.15,0,0,0,18.44,8.07C-3.41,40.73-1,72.59,10.09,87.78a105.81,105.81,0,0,0,32,16.22,80.12,80.12,0,0,0,6.75-11,68.86,68.86,0,0,1-10.66-5.12c.9-.66,1.8-1.34,2.65-2a75.58,75.58,0,0,0,103.35,0c.85.69,1.75,1.37,2.65,2a68.86,68.86,0,0,1-10.66,5.12,80.12,80.12,0,0,0,6.75,11,105.81,105.81,0,0,0,32-16.22C128.14,72.59,129.7,40.73,107.7,8.07ZM42.45,71.69c-6.27,0-11.45-5.75-11.45-12.82S36.1,46.05,42.45,46.05,53.9,51.8,53.9,58.87,48.72,71.69,42.45,71.69Zm41.15,0c-6.27,0-11.45-5.75-11.45-12.82S77.25,46.05,83.6,46.05,95.05,51.8,95.05,58.87,89.87,71.69,83.6,71.69Z"/>
              </svg>
            </div>
            <div class="discord-info">
              <h3 class="discord-server-name">feum Community</h3>
              <div class="discord-stats">
                <span class="discord-status-text">
                  <span class="discord-dot-online"></span>
                  1,432 Online
                </span>
                <span class="discord-status-text">
                  <span class="discord-dot-total"></span>
                  8,540 Members
                </span>
              </div>
            </div>
          </div>
          <div class="discord-action-wrap">
            <a href="https://dsc.gg/feum" target="_blank" rel="noopener" class="btn-discord-join">Join Server</a>
          </div>
        </div>
      </section>
    </main>
  `,

  browse: `
    <div class="browse-hero">
      <div class="browse-orb browse-orb-1"></div>
      <div class="browse-orb browse-orb-2"></div>
      <div class="browse-orb browse-orb-3"></div>
      <div class="browse-hero-content page">
        <h1 class="browse-title">Browse Packs</h1>
        <p class="browse-count" id="pack-count">Loading…</p>
      </div>
    </div>
    <main class="page">
      <div class="controls-row">
        <div class="search-wrap">
          <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="18" height="18">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input type="text" class="search-input" id="search-input" placeholder="Search packs…" autocomplete="off" spellcheck="false" />
        </div>
        <div class="sort-wrap">
          <div class="custom-dropdown" id="sort-dropdown">
            <button class="dropdown-trigger" id="sort-trigger" type="button">
              <span id="sort-current-label">Recently Added</span>
              <svg class="dropdown-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" width="16" height="16">
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </button>
            <div class="dropdown-menu" id="sort-menu">
              <button class="dropdown-item" data-value="featured" type="button">Featured</button>
              <button class="dropdown-item" data-value="downloads" type="button">Most Downloaded</button>
              <button class="dropdown-item active" data-value="newest" type="button">Recently Added</button>
              <button class="dropdown-item" data-value="oldest" type="button">Oldest First</button>
            </div>
          </div>
        </div>
      </div>
      <div class="creator-filters">
        <span class="creator-filters-label">CREATORS</span>
        <div class="creator-pills" id="creator-pills-container"></div>
      </div>
      <div class="pack-grid" id="pack-grid"></div>
    </main>
  `,

  collections: `
    <div class="browse-hero">
      <div class="browse-orb browse-orb-1"></div>
      <div class="browse-orb browse-orb-2"></div>
      <div class="browse-orb browse-orb-3"></div>
      <div class="browse-hero-content page">
        <h1 class="browse-title">Collections</h1>
        <p class="browse-count" id="col-count">Loading…</p>
      </div>
    </div>
    <main class="page">
      <div class="pack-grid" id="collections-grid"></div>
    </main>
  `,

  pack: `
    <div class="page">
      <a href="browse.html" class="detail-back">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="15 18 9 12 15 6"/>
        </svg>
        Back to Browse
      </a>
      <div id="pack-detail"></div>
    </div>
  `
};

/* ── SPA Router Logic ── */
function getRouteType(path) {
  if (path.includes('pack.html')) return 'pack';
  if (path.includes('browse.html')) return 'browse';
  if (path.includes('collections.html')) return 'collections';
  return 'home';
}

function navigateTo(urlStr) {
  const currentPath = window.location.pathname;
  const currentSearch = window.location.search;
  const parser = new URL(urlStr, window.location.origin);
  const targetPath = parser.pathname;
  const targetSearch = parser.search;
  if (currentPath === targetPath && currentSearch === targetSearch) return;

  const routeType = getRouteType(targetPath);
  if (document.startViewTransition) {
    document.startViewTransition(() => renderPage(routeType, urlStr));
  } else {
    renderPage(routeType, urlStr);
  }
}

function renderPage(routeType, urlStr, skipPushState = false) {
  if (!skipPushState && urlStr) window.history.pushState({}, '', urlStr);

  const navbar = document.querySelector('.navbar');
  const footer = document.querySelector('.footer');
  if (!navbar || !footer) return;

  let sibling = navbar.nextElementSibling;
  while (sibling && sibling !== footer) {
    const next = sibling.nextElementSibling;
    sibling.remove();
    sibling = next;
  }

  const temp = document.createElement('div');
  temp.innerHTML = TEMPLATES[routeType];
  while (temp.firstChild) footer.parentNode.insertBefore(temp.firstChild, footer);

  if (routeType === 'home') initHome();
  else if (routeType === 'browse') initBrowse();
  else if (routeType === 'collections') initCollections();
  else if (routeType === 'pack') initPackDetail();

  window.scrollTo({ top: 0, behavior: 'auto' });
}

/* ── Card HTML (full-cover style) ── */
function buildCard(pack, eager) {
  return `
    <div onclick="event.preventDefault(); navigateTo('pack.html?id=${pack.id}')" class="pack-card">
      <div class="pack-card-cover">
        <img src="${pack.cover}" alt="${pack.title}" loading="${eager ? 'eager' : 'lazy'}" decoding="async" ${eager ? 'fetchpriority="high"' : ''} style="view-transition-name: pack-cover-${pack.id};" />
        <div class="pack-card-overlay">
          <span class="pack-card-title">${pack.title}</span>
          <div class="pack-card-author" onclick="event.stopPropagation(); navigateTo('browse.html?author=${pack.author.toLowerCase()}')">
            <img src="${pack.authorAvatar}" alt="${pack.author}" loading="lazy" decoding="async" />
            <span>@${pack.author}</span>
          </div>
        </div>
      </div>
    </div>`;
}

/* ── Collection card HTML (full-cover like pack-card, with folder badge) ── */
function buildCollectionCard(pack, eager) {
  const fileCount = pack.packFolder ? pack.packFolder.length : 0;
  const svgFolder = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" width="13" height="13"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>`;
  return `
    <div onclick="navigateTo('pack.html?id=${pack.id}')" class="pack-card">
      <div class="pack-card-cover">
        <img src="${pack.cover}" alt="${pack.title}" loading="${eager ? 'eager' : 'lazy'}" decoding="async" ${eager ? 'fetchpriority="high"' : ''} />
        <div class="pack-card-overlay">
          <span class="pack-card-title">${pack.title}</span>
          <div class="pack-card-author" onclick="event.stopPropagation(); navigateTo('browse.html?author=${pack.author.toLowerCase()}')">
            <img src="${pack.authorAvatar}" alt="${pack.author}" loading="lazy" decoding="async" />
            <span>@${pack.author}</span>
          </div>
        </div>
        <div class="folder-count-badge">${svgFolder} ${fileCount} file${fileCount !== 1 ? 's' : ''}</div>
      </div>
    </div>`;
}

/* ── Browse page ── */
function initBrowse() {
  const grid   = document.getElementById('pack-grid');
  const search = document.getElementById('search-input');
  const count  = document.getElementById('pack-count');
  if (!grid) return;

  let activeCreator = 'all';
  let downloadCounts = {};
  let activeSort = getParam('sort') || 'newest';

  const sortLabels = {
    featured:  'Featured',
    downloads: 'Most Downloaded',
    newest:    'Recently Added',
    oldest:    'Oldest First'
  };

  const sortTrigger      = document.getElementById('sort-trigger');
  const sortMenu         = document.getElementById('sort-menu');
  const sortCurrentLabel = document.getElementById('sort-current-label');
  const dropdownItems    = document.querySelectorAll('.dropdown-item');

  function updateSortDropdownUI(val) {
    if (sortCurrentLabel) sortCurrentLabel.textContent = sortLabels[val] || 'Recently Added';
    dropdownItems.forEach(item => {
      item.classList.toggle('active', item.getAttribute('data-value') === val);
    });
  }

  PACKS.forEach(p => {
    downloadCounts[p.id] = 0; 
});
renderFiltered();

  const authorParam = getParam('author');
  if (authorParam) {
    const trimmed = authorParam.trim().toLowerCase();
    const matchedCreator = CREATORS.find(c =>
      c.id.toLowerCase() === trimmed ||
      (c.aliases && c.aliases.map(a => a.toLowerCase()).includes(trimmed))
    );
    if (matchedCreator) activeCreator = matchedCreator.id;
  }

  if (sortTrigger && sortMenu) {
    updateSortDropdownUI(activeSort);

    sortTrigger.addEventListener('click', (e) => {
      e.stopPropagation();
      sortMenu.classList.toggle('active');
      sortTrigger.classList.toggle('active');
    });

    dropdownItems.forEach(item => {
      item.addEventListener('click', (e) => {
        e.stopPropagation();
        activeSort = item.getAttribute('data-value');
        const url = new URL(window.location);
        if (activeSort === 'newest') {
          url.searchParams.delete('sort');
        } else {
          url.searchParams.set('sort', activeSort);
        }
        window.history.pushState({}, '', url);
        updateSortDropdownUI(activeSort);
        sortMenu.classList.remove('active');
        sortTrigger.classList.remove('active');
        renderFiltered();
      });
    });

    document.addEventListener('click', (e) => {
      if (!sortTrigger.contains(e.target) && !sortMenu.contains(e.target)) {
        sortMenu.classList.remove('active');
        sortTrigger.classList.remove('active');
      }
    });
  }

  function renderFiltered() {
    const q = search.value.trim().toLowerCase();
    let list = [...PACKS];

    if (activeSort === 'downloads') {
      list.sort((a, b) => (downloadCounts[b.id] || 0) - (downloadCounts[a.id] || 0));
    } else if (activeSort === 'newest') {
      list.sort((a, b) => new Date(b.dateAdded || '1970-01-01') - new Date(a.dateAdded || '1970-01-01'));
    } else if (activeSort === 'oldest') {
      list.sort((a, b) => new Date(a.dateAdded || '1970-01-01') - new Date(b.dateAdded || '1970-01-01'));
    } else {
      list.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }

    if (activeCreator !== 'all') {
      const creatorObj = CREATORS.find(c => c.id === activeCreator);
      if (creatorObj) {
        const aliases = (creatorObj.aliases || [creatorObj.id]).map(a => a.toLowerCase());
        list = list.filter(p => aliases.includes(p.author.toLowerCase()));
      }
    }

    if (q) list = list.filter(p => p.title.toLowerCase().includes(q) || p.author.toLowerCase().includes(q));

    const visible = list.filter(p => !p.hiddenFromBrowse);
    grid.innerHTML = visible.map((p, i) => buildCard(p, i < 3)).join('');
    count.textContent = `${visible.length} texture pack${visible.length !== 1 ? 's' : ''} for Minecraft Bedrock Edition`;
  }

  const pillsContainer = document.getElementById('creator-pills-container');
  if (pillsContainer) {
    pillsContainer.innerHTML = CREATORS.map(c => `
      <button class="creator-pill ${c.isPremium ? 'creator-pill-feum' : ''} ${c.id === activeCreator ? 'active' : ''}" data-creator="${c.id}">
        <img src="${c.avatar}" alt="@${c.name} profile" />
        <span>@${c.name}</span>
      </button>
    `).join('');
    makeDragScrollable(pillsContainer);
  }

  const pills = document.querySelectorAll('.creator-pill');
  pills.forEach(pill => {
    const creator = pill.getAttribute('data-creator');
    pill.addEventListener('click', () => {
      const isAlreadyActive = pill.classList.contains('active');
      pills.forEach(p => p.classList.remove('active'));
      const url = new URL(window.location);
      if (isAlreadyActive) {
        activeCreator = 'all';
        url.searchParams.delete('author');
      } else {
        pill.classList.add('active');
        activeCreator = creator;
        url.searchParams.set('author', creator);
      }
      window.history.pushState({}, '', url);
      renderFiltered();
    });
  });

  renderFiltered();
  search.addEventListener('input', renderFiltered);
}

/* ── Collections page ── */
function initCollections() {
  const grid  = document.getElementById('collections-grid');
  const count = document.getElementById('col-count');
  if (!grid) return;

  const collections = PACKS.filter(p => p.packFolder);
  grid.innerHTML = collections.map((p, i) => buildCollectionCard(p, i < 3)).join('');
  if (count) {
    count.textContent = `${collections.length} collection${collections.length !== 1 ? 's' : ''}`;
  }
}

/* ── Discord widget ── */
let discordIntervalId = null;

function initDiscordWidget() {
  if (discordIntervalId) { clearInterval(discordIntervalId); discordIntervalId = null; }

  const section = document.querySelector('.discord-section');
  if (!section) return;

  const serverNameEl = section.querySelector('.discord-server-name');
  const onlineEl     = section.querySelector('.discord-status-text:nth-child(1)');
  const totalEl      = section.querySelector('.discord-status-text:nth-child(2)');
  const joinBtn      = section.querySelector('.btn-discord-join');
  const iconWrapper  = section.querySelector('.discord-icon-wrapper');

  const code = (typeof DISCORD_INVITE_CODE !== 'undefined') ? DISCORD_INVITE_CODE : 'feum';
  if (joinBtn && code !== 'feum') joinBtn.href = `https://discord.gg/${code}`;

  async function updateStats() {
    if (!document.body.contains(section)) {
      if (discordIntervalId) { clearInterval(discordIntervalId); discordIntervalId = null; }
      return;
    }
    try {
      let data;
      try {
        const res = await fetch(`/api/discord-info?code=${encodeURIComponent(code)}`);
        if (!res.ok) throw new Error('proxy unavailable');
        data = await res.json();
      } catch {
        const res = await fetch(`https://discord.com/api/v10/invites/${code}?with_counts=true`);
        if (!res.ok) throw new Error('Discord API failed');
        const raw = await res.json();
        const guildId   = raw.guild && raw.guild.id;
        const iconHash  = raw.guild && raw.guild.icon;
        data = {
          serverName: raw.guild ? raw.guild.name : null,
          iconUrl: guildId && iconHash ? `https://cdn.discordapp.com/icons/${guildId}/${iconHash}.png?size=128` : null,
          online: raw.approximate_presence_count || 0,
          total:  raw.approximate_member_count || 0,
        };
      }
      if (data && !data.error) {
        if (serverNameEl && data.serverName) serverNameEl.textContent = data.serverName;
        if (iconWrapper && data.iconUrl) {
          iconWrapper.innerHTML = `<img src="${data.iconUrl}" alt="${data.serverName || 'Server Icon'}" class="discord-server-icon-img" style="width:100%;height:100%;object-fit:cover;border-radius:inherit;" />`;
        }
        if (onlineEl) onlineEl.innerHTML = `<span class="discord-dot-online"></span>${Number(data.online||0).toLocaleString()} Online`;
        if (totalEl)  totalEl.innerHTML  = `<span class="discord-dot-total"></span>${Number(data.total||0).toLocaleString()} Members`;
      }
    } catch (e) {}
  }

  updateStats();
  discordIntervalId = setInterval(updateStats, 30000);
}

/* ── Home page ── */
function initHome() {
  const grid = document.getElementById('featured-grid');
  if (!grid) return;
  const featured = PACKS.filter(p => p.featured && !p.hiddenFromBrowse).slice(0, 2);
  grid.innerHTML = featured.map((p, i) => buildCard(p, i < 2)).join('');

  const collections = PACKS.filter(p => p.packFolder);
  const collectionsSection = document.getElementById('collections-section');
  const collectionsGrid    = document.getElementById('collections-grid');
  if (collections.length > 0 && collectionsSection && collectionsGrid) {
    collectionsGrid.innerHTML = collections.map((p, i) => buildCollectionCard(p, i < 2)).join('');
    collectionsSection.style.display = '';
  }

  initDiscordWidget();
}

/* ── Download button builder ── */
function buildDownloadButton(pack) {
  const svgDownload = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="width:16px;height:16px;flex-shrink:0"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>`;
  const svgFolder   = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="width:16px;height:16px;flex-shrink:0"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>`;

  if (pack.packFolder)  return `<button class="btn-download" id="btn-folder">${svgFolder} Browse Files</button>`;
  if (pack.downloadFile) return `<a href="${pack.downloadFile}" download class="btn-download">${svgDownload} Download</a>`;
  if (pack.downloadUrl)  return `<a href="${pack.downloadUrl}" target="_blank" rel="noopener" class="btn-download">${svgDownload} Download</a>`;
  return '';
}

/* ── Pack detail page ── */
function initPackDetail() {
  const root = document.getElementById('pack-detail');
  if (!root) return;

  const id   = getParam('id');
  const pack = PACKS.find(p => p.id === id);

  if (!pack) {
    root.innerHTML = '<p class="error-msg">Pack not found.</p>';
    return;
  }

  document.title = `${pack.title} — feumrp`;

  function updateOrCreateMeta(property, val) {
    let el = document.querySelector(`meta[property="${property}"]`) || document.querySelector(`meta[name="${property}"]`);
    if (!el) {
      el = document.createElement('meta');
      if (property.startsWith('og:')) el.setAttribute('property', property);
      else el.setAttribute('name', property);
      document.head.appendChild(el);
    }
    el.setAttribute('content', val);
  }

  updateOrCreateMeta('og:title',       `${pack.title} — feumrp`);
  updateOrCreateMeta('og:description', `Curated premium texture pack: ${pack.title} by @${pack.author}. Available on feumrp!`);
  updateOrCreateMeta('og:image',       pack.cover);
  updateOrCreateMeta('twitter:title',  `${pack.title} — feumrp`);
  updateOrCreateMeta('twitter:image',  pack.cover);

  root.innerHTML = `
    <div class="detail-cover-container" id="cover-container">
      <div class="detail-cover">
        <img src="${pack.cover}" alt="${pack.title}" class="cover-image" style="view-transition-name: pack-cover-${pack.id};" />
        ${pack.youtubeEmbed ? `
          <div class="video-preview-wrapper">
            <iframe id="preview-iframe" src="" title="${pack.title} Showcase"
              frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen>
            </iframe>
          </div>
        ` : ''}
      </div>
    </div>

    <div class="detail-info">
      <div class="detail-meta">
        <div class="detail-title-block">
          <h1 class="detail-title">${pack.title}</h1>
          <div class="detail-author" onclick="navigateTo('browse.html?author=${pack.author.toLowerCase()}')">
            <img src="${pack.authorAvatar}" alt="${pack.author}" />
            <span>@${pack.author}</span>
          </div>
        </div>
        <div class="detail-actions">
          ${buildDownloadButton(pack)}
          ${pack.slug ? `
          <button class="btn-share" id="btn-share" aria-label="Share this pack">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
            </svg>
          </button>` : ''}
        </div>
      </div>
    </div>

    ${pack.screenshots.length > 1 ? `
    <div class="detail-screenshots">
      <h2>Screenshots</h2>
      <div class="screenshots-grid">
        ${pack.screenshots.map(s => `<img src="${s}" alt="${pack.title} screenshot" />`).join('')}
      </div>
    </div>` : ''}
  `;

  if (pack.youtubeEmbed) {
    const container = document.getElementById('cover-container');
    const iframe    = document.getElementById('preview-iframe');
    if (container && iframe) {
      const parts   = pack.youtubeEmbed.split('/');
      const videoId = parts[parts.length - 1] || '';
      container.addEventListener('mouseenter', () => {
        iframe.src = `${pack.youtubeEmbed}?autoplay=1&mute=1&controls=1&loop=1&playlist=${videoId}&enablejsapi=1`;
        container.classList.add('video-playing');
      });
      container.addEventListener('mouseleave', () => {
        iframe.src = 'about:blank';
        container.classList.remove('video-playing');
      });
    }
  }

  const folderBtn = root.querySelector('#btn-folder');
  if (folderBtn && pack.packFolder) folderBtn.addEventListener('click', () => openFolderModal(pack));

  const shareBtn = root.querySelector('#btn-share');
  if (shareBtn && pack.slug) {
    shareBtn.addEventListener('click', () => {
      const base     = window.location.origin + window.location.pathname.replace(/[^/]*$/, '');
      const shareUrl = base + pack.slug + '.html';
      openShareModal({ title: pack.title, author: pack.author, cover: pack.cover, url: shareUrl });
    });
  }
}

/* ── Folder Modal ── */
function openFolderModal(pack) {
  const existing = document.getElementById('folder-overlay');
  if (existing) existing.remove();

  const svgClose    = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" width="14" height="14"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`;
  const svgDownload = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" width="14" height="14"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>`;
  const svgExternal = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" width="14" height="14"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>`;
  const svgFile     = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="18" height="18"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>`;

  function buildFileRow(file) {
    if (file.downloadFile) return `
      <div class="folder-file-item">
        <span class="folder-file-icon">${svgFile}</span>
        <span class="folder-file-name">${file.name}</span>
        <a class="folder-file-btn" href="${file.downloadFile}" download>${svgDownload} Download</a>
      </div>`;
    if (file.downloadUrl) return `
      <div class="folder-file-item">
        <span class="folder-file-icon">${svgFile}</span>
        <span class="folder-file-name">${file.name}</span>
        <a class="folder-file-btn folder-file-btn-external" href="${file.downloadUrl}" target="_blank" rel="noopener">${svgExternal} Get</a>
      </div>`;
    return `
      <div class="folder-file-item">
        <span class="folder-file-icon">${svgFile}</span>
        <span class="folder-file-name">${file.name}</span>
      </div>`;
  }

  const overlay = document.createElement('div');
  overlay.id = 'folder-overlay';
  overlay.className = 'share-overlay';
  overlay.innerHTML = `
    <div class="share-modal folder-modal" role="dialog" aria-modal="true" aria-label="Files in ${pack.title}">
      <div class="share-modal-header">
        <span class="share-modal-title">Files in ${pack.title}</span>
        <button class="share-modal-close" id="folder-close-btn" aria-label="Close">${svgClose}</button>
      </div>
      <div class="share-modal-cover-wide">
        <img src="${pack.cover}" alt="${pack.title}" loading="lazy" decoding="async" />
        <div class="share-modal-cover-info">
          <span class="share-modal-pack-name">${pack.title}</span>
          <span class="share-modal-pack-author">@${pack.author} · ${pack.packFolder.length} file${pack.packFolder.length !== 1 ? 's' : ''}</span>
        </div>
      </div>
      <div class="folder-file-list">
        ${pack.packFolder.map(buildFileRow).join('')}
      </div>
    </div>
  `;

  document.body.appendChild(overlay);
  requestAnimationFrame(() => requestAnimationFrame(() => overlay.classList.add('visible')));

  function closeModal() {
    overlay.classList.remove('visible');
    overlay.addEventListener('transitionend', () => overlay.remove(), { once: true });
  }

  overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
  overlay.querySelector('#folder-close-btn').addEventListener('click', closeModal);
  function onKeyDown(e) { if (e.key === 'Escape') { closeModal(); document.removeEventListener('keydown', onKeyDown); } }
  document.addEventListener('keydown', onKeyDown);
}

/* ── Share Modal ── */
function openShareModal({ title, author, cover, url }) {
  const existing = document.getElementById('share-overlay');
  if (existing) existing.remove();

  const svgClose   = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" width="14" height="14"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`;
  const svgCopy    = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" width="14" height="14"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>`;
  const svgCheck   = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" width="14" height="14"><polyline points="20 6 9 17 4 12"/></svg>`;
  const svgX       = `<svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>`;
  const svgWA      = `<svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>`;
  const svgDiscord = `<svg viewBox="0 0 127.14 96.36" fill="currentColor" width="20" height="20"><path d="M107.7,8.07A105.15,105.15,0,0,0,77.26,0a77.19,77.19,0,0,0-3.3,6.83A96.67,96.67,0,0,0,52.18,6.83,77.19,77.19,0,0,0,48.88,0,105.15,105.15,0,0,0,18.44,8.07C-3.41,40.73-1,72.59,10.09,87.78a105.81,105.81,0,0,0,32,16.22,80.12,80.12,0,0,0,6.75-11,68.86,68.86,0,0,1-10.66-5.12c.9-.66,1.8-1.34,2.65-2a75.58,75.58,0,0,0,103.35,0c.85.69,1.75,1.37,2.65,2a68.86,68.86,0,0,1-10.66,5.12,80.12,80.12,0,0,0,6.75,11,105.81,105.81,0,0,0,32-16.22C128.14,72.59,129.7,40.73,107.7,8.07ZM42.45,71.69c-6.27,0-11.45-5.75-11.45-12.82S36.1,46.05,42.45,46.05,53.9,51.8,53.9,58.87,48.72,71.69,42.45,71.69Zm41.15,0c-6.27,0-11.45-5.75-11.45-12.82S77.25,46.05,83.6,46.05,95.05,51.8,95.05,58.87,89.87,71.69,83.6,71.69Z"/></svg>`;

  const tweetText = encodeURIComponent(`Check out ${title} on feumrp!`);
  const tweetUrl  = encodeURIComponent(url);
  const waText    = encodeURIComponent(`Check out ${title} on feumrp! ${url}`);

  const overlay = document.createElement('div');
  overlay.id = 'share-overlay';
  overlay.className = 'share-overlay';
  overlay.innerHTML = `
    <div class="share-modal" role="dialog" aria-modal="true" aria-label="Share ${title}">
      <div class="share-modal-header">
        <span class="share-modal-title">Share Pack</span>
        <button class="share-modal-close" id="share-close-btn" aria-label="Close">${svgClose}</button>
      </div>

      <div class="share-modal-cover-wide">
        <img src="${cover}" alt="${title}" loading="lazy" decoding="async" />
        <div class="share-modal-cover-info">
          <span class="share-modal-pack-name">${title}</span>
          <span class="share-modal-pack-author">@${author}</span>
        </div>
      </div>

      <div class="share-url-row">
        <input class="share-url-input" type="text" value="${url}" readonly />
        <button class="share-copy-btn" id="share-copy-btn">${svgCopy} Copy</button>
      </div>

      <div class="share-divider">Share on</div>

      <div class="share-platforms">
        <a class="share-platform-btn" href="https://twitter.com/intent/tweet?text=${tweetText}&url=${tweetUrl}" target="_blank" rel="noopener" aria-label="Share on X / Twitter">
          ${svgX}
        </a>
        <a class="share-platform-btn" href="https://wa.me/?text=${waText}" target="_blank" rel="noopener" aria-label="Share on WhatsApp">
          ${svgWA}
        </a>
        <button class="share-platform-btn" id="share-discord-btn" aria-label="Copy link for Discord">
          ${svgDiscord}
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);
  requestAnimationFrame(() => requestAnimationFrame(() => overlay.classList.add('visible')));

  function closeModal() {
    overlay.classList.remove('visible');
    overlay.addEventListener('transitionend', () => overlay.remove(), { once: true });
  }

  overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
  overlay.querySelector('#share-close-btn').addEventListener('click', closeModal);
  function onKeyDown(e) { if (e.key === 'Escape') { closeModal(); document.removeEventListener('keydown', onKeyDown); } }
  document.addEventListener('keydown', onKeyDown);

  const copyBtn = overlay.querySelector('#share-copy-btn');
  copyBtn.addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(url); }
    catch { const inp = overlay.querySelector('.share-url-input'); inp.select(); document.execCommand('copy'); }
    copyBtn.classList.add('copied');
    copyBtn.innerHTML = `${svgCheck} Copied!`;
    setTimeout(() => { copyBtn.classList.remove('copied'); copyBtn.innerHTML = `${svgCopy} Copy`; }, 2000);
  });

  const discordBtn = overlay.querySelector('#share-discord-btn');
  discordBtn.addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(url); }
    catch { const inp = overlay.querySelector('.share-url-input'); inp.select(); document.execCommand('copy'); }
    discordBtn.innerHTML = svgCheck;
    setTimeout(() => { discordBtn.innerHTML = svgDiscord; }, 2000);
  });
}

/* ── Init on load ── */
document.addEventListener('DOMContentLoaded', () => {
  document.body.addEventListener('click', e => {
    const anchor = e.target.closest('a');
    if (anchor) {
      const href = anchor.getAttribute('href');
      if (href && !href.startsWith('http') && !href.startsWith('#') && !anchor.hasAttribute('target') && !anchor.hasAttribute('download')) {
        e.preventDefault();
        navigateTo(href);
      }
    }
  });

  window.addEventListener('popstate', () => {
    const routeType = getRouteType(window.location.pathname);
    if (document.startViewTransition) {
      document.startViewTransition(() => renderPage(routeType, window.location.href, true));
    } else {
      renderPage(routeType, window.location.href, true);
    }
  });

  const initialRoute = getRouteType(window.location.pathname);
  if (initialRoute === 'home')        initHome();
  else if (initialRoute === 'browse') initBrowse();
  else if (initialRoute === 'collections') initCollections();
  else if (initialRoute === 'pack')   initPackDetail();
});
