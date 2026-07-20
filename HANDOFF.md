# Handoff: Sipdeck

Read this first, then PRODUCT.md (what to build + acceptance criteria), then BACKLOG.md
(what's next). Written for AI agent sessions picking this up cold.

## Current state in one paragraph

**v1 (BACKLOG 1–14) closed 2026-07-19. v1.1 BACKLOG 16 (deep links) done 2026-07-20;
BACKLOG 15 (accounts + sync) is next and last for v1.1.** `#/drink/<id>` now opens any
drink's continuous illustrated detail directly (reuses the favorite-detail view/state,
see implementation notes below), with a Save/Remove-favorite toggle and a Back that
returns to the deck rather than the favorites list. Verified in a Playwright phone
viewport (390×760) against local HTTP: direct load of a valid id, saving from the
deep-link view, list pickup, Back-to-deck fallback, and an invalid id degrading
gracefully to the favorites list — all with zero console errors. `app.js` is 59,995
bytes (still under the 60 kB budget; the budget is tight, watch it on the next change).
`node test.js`: 4,308 checks green (5 new deep-link tests). Previous paragraph, superseded
below in "v1 close-out", kept for history:

**BACKLOG items 1–12 done; item 13 next; item 14 partially verified** (updated 2026-07-19).
The approved 92-drink/123-ingredient seed and complete card artwork remain intact. Sipdeck
now has a localized, full-screen `#/hjul` spinning wheel opened by the starting-page "Pick
for me" / "Välj åt mig" mini-wheel. Its five required visit-local moods build exactly 12
visible sectors, use the current `bar: true` cocktail pool plus normal simple orders, and
apply the locked strength/water progression. Shitfaced/Kanon visibly has seven water sectors,
five non-water decoys and is guaranteed to land on water, with progressively firmer repeat
copy. Re-spin keeps the lineup; New wheel replaces it. Sound/mute, ticking, one landing
haptic, reduced-motion behavior and exact outcome geometry are implemented without changing
the persisted `sipdeck` blob. Thirteen new 512×512 production illustrations are committed;
their portrait masters and card-ready variants remain local under gitignored `img-src/`.
`test.js`: 4258 checks green; `app.js` remains below 60 kB. Local HTTP and static checks
pass. Browser discovery again returned `[]`, so the live phone/console and measured
performance gate is still not claimed. Item 13 must now perform the strict normal-bar audit
before item 14's remaining browser gate can close the v1 cut.

## Implementation notes for the next session (things the code assumes)

- `app.js` layout: pure functions top (exported), then one browser IIFE. Module vars
  `db` (fetched drinks.json), `deckQueue` (deck order, ids), `flippedId` (deck flip),
  `favOpenId`/`favChecked`/`favHistoryEntry` (favorite detail, mixing progress and whether
  Close can use browser Back) — all transient, never in the state blob. Favorite detail
  routes are parsed by the exported pure `favoriteIdFromHash()` helper; deep links
  (`#/drink/<id>`, BACKLOG 16) share the same detail view via the parallel
  `drinkIdFromHash()` helper (both thin wrappers around an internal `hid()` prefix
  matcher) and the same `favOpenId` state — `favDrink()` already looks up any id in `db`,
  not just favorited ones. The toolbar button in that view is a single add/remove
  favorite toggle (`data-act="fav"`) whose label depends on current membership; closing
  falls back to `#/` when opened via `#/drink/`, `#/favoriter` otherwise (checked via
  `drinkIdFromHash(location.hash)` at close time, not stored state).
- Card faces use fixed paper-ink hex (`#211B12`/`#6E6455`), not `--sd-ink` — cards never
  theme-invert (design rule). Gesture tints are opacity-only overlays (composited).
- Deck flip must animate by toggling `.flipped` on the LIVE element; a re-render rebuilds
  the card with the class pre-applied and snaps instead of animating. Favorite detail no
  longer flips: art and recipe are consecutive scroll sections.
- A committed deck swipe must call `promoteDeck(leavingCard)`, never `render()`. It updates
  `data-depth` on the surviving live cards, inserts only the new back card, and removes the
  outgoing card after its transform transition. This is what prevents the reported snap.
- The live card owns `pointerdown`: native image dragging and card text selection are
  disabled. Arrow Left/Right call `flyOff()` directly, ignore form controls/modifiers/repeat,
  and move focus to the promoted live card.
- `formatAmount` returns non-convertible unit labels as raw keys (`dash`); the view layer
  translates via `t('unit_' + key)`; unit `top` renders as just "toppa upp"/"top up".
- Card fronts try `img/<drink-id>.webp` for the top four live cards and retain the
  `glassPlaceholder(drink.glass)` inline silhouette until load or on error. The current
  seed uses `coupe`, `highball`, `rocks` and `martini`; unknown future values degrade to
  `rocks`. All 92 current ids have production art; the fallback remains resilient for
  future additions or failed requests. `convert()` uses 30 ml/oz (bar standard;
  PRODUCT.md doesn't pin it).
- The `#view` click/change delegates are attached ONCE at startup (the element is never
  replaced). `#deck` listeners attach when the view is rendered and survive successive
  swipes; each newly promoted top card only gets its pointer handlers once.
- Wheel catalog/copy/slot ownership lives in lazy-loaded `wheel.json`; pure selection and
  SVG geometry helpers remain at the top of `app.js` for deterministic Node coverage. All
  wheel state (`wheelMoodId`, lineup, result, sound and repeat count) is visit-local module
  state. Never add any of it to localStorage or the v1.1 sync blob.
- Normal spins select an eligible visible sector before animating six to nine turns to that
  sector. Level 5 marks only water sectors eligible even though decoys remain visible. Keep
  the visible-sector/result relationship honest if geometry or sector count changes.

## Name & brand

**Name: Sipdeck** — locked by the user 2026-07-18 (chosen after briefly locking Drinkr
the same day; Svepa was the agent's recommendation).
Tagline: *"Swipe. Save. Shake."* Tone: stylish, dry, slightly playful.

**Visual identity is finalized** (2026-07-18, same Claude design session per
`DESIGN-BRIEF.md`). Concept: "the garnished deck" — monoline wordmark/icon, one fixed
accent (vermouth green) as the only color the brand itself uses. Real assets live in
`design/`: `tokens.css`, `wordmark.svg`, `icon.svg` + `icon-48.svg` + `favicon.svg`,
plus `identity-full.html` (full archived rationale) and `README.md` (usage map). Summary
in PRODUCT.md's "Visual identity" section. One implementation deviation from the raw
design output, documented in `tokens.css`'s header comment: dark mode is wired to
`prefers-color-scheme` automatically instead of a manual `[data-theme]` attribute,
because v1 has no theme toggle (YAGNI) — the color values themselves are unchanged.
**Do not check domain availability** — the domain/app-store/trademark check is the
user's own to-do before going public.

## Decisions locked 2026-07-18 (grilled in planning — don't relitigate without new info)

1. **Vanilla JS/CSS/HTML, no build, no deps.** Swipe physics is imperative in any stack;
   the rest is coarse re-renders. Switch point would be deep collaborative state — not on
   any roadmap.
2. **Accounts = v1.1, not v1** (pushback accepted: v1 already fat with pantry + i18n +
   asset pipeline; localStorage-first makes sync purely additive). v1's only obligation:
   state stays one sync-shaped blob under one key — already specified in PRODUCT.md.
3. **Accounts backend = recept pattern, minimal cut**: Firebase Auth identity-only +
   Cloudflare Worker + D1, whole-state JSON blob, debounced PUT, last-write-wins. Only
   `GET/PUT /state` + `DELETE /account`. No feed/groups/PIN — deliberate subset.
4. **Hosting = Cloudflare Pages, direct upload** (`npx wrangler pages deploy .`), like
   Årshjul. Custom domain deferred until the name is final.

Earlier locked decisions (data model, units/rounding, filters, pantry, i18n, images) are
in PRODUCT.md "Locked decisions".

## Reuse map — copy, don't reinvent (sibling projects under C:\dev, separate repos)

- `recept/PROJECT.md` — the whole architecture pattern this project follows:
  - State = one localStorage object, whole-blob debounced PUT (800 ms), server-wins-on-
    load, last-write-wins (its "Filer → app.js" section).
  - Worker: Firebase JWT verified RS256 against Google JWKS **without SDK**, aud/iss
    check, key caching (its "worker/" section). Lift this code nearly verbatim in v1.1.
  - `test.js` pattern: plain node asserts over exported pure functions, no framework.
  - PWA manifest with **relative** paths (site lives under a subpath — same gotcha here
    if ever hosted under one).
  - Canonical-unit + linear-scaling + display-formatting layering (g/ml there, ml here).
- `recept/PROJECT.md` "Konventioner": Swedish text = decimal comma, space thousands
  separator, never an em-dash. Applies to all sv strings here.
- `Årshjul/HANDOFF.md` — Cloudflare Pages/wrangler deploy motions; note its gotcha about
  piping secrets with PowerShell (CRLF) if Worker secrets ever get set from Windows.
- `sipdeck/design/` — the finalized visual identity (this session, 2026-07-18): tokens,
  wordmark, icon variants. Use these, don't design new ones. Map of files → use is in
  `design/README.md`.

## Conventions

- All doc files in English (project aims public); app UI is EN + SV from day 1.
- app.js: pure functions at top, exported for test.js; render functions per view; the
  card stack is the only place allowed to touch the DOM imperatively during animation.
- Amounts canonical in ml; ingredient ids kebab-case (`lime-juice`); `essential` explicit
  on every ingredient line.
- Commit messages: `sipdeck: <what>` (repo convention).
- Run `node sipdeck/test.js` after touching app.js pure functions or drinks.json.

## Image pipeline (operational spec)

1. **Frozen visual direction.** Keep this short form verbatim for every drink, only
   swapping the bracketed parts:
   > "Hand-drawn ink and watercolor sketch of a [DRINK NAME] cocktail in a [GLASS] glass,
   > single subject centered on a plain warm-white (#FBF7EF) background, loose confident
   > linework, limited palette with one or two accent colors true to the drink, generous
   > white space around the subject, no text, no watermark, no border, portrait
   > composition."
   The first-three trial passed and the direction is frozen. Margarita, Mojito and
   Negroni are the primary style references; the approved Daiquiri is a fourth reference
   when a broader set helps.

   **Ready-to-paste ChatGPT session opener** (first 3 test drinks — margarita/coupe,
   mojito/highball, negroni/rocks — chosen for distinct glass shapes and colors):

   > I need illustrations for a cocktail app, all in one exactly consistent style.
   > Portrait orientation (1024×1536). Style for every image: hand-drawn ink and
   > watercolor sketch, single subject centered on a plain warm-white (#FBF7EF)
   > background, loose confident linework, limited palette with one or two accent
   > colors true to the drink, generous white space around the subject, no text, no
   > watermark, no border.
   >
   > First image: a Margarita cocktail in a coupe glass with a salt rim and a lime
   > wheel.

   Then per follow-up, same chat: "Same exact style: a Mojito in a tall highball glass
   with mint sprig and lime" / "Same exact style: a Negroni in a rocks glass with a
   large ice cube and orange peel." Judge the 3 together for consistency before
   batch-generating the rest; adjust this section if the prompt needed changes.

   **First-three verdict (2026-07-18): pass, freeze the prompt.** Margarita, Mojito and
   Negroni share the same warm-white paper, confident fine ink, watercolor texture,
   centered portrait composition, generous whitespace and comparable line weight. The
   Mojito is naturally more detailed, but its rendering still clearly belongs to the
   same set. No prompt adjustment was needed for the rest of the seed.

2. **Generate in Codex with `$imagegen` / built-in `gpt-image-2`.** Make one call per
   distinct drink. Pass these local files as style references only:
   `img-src/margarita.png`, `img-src/mojito.png`, `img-src/negroni.png`, and optionally
   `img-src/daiquiri.png`. Use this structured prompt, replacing bracketed fields:

   > Use case: stylized-concept
   >
   > Asset type: portrait cocktail-card illustration for the Sipdeck app
   >
   > Input images: Images 1–4 are approved style references only. Match their shared
   > visual language exactly; do not edit, combine, trace, or reproduce their
   > drink-specific objects.
   >
   > Primary request: Create a brand-new illustration of a classic [DRINK] in a [GLASS].
   >
   > Scene/backdrop: plain warm-white (#FBF7EF) background.
   >
   > Subject: [DRINK-SPECIFIC COLOR, ICE AND GARNISH DETAILS], entire glass visible.
   >
   > Style/medium: the same hand-drawn fine ink and watercolor sketch as the references,
   > loose confident linework, delicate transparent washes, comparable line weight and
   > paper texture.
   >
   > Composition/framing: portrait 2:3 composition, single subject centered at the same
   > visual scale as the references, generous white space.
   >
   > Color palette: [ONE OR TWO RESTRAINED DRINK-TRUE ACCENTS]; clear glass remains
   > mostly paper-white.
   >
   > Constraints: no text, no watermark, no border, no extra objects, no cast shadow, no
   > table or environment. [DISTINGUISH FROM THE MOST SIMILAR EXISTING DRINK.] Preserve
   > the exact family resemblance of the approved references.

   Copy each approved built-in result from its reported
   `C:\Users\patri\.codex\generated_images\...` path to
   `img-src/<drink-id>.png`. Leave the generated original in place. `img-src/` is
   intentionally gitignored: source PNGs stay local and are never production assets.

3. **Curate before converting.** Check subject correctness, whole-glass framing,
   `#FBF7EF` paper, line weight, watercolor texture, whitespace, garnish accuracy and
   distinction from similar glass/color combinations. Regenerate only an outlier, with
   one targeted correction. All 92 current sources have passed this review.

4. **Convert approved sources.** Pillow is available as tooling and is not an app
   dependency. Center-crop the 2:3 source to 4:5, resize to exactly 640×800 and encode
   WebP with quality 72/method 6:

   ```powershell
   python -c "from pathlib import Path; from PIL import Image,ImageOps; name='DRINK_ID'; ImageOps.fit(Image.open(Path('img-src')/(name+'.png')).convert('RGB'),(640,800),Image.Resampling.LANCZOS).save(Path('img')/(name+'.webp'),'WEBP',quality=72,method=6)"
   ```

   Filename **must** be `img/<drink-id>.webp`; verify every output is 640×800 and
   ≤ 80 kB. Current range is 10,834–57,952 bytes across 92 production images.

   **Completed 66-drink expansion (2026-07-19).** Manhattan's preexisting reviewed source
   and 65 new one-call sources were curated in `drinks.json` order using Margarita, Mojito,
   Negroni and Daiquiri strictly as style references. Manhattan and the 65 new sources were
   converted together with the frozen quality 72/method 6 pipeline. Do not regenerate any
   current source unless a future task explicitly replaces this reviewed set.

   **Wheel extension (2026-07-19).** The reviewed inventory is `beer`, `cider`, `red-wine`,
   `white-wine`, `sparkling-wine`, `jagermeister-shot`, `fernet-shot`, `tequila-shot`,
   `red-bull`, `water-plain`, `water-lemon`, `water-lime`, and `bottle-sparkling`. Generate
   these one at a time from the same four style references at 1024×1536. Preserve each PNG
   as `img-src/<id>.png`, plus a card-ready 640×800 quality-72/method-6 WebP as
   `img-src/<id>-card.webp`. For the committed wheel asset, detect the non-paper subject
   bounding box, add about 30 source pixels of breathing room, then use `ImageOps.pad` to
   512×512 on `(251,247,239)` and save quality 72/method 6 to `img-wheel/<id>.webp`.
   Padding rather than a blind square crop is required so tall glasses and the full bottle
   remain intact. All 13 current outputs are 8,228–24,592 bytes.

5. **Runtime behavior.** The app only creates the top four cards, uses
   `loading="lazy" decoding="async"`, keeps `glassPlaceholder(drink.glass)` behind the
   image until load and hides a failed `<img>` on error. Missing art must never break
   layout or animation.
   Before Wrangler deploy, temporarily move `img-src/` outside the repo root because
   Wrangler does not honor `.gitignore`, then restore it immediately afterward.

## Immediate next steps (in order)

v1 is closed (BACKLOG 1–14 ✅ on 2026-07-19). BACKLOG 16 (deep links) ✅ on 2026-07-20.
Next and last for v1.1: BACKLOG 15 (accounts + sync) — needs a Firebase project and a
Cloudflare D1 database the user creates/approves; not something an agent session can
provision unattended. Follow the recept worker pattern per "Reuse map" above.

## v1 close-out (BACKLOG 13 + 14, 2026-07-19)

BACKLOG 13: strict normal-bar audit done per BAR-AUDIT.md — 37 drinks stay `bar: true`,
20 flipped to false (blocking essentials documented per drink); the exact allowlist is
under regression in test.js (4,303 checks green). Recipes, ingredients and the seed are
untouched.

BACKLOG 14: throttled phone trace and live mobile smoke ran via Playwright CDP (Chrome
DevTools MCP was still unavailable; CDP `Network.emulateNetworkConditions` 150 ms RTT /
1,6 Mbps down / 750 kbps up + 4x CPU throttle, 390x844 viewport, cold cache) against both
production origins after the audit deploy. sipdeck.pages.dev: cold load event 1 790 ms,
LCP 1 928 ms, wall-to-deck 1 830 ms; repeat visit 429 ms wall. orgutveckling.se/sipdeck/:
cold load 1 642 ms, LCP 1 520 ms; repeat 302 ms. Budgets (< 2,5 s first, < 1 s repeat)
hold on both. Live smoke, all green with zero console/page errors: fixed bottom nav +
all four routes, pointer-drag save, ArrowRight save/ArrowLeft skip, flip with stepper and
oz toggle, missing-image fallback (bogus src hides img, silhouette remains), favorite
detail + Back, persistence across reload, EN/SV toggle, installable manifest + 512 icon,
wheel in both languages: five moods apply with 12 sectors, full-motion spin 7,5 s with
exact pointer/winning-sector landing, re-spin + New wheel relabel/reset, mute aria state,
reduced-motion fast path < 1,5 s, level-5 forced water with safety note and changing
repeat copy, dark-scheme render and landscape reachability. One smoke-harness gotcha:
`#wheelMood` listens on `change` (fires on release), not `input` — dispatch `change` when
driving it synthetically.

## How to run / deploy

```
python -m http.server            # from sipdeck/ — no build step
node test.js                     # pure-function + data validation tests
npx wrangler pages deploy . --project-name sipdeck --branch main   # Cloudflare Pages
```

Live (since 2026-07-18): **https://sipdeck.pages.dev** (Cloudflare Pages, deploy =
wrangler command above) and **https://orgutveckling.se/sipdeck/** (GitHub Pages, deploy
= just `git push`; serves repo root off main — note the subpath, which is why all asset
paths must stay relative). Both were reverified with the 92-drink data, complete art,
manifest, icons and input update on 2026-07-19. No current browser-console claim is made
because no controllable browser was available. Delete `.playwright-mcp/` before wrangler
deploys — wrangler doesn't read `.gitignore`.

## Git

Own repo at `C:\dev\sipdeck` → github.com/Elwyndaz/sipdeck (like recept; each project
under C:\dev is its own repo — ignore the stale parent repo at C:\dev, never push it).
Commit messages: `sipdeck: <what>`.

## Verification state

`node test.js`: 4258 green; `node --check app.js`: green; `git diff --check`: green. The
92-drink dataset validates with 123 normalized ingredients, and all 92 current recipe
source URLs returned HTTP 200. All 92 production filenames exactly match the drink ids;
every WebP is 640×800 and 10,834–57,952 bytes. The 26 preexisting production files are
byte-identical to their committed versions, and the recorded SHA-256 hashes for Manhattan
plus the four frozen style references are unchanged. The 65 remaining sources were each
generated once, visually reviewed and accepted without regeneration.

Before conversion, local HTTP returned 404 for the intentionally absent Manhattan WebP;
source/runtime inspection confirmed the SVG placeholder remains while the failed image is
hidden. After conversion, local HTTP smoke returned 200 for `/`, `app.js`, `drinks.json`,
Manhattan and Hot Shot. Browser setup was attempted on 2026-07-19, but discovery returned
an empty backend list. The phone-viewport interaction pass and browser-console check were
therefore not performed or claimed. Both production origins returned the 92-drink data and
new expansion artwork after deployment. This file's "Current state" paragraph must be
updated at the end of every working session (recept/Årshjul convention).

Input/PWA verification on 2026-07-19: pure tests cover Arrow Left = skip and Arrow Right =
save; source guards disable native image drag and card text selection; all seven PNG exports
have their required dimensions; the manifest uses relative `id`, `start_url` and `scope`,
standalone display, finalized shell colors and no service worker. Local HTTP returned 200
with correct MIME types for the document, app, data, manifest and representative icons.
`app.js` is 59,745 bytes unminified (< 60 kB), uses one production JS file and two font
families. The worst-case uncompressed document/app/data/four-largest-image sum is 408,432
bytes. Chrome DevTools MCP was not configured and browser discovery returned `[]`, so item
14's measured phone performance and live mobile interaction/console checks remain open.
Both production origins returned the updated manifest, representative icons, 92-drink data
and corrected bar flags after deployment.

Wheel verification on 2026-07-19: deterministic tests cover all five exact 12-sector
lineups, strong-cocktail weights, shot/water progression, level-5 forced-water eligibility,
six-to-nine-turn landing geometry, repeat copy, EN/SV catalog completeness, route/motion/
accessibility source guards and unchanged persisted-state shape. All 13 committed Wheel
WebPs are validated as 512×512, 8,228–24,592 bytes. Local HTTP returned 200 with correct
MIME types for `/`, `app.js`, `wheel.json`, water and bottle art. Browser discovery was
retried after the build and again returned `[]`; no live wheel interaction or console claim
is made.

Wheel deploy on 2026-07-19: commit `dcce071` pushed to main; Cloudflare Pages deployed via
wrangler from a staging copy excluding `img-src/`. Both production origins returned 200 for
`wheel.json` and wheel art after deployment.

Wheel polish on 2026-07-19 (user feedback): the wheel now opens live on the first mood
(Pigg) instead of the empty intro state, and the home-entry mini symbol is the same
twelve-sector disc as the big wheel (neutral-mark icons removed). The three shot WebPs in
`img-wheel/` were regenerated from their `img-src/` masters with the subject scaled to 60%
of the 512 canvas (same paper pad, q72/m6), so shots read as shot glasses everywhere the
art is used; a first in-app radius hack was reverted in favor of this. Spin duration is
6,2-7,4 s (was 5-6 s). The result box lost its button row: the controls button and hub
relabel to "Snurra igen" and "Nytt hjul" joins the controls row after a spin. A landed
cocktail's name links to its recipe detail (`#/favoriter/<id>` via `.fav-open`), and
`resetWheelVisit` is skipped while a detail is open so Tillbaka returns to the intact
result. Verified in a Playwright phone viewport (390x760): live start, two spins, compact
result on-screen, cocktail link -> detail -> back with state kept, zero console messages.
app.js is 59,856 bytes; 4,264 tests green (six new source guards).

Shot-card and mini-wheel pass on 2026-07-19: `img/hot-shot.webp` and `img/b-52.webp` were
regenerated from masters with the glass at 42% of the 800px canvas height (the old cards
had the shot filling the frame like a tumbler; wheel shots use 60% of their square 512
canvas). The home-entry mini symbol gained the twelve art rings, a green pointer wedge and
a stronger alternating sector fill (`#ece1cd`, scoped to `.wheel-symbol`) so it reads as
the prize wheel rather than a blank disc.

Skip-gesture color changed 2026-07-20 (user feedback: left-swipe brown read as muddy next
to the green save tint): `--sd-skip` moved from bitters amber `#8A5A21` to a muted brick
red `#A03B2E` (dark mode `#D8A659` -> `#DE8070`), in `index.html`, `design/tokens.css` and
both design docs (`design/README.md`, `design/identity-full.html`, including its
recomputed contrast table rows). Still explicitly gesture feedback, never reused for
errors — PRODUCT.md's D1/color section and the identity doc's usage rules were reworded
to say "skip-red" instead of "skip-amber". Contrast improved: 6.22:1 light (was 5.51:1),
6.54:1 dark AA (was 8.38:1 AAA — still comfortably above the 4.5:1 floor). Verified
visually via a Playwright drag-left/drag-right screenshot pair; deployed to both
production origins. 4,303 tests green throughout.

BACKLOG 16 (deep links) done 2026-07-20: `#/drink/<id>` reuses the favorite-detail view
and `favOpenId` state — `favDrink()` already resolved any id in `db`, not just favorited
ones, so no new render path was needed. Added the parallel `drinkIdFromHash()` helper
(both it and `favoriteIdFromHash()` are now thin wrappers around an internal `hid()`
prefix matcher, to stay inside the 60 kB budget), a single add/remove-favorite toggle
button (`data-act="fav"`) replacing the old unfavorite-only button, and a Back fallback
that goes to `#/` when opened via `#/drink/` vs `#/favoriter` otherwise (checked from
`location.hash` at close time). Verified in a Playwright phone viewport (390x760) against
local HTTP: direct load of `#/drink/margarita` (loading state then detail, matching the
existing db-fetch race handling), Save toggle -> label flips to "Ta bort favorit" and the
drink appears in the Favorites list, Back returns to `#/` (not `#/favoriter`) when opened
via the deep link, and an unknown id degrades to the favorites list with zero console
errors (existing "skip ids not in db" pattern already covered it, unchanged). `app.js` is
59,995 bytes — 5 bytes under the 60 kB test.js budget; the margin is thin, watch it on
the next app.js change. 4,308 tests green (5 new: `drinkIdFromHash` parsing/decoding/
rejection cases). No production deploy yet for this change — local-only until deployed.
