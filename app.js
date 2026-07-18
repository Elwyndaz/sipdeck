'use strict';

// ---------- string table (EN + SV) — every UI string routes through t(), none hardcoded in markup ----------
const STRINGS = {
  en: {
    tagline: 'Swipe. Save. Shake.',
    nav_deck: 'Deck', nav_favorites: 'Favorites', nav_pantry: 'Pantry', nav_settings: 'Settings',
    nav_label: 'Main navigation',
    deck_empty: 'No drinks yet. Deal the deck once drinks.json ships.',
    deck_loading: 'Dealing the deck...',
    deck_error: "Couldn't load the deck. Reload to try again.",
    deck_count_label: 'drinks in the deck',
    deck_no_matches: 'No drinks match those filters. Try another combination.',
    filters_label: 'Filter drinks',
    filter_makeable: 'Only what I can make',
    favorites_title: 'Favorites',
    favorites_empty: 'Nothing saved yet. Swipe right on a drink to save it here.',
    fav_back: 'Back',
    fav_unfavorite: 'Remove favorite',
    pantry_title: 'Pantry',
    pantry_empty: 'No ingredients are used by the current drinks.',
    pantry_intro: 'Check off what you have. Optional garnishes never block a match.',
    pantry_group_spirits: 'Spirits', pantry_group_liqueurs: 'Liqueurs',
    pantry_group_fresh: 'Fresh & mixers', pantry_group_pantry: 'Pantry staples',
    settings_title: 'Settings',
    settings_lang: 'Language', settings_unit: 'Unit', settings_servings: 'Servings',
    language_en: 'English', language_sv: 'Swedish',
    settings_filter_bar: 'Bar-servable only', settings_filter_base: 'Base spirit',
    settings_filter_base_none: 'Any',
    base_gin: 'Gin', base_vodka: 'Vodka', base_rum: 'Rum', base_tequila: 'Tequila',
    base_whiskey: 'Whiskey', base_brandy: 'Brandy', base_other: 'Other / none',
    yes: 'Yes', no: 'No',
    type_sour: 'Sour', type_highball: 'Highball', type_aromatic: 'Aromatic',
    type_spirit_forward: 'Spirit-forward', type_contemporary: 'Contemporary',
    servings: 'Servings',
    servings_decrease: 'Decrease servings', servings_increase: 'Increase servings',
    unit_dash: 'dash', unit_barspoon: 'barspoon', unit_piece: 'pc', unit_leaf: 'leaf',
    unit_slice: 'slice', unit_garnish: 'garnish', unit_top: 'top up',
  },
  sv: {
    tagline: 'Svep. Spara. Skaka.',
    nav_deck: 'Kortlek', nav_favorites: 'Favoriter', nav_pantry: 'Skafferi', nav_settings: 'Inställningar',
    nav_label: 'Huvudnavigering',
    deck_empty: 'Inga drinkar än. Kortleken delas ut när drinks.json finns.',
    deck_loading: 'Delar ut kortleken...',
    deck_error: 'Kunde inte ladda kortleken. Ladda om sidan för att försöka igen.',
    deck_count_label: 'drinkar i kortleken',
    deck_no_matches: 'Inga drinkar matchar filtren. Prova en annan kombination.',
    filters_label: 'Filtrera drinkar',
    filter_makeable: 'Bara det jag kan blanda',
    favorites_title: 'Favoriter',
    favorites_empty: 'Inget sparat än. Svep höger på en drink för att spara den här.',
    fav_back: 'Tillbaka',
    fav_unfavorite: 'Ta bort favorit',
    pantry_title: 'Skafferi',
    pantry_empty: 'Inga ingredienser används av de aktuella drinkarna.',
    pantry_intro: 'Bocka av vad du har. Valfri garnering stoppar aldrig en träff.',
    pantry_group_spirits: 'Sprit', pantry_group_liqueurs: 'Likörer',
    pantry_group_fresh: 'Färskt och blanddryck', pantry_group_pantry: 'Skafferivaror',
    settings_title: 'Inställningar',
    settings_lang: 'Språk', settings_unit: 'Enhet', settings_servings: 'Portioner',
    language_en: 'Engelska', language_sv: 'Svenska',
    settings_filter_bar: 'Bara barserverbara', settings_filter_base: 'Bas-sprit',
    settings_filter_base_none: 'Alla',
    base_gin: 'Gin', base_vodka: 'Vodka', base_rum: 'Rom', base_tequila: 'Tequila',
    base_whiskey: 'Whisky', base_brandy: 'Brandy', base_other: 'Annan / ingen',
    yes: 'Ja', no: 'Nej',
    type_sour: 'Sour', type_highball: 'Highball', type_aromatic: 'Aromatisk',
    type_spirit_forward: 'Spritdominerad', type_contemporary: 'Samtida',
    servings: 'Portioner',
    servings_decrease: 'Minska antal portioner', servings_increase: 'Öka antal portioner',
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

const BASE_FILTERS = ['gin', 'vodka', 'rum', 'tequila', 'whiskey', 'brandy', 'other'];

function matchesFilters(drink, filters) {
  const f = filters || {};
  if (f.bar && drink.bar !== true) return false;
  if (!f.base) return true;
  if (f.base === 'other') return !BASE_FILTERS.slice(0, -1).includes(drink.base);
  return drink.base === f.base;
}

function canMake(drink, pantry) {
  const have = pantry instanceof Set ? pantry : new Set(Array.isArray(pantry) ? pantry : []);
  return Array.isArray(drink.ingredients) && drink.ingredients
    .filter(line => line.essential)
    .every(line => have.has(line.id));
}

function filterDrinks(drinks, filters, pantry) {
  const have = Array.isArray(pantry) ? new Set(pantry) : null;
  return (Array.isArray(drinks) ? drinks : [])
    .filter(drink => matchesFilters(drink, filters) && (!have || canMake(drink, have)));
}

// Restrained inline fallbacks for every glass used by the current seed. Unknown future
// values degrade to the rocks silhouette without changing the card's dimensions.
const GLASS_SILHOUETTES = {
  coupe: '<path d="M18 25h60c-3 17-13 25-30 25S21 42 18 25Z"/><path d="M48 50v27M32 79h32"/>',
  highball: '<path d="M29 14h38l-4 66H33l-4-66Z"/><path d="M34 25h28"/>',
  rocks: '<path d="M25 35h46l-5 43H30l-5-43Z"/><path d="M30 47h36"/>',
  martini: '<path d="M17 20h62L48 53 17 20Z"/><path d="M48 53v24M32 79h32"/>',
};

function glassPlaceholder(glass) {
  const known = Object.prototype.hasOwnProperty.call(GLASS_SILHOUETTES, glass);
  const key = known ? glass : 'rocks';
  return `<svg viewBox="0 0 96 96" class="glass-ph glass-${key}" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round">${GLASS_SILHOUETTES[key]}</g></svg>`;
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
  shuffle, BASE_FILTERS, matchesFilters, canMake, filterDrinks,
  GLASS_SILHOUETTES, glassPlaceholder,
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
    if (drinksFailed) return `<p class="empty">${esc(t(lang(), 'deck_error'))}</p>`;
    if (!db) return `<p class="empty">${esc(t(lang(), 'deck_loading'))}</p>`;
    if (!db.drinks.length) return `<p class="empty">${esc(t(lang(), 'deck_empty'))}</p>`;
    const f = state.settings.filters;
    const baseOptions = [`<option value="">${esc(t(lang(), 'settings_filter_base_none'))}</option>`]
      .concat(BASE_FILTERS.map(base => `<option value="${base}"${f.base === base ? ' selected' : ''}>${esc(t(lang(), 'base_' + base))}</option>`))
      .join('');
    const controls = `<section class="filters" aria-label="${esc(t(lang(), 'filters_label'))}">
      <label class="filter-toggle"><input type="checkbox" data-filter="bar"${f.bar ? ' checked' : ''}> <span>${esc(t(lang(), 'settings_filter_bar'))}</span></label>
      <label class="filter-toggle"><input type="checkbox" data-filter="makeable"${makeableOnly ? ' checked' : ''}> <span>${esc(t(lang(), 'filter_makeable'))}</span></label>
      <label class="filter-select"><span>${esc(t(lang(), 'settings_filter_base'))}</span><select data-filter="base">${baseOptions}</select></label>
    </section>`;
    const matches = filteredDrinks();
    const count = `<p class="deck-count"><span class="amount">${matches.length}</span> ${esc(t(lang(), 'deck_count_label'))}</p>`;
    const deck = matches.length ? '<div class="deck" id="deck"></div>' : `<p class="empty">${esc(t(lang(), 'deck_no_matches'))}</p>`;
    return `${deck}${controls}${count}`;
  }

  // ---------- deck: the one imperative-DOM zone (drag/flip animate outside re-renders) ----------
  let deckQueue = null; // drink ids, [0] = top card; survives view switches, reshuffles on exhaustion
  let flippedId = null; // top-card id when showing the recipe back
  // favorites overlay (BACKLOG 5): transient UI state, deliberately NOT in the state blob and
  // NOT touching deckQueue/flippedId — the favorites card is a separate, swipe-free instance.
  let favOpenId = null;  // id of the favorite currently opened in detail view, or null = list
  let favFlipped = false; // flip state for that one open card
  let makeableOnly = false; // transient deck mode; pantry itself is the persisted source of truth

  function filteredDrinks() {
    return filterDrinks(db.drinks, state.settings.filters, makeableOnly ? state.pantry : null);
  }

  function ensureQueue() {
    if (!deckQueue || !deckQueue.length) deckQueue = shuffle(filteredDrinks().map(d => d.id));
  }

  function ingName(id) {
    const n = db.ingredients[id];
    return n ? (n[lang()] || n.en) : id;
  }

  function taxonomyName(kind, id) {
    return t(lang(), kind + '_' + String(id).replace(/-/g, '_'));
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
          <div class="card-art">${glassPlaceholder(drink.glass)}<img class="cocktail-art" src="img/${esc(drink.id)}.webp" alt="" loading="lazy" decoding="async"></div>
          <h2 class="card-name">${esc(drink.name)}</h2>
          <div class="card-meta">${esc(taxonomyName('type', drink.type))}</div>
          <div class="card-tags">${tags}</div>
        </div>
        <div class="card-face card-back">
          <h2 class="card-name">${esc(drink.name)}</h2>
          <ul class="ing">${drink.ingredients.map(ingLine).join('')}</ul>
          <p class="card-method">${esc(drink.method[lang()] || drink.method.en)}</p>
          <div class="card-ctrl">
            <div class="stepper" role="group" aria-label="${esc(t(lang(), 'servings'))}">
              <button data-act="dec" aria-label="${esc(t(lang(), 'servings_decrease'))}">−</button>
              <span class="amount">${s.servings}</span>
              <button data-act="inc" aria-label="${esc(t(lang(), 'servings_increase'))}">+</button>
            </div>
            <div class="units" role="group" aria-label="${esc(t(lang(), 'settings_unit'))}">${unitBtns}</div>
          </div>
        </div>
      </div>${tint ? `
      <div class="tint tint-save"></div>
      <div class="tint tint-skip"></div>` : ''}`;
    const art = el.querySelector('.cocktail-art');
    const revealArt = () => art.classList.add('loaded');
    art.addEventListener('load', revealArt, { once: true });
    art.addEventListener('error', () => { art.hidden = true; }, { once: true });
    if (art.complete && art.naturalWidth) revealArt();
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
        <div class="fav-thumb">${glassPlaceholder(d.glass)}</div>
        <div class="fav-info">
          <div class="name">${esc(d.name)}</div>
          <div class="meta">${esc(taxonomyName('type', d.type))}</div>
        </div>
        <button class="fav-remove" data-act="unfav" data-id="${esc(d.id)}" aria-label="${esc(t(lang(), 'fav_unfavorite'))}">&times;</button>
      </div>`).join('');
    return `${title}${list}`;
  }

  function viewPantry() {
    const title = `<h1 class="screen-title">${esc(t(lang(), 'pantry_title'))}</h1>`;
    if (!db) return `${title}<p class="empty">${esc(t(lang(), 'deck_loading'))}</p>`;
    const used = new Set();
    db.drinks.forEach(drink => drink.ingredients.forEach(line => used.add(line.id)));
    if (!used.size) return `${title}<p class="empty">${esc(t(lang(), 'pantry_empty'))}</p>`;
    const groups = { spirits: [], liqueurs: [], fresh: [], pantry: [] };
    used.forEach(id => {
      const ingredient = db.ingredients[id];
      const group = ingredient && groups[ingredient.group] ? ingredient.group : 'pantry';
      groups[group].push(id);
    });
    const fieldsets = Object.keys(groups).map(group => {
      const items = groups[group]
        .sort((a, b) => ingName(a).localeCompare(ingName(b), lang()))
        .map(id => `<label class="pantry-item"><input type="checkbox" data-pantry="${esc(id)}"${state.pantry.includes(id) ? ' checked' : ''}> <span>${esc(ingName(id))}</span></label>`)
        .join('');
      return items ? `<fieldset class="pantry-group"><legend>${esc(t(lang(), 'pantry_group_' + group))}</legend><div class="pantry-list">${items}</div></fieldset>` : '';
    }).join('');
    return `${title}<p class="pantry-intro">${esc(t(lang(), 'pantry_intro'))}</p>${fieldsets}`;
  }

  function viewSettings() {
    const s = state.settings;
    const bool = v => t(lang(), v ? 'yes' : 'no');
    const base = s.filters.base ? esc(taxonomyName('base', s.filters.base)) : esc(t(lang(), 'settings_filter_base_none'));
    return `<h1 class="screen-title">${esc(t(lang(), 'settings_title'))}</h1>
      <dl class="settings">
        <dt>${esc(t(lang(), 'settings_lang'))}</dt><dd><div class="lang-toggle" role="group" aria-label="${esc(t(lang(), 'settings_lang'))}">
          ${['en', 'sv'].map(code => `<button data-lang="${code}"${code === s.lang ? ' class="active" aria-pressed="true"' : ' aria-pressed="false"'}>${esc(t(lang(), 'language_' + code))}</button>`).join('')}
        </div></dd>
        <dt>${esc(t(lang(), 'settings_unit'))}</dt><dd>${esc(s.unit)}</dd>
        <dt>${esc(t(lang(), 'settings_servings'))}</dt><dd>${esc(String(s.servings))}</dd>
        <dt>${esc(t(lang(), 'settings_filter_bar'))}</dt><dd>${esc(bool(s.filters.bar))}</dd>
        <dt>${esc(t(lang(), 'settings_filter_base'))}</dt><dd>${base}</dd>
      </dl>`;
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
    $('#nav').setAttribute('aria-label', t(lang(), 'nav_label'));
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
    const langBtn = e.target.closest('[data-lang]');
    if (langBtn) {
      state.settings.lang = langBtn.dataset.lang;
      save();
      render();
      return;
    }
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

  $('#view').addEventListener('change', e => {
    const control = e.target.closest('[data-filter]');
    if (!control) return;
    if (control.dataset.filter === 'bar') state.settings.filters.bar = control.checked;
    if (control.dataset.filter === 'base') state.settings.filters.base = control.value || null;
    if (control.dataset.filter === 'makeable') makeableOnly = control.checked;
    deckQueue = null;
    flippedId = null;
    save();
    render();
  });

  $('#view').addEventListener('change', e => {
    const control = e.target.closest('[data-pantry]');
    if (!control) return;
    const id = control.dataset.pantry;
    if (control.checked && !state.pantry.includes(id)) state.pantry.push(id);
    if (!control.checked) state.pantry = state.pantry.filter(item => item !== id);
    deckQueue = null;
    save();
  });

  window.addEventListener('hashchange', render);
  render();
})();
