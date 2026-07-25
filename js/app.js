/* ============================================================
   STREAMERCARDS — APP
   Reads window.STREAMERCARDS_CONFIG (from config.js) and renders
   the home view (collections) and set view (cards). Nothing in
   this file needs editing to add cards — that all lives in config.js.
   ============================================================ */

(function () {
  const { RARITIES, COLLECTIONS, SITE } = window.STREAMERCARDS_CONFIG;

  document.title = `${SITE.name} — ${SITE.tagline}`;

  const els = {
    homeView: document.getElementById("home-view"),
    setView: document.getElementById("set-view"),
    collectionsGrid: document.getElementById("collections-grid"),
    rarityLegend: document.getElementById("rarity-legend"),
    rarityFilter: document.getElementById("rarity-filter"),
    cardsGrid: document.getElementById("cards-grid"),
    setTitle: document.getElementById("set-title"),
    setTagline: document.getElementById("set-tagline"),
    breadcrumb: document.getElementById("breadcrumb"),
    breadcrumbCurrent: document.getElementById("breadcrumb-current"),
    breadcrumbHome: document.getElementById("breadcrumb-home"),
    navHomeBtn: document.getElementById("nav-home-btn"),
    logoBtn: document.getElementById("logo-home-btn"),
    searchInput: document.getElementById("search-input"),
    modalBackdrop: document.getElementById("modal-backdrop"),
    modal: document.getElementById("modal"),
    modalClose: document.getElementById("modal-close"),
    modalArt: document.getElementById("modal-art"),
    modalRarity: document.getElementById("modal-rarity"),
    modalName: document.getElementById("modal-name"),
    modalNumber: document.getElementById("modal-number"),
    modalDesc: document.getElementById("modal-desc"),
  };

  let state = {
    setId: null,        // currently viewed collection id, or null = home
    rarityFilter: null, // active rarity key, or null = all
    query: "",
  };

  /* ---------- tactile interaction helpers ---------- */

  // Tilts an element toward the cursor (rotateX/rotateY) and tracks the
  // pointer position for foil/light sheens, all via CSS custom properties
  function attachTilt(el, { maxTilt = 10, accentColor = null } = {}) {
    el.addEventListener("mousemove", (e) => {
      const rect = el.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;
      const py = (e.clientY - rect.top) / rect.height;
      const ry = (px - 0.5) * maxTilt * 2;
      const rx = (0.5 - py) * maxTilt * 2;
      el.style.setProperty("--rx", `${rx.toFixed(2)}deg`);
      el.style.setProperty("--ry", `${ry.toFixed(2)}deg`);
      el.style.setProperty("--mx", `${(px * 100).toFixed(1)}%`);
      el.style.setProperty("--my", `${(py * 100).toFixed(1)}%`);
    });

    // Color-adapting ambient environmental backlighting
    el.addEventListener("mouseenter", () => {
      if (accentColor) {
        document.documentElement.style.setProperty("--ambient-color", accentColor);
      }
    });

    el.addEventListener("mouseleave", () => {
      el.style.setProperty("--rx", "0deg");
      el.style.setProperty("--ry", "0deg");
      el.style.setProperty("--mx", "50%");
      el.style.setProperty("--my", "50%");
      document.documentElement.style.setProperty("--ambient-color", "rgba(177, 92, 255, 0.03)");
    });
  }

  // Nudges an element a few px toward the cursor while hovering
  function attachMagnetic(el, { strength = 0.25, max = 7 } = {}) {
    el.addEventListener("mousemove", (e) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const tx = Math.max(-max, Math.min(max, (e.clientX - cx) * strength));
      const ty = Math.max(-max, Math.min(max, (e.clientY - cy) * strength));
      el.style.setProperty("--tx", `${tx.toFixed(1)}px`);
      el.style.setProperty("--ty", `${ty.toFixed(1)}px`);
    });
    el.addEventListener("mouseleave", () => {
      el.style.setProperty("--tx", "0px");
      el.style.setProperty("--ty", "0px");
    });
  }

  /* ---------- helpers ---------- */

  function findCollection(id) {
    return COLLECTIONS.find((c) => c.id === id);
  }

  function rarityOf(key) {
    return RARITIES[key] || { label: key, color: "#888", glow: "rgba(136,136,136,0.4)", holo: false };
  }

  function allRaritiesSorted() {
    return Object.entries(RARITIES).sort((a, b) => (b[1].weight || 0) - (a[1].weight || 0));
  }

  /* ---------- rendering: hero stats ---------- */

  function renderHeroStats() {
    const totalCards = COLLECTIONS.reduce((sum, c) => sum + c.cards.length, 0);
    document.getElementById("stat-cards").textContent = totalCards;
    document.getElementById("stat-collections").textContent = COLLECTIONS.length;
    document.getElementById("stat-rarities").textContent = Object.keys(RARITIES).length;
  }

  /* ---------- rendering: legend ---------- */

  function renderLegend() {
    els.rarityLegend.innerHTML = "";
    allRaritiesSorted().forEach(([key, r]) => {
      const chip = document.createElement("span");
      chip.className = "rarity-chip";
      chip.innerHTML = `<span class="dot" style="background:${r.color}"></span>${r.label}`;
      els.rarityLegend.appendChild(chip);
    });
  }

  /* ---------- rendering: home (collections) ---------- */

  function topRarityInCollection(col) {
    return col.cards.reduce((top, c) => {
      const r = rarityOf(c.rarity);
      return !top || (r.weight || 0) > (rarityOf(top).weight || 0) ? c.rarity : top;
    }, null);
  }

  function renderRarityDistribution(col) {
    const counts = {};
    col.cards.forEach((c) => { counts[c.rarity] = (counts[c.rarity] || 0) + 1; });
    return allRaritiesSorted()
      .filter(([key]) => counts[key])
      .map(([key, r]) => `<span class="dist-seg" style="flex-grow:${counts[key]};background:${r.color}" title="${counts[key]} ${r.label}"></span>`)
      .join("");
  }

  function renderCollections() {
    els.collectionsGrid.innerHTML = "";
    COLLECTIONS.forEach((col, idx) => {
      const tile = document.createElement("button");
      tile.className = "collection-tile";
      const colAccent = col.accent || "var(--accent)";
      tile.style.setProperty("--tile-accent", colAccent);
      
      // Card staggered entry styling on home screen
      tile.style.animation = "card-deal-reveal 0.6s var(--spring) both";
      tile.style.animationDelay = `${idx * 0.05}s`;

      const peak = rarityOf(topRarityInCollection(col));
      tile.innerHTML = `
        <div class="tile-art">
          <img src="${col.cover}" alt="" loading="lazy" onerror="this.style.display='none';" />
          <span class="tile-count-pill">${col.cards.length} cards</span>
          <span class="tile-peek" style="color:${peak.color};border-color:${peak.color}">${peak.holo ? "✦ " : "★ "}${peak.label} inside</span>
        </div>
        <div class="tile-body">
          <h3>${col.name}</h3>
          <p>${col.tagline || ""}</p>
          <div class="rarity-distribution">${renderRarityDistribution(col)}</div>
          <div class="tile-meta">
            <span class="tile-cta">View set <span class="tile-arrow">→</span></span>
          </div>
        </div>
      `;
      
      attachTilt(tile, { maxTilt: 6, accentColor: colAccent });
      tile.addEventListener("click", () => goToSet(col.id));
      els.collectionsGrid.appendChild(tile);
    });
  }

  /* ---------- rendering: global search results ---------- */

  function renderGlobalSearchResults() {
    els.collectionsGrid.innerHTML = "";

    const searchContainer = document.createElement("div");
    searchContainer.className = "global-search-results";

    const title = document.createElement("h3");
    title.className = "section-label";
    title.textContent = `Search results for "${state.query}"`;
    searchContainer.appendChild(title);

    const resultsGrid = document.createElement("div");
    resultsGrid.className = "cards-grid";
    searchContainer.appendChild(resultsGrid);

    let matches = [];
    COLLECTIONS.forEach((col) => {
      col.cards.forEach((card) => {
        if (cardMatchesQuery(card, state.query)) {
          matches.push({ card, col });
        }
      });
    });

    if (matches.length === 0) {
      resultsGrid.innerHTML = `<div class="empty-state">No cards found matching "${state.query}" across any collection.</div>`;
    } else {
      matches.forEach(({ card }, idx) => {
        const r = rarityOf(card.rarity);
        const el = document.createElement("div");
        el.className = "card" + (r.holo ? " is-holo" : "");
        el.tabIndex = 0;
        el.style.setProperty("--rarity-color", r.color);
        el.style.setProperty("--rarity-glow", r.glow);
        el.style.animationDelay = `${idx * 0.03}s`; // staggered deal in search results
        
        el.innerHTML = `
          <div class="card-art">
            <img src="${card.image}" alt="${card.name}" loading="lazy"
                 onerror="this.onerror=null;this.src='${SITE.fallbackImage}';" />
          </div>
          <div class="card-rarity-bar"></div>
          <div class="card-body">
            <p class="card-name">${card.name}</p>
            <div class="card-meta">
              <span class="rarity-label">${r.label}</span>
              <span>${card.number}</span>
            </div>
          </div>
        `;
        attachTilt(el, { maxTilt: 9, accentColor: r.color });
        el.addEventListener("click", () => openModal(card));
        el.addEventListener("keydown", (e) => {
          if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openModal(card); }
        });
        resultsGrid.appendChild(el);
      });
    }

    els.collectionsGrid.appendChild(searchContainer);
  }

  /* ---------- rendering: set view (rarity filter + cards) ---------- */

  function renderRarityFilterBar(collection) {
    els.rarityFilter.innerHTML = "";

    const allBtn = document.createElement("button");
    allBtn.className = "rarity-chip";
    allBtn.textContent = "All rarities";
    allBtn.dataset.selected = state.rarityFilter === null;
    allBtn.addEventListener("click", () => { state.rarityFilter = null; renderSet(); });
    els.rarityFilter.appendChild(allBtn);

    const presentRarities = new Set(collection.cards.map((c) => c.rarity));
    allRaritiesSorted()
      .filter(([key]) => presentRarities.has(key))
      .forEach(([key, r]) => {
        const btn = document.createElement("button");
        btn.className = "rarity-chip";
        btn.style.setProperty("--chip-color", r.color);
        btn.dataset.selected = state.rarityFilter === key;
        btn.innerHTML = `<span class="dot" style="background:${r.color}"></span>${r.label}`;
        btn.addEventListener("click", () => {
          state.rarityFilter = state.rarityFilter === key ? null : key;
          renderSet();
        });
        els.rarityFilter.appendChild(btn);
      });
  }

  function cardMatchesQuery(card, query) {
    if (!query) return true;
    const q = query.toLowerCase();
    return card.name.toLowerCase().includes(q) || card.number.toLowerCase().includes(q);
  }

  function renderCardsGrid(collection) {
    els.cardsGrid.innerHTML = "";
    const filtered = collection.cards.filter(
      (c) => (!state.rarityFilter || c.rarity === state.rarityFilter) && cardMatchesQuery(c, state.query)
    );

    if (filtered.length === 0) {
      els.cardsGrid.innerHTML = `<div class="empty-state">No cards match your filters. Try clearing the search or rarity filter.</div>`;
      return;
    }

    filtered.forEach((card, idx) => {
      const r = rarityOf(card.rarity);
      const el = document.createElement("div");
      el.className = "card" + (r.holo ? " is-holo" : "");
      el.tabIndex = 0;
      el.style.setProperty("--rarity-color", r.color);
      el.style.setProperty("--rarity-glow", r.glow);
      
      // Assign dynamic layout delays to animate cards like actual dealing decks
      el.style.animationDelay = `${idx * 0.04}s`;

      el.innerHTML = `
        <div class="card-art">
          <img src="${card.image}" alt="${card.name}" loading="lazy"
               onerror="this.onerror=null;this.src='${SITE.fallbackImage}';" />
        </div>
        <div class="card-rarity-bar"></div>
        <div class="card-body">
          <p class="card-name">${card.name}</p>
          <div class="card-meta">
            <span class="rarity-label">${r.label}</span>
            <span>${card.number}</span>
          </div>
        </div>
      `;

      attachTilt(el, { maxTilt: 9, accentColor: r.color });

      el.addEventListener("click", () => openModal(card));
      el.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openModal(card); }
      });

      els.cardsGrid.appendChild(el);
    });
  }

  function renderSet() {
    const collection = findCollection(state.setId);
    if (!collection) { goHome(); return; }
    els.setTitle.textContent = collection.name;
    els.setTagline.textContent = collection.tagline || "";
    renderRarityFilterBar(collection);
    renderCardsGrid(collection);
  }

  /* ---------- modal ---------- */

  function openModal(card) {
    const r = rarityOf(card.rarity);
    els.modal.style.setProperty("--rarity-color", r.color);
    els.modalArt.innerHTML = `<img src="${card.image}" alt="${card.name}" onerror="this.onerror=null;this.src='${SITE.fallbackImage}';" />`;
    els.modalRarity.textContent = r.label;
    els.modalName.textContent = card.name;
    els.modalNumber.textContent = card.number;
    els.modalDesc.textContent = card.description || "";
    els.modalBackdrop.hidden = false;
    els.modalClose.focus();
  }

  function closeModal() {
    els.modalBackdrop.hidden = true;
  }

  els.modalClose.addEventListener("click", closeModal);
  els.modalBackdrop.addEventListener("click", (e) => {
    if (e.target === els.modalBackdrop) closeModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !els.modalBackdrop.hidden) closeModal();
  });

  /* ---------- routing (view switching) ---------- */

  function goHome() {
    state.setId = null;
    state.rarityFilter = null;
    state.query = "";
    els.searchInput.value = "";
    location.hash = "";
    render();
  }

  function goToSet(id) {
    state.setId = id;
    state.rarityFilter = null;
    location.hash = `set/${id}`;
    render();
  }

  function applyHashToState() {
    const hash = location.hash.replace(/^#\/?/, "");
    if (hash.startsWith("set/")) {
      const id = hash.slice(4);
      state.setId = findCollection(id) ? id : null;
    } else {
      state.setId = null;
    }
  }

  function render() {
    const inSet = !!state.setId;
    const isSearchingHome = !inSet && state.query.length > 0;

    els.homeView.hidden = inSet;
    els.setView.hidden = !inSet;
    els.breadcrumb.hidden = !inSet;
    els.navHomeBtn.dataset.active = String(inSet);

    if (inSet) {
      const collection = findCollection(state.setId);
      els.breadcrumbCurrent.textContent = collection ? collection.name : "";
      renderSet();
    } else {
      if (isSearchingHome) {
        renderGlobalSearchResults();
      } else {
        renderCollections();
      }
    }
  }

  /* ---------- nav bindings ---------- */

  els.logoBtn.addEventListener("click", goHome);
  els.navHomeBtn.addEventListener("click", goHome);
  els.breadcrumbHome.addEventListener("click", goHome);

  els.searchInput.addEventListener("input", (e) => {
    state.query = e.target.value.trim();
    if (state.setId) {
      renderSet();
    } else {
      render();
    }
  });

  window.addEventListener("hashchange", () => {
    applyHashToState();
    render();
  });

  /* ---------- ambient cursor glow ---------- */

  const ambientGlow = document.getElementById("ambient-glow");
  let glowQueued = false;
  document.addEventListener("mousemove", (e) => {
    if (glowQueued) return;
    glowQueued = true;
    requestAnimationFrame(() => {
      const xPct = ((e.clientX / window.innerWidth) * 100).toFixed(1);
      const yPct = ((e.clientY / window.innerHeight) * 100).toFixed(1);
      ambientGlow.style.setProperty("--gx", `${xPct}%`);
      ambientGlow.style.setProperty("--gy", `${yPct}%`);
      glowQueued = false;
    });
  });

  /* ---------- background stardust cosmic system ---------- */

  function initStardust() {
    const container = document.createElement("div");
    container.className = "particles";
    document.body.appendChild(container);

    const stardustDensity = 24;
    for (let i = 0; i < stardustDensity; i++) {
      const particle = document.createElement("div");
      particle.className = "particle";
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.top = `${Math.random() * 100}%`;
      const sizeVal = Math.random() * 3 + 1.5;
      particle.style.width = `${sizeVal}px`;
      particle.style.height = `${sizeVal}px`;
      particle.style.animationDuration = `${Math.random() * 15 + 10}s`;
      particle.style.animationDelay = `-${Math.random() * 15}s`;
      particle.style.opacity = (Math.random() * 0.18 + 0.04).toFixed(2);
      container.appendChild(particle);
    }
  }

  /* ---------- magnetic header buttons ---------- */

  attachMagnetic(els.logoBtn, { strength: 0.3, max: 6 });
  attachMagnetic(els.navHomeBtn, { strength: 0.3, max: 6 });

  /* ---------- init ---------- */

  initStardust();
  renderLegend();
  renderHeroStats();
  applyHashToState();
  render();
})();