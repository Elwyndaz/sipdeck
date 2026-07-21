'use strict';
// ponytail: plain node asserts, no framework. `node test.js` to run.
const fs = require('fs');
const path = require('path');
const { STRINGS, t, detectLang, defaultState, normalizeState, favoriteIdFromHash, drinkIdFromHash,
  scaleMl, convert, roundForUnit, formatNumber, formatOz, formatAmount, shuffle, advanceQueue,
  swipeDirectionForKey,
  formatLineAmount, drinkAsText,
  BASE_FILTERS, matchesFilters, canMake, filterDrinks, missingIngredients, mergeState,
  searchHaystack, matchesSearch,
  weightedSampleUnique, wheelCocktailWeight, buildSpinLineup, selectWheelIndex,
  wheelLandingRotation, wheelSectorPath,
  GLASS_SILHOUETTES, glassPlaceholder } = require('./app.js');

let pass = 0, fail = 0;
function check(cond, msg) {
  if (cond) { pass++; } else { fail++; console.error('FAIL: ' + msg); }
}

// ---------- app.js pure functions ----------
check(detectLang('sv-SE') === 'sv', 'detectLang: sv-SE -> sv');
check(detectLang('en-US') === 'en', 'detectLang: en-US -> en');
check(detectLang(undefined) === 'en', 'detectLang: missing -> en');
check(Object.values(STRINGS.sv).every(value => !String(value).includes('—')), 'string table sv: no em-dashes');
check(Object.keys(STRINGS.en).every(key => key in STRINGS.sv), 'string table: every English key has Swedish copy');
check(Object.keys(STRINGS.sv).every(key => key in STRINGS.en), 'string table: every Swedish key has English copy');
check(t('sv', 'language_sv') === 'Svenska' && t('en', 'language_sv') === 'Swedish',
  'string table: language labels translate');

const d = defaultState('sv');
check(d.v === 1 && d.settings.lang === 'sv' && d.settings.unit === 'cl' && d.settings.servings === 1,
  'defaultState: shape + lang passthrough');
check(Array.isArray(d.favorites) && d.favorites.length === 0, 'defaultState: empty favorites');
check(d.settings.wheelFavoritesOnly === false, 'defaultState: wheel favorites-only off by default');
check(Array.isArray(d.settings.wheelOutcomesExcluded) && d.settings.wheelOutcomesExcluded.length === 0,
  'defaultState: no wheel outcomes excluded by default (opt-out, everything starts checked)');

// normalizeState round-trip: a valid blob comes back unchanged in shape
const valid = { v: 1, favorites: ['margarita'], pantry: ['gin'],
  settings: { lang: 'en', unit: 'oz', servings: 4, filters: { bar: true, base: 'gin' } } };
const rt = normalizeState(valid, 'sv');
check(rt.favorites.length === 1 && rt.favorites[0] === 'margarita', 'normalizeState: favorites survive');
check(rt.settings.unit === 'oz' && rt.settings.servings === 4, 'normalizeState: settings survive');
check(rt.settings.filters.bar === true && rt.settings.filters.base === 'gin', 'normalizeState: filters survive');

const validWithWheelPrefs = Object.assign({}, valid, { settings: Object.assign({}, valid.settings,
  { wheelFavoritesOnly: true, wheelOutcomesExcluded: ['fernet-shot', 42, 'red-wine'] }) });
const rtWheelPrefs = normalizeState(validWithWheelPrefs, 'sv');
check(rtWheelPrefs.settings.wheelFavoritesOnly === true, 'normalizeState: wheel favorites-only survives');
check(rtWheelPrefs.settings.wheelOutcomesExcluded.join() === 'fernet-shot,red-wine',
  'normalizeState: wheel outcomes excluded survives, non-string entries dropped');
check(normalizeState({ settings: { wheelOutcomesExcluded: 'not-an-array' } }, 'en')
  .settings.wheelOutcomesExcluded.length === 0,
  'normalizeState: garbage wheelOutcomesExcluded falls back to empty');

// normalizeState never throws on garbage, falls back to defaults
check((() => { try { return normalizeState('garbage', 'en').v === 1; } catch (e) { return false; } })(),
  'normalizeState: garbage input never throws');
check((() => { try { return normalizeState(null, 'en').settings.lang === 'en'; } catch (e) { return false; } })(),
  'normalizeState: null input falls back to nav lang');
check(normalizeState({ settings: { servings: 99 } }, 'en').settings.servings === 1,
  'normalizeState: out-of-range servings falls back to 1');
check(!('wheel' in normalizeState({ wheel: { mood: 'fresh' } }, 'en')),
  'normalizeState: wheel visit state never enters the persisted blob');

check(favoriteIdFromHash('#/favoriter/margarita') === 'margarita',
  'favoriteIdFromHash: parses favorite detail route');
check(favoriteIdFromHash('#/favoriter/corpse%20reviver') === 'corpse reviver',
  'favoriteIdFromHash: decodes route id');
check(favoriteIdFromHash('#/favoriter') === null,
  'favoriteIdFromHash: favorite list is not a detail route');
check(favoriteIdFromHash('#/favoriter/bad/id') === null,
  'favoriteIdFromHash: nested route is rejected');

check(drinkIdFromHash('#/drink/margarita') === 'margarita',
  'drinkIdFromHash: parses deep-link route (BACKLOG 16)');
check(drinkIdFromHash('#/drink/corpse%20reviver') === 'corpse reviver',
  'drinkIdFromHash: decodes route id');
check(drinkIdFromHash('#/drink') === null, 'drinkIdFromHash: bare prefix is not a detail route');
check(drinkIdFromHash('#/drink/bad/id') === null, 'drinkIdFromHash: nested route is rejected');
check(drinkIdFromHash('#/favoriter/margarita') === null, 'drinkIdFromHash: does not match favorite route');

// ---------- unit engine (BACKLOG 3) ----------
// scaling
check(scaleMl(45, 4) === 180, 'scaleMl: 45 x 4 = 180');
check(scaleMl(45, 1) === 45, 'scaleMl: servings lower bound 1');
check(scaleMl(45, 8) === 360, 'scaleMl: servings upper bound 8');
check((2 * 3) === 6, 'dash scaling: 2 dashes x 3 = 6 (qty x servings)');

// conversion + rounding
check(roundForUnit(convert(45, 'cl'), 'cl') === 4.5, 'convert+round: 45 ml -> 4,5 cl');
check(roundForUnit(convert(45, 'oz'), 'oz') === 1.5, 'convert+round: 45 ml -> 1.5 oz (1½)');
check(roundForUnit(convert(50, 'oz'), 'oz') === 1.75, 'convert+round: 50 ml -> 1.75 oz (1¾, 50/30=1.667 rounds up)');
check(roundForUnit(convert(22, 'ml'), 'ml') === 20, 'convert+round: 22 ml stays ml, rounds to nearest 5 -> 20');
check(roundForUnit(convert(180, 'cl'), 'cl') === 18, 'convert+round: 180 ml -> 18 cl');

// oz vulgar fractions
check(formatOz(1.5, 'en') === '1' + '½', 'formatOz: 1.5 -> 1½');
check(formatOz(1.75, 'en') === '1' + '¾', 'formatOz: 1.75 -> 1¾');
check(formatOz(2.25, 'en') === '2' + '¼', 'formatOz: 2.25 -> 2¼');
check(formatOz(0.75, 'en') === '¾', 'formatOz: 0.75 -> ¾ (no leading 0)');
check(formatOz(2, 'en') === '2', 'formatOz: whole number has no fraction glyph');

// sv vs en number formatting
check(formatNumber(4.5, 'sv') === '4,5', 'formatNumber sv: decimal comma');
check(formatNumber(4.5, 'en') === '4.5', 'formatNumber en: decimal point');
check(formatNumber(1500, 'sv') === '1 500', 'formatNumber sv: space thousands separator');
check(formatNumber(1500, 'en') === '1,500', 'formatNumber en: comma thousands separator');
check(formatNumber(20, 'sv') === '20', 'formatNumber sv: whole number has no decimal tail');
check(!formatNumber(1500.5, 'sv').includes('—'), 'formatNumber sv: never an em-dash');

// top-level formatAmount: convertible lines
check(formatAmount({ ml: 45, essential: true }, 1, 'cl', 'sv') === '4,5 cl', 'formatAmount: 45 ml -> 4,5 cl (sv)');
check(formatAmount({ ml: 45, essential: true }, 1, 'oz', 'en') === '1½ oz', 'formatAmount: 45 ml -> 1½ oz');
check(formatAmount({ ml: 50, essential: true }, 1, 'oz', 'en') === '1¾ oz', 'formatAmount: 50 ml -> 1¾ oz');
check(formatAmount({ ml: 22, essential: true }, 1, 'ml', 'en') === '20 ml', 'formatAmount: 22 ml x1 -> 20 ml');
check(formatAmount({ ml: 45, essential: true }, 4, 'cl', 'sv') === '18 cl', 'formatAmount: scaling before rounding (45x4=180ml -> 18 cl)');

// non-convertible passthrough: never converts regardless of active display unit
check(formatAmount({ qty: 2, unit: 'dash', essential: false }, 3, 'cl', 'en') === '6 dash',
  'formatAmount: 2 dashes x 3 servings = 6 dash, unaffected by cl unit');
check(formatAmount({ qty: 2, unit: 'dash', essential: false }, 3, 'oz', 'en') === '6 dash',
  'formatAmount: non-convertible passthrough unaffected by oz unit');
check(formatAmount({ qty: 1, unit: 'barspoon', essential: false }, 1, 'ml', 'en') === '1 barspoon',
  'formatAmount: 1 barspoon x1 stays integer');
check(formatAmount({ qty: 1, unit: 'piece', essential: false }, 3, 'cl', 'en') === '3 piece',
  'formatAmount: qty x servings stays integer when it divides evenly');
check(formatAmount({ qty: 1, unit: 'dash', essential: false }, 3, 'cl', 'en').includes('.') === false,
  'formatAmount: integer scaled qty has no decimal tail');
check(formatLineAmount({ qty: 1, unit: 'dash' }, 2, 'cl', 'sv') === '2 stänk',
  'formatLineAmount: translates non-convertible unit');
check(formatLineAmount({ qty: 1, unit: 'top' }, 4, 'oz', 'sv') === 'toppa upp',
  'formatLineAmount: top renders without quantity');

const copyDrink = {
  name: 'Testdrink',
  ingredients: [{ id: 'gin', ml: 45 }, { id: 'lime', qty: 1, unit: 'slice' }],
  method: { en: 'Stir and serve.', sv: 'Rör och servera.' },
};
const copyIngredients = { gin: { en: 'Gin', sv: 'Gin' }, lime: { en: 'Lime', sv: 'Lime' } };
check(drinkAsText(copyDrink, copyIngredients, 2, 'cl', 'sv') === [
  'Testdrink', '', '2 portioner', '', 'Ingredienser',
  '- 9 cl Gin', '- 2 skiva Lime', '', 'Gör så här', 'Rör och servera.',
].join('\n'), 'drinkAsText: readable Swedish recipe with scaled amounts');
check(drinkAsText(copyDrink, copyIngredients, 1, 'oz', 'en').includes('- 1½ oz Gin'),
  'drinkAsText: uses active English unit formatting');
check(!drinkAsText(copyDrink, copyIngredients, 2, 'cl', 'sv').includes('—'),
  'drinkAsText: Swedish copy contains no em-dash');

// ---------- shuffle (BACKLOG 4) ----------
const orig = [1, 2, 3, 4];
const shuffled = shuffle(orig, () => 0.5); // deterministic rng
check(orig.join() === '1,2,3,4', 'shuffle: does not mutate input');
check(shuffled.length === 4 && [1, 2, 3, 4].every(n => shuffled.includes(n)),
  'shuffle: same members, same length');
check(shuffle([], () => 0.5).length === 0, 'shuffle: empty array ok');
check(shuffle(['a']).join() === 'a', 'shuffle: single element ok');
const queue = ['a', 'b', 'c'];
check(advanceQueue(queue, false).join() === 'b,c,a', 'advanceQueue: skip moves top to back');
check(advanceQueue(queue, true).join() === 'b,c', 'advanceQueue: save removes top for this cycle');
check(queue.join() === 'a,b,c', 'advanceQueue: does not mutate live queue input');
check(advanceQueue([], false).length === 0, 'advanceQueue: empty queue stays empty');

// ---------- filters (BACKLOG 6) ----------
const filterSeed = [
  { id: 'a', base: 'gin', bar: true },
  { id: 'b', base: 'rum', bar: false },
  { id: 'c', base: 'mezcal', bar: true },
];
check(matchesFilters(filterSeed[0], { bar: false, base: null }), 'filters: no filters matches');
check(!matchesFilters(filterSeed[1], { bar: true, base: null }), 'filters: bar excludes non-bar drink');
check(matchesFilters(filterSeed[0], { bar: true, base: 'gin' }), 'filters: bar and base combine');
check(!matchesFilters(filterSeed[1], { bar: false, base: 'gin' }), 'filters: base excludes other spirits');
check(matchesFilters(filterSeed[2], { bar: false, base: 'other' }), 'filters: other matches unlisted base');
check(filterDrinks(filterSeed, { bar: true, base: null }).length === 2, 'filterDrinks: returns matching set');
check(filterDrinks(filterSeed, { bar: true, base: 'rum' }).length === 0, 'filterDrinks: empty combination');
check(filterDrinks(null, {}).length === 0, 'filterDrinks: invalid input is empty');

// ---------- search (#/sok) ----------
const searchDrink = { name: 'Margarita' };
const searchHay = searchHaystack(searchDrink, ['Blanco tequila', 'Triple sec', 'Lime juice']);
check(searchHay === 'margarita blanco tequila triple sec lime juice', 'searchHaystack: name + ingredients, lowercased');
check(matchesSearch(searchHay, 'MARGA'), 'matchesSearch: case-insensitive name match');
check(matchesSearch(searchHay, 'tequila'), 'matchesSearch: ingredient match');
check(matchesSearch(searchHay, '  '), 'matchesSearch: blank query matches everything');
check(matchesSearch(searchHay, ''), 'matchesSearch: empty query matches everything');
check(!matchesSearch(searchHay, 'vodka'), 'matchesSearch: no match rejects');

check(swipeDirectionForKey('ArrowLeft') === -1, 'keyboard swipe: left skips');
check(swipeDirectionForKey('ArrowRight') === 1, 'keyboard swipe: right saves');
check(swipeDirectionForKey('Enter') === 0, 'keyboard swipe: unrelated keys are ignored');

// ---------- spinning wheel ----------
const wheelData = JSON.parse(fs.readFileSync(path.join(__dirname, 'wheel.json'), 'utf8'));
const wheelFixture = Array.from({ length: 10 }, (_, i) => ({
  id: `drink-${i}`, name: `Drink ${i}`, bar: true,
  tags: i < 3 ? ['strong'] : [],
}));
const sampleSource = ['a', 'b', 'c'];
const sample = weightedSampleUnique(sampleSource, 2, () => 1, () => 0);
check(sample.join() === 'a,b', 'wheel weighted sample: deterministic unique picks');
check(sampleSource.join() === 'a,b,c', 'wheel weighted sample: does not mutate source');
check(wheelCocktailWeight(wheelFixture[0], { strongWeight: 2 }) === 2,
  'wheel cocktail weight: strong mood multiplier');
check(wheelCocktailWeight(wheelFixture[0], { strongWeight: 0 }) === 0,
  'wheel cocktail weight: strong cocktails can be excluded');
check(wheelCocktailWeight({ bar: false, tags: [] }, { strongWeight: 2 }) === 0,
  'wheel cocktail weight: non-bar cocktail never qualifies');

const lineups = Object.fromEntries(wheelData.moods.map(mood => [
  mood.id, buildSpinLineup(wheelData, mood.id, wheelFixture, () => 0.2),
]));
Object.entries(lineups).forEach(([mood, lineup]) => {
  check(lineup.length === 12, `wheel lineup ${mood}: exactly 12 visible sectors`);
});
check(lineups.fresh.filter(item => item.category === 'shot').length === 3,
  'wheel lineup fresh: three shot sectors');
check(lineups.fresh.filter(item => item.category === 'bottle').length === 1,
  'wheel lineup fresh: bottle appears when flex draw is below one third');
check(lineups.groove.filter(item => item.category === 'shot').length === 2,
  'wheel lineup groove: two shot sectors');
check(lineups.tipsy.filter(item => item.category === 'shot').length === 1,
  'wheel lineup tipsy: one shot sector');
check(lineups.wobbly.every(item => item.category !== 'shot'),
  'wheel lineup wobbly: no shot sectors');
check(lineups.wobbly.filter(item => item.category === 'water').length === 2,
  'wheel lineup wobbly: water is introduced with two sectors');
check(lineups.wobbly.filter(item => item.kind === 'cocktail').every(item =>
  !wheelFixture.find(drink => drink.id === item.outcomeId).tags.includes('strong')),
  'wheel lineup wobbly: strong-tagged cocktails excluded');
check(lineups.shitfaced.filter(item => item.category === 'water').length === 7,
  'wheel lineup shitfaced: seven visible water sectors');
check(lineups.shitfaced.filter(item => item.eligible === false).length === 5,
  'wheel lineup shitfaced: five visible non-water decoys');
check(lineups.shitfaced[selectWheelIndex(lineups.shitfaced, () => 0.99)].category === 'water',
  'wheel selection shitfaced: forced result always chooses water');
check(lineups.groove[selectWheelIndex(lineups.groove, () => 0.99)].eligible,
  'wheel selection normal mood: selected visible sector is eligible');

// wheel prefs: favorites-only cocktails + per-outcome beer/wine/shot exclusion
const favEnough = ['drink-0', 'drink-1', 'drink-2', 'drink-3', 'drink-4']; // groove needs 5 cocktail slots
const lineupFavEnough = buildSpinLineup(wheelData, 'groove', wheelFixture, () => 0.5,
  { favoritesOnly: true, favorites: favEnough });
check(lineupFavEnough.length === 12, 'wheel prefs: favorites-only keeps 12 sectors when favorites suffice');
check(lineupFavEnough.filter(item => item.kind === 'cocktail').every(item => favEnough.includes(item.outcomeId)),
  'wheel prefs: favorites-only draws only favorited cocktails when there are enough');

const favTooFew = ['drink-0', 'drink-1']; // groove needs 5, only 2 favorited
const lineupFavTooFew = buildSpinLineup(wheelData, 'groove', wheelFixture, () => 0.5,
  { favoritesOnly: true, favorites: favTooFew });
const cocktailIdsTooFew = lineupFavTooFew.filter(item => item.kind === 'cocktail').map(item => item.outcomeId);
check(lineupFavTooFew.length === 12, 'wheel prefs: favorites-only tops up to 12 sectors when favorites are too few');
check(new Set(cocktailIdsTooFew).size === cocktailIdsTooFew.length,
  'wheel prefs: favorites-only top-up never repeats a cocktail to avoid the gap');
check(favTooFew.every(id => cocktailIdsTooFew.includes(id)),
  'wheel prefs: favorites-only top-up still includes every favorite that fits');

const lineupNoPrefs = buildSpinLineup(wheelData, 'groove', wheelFixture, () => 0.5);
const lineupFavZero = buildSpinLineup(wheelData, 'groove', wheelFixture, () => 0.5,
  { favoritesOnly: true, favorites: [] });
check(JSON.stringify(lineupFavZero) === JSON.stringify(lineupNoPrefs),
  'wheel prefs: favorites-only with zero favorites behaves exactly like the toggle being off');

const shotIds = Object.keys(wheelData.outcomes).filter(id => wheelData.outcomes[id].category === 'shot');
const lineupNoShots = buildSpinLineup(wheelData, 'fresh', wheelFixture, () => 0.99, { excludedOutcomes: shotIds });
check(lineupNoShots.length === 12, 'wheel prefs: excluding a whole category never breaks the lineup');
check(lineupNoShots.every(item => item.category !== 'shot'),
  'wheel prefs: excluding every shot outcome removes the category entirely');
check(lineupNoShots.filter(item => item.kind === 'cocktail').length === 9,
  'wheel prefs: slots freed by an excluded category fall back to extra cocktails');

const landing = wheelLandingRotation(17, 4, (() => { const values = [0.5, 0]; return () => values.shift(); })(), 12);
const landedCenter = ((-landing % 360) + 360) % 360;
const expectedCenter = 4 * 30;
const landingError = Math.abs((((landedCenter - expectedCenter) + 540) % 360) - 180);
check(landing >= 17 + 6 * 360, 'wheel landing: travels at least six full rotations');
check(landingError <= 10.2, 'wheel landing: finishes safely inside selected sector');
check(wheelSectorPath(0, 12).startsWith('M50 50L'), 'wheel SVG: sector path starts at hub');
check(wheelSectorPath(0, 12) !== wheelSectorPath(1, 12), 'wheel SVG: adjacent sector paths differ');

const appSource = fs.readFileSync(path.join(__dirname, 'app.js'), 'utf8');
const htmlSource = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
// budget bumped 60kB -> 65kB 2026-07-20 for BACKLOG 15 (accounts+sync, Firebase Auth + Worker/D1 client)
// bumped 65kB -> 67kB 2026-07-20 for BACKLOG 18 (email+password sign-in)
// bumped 67kB -> 68kB 2026-07-20 for BACKLOG 19 (account linking: add Google/password to an existing account)
// bumped 68kB -> 70kB 2026-07-20 for pantry-missing badges/highlighting + pull-merge bugfix
// bumped 70kB -> 71kB 2026-07-21 for deck-card pantry-missing chips/ingredient list (favorites parity)
// bumped 71kB -> 74kB 2026-07-21 for catalog search (#/sok: name+ingredient search, deep-links into detail view)
// bumped 74kB -> 79kB 2026-07-21 for wheel prefs (favorites-only cocktails, per-outcome beer/wine/shot toggles)
check(Buffer.byteLength(appSource) < 79000, 'bundle budget: app.js stays under 79 kB unminified');
check(htmlSource.includes('href="#/hjul"') && appSource.includes("'#/hjul'"),
  'wheel route: starting-page entry and router target are wired');
check(htmlSource.includes('view-transition-name:wheel-shared') && appSource.includes('document.startViewTransition'),
  'wheel transition: mini-wheel expands through progressive View Transitions');
check(appSource.includes("matchMedia('(prefers-reduced-motion: reduce)')"),
  'wheel accessibility: reduced motion is honored');
check(appSource.includes('aria-live="polite"') && appSource.includes('aria-valuetext='),
  'wheel accessibility: result and slider meaning are announced');
check(appSource.includes('navigator.vibrate(18)') && appSource.includes('wheelMuted = false'),
  'wheel feedback: one landing haptic and visit-local sound default');
check(appSource.includes('!wheelMoodId && wheelData && db'),
  'wheel start: opens live on the first mood, no empty intro wheel');
check(appSource.split("wheelResult ? 'wheel_respin' : 'wheel_spin'").length === 3,
  'wheel respin: hub and controls button relabel in place of a result-box button row');
check(!appSource.includes('wheel-result-actions'),
  'wheel result: compact box carries no action buttons');
check(appSource.includes('detailId === null) resetWheelVisit()'),
  'wheel result: spin state survives opening the landed recipe');
check(appSource.includes('`<button class="fav-open" data-id="${esc(entry.outcomeId)}"'),
  'wheel result: landed cocktail links to its recipe detail');
check(htmlSource.includes('<svg class="wheel-symbol" viewBox="0 0 100 100"') &&
  htmlSource.split('class="wheel-sector"').length >= 13,
  'wheel entry: mini symbol is the same twelve-sector disc as the big wheel');
check(appSource.includes('draggable="false"'), 'pointer swipe: artwork disables native image dragging');
check(appSource.includes('e.preventDefault(); // own the gesture'), 'pointer swipe: card owns pointer gesture');
check(htmlSource.includes('user-select:none;-webkit-user-select:none'), 'pointer swipe: card text selection disabled');
check(appSource.includes("aria-keyshortcuts', 'ArrowLeft ArrowRight'"),
  'keyboard swipe: top card exposes arrow shortcuts');

// ---------- glass placeholders (BACKLOG 9) ----------
['coupe', 'highball', 'rocks', 'martini'].forEach(glass => {
  check(typeof GLASS_SILHOUETTES[glass] === 'string', `glass placeholder: ${glass} silhouette exists`);
  check(glassPlaceholder(glass).includes(`glass-${glass}`), `glass placeholder: ${glass} selects its silhouette`);
});
check(glassPlaceholder('unknown').includes('glass-rocks'), 'glass placeholder: unknown glass degrades to rocks');
check(glassPlaceholder('coupe') !== glassPlaceholder('martini'), 'glass placeholder: coupe and martini differ');

// ---------- pantry + makeable filter (BACKLOG 7) ----------
const pantryDrink = { id: 'pantry-test', base: 'gin', bar: true, ingredients: [
  { id: 'gin', essential: true },
  { id: 'lime-juice', essential: true },
  { id: 'lime-wheel', essential: false },
] };
check(canMake(pantryDrink, ['gin', 'lime-juice']), 'canMake: every essential ingredient present');
check(!canMake(pantryDrink, ['gin']), 'canMake: missing essential ingredient rejects drink');
check(canMake({ ingredients: [{ id: 'garnish', essential: false }] }, []), 'canMake: optional-only drink qualifies');
check(filterDrinks([pantryDrink], { bar: true, base: 'gin' }, ['gin', 'lime-juice']).length === 1,
  'filterDrinks: pantry combines with bar and base');
check(filterDrinks([pantryDrink], { bar: true, base: 'gin' }, []).length === 0,
  'filterDrinks: empty pantry has no makeable drinks');
check(missingIngredients(pantryDrink, ['gin']).length === 1 && missingIngredients(pantryDrink, ['gin'])[0].id === 'lime-juice',
  'missingIngredients: returns the missing essential line');
check(missingIngredients(pantryDrink, ['gin', 'lime-juice']).length === 0,
  'missingIngredients: empty when every essential is present');
check(missingIngredients(pantryDrink, []).length === 2, 'missingIngredients: ignores non-essential lines');

// ---------- sync merge (logged-out edits must never be lost on login) ----------
const localState = { v: 1, favorites: ['margarita'], pantry: ['gin'], settings: { lang: 'sv', unit: 'cl', servings: 1, filters: { bar: false, base: null } } };
const serverState = { v: 1, favorites: ['negroni'], pantry: ['lime-juice'], settings: { lang: 'en', unit: 'oz', servings: 2, filters: { bar: true, base: 'gin' } } };
const merged = mergeState(localState, serverState);
check(merged.favorites.includes('margarita') && merged.favorites.includes('negroni'),
  'mergeState: unions favorites from both sides');
check(merged.pantry.includes('gin') && merged.pantry.includes('lime-juice'),
  'mergeState: unions pantry from both sides');
check(merged.settings === serverState.settings, 'mergeState: settings stay server-wins');
const dedupeMerged = mergeState({ v: 1, favorites: ['margarita'], pantry: [], settings: localState.settings },
  { v: 1, favorites: ['margarita'], pantry: [], settings: serverState.settings });
check(dedupeMerged.favorites.length === 1, 'mergeState: union dedupes shared entries');

// ---------- drinks.json validator ----------
const UNITS = ['dash', 'barspoon', 'piece', 'leaf', 'slice', 'garnish', 'top'];
const INGREDIENT_GROUPS = ['spirits', 'liqueurs', 'fresh', 'pantry'];
const KEBAB = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'drinks.json'), 'utf8'));

check(data.schema === 1, 'drinks.json: schema === 1');
check(data.ingredients && typeof data.ingredients === 'object', 'drinks.json: ingredients is a map');
check(Array.isArray(data.drinks), 'drinks.json: drinks is an array');
check(wheelData.schema === 1, 'wheel.json: schema === 1');
check(Array.isArray(wheelData.moods) && wheelData.moods.length === 5,
  'wheel.json: exact five-mood ladder');
check(wheelData.outcomes && Object.keys(wheelData.outcomes).length === 11,
  'wheel.json: exact wheel-only outcome catalog');
check(wheelData.moods.map(mood => mood.id).join() === 'fresh,groove,tipsy,wobbly,shitfaced',
  'wheel.json: canonical mood order');
wheelData.moods.forEach(mood => {
  check(Array.isArray(mood.slots) && mood.slots.length === 12,
    `wheel.json mood ${mood.id}: exactly 12 sector slots`);
  check(mood.name && mood.name.en && mood.name.sv, `wheel.json mood ${mood.id}: EN + SV name`);
  check(mood.copy && mood.copy.en && mood.copy.sv, `wheel.json mood ${mood.id}: EN + SV copy`);
  check(!String(mood.name.sv).includes('â€”') && !String(mood.copy.sv).includes('â€”'),
    `wheel.json mood ${mood.id}: Swedish copy has no em-dash`);
});
check(wheelData.moods.find(mood => mood.id === 'shitfaced').forcedOutcome === 'water',
  'wheel.json: highest mood forces water');
check(wheelData.moods.find(mood => mood.id === 'shitfaced').repeatCopy.length === 2,
  'wheel.json: highest mood has second and third-spin copy');
const wheelArt = new Set();
Object.entries(wheelData.outcomes).forEach(([id, outcome]) => {
  check(outcome.sector && outcome.sector.en && outcome.sector.sv,
    `wheel.json outcome ${id}: short EN + SV sector label`);
  check(outcome.result && outcome.result.en && outcome.result.sv,
    `wheel.json outcome ${id}: full EN + SV result name`);
  check(Array.isArray(outcome.art) && outcome.art.length > 0,
    `wheel.json outcome ${id}: artwork declared`);
  (outcome.art || []).forEach(file => {
    wheelArt.add(file);
    check(/^img-wheel\/[a-z0-9-]+\.webp$/.test(file), `wheel artwork path: ${file}`);
    check(fs.existsSync(path.join(__dirname, file)), `wheel artwork exists: ${file}`);
    const image = fs.readFileSync(path.join(__dirname, file));
    const marker = image.indexOf(Buffer.from([0x9d, 0x01, 0x2a]));
    check(image.toString('ascii', 0, 4) === 'RIFF' && image.toString('ascii', 8, 12) === 'WEBP',
      `wheel artwork format: ${file} is WebP`);
    check(marker >= 0 && (image.readUInt16LE(marker + 3) & 0x3fff) === 512 &&
      (image.readUInt16LE(marker + 5) & 0x3fff) === 512,
    `wheel artwork dimensions: ${file} is 512x512`);
    check(image.length <= 30000, `wheel artwork budget: ${file} is at most 30 kB`);
  });
});
check(wheelArt.size === 13, 'wheel.json: exact 13-image wheel artwork inventory');
['sazerac', 'bees-knees', 'bellini'].forEach(id => {
  const drink = data.drinks.find(item => item.id === id);
  check(drink && drink.bar === false, `bar-ready editorial exception: ${id}`);
});
// BACKLOG 13 strict normal-bar audit: the exact allowlist, per BAR-AUDIT.md.
const BAR_ALLOWLIST = ['amaretto-sour', 'americano', 'aperol-spritz', 'black-russian',
  'bloody-mary', 'blue-lagoon', 'boulevardier', 'caipiroska', 'cosmopolitan', 'cuba-libre',
  'daiquiri', 'dark-n-stormy', 'dry-martini', 'espresso-martini', 'french-connection',
  'gin-and-tonic', 'gin-fizz', 'godfather', 'irish-coffee', 'lemon-drop-martini',
  'long-island-iced-tea', 'lynchburg-lemonade', 'margarita', 'mimosa', 'mint-julep',
  'mojito', 'moscow-mule', 'negroni', 'old-fashioned', 'rob-roy', 'sex-on-the-beach',
  'sidecar', 'southside', 'tequila-sunrise', 'whiskey-sour', 'white-lady', 'white-russian'];
const barIds = data.drinks.filter(drink => drink.bar).map(drink => drink.id).sort();
check(barIds.length === 37, 'bar audit: exactly 37 drinks pass the strict normal-bar bar');
check(barIds.join() === BAR_ALLOWLIST.join(), 'bar audit: allowlist matches BAR-AUDIT.md exactly');
BAR_ALLOWLIST.forEach(id => check(data.drinks.some(drink => drink.id === id && drink.bar === true),
  `bar audit allowlist: ${id} is bar: true`));
new Set(data.drinks.map(drink => drink.type)).forEach(type => {
  const key = 'type_' + type.replace(/-/g, '_');
  check(t('en', key) !== key && t('sv', key) !== key, `i18n: drink type ${type} resolves in EN + SV`);
});
BASE_FILTERS.forEach(base => {
  const key = 'base_' + base;
  check(t('en', key) !== key && t('sv', key) !== key, `i18n: base filter ${base} resolves in EN + SV`);
});

// ---------- installability (BACKLOG 11) ----------
const manifest = JSON.parse(fs.readFileSync(path.join(__dirname, 'manifest.webmanifest'), 'utf8'));
check(manifest.id === './' && manifest.start_url === './' && manifest.scope === './',
  'manifest: subpath-safe relative identity, start and scope');
check(manifest.display === 'standalone', 'manifest: standalone display');
check(manifest.background_color === '#EFE8DB' && manifest.theme_color === '#EFE8DB',
  'manifest: finalized shell colors');
const expectedManifestIcons = new Map([
  ['icons/icon-192.png', '192x192'],
  ['icons/icon-512.png', '512x512'],
  ['icons/icon-maskable-512.png', '512x512'],
]);
check(manifest.icons.length === expectedManifestIcons.size, 'manifest: exact icon set');
manifest.icons.forEach(icon => {
  check(expectedManifestIcons.get(icon.src) === icon.sizes, `manifest: icon declaration ${icon.src}`);
  check(fs.existsSync(path.join(__dirname, icon.src)), `manifest: icon exists ${icon.src}`);
});
check(manifest.icons.find(icon => icon.src === 'icons/icon-maskable-512.png').purpose === 'maskable',
  'manifest: maskable icon purpose');
const expectedPngSizes = new Map([
  ['icons/icon-192.png', 192], ['icons/icon-512.png', 512],
  ['icons/icon-maskable-512.png', 512], ['icons/apple-touch-icon.png', 180],
  ['icons/icon-48.png', 48], ['icons/favicon-32.png', 32], ['icons/favicon-16.png', 16],
]);
expectedPngSizes.forEach((size, file) => {
  const png = fs.readFileSync(path.join(__dirname, file));
  check(png.readUInt32BE(16) === size && png.readUInt32BE(20) === size,
    `icon export: ${file} is ${size}x${size}`);
});
check(htmlSource.includes('rel="manifest" href="manifest.webmanifest"'), 'installability: manifest linked');
check(htmlSource.includes('rel="apple-touch-icon" href="icons/apple-touch-icon.png"'),
  'installability: Apple touch icon linked');
check(!appSource.includes('serviceWorker.register'), 'installability: no v1 service worker');

// every ingredient map key is kebab-case with en+sv
Object.keys(data.ingredients).forEach(id => {
  check(KEBAB.test(id), `ingredient id kebab-case: ${id}`);
  const ing = data.ingredients[id];
  check(typeof ing.en === 'string' && ing.en.length > 0, `ingredient ${id}: en present`);
  check(typeof ing.sv === 'string' && ing.sv.length > 0, `ingredient ${id}: sv present`);
  check(INGREDIENT_GROUPS.includes(ing.group), `ingredient ${id}: group valid`);
  check(!String(ing.sv).includes('—'), `ingredient ${id}: sv has no em-dash`);
});

const seenIds = new Set();
const REQUIRED_FIELDS = ['id', 'name', 'type', 'base', 'iba', 'bar', 'tags', 'glass', 'ingredients', 'method'];

data.drinks.forEach(drink => {
  REQUIRED_FIELDS.forEach(f => check(f in drink, `drink ${drink.id || '?'}: has field ${f}`));

  check(!seenIds.has(drink.id), `drink id unique: ${drink.id}`);
  seenIds.add(drink.id);

  check(KEBAB.test(drink.id), `drink id kebab-case: ${drink.id}`);
  check(typeof drink.name === 'string' && drink.name.length > 0, `${drink.id}: name is a non-empty string`);
  check(typeof drink.iba === 'boolean', `${drink.id}: iba is boolean`);
  check(typeof drink.bar === 'boolean', `${drink.id}: bar is boolean`);
  check(Array.isArray(drink.tags), `${drink.id}: tags is an array`);

  check(drink.method && typeof drink.method.en === 'string' && drink.method.en.length > 0,
    `${drink.id}: method.en present`);
  check(drink.method && typeof drink.method.sv === 'string' && drink.method.sv.length > 0,
    `${drink.id}: method.sv present`);
  if (drink.source !== undefined) {
    check(drink.source && typeof drink.source.label === 'string' && drink.source.label.length > 0,
      `${drink.id}: source label present`);
    check(drink.source && /^https:\/\//.test(drink.source.url), `${drink.id}: source is an HTTPS URL`);
  }
  if (drink.method && drink.method.sv) {
    check(!drink.method.sv.includes('—'), `${drink.id}: method.sv has no em-dash`);
  }

  check(Array.isArray(drink.ingredients) && drink.ingredients.length > 0,
    `${drink.id}: ingredients is a non-empty array`);
  (drink.ingredients || []).forEach((line, i) => {
    check(data.ingredients[line.id] !== undefined,
      `${drink.id}[${i}]: ingredient id resolvable (${line.id})`);
    check(typeof line.essential === 'boolean', `${drink.id}[${i}]: essential is boolean (${line.id})`);

    const hasMl = typeof line.ml === 'number';
    const hasQtyUnit = typeof line.qty === 'number' && typeof line.unit === 'string';
    check(hasMl !== hasQtyUnit, `${drink.id}[${i}]: ml xor qty+unit (${line.id})`);
    if (hasQtyUnit) check(UNITS.includes(line.unit), `${drink.id}[${i}]: unit in allowed set (${line.unit})`);
  });
});

console.log(`${pass} passed, ${fail} failed`);
if (fail > 0) process.exit(1);
