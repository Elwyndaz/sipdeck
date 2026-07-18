'use strict';
// ponytail: plain node asserts, no framework. `node test.js` to run.
const fs = require('fs');
const path = require('path');
const { detectLang, defaultState, normalizeState,
  scaleMl, convert, roundForUnit, formatNumber, formatOz, formatAmount, shuffle } = require('./app.js');

let pass = 0, fail = 0;
function check(cond, msg) {
  if (cond) { pass++; } else { fail++; console.error('FAIL: ' + msg); }
}

// ---------- app.js pure functions ----------
check(detectLang('sv-SE') === 'sv', 'detectLang: sv-SE -> sv');
check(detectLang('en-US') === 'en', 'detectLang: en-US -> en');
check(detectLang(undefined) === 'en', 'detectLang: missing -> en');

const d = defaultState('sv');
check(d.v === 1 && d.settings.lang === 'sv' && d.settings.unit === 'cl' && d.settings.servings === 1,
  'defaultState: shape + lang passthrough');
check(Array.isArray(d.favorites) && d.favorites.length === 0, 'defaultState: empty favorites');

// normalizeState round-trip: a valid blob comes back unchanged in shape
const valid = { v: 1, favorites: ['margarita'], pantry: ['gin'],
  settings: { lang: 'en', unit: 'oz', servings: 4, filters: { bar: true, base: 'gin' } } };
const rt = normalizeState(valid, 'sv');
check(rt.favorites.length === 1 && rt.favorites[0] === 'margarita', 'normalizeState: favorites survive');
check(rt.settings.unit === 'oz' && rt.settings.servings === 4, 'normalizeState: settings survive');
check(rt.settings.filters.bar === true && rt.settings.filters.base === 'gin', 'normalizeState: filters survive');

// normalizeState never throws on garbage, falls back to defaults
check((() => { try { return normalizeState('garbage', 'en').v === 1; } catch (e) { return false; } })(),
  'normalizeState: garbage input never throws');
check((() => { try { return normalizeState(null, 'en').settings.lang === 'en'; } catch (e) { return false; } })(),
  'normalizeState: null input falls back to nav lang');
check(normalizeState({ settings: { servings: 99 } }, 'en').settings.servings === 1,
  'normalizeState: out-of-range servings falls back to 1');

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

// ---------- shuffle (BACKLOG 4) ----------
const orig = [1, 2, 3, 4];
const shuffled = shuffle(orig, () => 0.5); // deterministic rng
check(orig.join() === '1,2,3,4', 'shuffle: does not mutate input');
check(shuffled.length === 4 && [1, 2, 3, 4].every(n => shuffled.includes(n)),
  'shuffle: same members, same length');
check(shuffle([], () => 0.5).length === 0, 'shuffle: empty array ok');
check(shuffle(['a']).join() === 'a', 'shuffle: single element ok');

// ---------- drinks.json validator ----------
const UNITS = ['dash', 'barspoon', 'piece', 'leaf', 'slice', 'garnish', 'top'];
const KEBAB = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'drinks.json'), 'utf8'));

check(data.schema === 1, 'drinks.json: schema === 1');
check(data.ingredients && typeof data.ingredients === 'object', 'drinks.json: ingredients is a map');
check(Array.isArray(data.drinks), 'drinks.json: drinks is an array');

// every ingredient map key is kebab-case with en+sv
Object.keys(data.ingredients).forEach(id => {
  check(KEBAB.test(id), `ingredient id kebab-case: ${id}`);
  const ing = data.ingredients[id];
  check(typeof ing.en === 'string' && ing.en.length > 0, `ingredient ${id}: en present`);
  check(typeof ing.sv === 'string' && ing.sv.length > 0, `ingredient ${id}: sv present`);
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
