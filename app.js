'use strict';

// ---------- string table (EN + SV) — every UI string routes through t(), none hardcoded in markup ----------
const STRINGS = {
  en: {
    tagline: 'Swipe. Save. Shake.',
    nav_deck: 'Deck', nav_favorites: 'Favorites', nav_pantry: 'Pantry', nav_settings: 'Settings',
    nav_label: 'Main navigation',
    wheel_entry: 'Pick for me', wheel_title: 'Pick for me', wheel_back: 'Back',
    wheel_mute: 'Mute wheel sound', wheel_unmute: 'Turn wheel sound on',
    wheel_intro: 'How are you feeling?', wheel_choose: 'Choose a mood to build your wheel.',
    wheel_mood_label: 'Drunkenness level', wheel_spin: 'Spin', wheel_respin: 'Re-spin',
    wheel_new: 'New wheel', wheel_result: 'Your order',
    wheel_loading: 'Preparing the wheel...', wheel_error: "Couldn't load the wheel. Reload to try again.",
    wheel_spinning: 'The wheel is spinning', wheel_ready: 'Wheel ready to spin',
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
    recipe_title: 'Recipe', ingredients_title: 'Ingredients', method_title: 'Method',
    ingredient_check_hint: 'Check off ingredients as you mix.',
    check_ingredient: 'Check off', copy_recipe: 'Copy recipe',
    copied: 'Copied!', copy_failed: 'Could not copy', servings_copy: 'servings', source_label: 'Source',
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
    wheel_entry: 'Välj åt mig', wheel_title: 'Välj åt mig', wheel_back: 'Tillbaka',
    wheel_mute: 'Stäng av hjulljudet', wheel_unmute: 'Slå på hjulljudet',
    wheel_intro: 'Hur känns det?', wheel_choose: 'Välj en känsla för att bygga ditt hjul.',
    wheel_mood_label: 'Berusningsnivå', wheel_spin: 'Snurra', wheel_respin: 'Snurra igen',
    wheel_new: 'Nytt hjul', wheel_result: 'Din beställning',
    wheel_loading: 'Förbereder hjulet...', wheel_error: 'Kunde inte ladda hjulet. Ladda om sidan för att försöka igen.',
    wheel_spinning: 'Hjulet snurrar', wheel_ready: 'Hjulet är redo att snurra',
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
    recipe_title: 'Recept', ingredients_title: 'Ingredienser', method_title: 'Gör så här',
    ingredient_check_hint: 'Bocka av ingredienserna medan du blandar.',
    check_ingredient: 'Bocka av', copy_recipe: 'Kopiera receptet',
    copied: 'Kopierat!', copy_failed: 'Kunde inte kopiera', servings_copy: 'portioner', source_label: 'Källa',
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

function favoriteIdFromHash(hash) {
  const prefix = '#/favoriter/';
  if (typeof hash !== 'string' || hash.indexOf(prefix) !== 0) return null;
  const encoded = hash.slice(prefix.length);
  if (!encoded || encoded.includes('/')) return null;
  try { return decodeURIComponent(encoded); } catch (e) { return null; }
}

// ---------- unit engine (BACKLOG 3) — canonical ml, linear scaling, bar rounding, display ----------
const NONCONVERTIBLE_UNITS = ['dash', 'barspoon', 'piece', 'leaf', 'slice', 'garnish', 'top'];

function scaleMl(ml, servings) { return ml * servings; }

function convert(ml, unit) {
  if (unit === 'cl') return ml / 10;
  if (unit === 'oz') return ml / 30;
  return ml; // ml passthrough
}

function roundForUnit(value, unit) {
  if (unit === 'oz') return Math.round(value * 4) / 4;
  if (unit === 'cl') return Math.round(value * 2) / 2;
  return Math.round(value / 5) * 5; // ml
}

function formatNumber(value, lang) {
  const [intPart, decPart] = (Math.round(value * 100) / 100).toFixed(2).split('.');
  const dec = decPart.replace(/0+$/, '');
  const sep = lang === 'sv' ? ' ' : ',';
  const grouped = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, sep);
  return dec ? grouped + (lang === 'sv' ? ',' : '.') + dec : grouped;
}

const OZ_FRACTIONS = { 0.25: '¼', 0.5: '½', 0.75: '¾' };
function formatOz(value, lang) {
  const whole = Math.floor(value);
  const frac = Math.round((value - whole) * 100) / 100;
  const fracChar = OZ_FRACTIONS[frac] || '';
  if (!fracChar) return formatNumber(whole, lang);
  return whole === 0 ? fracChar : formatNumber(whole, lang) + fracChar;
}

function shuffle(arr, rng) {
  const a = arr.slice(), r = rng || Math.random;
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(r() * (i + 1));
    const tmp = a[i]; a[i] = a[j]; a[j] = tmp;
  }
  return a;
}

function advanceQueue(queue, saved) {
  const next = Array.isArray(queue) ? queue.slice() : [];
  if (!next.length) return next;
  const top = next.shift();
  if (!saved) next.push(top);
  return next;
}

function swipeDirectionForKey(key) {
  if (key === 'ArrowLeft') return -1;
  if (key === 'ArrowRight') return 1;
  return 0;
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

// ---------- spinning wheel: pure catalog, weighting and geometry ----------
function wheelRng(rng) {
  const n = Number((rng || Math.random)());
  return Number.isFinite(n) ? Math.max(0, Math.min(0.999999999, n)) : 0;
}

function weightedSampleUnique(items, count, weightFn, rng) {
  const pool = (Array.isArray(items) ? items : []).slice();
  const picked = [];
  while (pool.length && picked.length < count) {
    const weights = pool.map(item => Math.max(0, Number(weightFn(item)) || 0));
    const total = weights.reduce((sum, weight) => sum + weight, 0);
    if (total <= 0) break;
    let target = wheelRng(rng) * total;
    let index = weights.length - 1;
    for (let i = 0; i < weights.length; i++) {
      target -= weights[i];
      if (target < 0) { index = i; break; }
    }
    picked.push(pool.splice(index, 1)[0]);
  }
  return picked;
}

function wheelCocktailWeight(drink, mood) {
  if (!drink || drink.bar !== true) return 0;
  const strong = Array.isArray(drink.tags) && drink.tags.includes('strong');
  return strong ? Number(mood && mood.strongWeight) || 0 : 1;
}

function wheelDrinkName(drink) {
  if (!drink) return { en: '', sv: '' };
  if (typeof drink.name === 'string') return { en: drink.name, sv: drink.name };
  return { en: drink.name.en || drink.name.sv || drink.id, sv: drink.name.sv || drink.name.en || drink.id };
}

function buildSpinLineup(wheel, moodId, drinks, rng) {
  if (!wheel || !Array.isArray(wheel.moods) || !wheel.outcomes) return [];
  const mood = wheel.moods.find(item => item.id === moodId);
  if (!mood || !Array.isArray(mood.slots) || mood.slots.length !== 12) return [];
  const useBottle = moodId === 'fresh' && mood.slots.includes('flex') && wheelRng(rng) < 1 / 3;
  const cocktailCount = mood.slots.filter(slot => slot === 'cocktail').length +
    (mood.slots.includes('flex') && !useBottle ? 1 : 0);
  const cocktailPool = (Array.isArray(drinks) ? drinks : [])
    .filter(drink => wheelCocktailWeight(drink, mood) > 0);
  let cocktailPicks = weightedSampleUnique(
    cocktailPool, cocktailCount, drink => wheelCocktailWeight(drink, mood), rng);
  while (cocktailPicks.length < cocktailCount && cocktailPool.length) {
    cocktailPicks = cocktailPicks.concat(weightedSampleUnique(
      cocktailPool, Math.min(cocktailCount - cocktailPicks.length, cocktailPool.length),
      drink => wheelCocktailWeight(drink, mood), rng));
  }
  let cocktailIndex = 0;
  const categoryPools = {};
  const categoryIndexes = {};
  const artIndexes = {};
  Object.keys(wheel.outcomes).forEach(id => {
    const outcome = wheel.outcomes[id];
    (categoryPools[outcome.category] || (categoryPools[outcome.category] = [])).push(id);
  });
  Object.keys(categoryPools).forEach(category => {
    categoryPools[category] = shuffle(categoryPools[category], rng);
    categoryIndexes[category] = 0;
  });
  function simpleEntry(id) {
    const outcome = wheel.outcomes[id];
    if (!outcome) return null;
    const arts = Array.isArray(outcome.art) ? outcome.art : [];
    const artIndex = artIndexes[id] || 0;
    artIndexes[id] = artIndex + 1;
    return {
      kind: 'simple', outcomeId: id, category: outcome.category,
      sector: outcome.sector, result: outcome.result,
      art: arts.length ? arts[artIndex % arts.length] : '',
      eligible: !mood.forcedOutcome || id === mood.forcedOutcome,
    };
  }
  function takeCategory(category) {
    const pool = categoryPools[category] || [];
    if (!pool.length) return null;
    const index = categoryIndexes[category] || 0;
    categoryIndexes[category] = index + 1;
    return simpleEntry(pool[index % pool.length]);
  }
  function takeCocktail() {
    const drink = cocktailPicks[cocktailIndex++];
    if (!drink) return null;
    const name = wheelDrinkName(drink);
    return {
      kind: 'cocktail', outcomeId: drink.id, category: 'cocktail',
      sector: name, result: name, art: `img/${drink.id}.webp`,
      eligible: !mood.forcedOutcome,
    };
  }
  let lineup = mood.slots.map(slot => {
    if (slot === 'cocktail') return takeCocktail();
    if (slot === 'flex') return useBottle ? takeCategory('bottle') : takeCocktail();
    return takeCategory(slot);
  }).filter(Boolean);
  if (lineup.length !== 12) return [];
  const offset = Math.floor(wheelRng(rng) * lineup.length);
  lineup = lineup.slice(offset).concat(lineup.slice(0, offset));
  return lineup.map((entry, index) => Object.assign({ key: `${entry.kind}-${entry.outcomeId}-${index}` }, entry));
}

function selectWheelIndex(lineup, rng) {
  const eligible = (Array.isArray(lineup) ? lineup : [])
    .map((entry, index) => ({ entry, index })).filter(item => item.entry.eligible !== false);
  if (!eligible.length) return -1;
  return eligible[Math.floor(wheelRng(rng) * eligible.length)].index;
}

function wheelLandingRotation(current, index, rng, count) {
  const sectors = count || 12;
  const step = 360 / sectors;
  const halfSafe = step * 0.34;
  const offset = (wheelRng(rng) * 2 - 1) * halfSafe;
  const desired = ((-index * step - offset) % 360 + 360) % 360;
  const currentMod = ((current % 360) + 360) % 360;
  const travel = ((desired - currentMod) % 360 + 360) % 360;
  const turns = 6 + Math.floor(wheelRng(rng) * 4);
  return current + turns * 360 + travel;
}

function wheelSectorPath(index, count, radius) {
  const sectors = count || 12, r = radius || 49;
  const step = 360 / sectors, start = -90 + index * step - step / 2, end = start + step;
  const point = angle => {
    const rad = angle * Math.PI / 180;
    return [50 + r * Math.cos(rad), 50 + r * Math.sin(rad)];
  };
  const a = point(start), b = point(end);
  return `M50 50L${a[0].toFixed(3)} ${a[1].toFixed(3)}A${r} ${r} 0 0 1 ${b[0].toFixed(3)} ${b[1].toFixed(3)}Z`;
}

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

function formatLineAmount(line, servings, unit, lang) {
  if (line.unit === 'top') return t(lang, 'unit_top');
  const amount = formatAmount(line, servings, unit, lang);
  return typeof line.ml === 'number' ? amount : amount.replace(line.unit, t(lang, 'unit_' + line.unit));
}

function drinkAsText(drink, ingredients, servings, unit, lang) {
  const name = typeof drink.name === 'string' ? drink.name : (drink.name[lang] || drink.name.en);
  const lines = [name, '', `${formatNumber(servings, lang)} ${t(lang, 'servings_copy')}`, '', t(lang, 'ingredients_title')];
  drink.ingredients.forEach(line => {
    const ingredient = ingredients[line.id] || {};
    const ingredientName = ingredient[lang] || ingredient.en || line.id;
    lines.push(`- ${formatLineAmount(line, servings, unit, lang)} ${ingredientName}`);
  });
  lines.push('', t(lang, 'method_title'), drink.method[lang] || drink.method.en);
  return lines.join('\n');
}

if (typeof module !== 'undefined') module.exports = {
  STRINGS, t, UNITS, detectLang, defaultState, normalizeState, favoriteIdFromHash,
  NONCONVERTIBLE_UNITS, scaleMl, convert, roundForUnit, formatNumber, formatOz, formatAmount,
  formatLineAmount, drinkAsText,
  shuffle, advanceQueue, swipeDirectionForKey, BASE_FILTERS, matchesFilters, canMake, filterDrinks,
  weightedSampleUnique, wheelCocktailWeight, buildSpinLineup, selectWheelIndex,
  wheelLandingRotation, wheelSectorPath,
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
  function save() { localStorage.setItem(KEY, JSON.stringify(state)); }
  save(); // persist first-run defaults immediately

  function lang() { return state.settings.lang; }

  let db = null;       // null = loading; {ingredients, drinks} once fetch resolves
  let drinksFailed = false;
  fetch('drinks.json').then(r => r.json()).then(data => {
    db = { ingredients: data.ingredients || {}, drinks: Array.isArray(data.drinks) ? data.drinks : [] };
    render();
  }).catch(() => { drinksFailed = true; render(); });

  let wheelData = null, wheelFailed = false, wheelPromise = null;
  let wheelMoodId = null, wheelLineup = null, wheelResult = null;
  let wheelRotation = 0, wheelSpinning = false, wheelMuted = false, wheelLevel5Spins = 0;
  let wheelVisitActive = false, wheelOpenedFromHome = false, wheelAnimation = null;

  function loadWheelData() {
    if (wheelPromise) return wheelPromise;
    wheelPromise = fetch('wheel.json').then(r => {
      if (!r.ok) throw new Error('wheel data');
      return r.json();
    }).then(data => {
      wheelData = data;
      wheelFailed = false;
      if ((location.hash || '#/') === '#/hjul') render();
      return data;
    }).catch(() => {
      wheelFailed = true;
      if ((location.hash || '#/') === '#/hjul') render();
    });
    return wheelPromise;
  }

  function resetWheelVisit() {
    if (wheelAnimation) wheelAnimation.cancel();
    wheelAnimation = null;
    wheelMoodId = null;
    wheelLineup = null;
    wheelResult = null;
    wheelRotation = 0;
    wheelSpinning = false;
    wheelMuted = false;
    wheelLevel5Spins = 0;
    wheelVisitActive = false;
    wheelOpenedFromHome = false;
  }

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
  let favOpenId = null;  // id of the favorite currently opened in detail view, or null = list
  let favChecked = new Set(); // mixing progress for the open favorite; resets when it closes
  let favHistoryEntry = false; // true only when this session opened detail from the favorite list
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
    const amt = formatLineAmount(line, state.settings.servings, state.settings.unit, lang());
    return `<li${line.essential ? '' : ' class="opt"'}><span class="amount">${esc(amt)}</span> ${esc(ingName(line.id))}</li>`;
  }

  function wireArt(img) {
    const revealArt = () => img.classList.add('loaded');
    img.addEventListener('load', revealArt, { once: true });
    img.addEventListener('error', () => { img.hidden = true; }, { once: true });
    if (img.complete && img.naturalWidth) revealArt();
  }

  function artMarkup(drink) {
    return `${glassPlaceholder(drink.glass)}<img class="cocktail-art" src="img/${esc(drink.id)}.webp" alt="" loading="lazy" decoding="async" draggable="false">`;
  }

  function buildCard(drink, depth, opts) {
    opts = opts || {};
    const flipped = 'flipped' in opts ? opts.flipped : (depth === 0 && flippedId === drink.id);
    const tint = opts.tint !== false;
    const el = document.createElement('article');
    el.className = 'card' + (flipped ? ' flipped' : '');
    el.dataset.depth = depth;
    el.dataset.id = drink.id;
    el.tabIndex = depth === 0 ? 0 : -1;
    el.setAttribute('aria-keyshortcuts', 'ArrowLeft ArrowRight');
    const tags = drink.ingredients.filter(l => l.essential)
      .map(l => `<span class="chip">${esc(ingName(l.id))}</span>`).join('');
    const s = state.settings;
    const unitBtns = UNITS.map(u =>
      `<button data-act="unit" data-unit="${u}"${u === s.unit ? ' class="active"' : ''}>${u}</button>`).join('');
    el.innerHTML = `
      <div class="card-inner">
        <div class="card-face card-front">
          <div class="card-art">${artMarkup(drink)}</div>
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
    wireArt(art);
    return el;
  }

  function mountDeck() {
    const deckEl = $('#deck');
    if (!deckEl) return;
    ensureQueue();
    const byId = {};
    db.drinks.forEach(d => { byId[d.id] = d; });
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

  function promoteDeck(leavingCard) {
    const deckEl = $('#deck');
    if (!deckEl) return;
    const moveFocus = leavingCard === document.activeElement || leavingCard.contains(document.activeElement);
    ensureQueue();
    const desired = deckQueue.slice(0, 4);
    Array.from(deckEl.querySelectorAll('.card')).forEach(card => {
      if (card !== leavingCard && !desired.includes(card.dataset.id)) card.remove();
    });
    desired.forEach((id, depth) => {
      let card = Array.from(deckEl.querySelectorAll('.card')).find(el => el !== leavingCard && el.dataset.id === id);
      if (!card) {
        const drink = db.drinks.find(item => item.id === id);
        card = buildCard(drink, depth);
        deckEl.insertBefore(card, deckEl.firstChild);
      }
      card.dataset.depth = depth;
      card.tabIndex = depth === 0 ? 0 : -1;
    });
    const nextCard = Array.from(deckEl.querySelectorAll('.card'))
      .find(el => el !== leavingCard && el.dataset.depth === '0');
    attachDrag(nextCard);
    if (moveFocus && nextCard) nextCard.focus();
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
      e.preventDefault(); // own the gesture: no native image drag or text selection
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
    card.addEventListener('dragstart', e => e.preventDefault());
  }

  function flyOff(card, dir, dy) {
    if (card.dataset.leaving) return;
    card.dataset.leaving = 'true';
    const x = (window.innerWidth + card.offsetWidth) * dir;
    card.style.transition = 'transform var(--sd-t-fly) var(--sd-ease-fly)'; // never fades — it leaves
    card.style.transform = `translate(${x}px, ${dy * 0.4}px) rotate(${dir * 18}deg)`;
    const id = deckQueue[0];
    if (dir > 0) { // save (A3): idempotent, out of this cycle; exhaustion reshuffles the full set
      if (!state.favorites.includes(id)) state.favorites.push(id);
      deckQueue = advanceQueue(deckQueue, true);
      save();
    } else { // skip (A2): to the back of the deck, nothing is ever dismissed
      deckQueue = advanceQueue(deckQueue, false);
    }
    flippedId = null; // flip state resets when a card leaves the top (A4)
    promoteDeck(card);
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      card.removeEventListener('transitionend', onEnd);
      card.remove();
    };
    const onEnd = e => { if (e.target === card) finish(); };
    card.addEventListener('transitionend', onEnd);
    setTimeout(finish, 450); // reduced-motion sets 0ms durations, which never fire transitionend
  }

  // ---------- favorites: compact image list -> one continuous, swipe-free recipe detail ----------
  function favDrink() {
    return favOpenId && db ? db.drinks.find(d => d.id === favOpenId) || null : null;
  }

  async function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) return navigator.clipboard.writeText(text);
    const area = document.createElement('textarea');
    area.value = text;
    area.style.position = 'fixed';
    area.style.opacity = '0';
    document.body.appendChild(area);
    area.select();
    const copied = document.execCommand('copy');
    area.remove();
    if (!copied) throw new Error('copy failed');
  }

  function viewFavorites() {
    const title = `<h1 class="screen-title">${esc(t(lang(), 'favorites_title'))}</h1>`;
    if (!db) return `${title}<p class="empty">${esc(t(lang(), 'deck_loading'))}</p>`; // ponytail: shared fetch, same loading copy
    const open = favDrink();
    if (favOpenId && !open) favOpenId = null; // favorite id vanished from db: just close, no crash
    if (open) {
      const s = state.settings;
      const tags = open.ingredients.filter(line => line.essential)
        .map(line => `<span class="chip">${esc(ingName(line.id))}</span>`).join('');
      const ingredientRows = open.ingredients.map(line => {
        const checked = favChecked.has(line.id);
        return `<label class="fav-ing-row${checked ? ' done' : ''}">
          <input type="checkbox" data-fav-ing="${esc(line.id)}"${checked ? ' checked' : ''} aria-label="${esc(t(lang(), 'check_ingredient') + ' ' + ingName(line.id))}">
          <span class="amount">${esc(formatLineAmount(line, s.servings, s.unit, lang()))}</span>
          <span>${esc(ingName(line.id))}</span>
        </label>`;
      }).join('');
      const unitBtns = UNITS.map(unit => `<button data-fav-act="unit" data-unit="${unit}"${unit === s.unit ? ' class="active"' : ''}>${unit}</button>`).join('');
      const source = open.source && open.source.url && open.source.label
        ? `<p class="fav-source"><a href="${esc(open.source.url)}" target="_blank" rel="noopener noreferrer">${esc(t(lang(), 'source_label'))}: ${esc(open.source.label)}</a></p>`
        : '';
      return `${title}
        <div class="fav-toolbar">
          <button id="favClose" class="fav-back">${esc(t(lang(), 'fav_back'))}</button>
          <button class="fav-remove" data-act="unfav" data-id="${esc(open.id)}" aria-label="${esc(t(lang(), 'fav_unfavorite'))}">${esc(t(lang(), 'fav_unfavorite'))}</button>
        </div>
        <article class="fav-detail">
          <section class="fav-hero">
            <div class="fav-detail-art">${artMarkup(open)}</div>
            <h2 class="card-name">${esc(open.name)}</h2>
            <div class="card-meta">${esc(taxonomyName('type', open.type))}</div>
            <div class="card-tags">${tags}</div>
          </section>
          <section class="fav-recipe">
            <h2>${esc(t(lang(), 'recipe_title'))}</h2>
            <div class="fav-recipe-controls">
              <div class="stepper" role="group" aria-label="${esc(t(lang(), 'servings'))}">
                <button data-fav-act="dec" aria-label="${esc(t(lang(), 'servings_decrease'))}">−</button>
                <span class="amount">${s.servings}</span>
                <button data-fav-act="inc" aria-label="${esc(t(lang(), 'servings_increase'))}">+</button>
              </div>
              <div class="units" role="group" aria-label="${esc(t(lang(), 'settings_unit'))}">${unitBtns}</div>
            </div>
            <h3>${esc(t(lang(), 'ingredients_title'))}</h3>
            <p class="fav-hint">${esc(t(lang(), 'ingredient_check_hint'))}</p>
            <div class="fav-ing-list">${ingredientRows}</div>
            <h3>${esc(t(lang(), 'method_title'))}</h3>
            <p class="fav-method">${esc(open.method[lang()] || open.method.en)}</p>
            ${source}
            <button class="fav-copy" data-copy-fav>${esc(t(lang(), 'copy_recipe'))}</button>
          </section>
        </article>`;
    }
    const rows = state.favorites.map(id => db.drinks.find(d => d.id === id)).filter(Boolean); // skip ids not in db
    if (!rows.length) return `${title}<p class="empty">${esc(t(lang(), 'favorites_empty'))}</p>`;
    const list = rows.map(d => `
      <div class="list-card fav-row">
        <button class="fav-open" data-id="${esc(d.id)}">
          <span class="fav-thumb">${artMarkup(d)}</span>
          <span class="fav-info">
            <span class="name">${esc(d.name)}</span>
            <span class="meta">${esc(taxonomyName('type', d.type))}</span>
          </span>
        </button>
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

  function wheelMood() { return wheelData && wheelData.moods.find(mood => mood.id === wheelMoodId) || null; }
  function localText(value) { return value && (value[lang()] || value.en) || ''; }
  function wheelWordmark() { return '<span class="wheel-top-wordmark"><img src="design/wordmark.svg" alt="Sipdeck"></span>'; }

  function neutralWheelSvg() {
    const sectors = Array.from({ length: 12 }, (_, index) =>
      `<path class="wheel-sector" d="${wheelSectorPath(index)}"/>`).join('');
    return `<svg class="wheel-neutral" viewBox="0 0 100 100" aria-hidden="true">${sectors}<circle class="wheel-rim" cx="50" cy="50" r="49"/><circle class="wheel-hub" cx="50" cy="50" r="10"/><circle class="wheel-hub-dot" cx="50" cy="50" r="3"/></svg>`;
  }

  function wheelSvgMarkup(lineup) {
    if (!Array.isArray(lineup) || lineup.length !== 12) return neutralWheelSvg();
    const defs = lineup.map((entry, index) => {
      const angle = (-90 + index * 30) * Math.PI / 180;
      const cx = 50 + 24 * Math.cos(angle), cy = 50 + 24 * Math.sin(angle);
      return `<clipPath id="wheel-art-${index}"><circle cx="${cx.toFixed(3)}" cy="${cy.toFixed(3)}" r="5.3"/></clipPath>`;
    }).join('');
    const sectors = lineup.map((entry, index) => {
      const degrees = -90 + index * 30, angle = degrees * Math.PI / 180;
      const cx = 50 + 24 * Math.cos(angle), cy = 50 + 24 * Math.sin(angle);
      const normalized = (degrees + 360) % 360, flip = normalized > 90 && normalized < 270;
      const rotation = flip ? degrees + 180 : degrees;
      const x = flip ? 6 : 94, anchor = flip ? 'start' : 'end';
      const label = localText(entry.sector);
      const artR = entry.category === 'shot' ? 4.1 : 5.3; // shots drawn smaller
      return `<path class="wheel-sector" data-sector="${index}" d="${wheelSectorPath(index)}"/><circle class="wheel-art-ring" cx="${cx.toFixed(3)}" cy="${cy.toFixed(3)}" r="5.7"/><image class="wheel-art" href="${esc(entry.art)}" x="${(cx - artR).toFixed(3)}" y="${(cy - artR).toFixed(3)}" width="${artR * 2}" height="${artR * 2}" preserveAspectRatio="xMidYMid slice" clip-path="url(#wheel-art-${index})"/><text class="wheel-sector-label" x="${x}" y="50.9" text-anchor="${anchor}" transform="rotate(${rotation} 50 50)">${esc(label)}</text>`;
    }).join('');
    const choices = lineup.map(entry => localText(entry.sector)).join(', ');
    return `<svg viewBox="0 0 100 100" role="img" aria-label="${esc(choices)}"><defs>${defs}</defs>${sectors}<circle class="wheel-rim" cx="50" cy="50" r="49"/><circle class="wheel-hub" cx="50" cy="50" r="10"/><circle class="wheel-hub-dot" cx="50" cy="50" r="3"/></svg>`;
  }

  function wheelSupportingCopy(mood) {
    if (!mood) return t(lang(), 'wheel_choose');
    if (mood.id === 'shitfaced' && wheelLevel5Spins > 0 && Array.isArray(mood.repeatCopy)) {
      return localText(mood.repeatCopy[Math.min(wheelLevel5Spins - 1, mood.repeatCopy.length - 1)]);
    }
    return localText(mood.copy);
  }

  function wheelResultMarkup(entry, mood) {
    if (!entry) return '';
    const safety = mood && mood.forcedOutcome && mood.safety
      ? `<p class="wheel-result-note">${esc(localText(mood.safety))}</p>` : '';
    const name = entry.kind === 'cocktail'
      ? `<button class="fav-open" data-id="${esc(entry.outcomeId)}">${esc(localText(entry.result))} ›</button>`
      : esc(localText(entry.result));
    return `<img class="wheel-result-art${entry.category === 'shot' ? ' shot' : ''}" src="${esc(entry.art)}" alt="">
      <div><p class="wheel-result-label">${esc(t(lang(), 'wheel_result'))}</p>
      <h2 class="wheel-result-name">${name}</h2>${safety}</div>`;
  }

  function wheelActionsMarkup(canSpin) {
    return `<button class="wheel-action primary" data-wheel-act="spin"${canSpin ? '' : ' disabled'}>${esc(t(lang(), wheelResult ? 'wheel_respin' : 'wheel_spin'))}</button>${wheelResult ? `<button class="wheel-action" data-wheel-act="new">${esc(t(lang(), 'wheel_new'))}</button>` : ''}`;
  }

  function viewWheel() {
    loadWheelData();
    if (!wheelMoodId && wheelData && db) { // default to first mood
      wheelMoodId = wheelData.moods[0].id;
      wheelLineup = buildSpinLineup(wheelData, wheelMoodId, db.drinks, random01);
    }
    const mood = wheelMood();
    const moods = wheelData && Array.isArray(wheelData.moods) ? wheelData.moods : [];
    const moodIndex = mood ? moods.indexOf(mood) : -1;
    const heading = mood
      ? `<h1><span class="wheel-emoji" aria-hidden="true">${esc(mood.emoji)}</span>${esc(localText(mood.name))}</h1>
         <p>${esc(wheelSupportingCopy(mood))}</p>`
      : `<h1>${esc(t(lang(), 'wheel_intro'))}</h1><p>${esc(t(lang(), 'wheel_choose'))}</p>`;
    const stops = moods.length === 5 ? moods.map(item => `<span aria-hidden="true">${esc(item.emoji)}</span>`).join('')
      : '<span>•</span><span>•</span><span>•</span><span>•</span><span>•</span>';
    const loading = !wheelData && !wheelFailed;
    const status = wheelFailed ? t(lang(), 'wheel_error') : (loading ? t(lang(), 'wheel_loading') : '');
    const canSpin = !!(mood && wheelLineup && !wheelSpinning);
    const disc = wheelLineup ? wheelSvgMarkup(wheelLineup) : neutralWheelSvg();
    const result = wheelResult ? wheelResultMarkup(wheelResult, mood) : '';
    return `<section class="wheel-screen">
      <header class="wheel-topbar">
        <button class="wheel-back" data-wheel-act="back">‹ ${esc(t(lang(), 'wheel_back'))}</button>
        ${wheelWordmark()}
        <button class="wheel-sound" data-wheel-act="sound" aria-label="${esc(t(lang(), wheelMuted ? 'wheel_unmute' : 'wheel_mute'))}"
          aria-pressed="${wheelMuted ? 'true' : 'false'}">${wheelMuted ? '🔇' : '🔊'}</button>
      </header>
      <div class="wheel-body">
        <div class="wheel-heading">${heading}</div>
        <div class="wheel-stage" id="wheelStage">
          <div class="wheel-pointer" id="wheelPointer" aria-hidden="true"></div>
          <div class="wheel-disc" id="wheelDisc" style="transform:rotate(${wheelRotation}deg)">${disc}</div>
          <button class="wheel-hub-button" data-wheel-act="spin"${canSpin ? '' : ' disabled'}>${esc(t(lang(), wheelResult ? 'wheel_respin' : 'wheel_spin'))}</button>
        </div>
        <section class="wheel-controls${mood ? '' : ' unset'}">
          <p class="wheel-controls-title">${esc(status || t(lang(), 'wheel_mood_label'))}</p>
          <input class="wheel-range" id="wheelMood" type="range" min="1" max="5" step="1" value="${moodIndex >= 0 ? moodIndex + 1 : 1}"
            aria-label="${esc(t(lang(), 'wheel_mood_label'))}" aria-valuetext="${esc(mood ? localText(mood.name) : t(lang(), 'wheel_choose'))}"
            ${wheelData && db && !wheelSpinning ? '' : 'disabled'}>
          <div class="wheel-stops">${stops}</div>
          <div class="wheel-actions">${wheelActionsMarkup(canSpin)}</div>
        </section>
        <section class="wheel-result" id="wheelResult" aria-live="polite"${wheelResult ? '' : ' hidden'}>${result}</section>
        <p class="wheel-live" id="wheelLive" aria-live="polite">${esc(canSpin ? t(lang(), 'wheel_ready') : status)}</p>
      </div>
    </section>`;
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

  function random01() {
    if (window.crypto && window.crypto.getRandomValues) {
      const value = new Uint32Array(1);
      window.crypto.getRandomValues(value);
      return value[0] / 4294967296;
    }
    return Math.random();
  }

  function selectWheelMood(value) {
    if (!wheelData || !db || wheelSpinning) return;
    const mood = wheelData.moods[Number(value) - 1];
    if (!mood) return;
    wheelMoodId = mood.id;
    wheelLineup = buildSpinLineup(wheelData, wheelMoodId, db.drinks, random01);
    wheelResult = null;
    wheelRotation = 0;
    render();
    const spin = $('#view [data-wheel-act="spin"]');
    if (spin) spin.focus();
  }

  function newWheel() {
    if (!wheelData || !db || !wheelMoodId || wheelSpinning) return;
    wheelLineup = buildSpinLineup(wheelData, wheelMoodId, db.drinks, random01);
    wheelResult = null;
    wheelRotation = 0;
    render();
  }

  function closeWheel() {
    if (wheelOpenedFromHome) history.back();
    else {
      history.replaceState(null, '', '#/');
      renderRoute();
    }
  }

  let wheelAudio = null;
  function audioContext() {
    if (wheelMuted) return null;
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return null;
    if (!wheelAudio) wheelAudio = new AudioCtx();
    if (wheelAudio.state === 'suspended') wheelAudio.resume();
    return wheelAudio;
  }

  function wheelTone(frequency, duration, volume, delay) {
    const context = audioContext();
    if (!context) return;
    const start = context.currentTime + (delay || 0);
    const oscillator = context.createOscillator(), gain = context.createGain();
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(frequency, start);
    gain.gain.setValueAtTime(Math.max(0.0001, volume), start);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    oscillator.connect(gain); gain.connect(context.destination);
    oscillator.start(start); oscillator.stop(start + duration);
  }

  function tickWheel() {
    wheelTone(920, .025, .018, 0);
    const pointer = $('#wheelPointer');
    if (!pointer) return;
    pointer.classList.remove('tick');
    void pointer.offsetWidth;
    pointer.classList.add('tick');
  }

  function landingSound() {
    wheelTone(390, .12, .035, 0);
    wheelTone(560, .18, .028, .07);
  }

  function renderedRotation(element) {
    const transform = getComputedStyle(element).transform;
    if (!transform || transform === 'none') return 0;
    const match = transform.match(/^matrix\(([^)]+)\)$/);
    if (!match) return 0;
    const values = match[1].split(',').map(Number);
    return Math.atan2(values[1], values[0]) * 180 / Math.PI;
  }

  function finishWheelSpin(index, endRotation, reduced) {
    const disc = $('#wheelDisc'), stage = $('#wheelStage'), mood = wheelMood();
    if (!disc || !stage || !wheelLineup || !wheelLineup[index]) return;
    if (!reduced) {
      disc.style.transform = `rotate(${endRotation}deg)`;
      wheelRotation = endRotation;
    }
    wheelAnimation = null;
    wheelSpinning = false;
    wheelResult = wheelLineup[index];
    if (mood && mood.id === 'shitfaced') wheelLevel5Spins++;
    stage.classList.add('wheel-win');
    const winning = disc.querySelector(`[data-sector="${index}"]`);
    if (winning) winning.dataset.winning = 'true';
    const result = $('#wheelResult');
    if (result) {
      result.innerHTML = wheelResultMarkup(wheelResult, mood);
      result.hidden = false;
    }
    const controlsActions = $('#view .wheel-controls .wheel-actions');
    if (controlsActions) controlsActions.innerHTML = wheelActionsMarkup(true);
    const hub = $('#view .wheel-hub-button');
    if (hub) { hub.disabled = false; hub.textContent = t(lang(), 'wheel_respin'); }
    const range = $('#wheelMood');
    if (range) range.disabled = false;
    const copy = $('#view .wheel-heading p');
    if (copy && mood) copy.textContent = wheelSupportingCopy(mood);
    const live = $('#wheelLive');
    if (live) live.textContent = localText(wheelResult.result);
    $('#view .wheel-result-art')?.addEventListener('error', e => { e.currentTarget.hidden = true; }, { once: true });
    landingSound();
    if (navigator.vibrate) navigator.vibrate(18);
  }

  function spinWheel() {
    if (wheelSpinning || !wheelLineup || wheelLineup.length !== 12) return;
    const disc = $('#wheelDisc'), stage = $('#wheelStage');
    if (!disc || !stage) return;
    const index = selectWheelIndex(wheelLineup, random01);
    if (index < 0) return;
    wheelSpinning = true;
    wheelResult = null;
    stage.classList.remove('wheel-win');
    disc.querySelectorAll('[data-winning]').forEach(item => item.removeAttribute('data-winning'));
    const result = $('#wheelResult');
    if (result) { result.hidden = true; result.innerHTML = ''; }
    $('#view').querySelectorAll('[data-wheel-act="spin"],#wheelMood').forEach(control => { control.disabled = true; });
    const live = $('#wheelLive');
    if (live) live.textContent = t(lang(), 'wheel_spinning');
    audioContext(); // unlock Web Audio from the explicit user gesture
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced || !disc.animate) {
      setTimeout(() => finishWheelSpin(index, wheelRotation, true), 180);
      return;
    }
    const end = wheelLandingRotation(wheelRotation, index, random01, 12);
    const travel = end - wheelRotation, duration = 6200 + Math.round(random01() * 1200);
    wheelAnimation = disc.animate([
      { transform: `rotate(${wheelRotation}deg)`, offset: 0, easing: 'cubic-bezier(.45,0,1,1)' },
      { transform: `rotate(${wheelRotation + travel * .08}deg)`, offset: .12, easing: 'cubic-bezier(.08,.58,.12,1)' },
      { transform: `rotate(${end}deg)`, offset: 1 },
    ], { duration, fill: 'forwards' });
    let lastSector = null, raf = 0;
    const watchTicks = () => {
      if (!wheelSpinning || !disc.isConnected) return;
      const angle = ((-renderedRotation(disc) % 360) + 360) % 360;
      const sector = Math.floor((angle + 15) / 30) % 12;
      if (lastSector !== null && sector !== lastSector) tickWheel();
      lastSector = sector;
      raf = requestAnimationFrame(watchTicks);
    };
    raf = requestAnimationFrame(watchTicks);
    wheelAnimation.finished.then(() => {
      cancelAnimationFrame(raf);
      finishWheelSpin(index, end, false);
    }).catch(() => cancelAnimationFrame(raf));
  }

  // ---------- router: hashchange -> coarse re-render per view ----------
  const ROUTES = {
    '#/': { view: viewDeck, match: '#/' },
    '#/hjul': { view: viewWheel, match: null },
    '#/favoriter': { view: viewFavorites, match: '#/favoriter' },
    '#/skafferi': { view: viewPantry, match: '#/skafferi' },
    '#/installningar': { view: viewSettings, match: '#/installningar' },
  };

  function closeFavoriteDetail() {
    favOpenId = null;
    favChecked = new Set();
    if (favHistoryEntry) {
      favHistoryEntry = false;
      history.back();
    } else {
      history.replaceState(null, '', '#/favoriter');
      render();
    }
  }

  function render() {
    const hash = location.hash || '#/';
    const detailId = favoriteIdFromHash(hash);
    const route = detailId !== null ? ROUTES['#/favoriter'] : (ROUTES[hash] || ROUTES['#/']);
    const isWheel = route.view === viewWheel;
    if (isWheel && !wheelVisitActive) wheelVisitActive = true;
    else if (!isWheel && wheelVisitActive && detailId === null) resetWheelVisit(); // survives fav detail peek
    document.body.classList.toggle('wheel-mode', isWheel);
    if (route.view === viewFavorites) {
      if (detailId !== favOpenId) favChecked = new Set();
      favOpenId = detailId;
      if (detailId === null) favHistoryEntry = false;
    } else if (favOpenId !== null) {
      favOpenId = null;
      favChecked = new Set();
      favHistoryEntry = false;
    }
    $('#view').innerHTML = route.view();
    if (route.view === viewDeck && db) mountDeck();
    if (route.view === viewFavorites) $('#view').querySelectorAll('.cocktail-art').forEach(wireArt);
    document.documentElement.lang = lang();
    $('#tagline').textContent = t(lang(), 'tagline');
    $('#wheelEntryLabel').textContent = t(lang(), 'wheel_entry');
    $('#wheelEntry').setAttribute('aria-label', t(lang(), 'wheel_entry'));
    $('#wheelEntry').hidden = route.view !== viewDeck;
    $('#nav').setAttribute('aria-label', t(lang(), 'nav_label'));
    const navLabels = { '#/': 'nav_deck', '#/favoriter': 'nav_favorites', '#/skafferi': 'nav_pantry', '#/installningar': 'nav_settings' };
    document.querySelectorAll('#nav a').forEach(a => {
      a.textContent = t(lang(), navLabels[a.dataset.match]);
      a.classList.toggle('active', a.dataset.match === route.match);
    });
  }

  function renderRoute() {
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!reduced && document.startViewTransition) document.startViewTransition(() => render());
    else render();
  }

  $('#view').addEventListener('click', async e => {
    const wheelAction = e.target.closest('[data-wheel-act]');
    if (wheelAction) {
      const action = wheelAction.dataset.wheelAct;
      if (action === 'spin') spinWheel();
      else if (action === 'new') newWheel();
      else if (action === 'back') closeWheel();
      else if (action === 'sound') {
        wheelMuted = !wheelMuted;
        wheelAction.textContent = wheelMuted ? '🔇' : '🔊';
        wheelAction.setAttribute('aria-pressed', wheelMuted ? 'true' : 'false');
        wheelAction.setAttribute('aria-label', t(lang(), wheelMuted ? 'wheel_unmute' : 'wheel_mute'));
      }
      return;
    }
    const langBtn = e.target.closest('[data-lang]');
    if (langBtn) {
      state.settings.lang = langBtn.dataset.lang;
      save();
      render();
      return;
    }
    if (e.target.closest('#favClose')) { closeFavoriteDetail(); return; }
    const favAction = e.target.closest('[data-fav-act]');
    if (favAction) {
      const s = state.settings;
      if (favAction.dataset.favAct === 'inc') s.servings = Math.min(8, s.servings + 1);
      else if (favAction.dataset.favAct === 'dec') s.servings = Math.max(1, s.servings - 1);
      else if (favAction.dataset.favAct === 'unit') s.unit = favAction.dataset.unit;
      save();
      render();
      return;
    }
    const copyBtn = e.target.closest('[data-copy-fav]');
    if (copyBtn) {
      const drink = favDrink();
      try {
        await copyText(drinkAsText(drink, db.ingredients, state.settings.servings, state.settings.unit, lang()));
        copyBtn.textContent = t(lang(), 'copied');
      } catch (err) {
        copyBtn.textContent = t(lang(), 'copy_failed');
      }
      setTimeout(() => { if (copyBtn.isConnected) copyBtn.textContent = t(lang(), 'copy_recipe'); }, 2500);
      return;
    }
    const unfavBtn = e.target.closest('[data-act="unfav"]');
    if (unfavBtn) {
      const id = unfavBtn.dataset.id;
      state.favorites = state.favorites.filter(x => x !== id);
      const closedDetail = favOpenId === id;
      save();
      if (closedDetail) closeFavoriteDetail();
      else render();
      return;
    }
    const row = e.target.closest('.fav-open');
    if (row) {
      favHistoryEntry = true;
      location.hash = '#/favoriter/' + encodeURIComponent(row.dataset.id);
    }
  });

  $('#view').addEventListener('change', e => {
    const control = e.target.closest('#wheelMood');
    if (control) selectWheelMood(control.value);
  });

  $('#view').addEventListener('change', e => {
    const control = e.target.closest('[data-fav-ing]');
    if (!control) return;
    if (control.checked) favChecked.add(control.dataset.favIng);
    else favChecked.delete(control.dataset.favIng);
    control.closest('.fav-ing-row').classList.toggle('done', control.checked);
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

  $('#wheelEntry').addEventListener('click', () => { wheelOpenedFromHome = true; });
  window.addEventListener('hashchange', renderRoute);
  window.addEventListener('keydown', e => {
    const dir = swipeDirectionForKey(e.key);
    if (!dir || e.defaultPrevented || e.repeat || e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
    const target = e.target instanceof Element ? e.target : null;
    if (target && target.closest('button, input, select, textarea, a, [contenteditable="true"]')) return;
    const card = $('#deck .card[data-depth="0"]');
    if (!card || card.dataset.leaving) return;
    e.preventDefault();
    flyOff(card, dir, 0);
  });
  render();
})();
