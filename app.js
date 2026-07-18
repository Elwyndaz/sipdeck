'use strict';

// ---------- string table (EN + SV) — every UI string routes through t(), none hardcoded in markup ----------
const STRINGS = {
  en: {
    tagline: 'Swipe. Save. Shake.',
    nav_deck: 'Deck', nav_favorites: 'Favorites', nav_pantry: 'Pantry', nav_settings: 'Settings',
    deck_title: 'Deck',
    deck_empty: 'No drinks yet. Deal the deck once drinks.json ships.',
    deck_loading: 'Dealing the deck...',
    deck_error: "Couldn't load the deck. Reload to try again.",
    deck_count_label: 'drinks in the deck',
    favorites_title: 'Favorites',
    favorites_empty: 'Nothing saved yet. Swipe right on a drink to save it here.',
    fav_back: 'Back',
    fav_unfavorite: 'Remove favorite',
    pantry_title: 'Pantry',
    pantry_empty: "Your shelf is empty. Check off what you have once ingredients ship.",
    settings_title: 'Settings',
    settings_lang: 'Language', settings_unit: 'Unit', settings_servings: 'Servings',
    settings_filter_bar: 'Bar-servable only', settings_filter_base: 'Base spirit',
    settings_filter_base_none: 'Any',
    yes: 'Yes', no: 'No',
    servings: 'Servings',
    unit_dash: 'dash', unit_barspoon: 'barspoon', unit_piece: 'pc', unit_leaf: 'leaf',
    unit_slice: 'slice', unit_garnish: 'garnish', unit_top: 'top up',
  },
  sv: {
    tagline: 'Svep. Spara. Skaka.',
    nav_deck: 'Kortlek', nav_favorites: 'Favoriter', nav_pantry: 'Skafferi', nav_settings: 'Inställningar',
    deck_title: 'Kortlek',
    deck_empty: 'Inga drinkar än. Kortleken delas ut när drinks.json finns.',
    deck_loading: 'Delar ut kortleken...',
    deck_error: 'Kunde inte ladda kortleken. Ladda om sidan för att försöka igen.',
    deck_count_label: 'drinkar i kortleken',
    favorites_title: 'Favoriter',
    favorites_empty: 'Inget sparat än. Svep höger på en drink för att spara den här.',
    fav_back: 'Tillbaka',
    fav_unfavorite: 'Ta bort favorit',
    pantry_title: 'Skafferi',
    pantry_empty: 'Skafferiet är tomt. Bocka av vad du har när ingredienserna finns.',
    settings_title: 'Inställningar',
    settings_lang: 'Språk', settings_unit: 'Enhet', settings_servings: 'Portioner',
    settings_filter_bar: 'Bara barserverbara', settings_filter_base: 'Bas-sprit',
    settings_filter_base_none: 'Alla',
    yes: 'Ja', no: 'Nej',
    servings: 'Portioner',
    unit_dash: 'stänk', unit_barspoon: 'barsked', unit_piece: 'st', unit_leaf: 'blad',
    unit_slice: 'skiva', unit_garnish: 'garnering', unit_top: 'toppa upp',
  },
};
// No em-dashes; decimal comma / space thousands separator rules apply once numbers show up
// (unit engine, BACKLOG 3) — nothing here needs them yet.
function t(lang, key) { return (STRINGS[lang] && STRINGS[lang][key]) || STRINGS.en[key] || key; }

// ---------- pure functions (exported for test.js) ----------
const UNITS = ['cl', 'ml', 'oz'];

function detectLang(navLang) {
  return typeof navLang === 'string' && navLang.toLowerCase().indexOf('sv') === 0 ? 'sv' : 'en';
}

function defaultState(lang) {
  return {
    v: 1,
    favorites: [],
    pantry: [],
    settings: {
      lang: lang === 'sv' ? 'sv' : 'en',
      unit: 'cl',
      servings: 1,
      filters: { bar: false, base: null },
    },
  };
}

// Validates/migrates whatever was in localStorage into the exact blob shape from PRODUCT.md
// "State" — never throws (a corrupt/foreign blob just falls back to defaults), never stores
// derived data. `lang` is the navigator-detected fallback for a missing/invalid settings.lang.
function normalizeState(raw, lang) {
  const d = defaultState(lang);
  if (!raw || typeof raw !== 'object') return d;
  const rs = raw.settings && typeof raw.settings === 'object' ? raw.settings : {};
  const rf = rs.filters && typeof rs.filters === 'object' ? rs.filters : {};
  return {
    v: 1,
    favorites: Array.isArray(raw.favorites) ? raw.favorites.filter(x => typeof x === 'string') : [],
    pantry: Array.isArray(raw.pantry) ? raw.pantry.filter(x => typeof x === 'string') : [],
    settings: {
      lang: rs.lang === 'sv' || rs.lang === 'en' ? rs.lang : d.settings.lang,
      unit: UNITS.includes(rs.unit) ? rs.unit : 'cl',
      servings: Number.isInteger(rs.servings) && rs.servings >= 1 && rs.servings <= 8 ? rs.servings : 1,
      filters: {
        bar: rf.bar === true,
        base: typeof rf.base === 'string' && rf.base ? rf.base : null,
      },
    },
  };
}

// ---------- unit engine (BACKLOG 3) — canonical ml, linear scaling, bar rounding, display ----------
// units that never convert: qty scales linearly, no rounding beyond a sane display
const NONCONVERTIBLE_UNITS = ['dash', 'barspoon', 'piece', 'leaf', 'slice', 'garnish', 'top'];

// scaled = ml x servings (linear, servings 1-8 per PRODUCT.md)
function scaleMl(ml, servings) { return ml * servings; }

// ponytail: PRODUCT.md pins rounding but not the ml/oz factor; 30 ml/oz is the standard bar
// pour conversion, used here since nothing else is specified.
function convert(ml, unit) {
  if (unit === 'cl') return ml / 10;
  if (unit === 'oz') return ml / 30;
  return ml; // ml passthrough
}

// bar rounding AFTER scaling+conversion: oz -> nearest 1/4, cl -> nearest 0.5, ml -> nearest 5
function roundForUnit(value, unit) {
  if (unit === 'oz') return Math.round(value * 4) / 4;
  if (unit === 'cl') return Math.round(value * 2) / 2;
  return Math.round(value / 5) * 5; // ml
}

// sv: decimal comma + space thousands; en: decimal point + comma thousands. No em-dashes.
function formatNumber(value, lang) {
  const [intPart, decPart] = (Math.round(value * 100) / 100).toFixed(2).split('.');
  const dec = decPart.replace(/0+$/, '');
  const sep = lang === 'sv' ? ' ' : ',';
  const grouped = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, sep);
  return dec ? grouped + (lang === 'sv' ? ',' : '.') + dec : grouped;
}

// oz vulgar-fraction display: value already rounded to nearest 1/4. Zero whole part shows
// just the fraction (e.g. "¾", not "0¾").
const OZ_FRACTIONS = { 0.25: '¼', 0.5: '½', 0.75: '¾' };
function formatOz(value, lang) {
  const whole = Math.floor(value);
  const frac = Math.round((value - whole) * 100) / 100;
  const fracChar = OZ_FRACTIONS[frac] || '';
  if (!fracChar) return formatNumber(whole, lang);
  return whole === 0 ? fracChar : formatNumber(whole, lang) + fracChar;
}

// Fisher-Yates, returns a new array; rng injectable so tests can be deterministic.
function shuffle(arr, rng) {
  const a = arr.slice(), r = rng || Math.random;
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(r() * (i + 1));
    const tmp = a[i]; a[i] = a[j]; a[j] = tmp;
  }
  return a;
}

// Top-level: one ingredient line + servings + active display unit + lang -> display string.
// line is either { ml } (convertible, canonical) or { qty, unit } (non-convertible, passthrough).
// Non-convertible unit labels are returned as their raw string-table keys (e.g. "dash") for the
// caller to translate — the card back (item 4) owns rendering/translation, not this pure layer.
function formatAmount(line, servings, unit, lang) {
  if (typeof line.ml === 'number') {
    const rounded = roundForUnit(convert(scaleMl(line.ml, servings), unit), unit);
    const display = unit === 'oz' ? formatOz(rounded, lang) : formatNumber(rounded, lang);
    return `${display} ${unit}`;
  }
  const scaled = line.qty * servings;
  const rounded = Number.isInteger(scaled) ? scaled : Math.round(scaled * 10) / 10;
  return `${formatNumber(rounded, lang)} ${line.unit}`;
}

if (typeof module !== 'undefined') module.exports = {
  STRINGS, t, UNITS, detectLang, defaultState, normalizeState,
  NONCONVERTIBLE_UNITS, scaleMl, convert, roundForUnit, formatNumber, formatOz, formatAmount,
  shuffle,
};

// ---------- app (browser only) ----------
if (typeof document !== 'undefined') (function () {
  const KEY = 'sipdeck';
  const $ = sel => document.querySelector(sel);
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  const lang0 = detectLang(navigator.language);
  let raw = null;
  try { raw = JSON.parse(localStorage.getItem(KEY) || 'null'); } catch (e) { raw = null; }
  let state = normalizeState(raw, lang0);
  // ponytail: save is synchronous + unconditional, no debounce — that's a v1.1/server concern
  // (PRODUCT.md's 800ms debounce is for PUT /state, not this localStorage write).
  function save() { localStorage.setItem(KEY, JSON.stringify(state)); }
  save(); // persist first-run defaults immediately

  function lang() { return state.settings.lang; }

  // ponytail: drinks data is fetched once into a module-level var, never the state blob
  // (state stays the sync-shaped PRODUCT.md object only). Coarse re-render on load/error.
  let db = null;       // null = loading; {ingredients, drinks} once fetch resolves
  let drinksFailed = false;
  fetch('drinks.json').then(r => r.json()).then(data => {
    db = { ingredients: data.ingredients || {}, drinks: Array.isArray(data.drinks) ? data.drinks : [] };
    render();
  }).catch(() => { drinksFailed = true; render(); });

  // ---------- views ----------
  function viewDeck() {
    const title = `<h1 class="screen-title">${esc(t(lang(), 'deck_title'))}</h1>`;
    if (drinksFailed) return `${title}<p class="empty">${esc(t(lang(), 'deck_error'))}</p>`;
    if (!db) return `${title}<p class="empty">${esc(t(lang(), 'deck_loading'))}</p>`;
    if (!db.drinks.length) return `${title}<p class="empty">${esc(t(lang(), 'deck_empty'))}</p>`;
    const count = `<p class="deck-count">${db.drinks.length} ${esc(t(lang(), 'deck_count_label'))}</p>`;
    return `${title}${count}<div class="deck" id="deck"></div>`;
  }

  // ---------- deck: the one imperative-DOM zone (drag/flip animate outside re-renders) ----------
  let deckQueue = null; // drink ids, [0] = top card; survives view switches, reshuffles on exhaustion
  let flippedId = null; // top-card id when showing the recipe back
  // favorites overlay (BACKLOG 5): transient UI state, deliberately NOT in the state blob and
  // NOT touching deckQueue/flippedId — the favorites card is a separate, swipe-free instance.
  let favOpenId = null;  // id of the favorite currently opened in detail view, or null = list
  let favFlipped = false; // flip state for that one open card

  function ensureQueue() {
    if (!deckQueue || !deckQueue.length) deckQueue = shuffle(db.drinks.map(d => d.id));
  }

  // interim art until the image pipeline (item 9): the favicon glass, monoline, quiet
  const GLASS_PH = `<svg viewBox="0 0 96 96" class="glass-ph" aria-hidden="true"><g transform="rotate(-6 48 48)" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><path d="M 16,20 L 48,57 L 80,20 Z"/><path d="M 48,57 V 78 M 30,80 H 66"/></g><circle cx="74" cy="13" r="4.5" transform="rotate(-6 48 48)" fill="#2F6B3F"/></svg>`;

  function ingName(id) {
    const n = db.ingredients[id];
    return n ? (n[lang()] || n.en) : id;
  }

  function ingLine(line) {
    let amt;
    if (line.unit === 'top') {
      amt = t(lang(), 'unit_top'); // "toppa upp" reads better than "1 top up"
    } else {
      amt = formatAmount(line, state.settings.servings, state.settings.unit, lang());
      if (typeof line.ml !== 'number') amt = amt.replace(line.unit, t(lang(), 'unit_' + line.unit));
    }
    return `<li${line.essential ? '' : ' class="opt"'}><span class="amount">${esc(amt)}</span> ${esc(ingName(line.id))}</li>`;
  }

  // opts: { flipped, tint } — both optional; default behavior (undefined opts) is unchanged
  // for the deck's own call site. Favorites overlay passes its own flip flag and tint:false
  // (no drag = no gesture tint needed) instead of duplicating this markup. // ponytail
  function buildCard(drink, depth, opts) {
    opts = opts || {};
    const flipped = 'flipped' in opts ? opts.flipped : (depth === 0 && flippedId === drink.id);
    const tint = opts.tint !== false;
    const el = document.createElement('article');
    el.className = 'card' + (flipped ? ' flipped' : '');
    el.dataset.depth = depth;
    const tags = drink.ingredients.filter(l => l.essential)
      .map(l => `<span class="chip">${esc(ingName(l.id))}</span>`).join('');
    const s = state.settings;
    const unitBtns = UNITS.map(u =>
      `<button data-act="unit" data-unit="${u}"${u === s.unit ? ' class="active"' : ''}>${u}</button>`).join('');
    el.innerHTML = `
      <div class="card-inner">
        <div class="card-face card-front">
          <div class="card-art">${GLASS_PH}</div>
          <h2 class="card-name">${esc(drink.name)}</h2>
          <div class="card-meta">${esc(drink.type)}</div>
          <div class="card-tags">${tags}</div>
        </div>
        <div class="card-face card-back">
          <h2 class="card-name">${esc(drink.name)}</h2>
          <ul class="ing">${drink.ingredients.map(ingLine).join('')}</ul>
          <p class="card-method">${esc(drink.method[lang()] || drink.method.en)}</p>
          <div class="card-ctrl">
            <div class="stepper">
              <button data-act="dec" aria-label="−">−</button>
              <span class="amount">${s.servings}</span>
              <button data-act="inc" aria-label="+">+</button>
            </div>
            <div class="units">${unitBtns}</div>
          </div>
        </div>
      </div>${tint ? `
      <div class="tint tint-save"></div>
      <div class="tint tint-skip"></div>` : ''}`;
    return el;
  }

  function mountDeck() {
    const deckEl = $('#deck');
    if (!deckEl) return;
    ensureQueue();
    const byId = {};
    db.drinks.forEach(d => { byId[d.id] = d; });
    // back-to-front so the top card paints last (natural stacking, no z-index bookkeeping)
    const visible = deckQueue.slice(0, 4);
    for (let i = visible.length - 1; i >= 0; i--) deckEl.appendChild(buildCard(byId[visible[i]], i));
    deckEl.addEventListener('click', e => {
      const b = e.target.closest('button[data-act]');
      if (!b) return;
      const s = state.settings;
      if (b.dataset.act === 'inc') s.servings = Math.min(8, s.servings + 1);
      else if (b.dataset.act === 'dec') s.servings = Math.max(1, s.servings - 1);
      else if (b.dataset.act === 'unit') s.unit = b.dataset.unit;
      save();
      render(); // coarse re-render; deckQueue + flippedId survive, so the same card stays up, flipped
    });
    attachDrag(deckEl.querySelector('.card[data-depth="0"]'));
  }

  function attachDrag(card) {
    if (!card) return;
    const tintSave = card.querySelector('.tint-save');
    const tintSkip = card.querySelector('.tint-skip');
    const threshold = () => card.offsetWidth * 0.35;
    let dragging = false, moved = false, startX = 0, startY = 0, dx = 0, dy = 0;
    let lastX = 0, lastT = 0, vx = 0;

    card.addEventListener('pointerdown', e => {
      if (e.target.closest('.card-ctrl')) return; // controls are dead zones
      dragging = true; moved = false;
      startX = lastX = e.clientX; startY = e.clientY; dx = dy = vx = 0; lastT = e.timeStamp;
      try { card.setPointerCapture(e.pointerId); } catch (err) { /* capture is nice-to-have; drag works without it */ }
      card.style.transition = 'none';
      card.style.willChange = 'transform';
    });

    card.addEventListener('pointermove', e => {
      if (!dragging) return;
      dx = e.clientX - startX; dy = e.clientY - startY;
      if (Math.abs(dx) > 10 || Math.abs(dy) > 10) moved = true;
      const dt = e.timeStamp - lastT;
      if (dt > 0) { vx = (e.clientX - lastX) / dt; lastX = e.clientX; lastT = e.timeStamp; }
      card.style.transform = `translate(${dx}px, ${dy * 0.4}px) rotate(${dx * 0.04}deg)`;
      // edge tint past 30% of the commit threshold, before release (design spec)
      const p = dx / threshold();
      const a = Math.abs(p) < 0.3 ? 0 : Math.min(1, (Math.abs(p) - 0.3) / 0.7);
      tintSave.style.opacity = p > 0 ? a : 0;
      tintSkip.style.opacity = p < 0 ? a : 0;
    });

    function settle(e) {
      if (!dragging) return;
      dragging = false;
      card.style.willChange = '';
      const flick = Math.abs(vx) > 0.6 && vx * dx > 0;
      if (Math.abs(dx) > threshold() || flick) {
        flyOff(card, dx > 0 ? 1 : -1, dy);
      } else {
        tintSave.style.opacity = 0;
        tintSkip.style.opacity = 0;
        card.style.transition = 'transform var(--sd-t-spring) var(--sd-ease-spring)';
        card.style.transform = '';
        if (!moved && !e.target.closest('.card-ctrl')) { // a tap, not a drag: flip
          const id = deckQueue[0];
          flippedId = flippedId === id ? null : id;
          card.classList.toggle('flipped', flippedId === id);
        }
      }
    }
    card.addEventListener('pointerup', settle);
    card.addEventListener('pointercancel', settle);
  }

  function flyOff(card, dir, dy) {
    const x = (window.innerWidth + card.offsetWidth) * dir;
    card.style.transition = 'transform var(--sd-t-fly) var(--sd-ease-fly)'; // never fades — it leaves
    card.style.transform = `translate(${x}px, ${dy * 0.4}px) rotate(${dir * 18}deg)`;
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      const id = deckQueue[0];
      if (dir > 0) { // save (A3): idempotent, out of this cycle; exhaustion reshuffles the full set
        if (!state.favorites.includes(id)) state.favorites.push(id);
        save();
        deckQueue.shift();
      } else { // skip (A2): to the back of the deck, nothing is ever dismissed
        deckQueue.push(deckQueue.shift());
      }
      flippedId = null; // flip state resets when a card leaves the top (A4)
      render();
    };
    card.addEventListener('transitionend', finish, { once: true });
    setTimeout(finish, 450); // reduced-motion sets 0ms durations, which never fire transitionend
  }

  // ---------- favorites overlay (BACKLOG 5): same card markup, swipe-free, own flip tracking ----------
  function favDrink() {
    return favOpenId && db ? db.drinks.find(d => d.id === favOpenId) || null : null;
  }

  function mountFavCard(drink) {
    const wrap = $('#favDeck');
    if (!wrap) return;
    wrap.appendChild(buildCard(drink, 0, { flipped: favFlipped, tint: false }));
    wrap.addEventListener('click', e => {
      // only inc/dec/unit here — unfav/close live outside #favDeck, handled by the #view delegate
      const b = e.target.closest('button[data-act="inc"],button[data-act="dec"],button[data-act="unit"]');
      if (b) {
        const s = state.settings;
        if (b.dataset.act === 'inc') s.servings = Math.min(8, s.servings + 1);
        else if (b.dataset.act === 'dec') s.servings = Math.max(1, s.servings - 1);
        else if (b.dataset.act === 'unit') s.unit = b.dataset.unit;
        save();
        render();
        return;
      }
      if (e.target.closest('.card-ctrl')) return; // controls are dead zones, same as the deck
      favFlipped = !favFlipped;
      // toggle on the live element (like the deck's tap-flip) so the flip animation plays;
      // a re-render would rebuild the card with the class pre-applied and snap instead.
      wrap.querySelector('.card').classList.toggle('flipped', favFlipped);
    });
  }

  function viewFavorites() {
    const title = `<h1 class="screen-title">${esc(t(lang(), 'favorites_title'))}</h1>`;
    if (!db) return `${title}<p class="empty">${esc(t(lang(), 'deck_loading'))}</p>`; // ponytail: shared fetch, same loading copy
    const open = favDrink();
    if (favOpenId && !open) favOpenId = null; // favorite id vanished from db: just close, no crash
    if (open) {
      return `${title}
        <div class="fav-toolbar">
          <button id="favClose" class="fav-back">${esc(t(lang(), 'fav_back'))}</button>
          <button class="fav-remove" data-act="unfav" data-id="${esc(open.id)}" aria-label="${esc(t(lang(), 'fav_unfavorite'))}">${esc(t(lang(), 'fav_unfavorite'))}</button>
        </div>
        <div class="deck" id="favDeck"></div>`;
    }
    const rows = state.favorites.map(id => db.drinks.find(d => d.id === id)).filter(Boolean); // skip ids not in db
    if (!rows.length) return `${title}<p class="empty">${esc(t(lang(), 'favorites_empty'))}</p>`;
    const list = rows.map(d => `
      <div class="list-card fav-row" data-id="${esc(d.id)}">
        <div class="fav-thumb">${GLASS_PH}</div>
        <div class="fav-info">
          <div class="name">${esc(d.name)}</div>
          <div class="meta">${esc(d.type)}</div>
        </div>
        <button class="fav-remove" data-act="unfav" data-id="${esc(d.id)}" aria-label="${esc(t(lang(), 'fav_unfavorite'))}">&times;</button>
      </div>`).join('');
    return `${title}${list}`;
  }

  function viewPantry() {
    return `<h1 class="screen-title">${esc(t(lang(), 'pantry_title'))}</h1>
      <p class="empty">${esc(t(lang(), 'pantry_empty'))}</p>`;
  }

  function viewSettings() {
    const s = state.settings;
    const bool = v => t(lang(), v ? 'yes' : 'no');
    const base = s.filters.base ? esc(s.filters.base) : esc(t(lang(), 'settings_filter_base_none'));
    return `<h1 class="screen-title">${esc(t(lang(), 'settings_title'))}</h1>
      <dl class="settings">
        <dt>${esc(t(lang(), 'settings_lang'))}</dt><dd>${esc(s.lang.toUpperCase())}</dd>
        <dt>${esc(t(lang(), 'settings_unit'))}</dt><dd>${esc(s.unit)}</dd>
        <dt>${esc(t(lang(), 'settings_servings'))}</dt><dd>${esc(String(s.servings))}</dd>
        <dt>${esc(t(lang(), 'settings_filter_bar'))}</dt><dd>${esc(bool(s.filters.bar))}</dd>
        <dt>${esc(t(lang(), 'settings_filter_base'))}</dt><dd>${base}</dd>
      </dl>`;
    // ponytail: read-only display of the state blob. Editable controls (language toggle, unit
    // toggle, filters UI) are BACKLOG items 6/8 — the shape just needs to exist and persist now.
  }

  // ---------- router: hashchange -> coarse re-render per view ----------
  const ROUTES = {
    '#/': { view: viewDeck, match: '#/' },
    '#/favoriter': { view: viewFavorites, match: '#/favoriter' },
    '#/skafferi': { view: viewPantry, match: '#/skafferi' },
    '#/installningar': { view: viewSettings, match: '#/installningar' },
  };

  function render() {
    const hash = location.hash || '#/';
    const route = ROUTES[hash] || ROUTES['#/'];
    $('#view').innerHTML = route.view();
    if (route.view === viewDeck && db) mountDeck();
    if (route.view === viewFavorites) { const d = favDrink(); if (d) mountFavCard(d); }
    document.documentElement.lang = lang();
    $('#tagline').textContent = t(lang(), 'tagline');
    const navLabels = { '#/': 'nav_deck', '#/favoriter': 'nav_favorites', '#/skafferi': 'nav_pantry', '#/installningar': 'nav_settings' };
    document.querySelectorAll('#nav a').forEach(a => {
      a.textContent = t(lang(), navLabels[a.dataset.match]);
      a.classList.toggle('active', a.dataset.match === route.match);
    });
  }

  // #view itself is never replaced (only its innerHTML), so this delegate is attached once —
  // unlike #deck/#favDeck's listeners, which are fine to re-attach per render since those nodes
  // are freshly created each time. Covers favorites row-open, close, and un-favorite (list + open card).
  $('#view').addEventListener('click', e => {
    if (e.target.closest('#favClose')) { favOpenId = null; render(); return; }
    const unfavBtn = e.target.closest('[data-act="unfav"]');
    if (unfavBtn) {
      const id = unfavBtn.dataset.id;
      state.favorites = state.favorites.filter(x => x !== id);
      if (favOpenId === id) favOpenId = null;
      save();
      render();
      return;
    }
    const row = e.target.closest('.fav-row');
    if (row) { favOpenId = row.dataset.id; favFlipped = false; render(); }
  });

  window.addEventListener('hashchange', render);
  render();
})();
