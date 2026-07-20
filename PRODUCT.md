# Sipdeck — product

Browse cocktails as a swipeable card deck. Card front: drawn illustration, name, type,
ingredient-name tags. Tap flips to the full recipe. Swipe right saves, swipe left skips
(back of deck, nothing is ever permanently dismissed). The deck is a shuffle of every
drink passing the active filters.

**Name: Sipdeck** (locked 2026-07-18, revised same day from Drinkr). Tagline: *"Swipe.
Save. Shake."* Brand tone: stylish, dry, slightly playful. Full visual identity is
finalized — see "Visual identity" below and `design/`. Domain/app-store/trademark check
is the user's own to-do before going public.

## Vision

The fastest, best-feeling way to answer "what should we drink tonight?" — at home or to
order at a bar. Discovery feels like play (dealing cards), not like search (forms and
lists). Personal + friends first, but every decision assumes it goes public later.

## Target users

- **Patrik + friends** (v1): browsing at home ("what can I make with what I have?") and
  out ("what can I reliably order at a normal bar?"). Swedish/English speakers, mobile-first.
- **Public later**: same product, no pivot needed — accounts are additive sync only.

## Design principles (hard requirements)

1. **Buttery**: 60 fps swipe/flip on a mid-range phone. Physics feel > feature count.
2. **Fast**: images are the only heavy asset. Single small app.js, no framework, no build.
3. **YAGNI**: platform features over libraries; fewest possible moving parts.
4. **Logged-out is the product**: everything works from localStorage. An account (v1.1)
   only adds cross-device sync.

## Locked decisions

- **Stack**: vanilla JS + CSS + HTML. No build, no dependencies. Pure functions at the top
  of `app.js`, exported for `test.js` (plain `node test.js` asserts, recept pattern).
  Coarse re-render per view on state change; the card stack is the only imperative-DOM zone.
- **Hosting**: Cloudflare Pages, direct upload (`npx wrangler pages deploy .`). Custom
  domain deferred until the name is final.
- **Accounts**: **v1.1**, not v1. Recept pattern, minimal cut: Firebase Auth (identity
  only) + Cloudflare Worker + D1, table `users(id, firebase_uid UNIQUE, state)`, endpoints
  `GET /state`, `PUT /state` (debounced client-side), `DELETE /account`. Last-write-wins.
  v1's obligation: keep client state one sync-shaped blob (below).
- **Data**: own `drinks.json`, ~80–100 drinks seeded from the IBA official list + modern
  classics. Canonical amounts in **ml**. Every ingredient has a normalized id
  (`lime-juice`) and an `essential` flag (garnish/optional = false).
- **Units**: toggle cl / ml / oz, default **cl**, persisted. Bar rounding after scaling:
  oz to nearest ¼, cl to 0,5, ml to 5. Dashes/barspoons/counts scale but never convert.
  Serving stepper 1–8, linear scaling.
- **Filters v1**: editorial boolean `bar` ("reliably servable at a normal, non-specialist
  bar"; IBA is not sufficient evidence) + base-spirit filter. Richer tags (style, strength,
  alcohol-free) live in the data now, get UI later.
- **Pantry is in v1**: ingredient checklist + "what can I make" (essential-ingredient ids
  ⊆ pantry; non-essential ignored).
- **i18n**: EN + SV string table from day 1. Swedish: decimal comma, space as thousands
  separator, never an em-dash.
- **Images**: AI-generated drawn-style sketches from the frozen HANDOFF.md workflow.
  Codex built-in `gpt-image-2` generates one drink at a time using the approved first
  images as style-only references; production filename = `img/<drink-id>.webp`.
  Lazy-load only the top 3–4 cards. SVG placeholder until an image exists.
- **Spinning wheel**: a starting-page "Pick for me" / "Välj åt mig" entry opens the
  full-screen `#/hjul` individual order chooser. Its five-step drunkenness slider is
  visit-local, never persisted. The wheel always shows exactly 12 honest sectors;
  lower levels favor stronger choices, level 4 removes shots and adds water/Red Bull,
  and level 5 visibly has seven water sectors and is hard-coded to land on water.
  Vocabulary is "spinning wheel", never roulette; avoid casino visual language.

## Visual identity (locked 2026-07-18)

Full deliverable from the Claude design session lives in `design/` (`README.md` there
maps every file to its use; `identity-full.html` is the complete archived rationale).
Concept: **"the garnished deck"** — a quiet monoline frame finished with one drop of
color. Baked-in specifics:

- **Wordmark** (`design/wordmark.svg`): hand-drawn-feeling monoline lowercase, same
  stroke weight as the card illustrations; the dot of the *i* is the one fixed accent.
- **App icon** (`design/icon.svg`, `icon-48.svg`, `favicon.svg`): a recipe card tilted
  mid-swipe with a thin-line coupe glass on its face — three purpose-built size variants,
  not one mark rescaled (the card drops out entirely below 48px).
- **Color** (`design/tokens.css`): paper bg `#EFE8DB` / card `#FBF7EF` (cards are always
  this color, light or dark theme — the illustrations are painted on that paper) / ink
  `#211B12` / accent (vermouth green) `#2F6B3F`, doubling as the **save** gesture color /
  skip (muted brick red) `#A03B2E` — gesture feedback only, never reused for errors. Dark mode
  is in scope, activates automatically via `prefers-color-scheme` (no manual toggle in
  v1 — YAGNI). All pairs verified WCAG AA or better.
- **Typography**: **Instrument Serif** (400 + italic) for drink names and screen titles
  only; **Work Sans** (400/500/600) for everything else, with `lining-nums tabular-nums`
  forced on every amount display. Two families total — inside the H1 budget below.
- **Motion**: deck moves on `transform`/`opacity` only. Spring-back
  (`--sd-ease-spring`, 420ms) is the one place overshoot is allowed; fly-off
  (`--sd-ease-fly`, 320ms) never fades, it leaves the screen; flip
  (`--sd-ease-flip`, 480ms) must land dead, like a real card on felt; tint the dragged
  card's edge with save/skip color past 30% of the commit threshold, before release.
  Exact curves in `design/tokens.css`. This is the concrete spec for Epic A/B's "buttery"
  requirement — implement against these values, don't reinvent them.
- **Usage rules**: no color fill in the wordmark/icon strokes (ink draws, green
  garnishes); no playing-card iconography anywhere (suits, pips, dealer language); cards
  never tinted or theme-inverted; Instrument Serif never for body/buttons/tags/amounts.

## State (sync-shaped from day 1)

One object, one localStorage key (`sipdeck`):

```json
{ "v": 1,
  "favorites": ["margarita"],
  "pantry": ["tequila-blanco", "lime-juice"],
  "settings": { "lang": "sv", "unit": "cl", "servings": 1,
                "filters": { "bar": false, "base": null } } }
```

This exact blob is what `PUT /state` will carry in v1.1. Never store derived data in it.

## drinks.json schema

```json
{ "schema": 1,
  "ingredients": { "lime-juice": { "en": "Lime juice", "sv": "Limejuice",
                                      "group": "fresh" } },
  "drinks": [ {
    "id": "margarita",
    "name": "Margarita",
    "type": "sour",
    "base": "tequila",
    "iba": true,
    "bar": true,
    "tags": ["citrusy", "strong"],
    "glass": "coupe",
    "source": { "label": "IBA", "url": "https://iba-world.com/iba-cocktail/margarita/" },
    "ingredients": [
      { "id": "tequila-blanco", "ml": 50, "essential": true },
      { "id": "triple-sec",     "ml": 20, "essential": true },
      { "id": "lime-juice",     "ml": 15, "essential": true },
      { "id": "salt-rim", "qty": 1, "unit": "garnish", "essential": false } ],
    "method": { "en": "Shake with ice, strain into a chilled coupe.",
                "sv": "Skaka med is, sila i ett kylt coupeglas." } } ] }
```

- An ingredient line has **either** `ml` (number, canonical) **or** `qty` + `unit`
  (`dash`, `barspoon`, `piece`, `leaf`, `slice`, `garnish`, `top` — never converted).
- Ingredient metadata has `en`, `sv` and pantry `group`; group is one of `spirits`,
  `liqueurs`, `fresh`, `pantry` and drives the grouped checklist.
- `name` is a string (cocktail names are proper nouns); allow `{en, sv}` object override
  for the rare translated name. `type`, `base`, `glass`, `tags`, `unit` are ids resolved
  through the string table.
- `source` is optional for genuinely original/house recipes. When present it contains a
  short source label and an HTTPS link to the specific published recipe; favorite detail
  renders it as a small link after the method.
- `essential` is explicit on every line (validator enforces).

## User stories & acceptance criteria

### Epic A — Deck & swiping (the soul of the app)

**A1. As a browser, I want drinks dealt as a card stack so that discovery feels like play.**
- Deck = shuffled set of drinks passing active filters; top card fully visible, 2–3 cards
  peeking behind with depth (scale/offset).
- Card front: illustration, name, type, ingredient-name tags — **no amounts**.
- Only the top ~4 cards exist in the DOM; the rest are a queue of ids.
- 60 fps drag on a mid-range phone: transform/opacity only, `will-change` on the active
  card, no layout thrash during drag.
- Reshuffle happens on filter change or deck exhaustion — never on skip.

**A2. As a browser, I want swipe left = skip without loss so that I can always come back.**
- Left swipe past threshold (~35 % of card width, or a velocity flick) animates the card
  off-screen and requeues it at the **back** of the deck. No permanent dismiss exists.
- Below threshold: card springs back with damped easing.
- Native image dragging and text selection never steal the card gesture. Arrow Left invokes
  the same skip path for keyboard users.

**A3. As a browser, I want swipe right = save so that keeping a drink is one gesture.**
- Right swipe saves to `favorites` (idempotent), animates off with a brief save cue, and
  removes the card from the current deck cycle.
- When every card has been right-swiped, the deck reshuffles the full filtered set.
- Arrow Right invokes the same save path; focus follows the promoted live card.

**A4. As a browser, I want tap to flip the card so that the recipe is one touch away.**
- Tap (movement < ~10 px, so drags never misfire) flips with a 3D rotateY;
  `backface-visibility` back face shows the recipe. Tap flips back. Swiping works from
  either face; stepper/toggle controls are dead zones.
- Flip state resets when the card leaves the top of the deck.

### Epic B — Recipe (card back)

**B1. As a maker, I want full ingredients with amounts + method so that I can mix it.**
- All ingredient lines with amounts in the active unit; garnish/optional lines visually
  secondary. Method text in the active language.

**B2. As a maker, I want a serving stepper so that I can mix for the group.**
- Stepper 1–8, linear scaling from canonical ml, rounding applied **after** scaling.
- Dash/barspoon/count amounts scale linearly (2 dashes × 3 = 6 dashes), never convert.
- Chosen serving count persists in `settings.servings`.

**B3. As a user, I want a cl/ml/oz toggle so that amounts match how I measure.**
- Default cl; persisted in `settings.unit`; rounding: oz → nearest ¼ (vulgar-fraction
  display: 1½ oz), cl → 0,5, ml → 5. Swedish locale renders decimal comma.

### Epic C — Favorites

**C1. As a returning user, I want my saved drinks in a list so that I can find them fast.**
- Favorites view lists saved drinks (art thumbnail, name, type); tap opens a continuous,
  swipe-free detail with the illustrated front followed by the full recipe, so no second
  flip is needed. Ingredient rows can be checked off while mixing and the scaled recipe
  can be copied as readable text. Explicit un-favorite control. Favorites survive reload
  (localStorage); mixing checkmarks are deliberately transient. A favorite detail has its
  own history entry, so browser or mobile Back returns to the favorite list first.
  Published recipes show a small direct source link after the method; original or house
  recipes may omit it.

### Epic D — Filters

**D1. As an orderer, I want a "reliably servable at a normal bar" filter so that the deck
matches where I am.**
- Toggle drives the editorial `bar` flag. Deck rebuilds + reshuffles on change; a count of
  matching drinks is visible; state persists in `settings.filters`.
- A drink is `bar: true` only when every essential ingredient is likely to be stocked or
  routinely prepared by an ordinary, non-specialist bar. Cocktail-bar availability and IBA
  status are not enough; one doubtful required ingredient makes the drink `bar: false`.

**D2. As a browser, I want to filter by base spirit so that the deck matches my mood.**
- Single-select base spirit (gin, vodka, rum, tequila, whiskey, brandy, none/other…),
  combinable with D1. Empty result set shows a friendly empty state, never a dead app.

### Epic E — Pantry ("what can I make")

**E1. As a home bartender, I want to check off what I have so that the app knows my shelf.**
- Pantry view: all ingredient ids used by any drink, grouped (spirits / liqueurs / fresh /
  pantry…), checkbox each, persisted in `pantry`.

**E2. As a home bartender, I want a "what can I make" filter so that the deck shows only
mixable drinks.**
- A drink qualifies iff every `essential: true` ingredient id is in the pantry;
  non-essential ignored. Combinable with D1/D2; shows match count.

### Epic F — i18n

**F1. As a Swedish or English speaker, I want the app in my language.**
- Language toggle EN/SV, default from `navigator.language` (sv* → sv, else en), persisted.
- All UI strings from one string table; drink `method` from drinks.json per language.
- Swedish output: decimal comma, space thousands separator, no em-dashes anywhere.

### Epic G — Images & pipeline

**G1. As the curator, I want a repeatable image pipeline so that ~90 images stay consistent.**
- One documented style prompt and approved reference set (HANDOFF.md) used for every
  one-drink `gpt-image-2` generation; filename = drink id; conversion step to WebP
  (target ≤ 80 kB at ~640×800); `img/<id>.webp`.
- Cards lazy-load images for the top 3–4 cards only; a styled inline-SVG placeholder
  (glass silhouette by `glass` type) renders until the image loads or when none exists.
- Missing images never break layout or animation.

### Epic H — Platform & performance

**H1. As a mobile user, I want the app installable and instant.**
- PWA manifest with **relative** paths (recept lesson), icons, standalone display.
  No service worker in v1.
- Budget: app.js single file, target < 60 kB unminified; no fonts > 2 families; deck
  interactive < 1 s on repeat visit, < 2,5 s first visit on 4G mid-range phone.

### Epic I — Accounts (v1.1, spec'd now, built later)

**I1. As a multi-device user, I want optional login so that favorites/pantry follow me.**
- Firebase Auth (email+password and/or Google), identity only. Logged-out = full app.
- Whole-state blob PUT (debounced ~800 ms) to Worker + D1; on login/load server state wins
  if present, else local uploads. Last-write-wins. `DELETE /account` = GDPR wipe.

### Epic J — Spinning wheel

**J1. As an individual orderer, I want a polished wheel to choose my next normal bar order.**
- The starting-page mini-wheel expands into a full-screen route with a graceful fallback
  when View Transitions are unavailable. A required five-step EN/SV mood slider builds a
  12-sector lineup from current `bar: true` cocktails and the wheel-only catalog.
- Every normal spin preselects one eligible visible sector and animates that exact sector
  to the pointer in 5–6 seconds. The highest level may show non-water decoys but only its
  seven visible water sectors are eligible. Re-spin keeps the lineup; New wheel rebuilds it.
- Sound starts on for each wheel visit and has a visible mute control. Ticks, one landing
  haptic and the result card progressively enhance the tactile feel. Reduced motion skips
  rotation and reveals the result quickly. Results/history do not persist or change the
  exact `sipdeck` localStorage blob.
- Wheel-only art is committed as 512×512 WebP under `img-wheel/`; reusable portrait PNG
  masters and 640×800 card-ready variants remain local under gitignored `img-src/`.

## Non-goals (v1)

No UGC/moderation (all content is curated JSON), no search box, no richer tag filter UI,
no service worker, no custom domain, no accounts, no drink editor. (Deep links shipped in
v1.1, BACKLOG 16.)
