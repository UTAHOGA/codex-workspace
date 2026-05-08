const STORAGE_KEY = 'uoga-hunt-backpack-v2';

const huntUnits = [
  {
    id: 'cache-meadowville',
    name: 'Cache, Meadowville',
    region: 'Northern Utah',
    center: [41.86, -111.48],
    path: 'M285 112 C360 88 438 132 470 205 C422 292 305 280 252 210 Z',
    ownership: { usfs: 48, blm: 7, sitla: 8, dwr: 6, private: 25, cwmu: 6 },
  },
  {
    id: 'wasatch-west',
    name: 'Wasatch Mountains, West',
    region: 'Central Utah',
    center: [40.55, -111.55],
    path: 'M335 312 C425 258 545 310 585 420 C515 520 375 525 300 428 Z',
    ownership: { usfs: 55, blm: 5, sitla: 6, dwr: 8, private: 18, cwmu: 8 },
  },
  {
    id: 'pine-valley',
    name: 'Pine Valley',
    region: 'Southwestern Utah',
    center: [37.35, -113.55],
    path: 'M210 510 C308 455 410 505 438 610 C360 690 238 668 188 585 Z',
    ownership: { usfs: 36, blm: 32, sitla: 10, dwr: 4, private: 12, cwmu: 6 },
  },
  {
    id: 'san-juan-elk-ridge',
    name: 'San Juan, Elk Ridge',
    region: 'Southeastern Utah',
    center: [37.78, -109.78],
    path: 'M468 485 C560 435 660 492 678 592 C612 684 482 662 438 570 Z',
    ownership: { usfs: 42, blm: 24, sitla: 9, dwr: 5, private: 14, cwmu: 6 },
  },
];

const hunts = [
  {
    id: 'DB1001',
    species: 'Deer',
    sex: 'Buck',
    huntType: 'General season',
    huntClass: 'Any legal weapon',
    weapon: 'Rifle',
    unitId: 'cache-meadowville',
    dates: 'Oct. 18–26',
    difficulty: 'Moderate',
    drawOdds: 'Medium',
    trend: 'Stable demand',
    sourceUrl: 'https://wildlife.utah.gov/hunting/main-hunting-page.html',
  },
  {
    id: 'EL2204',
    species: 'Elk',
    sex: 'Bull',
    huntType: 'Limited entry',
    huntClass: 'Premium limited entry',
    weapon: 'Archery',
    unitId: 'wasatch-west',
    dates: 'Aug. 16–Sept. 12',
    difficulty: 'Hard',
    drawOdds: 'Low',
    trend: 'High demand',
    sourceUrl: 'https://wildlife.utah.gov/hunting/main-hunting-page.html',
  },
  {
    id: 'PR3307',
    species: 'Pronghorn',
    sex: 'Either sex',
    huntType: 'Limited entry',
    huntClass: 'Limited entry',
    weapon: 'Muzzleloader',
    unitId: 'pine-valley',
    dates: 'Sept. 24–Oct. 2',
    difficulty: 'Moderate',
    drawOdds: 'Low',
    trend: 'Variable access',
    sourceUrl: 'https://wildlife.utah.gov/hunting/main-hunting-page.html',
  },
  {
    id: 'BI4102',
    species: 'Bison',
    sex: 'Either sex',
    huntType: 'Once-in-a-lifetime',
    huntClass: 'Once-in-a-lifetime',
    weapon: 'Rifle',
    unitId: 'san-juan-elk-ridge',
    dates: 'Nov. 1–Dec. 31',
    difficulty: 'Hard',
    drawOdds: 'Very low',
    trend: 'Low permit volume',
    sourceUrl: 'https://wildlife.utah.gov/hunting/main-hunting-page.html',
  },
  {
    id: 'EL5510',
    species: 'Elk',
    sex: 'Cow',
    huntType: 'Antlerless',
    huntClass: 'Antlerless',
    weapon: 'Rifle',
    unitId: 'cache-meadowville',
    dates: 'Nov. 8–20',
    difficulty: 'Moderate',
    drawOdds: 'Medium',
    trend: 'Access sensitive',
    sourceUrl: 'https://wildlife.utah.gov/hunting/main-hunting-page.html',
  },
  {
    id: 'DE7803',
    species: 'Deer',
    sex: 'Buck',
    huntType: 'Dedicated hunter',
    huntClass: 'Dedicated hunter',
    weapon: 'Multi-season',
    unitId: 'wasatch-west',
    dates: 'Multi-season',
    difficulty: 'Moderate',
    drawOdds: 'Medium',
    trend: 'Stable demand',
    sourceUrl: 'https://wildlife.utah.gov/hunting/main-hunting-page.html',
  },
];

const outfitters = [
  { name: 'High Ridge Outfitters', species: ['Elk', 'Deer'], units: ['wasatch-west'], services: 'Guided rifle and archery hunts' },
  { name: 'North Cache Guides', species: ['Deer', 'Elk'], units: ['cache-meadowville'], services: 'Private-land access planning' },
  { name: 'Red Rock Field Service', species: ['Bison', 'Pronghorn'], units: ['san-juan-elk-ridge', 'pine-valley'], services: 'Scouting, pack-out, and logistics' },
];

const state = {
  filters: { species: 'all', sex: 'all', huntType: 'all', huntClass: 'all', weapon: 'all', unitId: 'all' },
  query: '',
  selectedUnitId: null,
  selectedHuntId: null,
  savedIds: loadBackpack(),
  tableView: false,
  basemap: 'road',
  mapSource: 'dwr',
  layerVisibility: { usfs: true, blm: true, sitla: true, dwr: true, private: true, cwmu: true },
};

const els = {
  panel: document.querySelector('#builder-panel'),
  mobileToggle: document.querySelector('.mobile-panel-toggle'),
  search: document.querySelector('#hunt-search'),
  filters: document.querySelectorAll('[data-filter]'),
  reset: document.querySelector('#reset-filters'),
  clearBackpack: document.querySelector('#clear-backpack'),
  filterSummary: document.querySelector('#filter-summary'),
  unitBoundaries: document.querySelector('#unit-boundaries'),
  ownershipOverlays: document.querySelector('#ownership-overlays'),
  mapCanvas: document.querySelector('#map-canvas'),
  mapStatus: document.querySelector('#map-status'),
  mapEmpty: document.querySelector('#map-empty'),
  resultCount: document.querySelector('#result-count'),
  loading: document.querySelector('#loading-state'),
  empty: document.querySelector('#empty-state'),
  results: document.querySelector('#hunt-results'),
  availablePanel: document.querySelector('#available-panel'),
  saved: document.querySelector('#saved-hunts'),
  savedCount: document.querySelector('#saved-count'),
  comparison: document.querySelector('#comparison'),
  analysis: document.querySelector('#hunt-analysis'),
  outfitterResults: document.querySelector('#outfitter-results'),
  officialStatus: document.querySelector('#official-status'),
  officialLink: document.querySelector('#official-link'),
  officialFrame: document.querySelector('#official-frame'),
};

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>'"]/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    "'": '&#39;',
    '"': '&quot;',
  })[character]);
}

function unitById(unitId) {
  return huntUnits.find((unit) => unit.id === unitId);
}

function huntById(huntId) {
  return hunts.find((hunt) => hunt.id === huntId);
}

function loadBackpack() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

function saveBackpack() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.savedIds));
  } catch {
    showStatus('Backpack could not be saved because browser storage is unavailable.');
  }
}

function showStatus(message) {
  els.filterSummary.textContent = message;
}

function uniqueOptions(key) {
  return [...new Set(hunts.map((hunt) => hunt[key]))].sort();
}

function populateFilters() {
  const optionMap = {
    species: uniqueOptions('species'),
    sex: uniqueOptions('sex'),
    huntType: uniqueOptions('huntType'),
    huntClass: uniqueOptions('huntClass'),
    weapon: uniqueOptions('weapon'),
    unitId: huntUnits.map((unit) => ({ label: unit.name, value: unit.id })),
  };

  els.filters.forEach((select) => {
    const key = select.dataset.filter;
    const options = optionMap[key] || [];
    select.innerHTML = '<option value="all">All</option>' + options.map((option) => {
      const value = typeof option === 'string' ? option : option.value;
      const label = typeof option === 'string' ? option : option.label;
      return `<option value="${escapeHtml(value)}">${escapeHtml(label)}</option>`;
    }).join('');
  });
}

function currentResults() {
  const query = state.query.trim().toLowerCase();
  return hunts.filter((hunt) => {
    const unit = unitById(hunt.unitId);
    const filterMatch = Object.entries(state.filters).every(([key, value]) => value === 'all' || hunt[key] === value);
    const queryText = `${hunt.id} ${hunt.species} ${hunt.sex} ${hunt.huntType} ${hunt.huntClass} ${hunt.weapon} ${unit?.name} ${unit?.region}`.toLowerCase();
    return filterMatch && (!query || queryText.includes(query));
  });
}

function renderMap() {
  const visibleUnitIds = new Set(currentResults().map((hunt) => hunt.unitId));
  els.unitBoundaries.innerHTML = huntUnits.map((unit) => {
    const isVisible = visibleUnitIds.has(unit.id);
    const isSelected = state.selectedUnitId === unit.id;
    return `<path class="unit-boundary${isSelected ? ' selected' : ''}${isVisible ? '' : ' muted'}" tabindex="0" role="button" aria-label="Select ${escapeHtml(unit.name)} hunt unit" data-unit-id="${escapeHtml(unit.id)}" d="${unit.path}" />`;
  }).join('');

  els.ownershipOverlays.innerHTML = huntUnits.map((unit) => Object.entries(unit.ownership).map(([key, percent], index) => {
    const visible = state.layerVisibility[key];
    return `<circle class="ownership-bubble ${key}${visible ? '' : ' hidden-layer'}" cx="${270 + index * 48}" cy="${145 + huntUnits.indexOf(unit) * 115}" r="${Math.max(8, percent / 2.5)}"><title>${unit.name}: ${key.toUpperCase()} ${percent}%</title></circle>`;
  }).join('')).join('');

  els.mapEmpty.hidden = visibleUnitIds.size > 0;
  els.mapCanvas.className = `map-canvas ${state.basemap}`;

  els.unitBoundaries.querySelectorAll('.unit-boundary').forEach((path) => {
    path.addEventListener('click', () => selectUnit(path.dataset.unitId));
    path.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        selectUnit(path.dataset.unitId);
      }
    });
  });
}

function renderResults() {
  const results = currentResults();
  els.loading.hidden = true;
  els.empty.hidden = results.length > 0;
  els.resultCount.textContent = results.length;
  els.availablePanel.classList.toggle('table-mode', state.tableView);
  els.results.innerHTML = results.map((hunt) => renderHuntCard(hunt)).join('');
  els.filterSummary.textContent = `${results.length} hunt${results.length === 1 ? '' : 's'} match current filters.`;

  els.results.querySelectorAll('[data-select-hunt]').forEach((button) => {
    button.addEventListener('click', () => selectHunt(button.dataset.selectHunt));
  });
  els.results.querySelectorAll('[data-save-hunt]').forEach((button) => {
    button.addEventListener('click', () => toggleSave(button.dataset.saveHunt));
  });
}

function renderHuntCard(hunt) {
  const unit = unitById(hunt.unitId);
  const saved = state.savedIds.includes(hunt.id);
  return `
    <article class="hunt-card${state.selectedHuntId === hunt.id ? ' selected' : ''}">
      <div>
        <p class="card-kicker">${escapeHtml(hunt.id)} · ${escapeHtml(unit?.region || '')}</p>
        <h3>${escapeHtml(hunt.species)} ${escapeHtml(hunt.sex)}</h3>
        <p>${escapeHtml(unit?.name)} · ${escapeHtml(hunt.weapon)} · ${escapeHtml(hunt.dates)}</p>
        <dl>
          <div><dt>Type</dt><dd>${escapeHtml(hunt.huntType)}</dd></div>
          <div><dt>Class</dt><dd>${escapeHtml(hunt.huntClass)}</dd></div>
          <div><dt>Draw</dt><dd>${escapeHtml(hunt.drawOdds)}</dd></div>
        </dl>
      </div>
      <div class="card-actions">
        <button type="button" data-select-hunt="${escapeHtml(hunt.id)}">Select</button>
        <button type="button" class="secondary" data-save-hunt="${escapeHtml(hunt.id)}">${saved ? 'Remove' : 'Save'}</button>
      </div>
    </article>
  `;
}

function renderBackpack() {
  const savedHunts = state.savedIds.map(huntById).filter(Boolean);
  els.savedCount.textContent = savedHunts.length;
  els.saved.innerHTML = savedHunts.length
    ? savedHunts.map((hunt) => `<button type="button" data-select-hunt="${escapeHtml(hunt.id)}">${escapeHtml(hunt.id)} · ${escapeHtml(hunt.species)} · ${escapeHtml(unitById(hunt.unitId)?.name)}</button>`).join('')
    : '<p class="muted-copy">Save hunts to compare them here.</p>';

  els.saved.querySelectorAll('[data-select-hunt]').forEach((button) => {
    button.addEventListener('click', () => selectHunt(button.dataset.selectHunt));
  });

  els.comparison.hidden = savedHunts.length < 2;
  els.comparison.innerHTML = savedHunts.length < 2 ? '' : `
    <h3>Side-by-side comparison</h3>
    <div class="compare-grid">
      ${savedHunts.slice(0, 3).map((hunt) => `
        <div>
          <strong>${escapeHtml(hunt.id)}</strong>
          <span>${escapeHtml(hunt.species)} · ${escapeHtml(hunt.weapon)}</span>
          <span>${escapeHtml(hunt.drawOdds)} draw odds</span>
          <span>${escapeHtml(unitById(hunt.unitId)?.name)}</span>
        </div>
      `).join('')}
    </div>
  `;
}

function renderAnalysis() {
  const hunt = huntById(state.selectedHuntId);
  if (!hunt) {
    els.analysis.textContent = 'Select a hunt to see unit notes, access cautions, and outfitter matches.';
    els.outfitterResults.textContent = 'Select a hunt to load outfitters.';
    els.officialStatus.textContent = 'Select a hunt to prepare an official-source fallback link.';
    els.officialFrame.hidden = true;
    return;
  }

  const unit = unitById(hunt.unitId);
  els.analysis.innerHTML = `
    <h3>${escapeHtml(hunt.id)} · ${escapeHtml(hunt.species)} ${escapeHtml(hunt.sex)}</h3>
    <p><strong>Unit:</strong> ${escapeHtml(unit.name)}</p>
    <p><strong>Access profile:</strong> ${unit.ownership.private + unit.ownership.cwmu}% private/CWMU planning sensitivity. Confirm permission before entering private property.</p>
    <p><strong>Planning note:</strong> ${escapeHtml(hunt.trend)} · ${escapeHtml(hunt.difficulty)} hunt difficulty.</p>
  `;

  const matches = outfitters.filter((outfitter) => outfitter.species.includes(hunt.species) && outfitter.units.includes(hunt.unitId));
  els.outfitterResults.innerHTML = matches.length
    ? matches.map((outfitter) => `<article class="outfitter-card"><strong>${escapeHtml(outfitter.name)}</strong><span>${escapeHtml(outfitter.services)}</span></article>`).join('')
    : '<p class="muted-copy">No verified outfitter match is loaded for this sample hunt yet.</p>';

  els.officialLink.href = hunt.sourceUrl;
  els.officialStatus.textContent = `Use the official DWR link to verify ${hunt.id} rules, dates, and boundaries before applying or hunting.`;
  els.officialFrame.hidden = false;
  els.officialFrame.src = hunt.sourceUrl;
  window.setTimeout(() => {
    if (els.officialFrame && !els.officialFrame.hidden) {
      els.officialStatus.textContent += ' If the embedded page is blocked, use the Open DWR button.';
    }
  }, 1600);
}

function selectUnit(unitId) {
  state.selectedUnitId = unitId;
  state.filters.unitId = unitId;
  document.querySelector('#unit-filter').value = unitId;
  const unit = unitById(unitId);
  els.mapStatus.textContent = `${unit.name} selected. Matching hunts loaded.`;
  render();
  const firstHunt = currentResults()[0];
  if (firstHunt) selectHunt(firstHunt.id, { preserveUrl: true });
}

function selectHunt(huntId, options = {}) {
  const hunt = huntById(huntId);
  if (!hunt) return;
  state.selectedHuntId = huntId;
  state.selectedUnitId = hunt.unitId;
  const unit = unitById(hunt.unitId);
  els.mapStatus.textContent = `${hunt.id} selected. Map centered on ${unit.name}.`;
  if (!options.preserveUrl) updateUrlState();
  render();
}

function toggleSave(huntId) {
  state.savedIds = state.savedIds.includes(huntId)
    ? state.savedIds.filter((id) => id !== huntId)
    : [...state.savedIds, huntId];
  saveBackpack();
  render();
}

function updateUrlState() {
  const params = new URLSearchParams();
  if (state.selectedHuntId) params.set('hunt', state.selectedHuntId);
  if (state.selectedUnitId) params.set('unit', state.selectedUnitId);
  if (state.query) params.set('q', state.query);
  history.replaceState(null, '', `${location.pathname}?${params.toString()}#google-maps`);
}

function readUrlState() {
  const params = new URLSearchParams(location.search);
  const huntId = params.get('hunt');
  const unitId = params.get('unit');
  const query = params.get('q');
  if (query) {
    state.query = query;
    els.search.value = query;
  }
  if (unitId && unitById(unitId)) {
    state.selectedUnitId = unitId;
    state.filters.unitId = unitId;
  }
  if (huntId && huntById(huntId)) state.selectedHuntId = huntId;
}

function bindEvents() {
  els.search.addEventListener('input', () => {
    state.query = els.search.value;
    render();
  });

  els.filters.forEach((select) => {
    select.addEventListener('change', () => {
      state.filters[select.dataset.filter] = select.value;
      if (select.dataset.filter === 'unitId') state.selectedUnitId = select.value === 'all' ? null : select.value;
      render();
    });
  });

  els.reset.addEventListener('click', () => {
    state.query = '';
    state.selectedUnitId = null;
    state.selectedHuntId = null;
    Object.keys(state.filters).forEach((key) => { state.filters[key] = 'all'; });
    els.search.value = '';
    els.filters.forEach((select) => { select.value = 'all'; });
    showStatus('Filters reset.');
    render();
  });

  els.clearBackpack.addEventListener('click', () => {
    state.savedIds = [];
    saveBackpack();
    render();
  });

  document.querySelector('#table-view').addEventListener('click', () => setTableView(true));
  document.querySelector('#map-view').addEventListener('click', () => setTableView(false));

  document.querySelectorAll('[data-basemap]').forEach((button) => {
    button.addEventListener('click', () => {
      state.basemap = button.dataset.basemap;
      document.querySelectorAll('[data-basemap]').forEach((tab) => tab.classList.toggle('active', tab === button));
      renderMap();
    });
  });

  document.querySelectorAll('[data-map-source]').forEach((button) => {
    button.addEventListener('click', () => {
      state.mapSource = button.dataset.mapSource;
      document.querySelectorAll('[data-map-source]').forEach((tab) => tab.classList.toggle('active', tab === button));
      els.mapStatus.textContent = `${button.textContent} selected. Boundary tools remain available in this prototype.`;
    });
  });

  document.querySelectorAll('[data-layer]').forEach((checkbox) => {
    checkbox.addEventListener('change', () => {
      state.layerVisibility[checkbox.dataset.layer] = checkbox.checked;
      renderMap();
    });
  });

  els.mobileToggle.addEventListener('click', () => {
    const isOpen = els.panel.classList.toggle('open');
    els.mobileToggle.setAttribute('aria-expanded', String(isOpen));
  });
}

function setTableView(enabled) {
  state.tableView = enabled;
  document.querySelector('#table-view').classList.toggle('active', enabled);
  document.querySelector('#map-view').classList.toggle('active', !enabled);
  document.querySelector('#table-view').setAttribute('aria-pressed', String(enabled));
  document.querySelector('#map-view').setAttribute('aria-pressed', String(!enabled));
  renderResults();
}

function render() {
  renderMap();
  renderResults();
  renderBackpack();
  renderAnalysis();
  updateUrlState();
}

populateFilters();
readUrlState();
bindEvents();
els.filters.forEach((select) => { select.value = state.filters[select.dataset.filter]; });
render();
