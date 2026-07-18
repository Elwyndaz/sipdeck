# Handoff: Sipdeck

Read this first, then PRODUCT.md (what to build + acceptance criteria), then BACKLOG.md
(what's next). Written for AI agent sessions picking this up cold.

## Current state in one paragraph

**BACKLOG items 1–9 done** (updated 2026-07-19). Committed swipes now promote the existing
live stack while the outgoing card flies away; the deck view is no longer re-rendered, so
the next card grows with `--sd-ease-list` and the content/bottom navigation do not repaint
at the handoff. Favorites are compact real-art rows opening a continuous illustrated
recipe detail with transient ingredient checkmarks and readable clipboard copy, with no
second flip. The bottom navigation now sits outside the content wrapper so it remains
viewport-fixed on mobile, and favorite details use `#/favoriter/<drink-id>` so browser
Back returns to the favorite list. The exact persisted state blob is unchanged. `test.js`:
566 checks green.
The outstanding phone pass was attempted again from a local `python -m http.server` on
2026-07-19. The required Browser-plugin connection and recovery diagnostics completed,
but its browser availability list was empty, so no new browser verification is claimed
and BACKLOG item 10 was not started. Real-phone 60 fps feel remains outstanding. Next:
the phone pass, then BACKLOG item 10.

## Implementation notes for the next session (things the code assumes)

- `app.js` layout: pure functions top (exported), then one browser IIFE. Module vars
  `db` (fetched drinks.json), `deckQueue` (deck order, ids), `flippedId` (deck flip),
  `favOpenId`/`favChecked`/`favHistoryEntry` (favorite detail, mixing progress and whether
  Close can use browser Back) — all transient, never in the state blob. Favorite detail
  routes are parsed by the exported pure `favoriteIdFromHash()` helper.
- Card faces use fixed paper-ink hex (`#211B12`/`#6E6455`), not `--sd-ink` — cards never
  theme-invert (design rule). Gesture tints are opacity-only overlays (composited).
- Deck flip must animate by toggling `.flipped` on the LIVE element; a re-render rebuilds
  the card with the class pre-applied and snaps instead of animating. Favorite detail no
  longer flips: art and recipe are consecutive scroll sections.
- A committed deck swipe must call `promoteDeck(leavingCard)`, never `render()`. It updates
  `data-depth` on the surviving live cards, inserts only the new back card, and removes the
  outgoing card after its transform transition. This is what prevents the reported snap.
- `formatAmount` returns non-convertible unit labels as raw keys (`dash`); the view layer
  translates via `t('unit_' + key)`; unit `top` renders as just "toppa upp"/"top up".
- Card fronts try `img/<drink-id>.webp` for the top four live cards and retain the
  `glassPlaceholder(drink.glass)` inline silhouette until load or on error. The current
  seed uses `coupe`, `highball`, `rocks` and `martini`; unknown future values degrade to
  `rocks`. All 10 current ids have art. `convert()` uses 30 ml/oz (bar standard;
  PRODUCT.md doesn't pin it).
- The `#view` click/change delegates are attached ONCE at startup (the element is never
  replaced). `#deck` listeners attach when the view is rendered and survive successive
  swipes; each newly promoted top card only gets its pointer handlers once.

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
   one targeted correction. The completed 10-image seed passed this review on 2026-07-18.

4. **Convert approved sources.** Pillow is available as tooling and is not an app
   dependency. Center-crop the 2:3 source to 4:5, resize to exactly 640×800 and encode
   WebP with quality 72/method 6:

   ```powershell
   python -c "from pathlib import Path; from PIL import Image,ImageOps; name='DRINK_ID'; ImageOps.fit(Image.open(Path('img-src')/(name+'.png')).convert('RGB'),(640,800),Image.Resampling.LANCZOS).save(Path('img')/(name+'.webp'),'WEBP',quality=72,method=6)"
   ```

   Filename **must** be `img/<drink-id>.webp`; verify every output is 640×800 and
   ≤ 80 kB. Current range is 17,672–45,038 bytes.

5. **Runtime behavior.** The app only creates the top four cards, uses
   `loading="lazy" decoding="async"`, keeps `glassPlaceholder(drink.glass)` behind the
   image until load and hides a failed `<img>` on error. Missing art must never break
   layout or animation.
   Before Wrangler deploy, temporarily move `img-src/` outside the repo root because
   Wrangler does not honor `.gitignore`, then restore it immediately afterward.

## Immediate next steps (in order)

1. Real-phone check that the bottom navigation remains fixed on every view and hardware
   Back from a favorite detail returns to the favorite list, plus the outstanding full
   phone-viewport pass and 60 fps feel check.
2. BACKLOG 10: add the user's numbered drink selection, following the frozen image
   pipeline for every added drink; selection is pending from the 40-drink candidate list.
3. BACKLOG 11: PWA manifest and icon exports.

## How to run / deploy

```
python -m http.server            # from sipdeck/ — no build step
node test.js                     # pure-function + data validation tests
npx wrangler pages deploy . --project-name sipdeck --branch main   # Cloudflare Pages
```

Live (since 2026-07-18): **https://sipdeck.pages.dev** (Cloudflare Pages, deploy =
wrangler command above) and **https://orgutveckling.se/sipdeck/** (GitHub Pages, deploy
= just `git push`; serves repo root off main — note the subpath, which is why all asset
paths must stay relative). Both verified rendering with zero console errors. Delete
`.playwright-mcp/` before wrangler deploys — wrangler doesn't read .gitignore.

## Git

Own repo at `C:\dev\sipdeck` → github.com/Elwyndaz/sipdeck (like recept; each project
under C:\dev is its own repo — ignore the stale parent repo at C:\dev, never push it).
Commit messages: `sipdeck: <what>`.

## Verification state

`node test.js`: 566 green; `node --check app.js`: green; `git diff --check`: green;
`app.js`: 37.9 kB. All 10 drink ids have exactly one visually inspected 640×800 WebP,
17,672–45,038 bytes; no missing or extra production filenames. Local HTTP smoke verifies
index/app/data responses; a deliberately missing image returns 404 and the source retains
the live `<img>` error fallback. Source inspection confirms both deck and favorite flips
still toggle `.flipped` on live elements, and filter/pantry changes set `deckQueue = null`
before `render()` causes `ensureQueue()` to reshuffle. Items 1–5 retain their earlier
Playwright phone-viewport smoke (deck gestures/flip/recipe/favorites/settings), zero
console errors. Source inspection on 2026-07-19 confirms committed swipe no longer calls
`render()`, surviving cards change `data-depth`, and deck flip still toggles `.flipped` on
the live element. On 2026-07-19 the requested phone pass was served locally from
`http://127.0.0.1:8765/`; the server returned HTTP 200, but the Browser plugin reported
an empty browser availability list after its prescribed recovery diagnostics. Therefore
none of the requested interaction checks received new browser verification, the promotion
feel and redesigned favorite flow remain browser-unverified, and BACKLOG item 10 remains
unstarted. Real-phone feel check NOT done. This file's "Current state" paragraph must be
updated at the end of every working session (recept/Årshjul convention).

Source inspection and pure-function tests on 2026-07-19 confirm favorite detail hashes
parse safely, opening a favorite creates a history entry, and hardware Back therefore
returns to `#/favoriter`; the explicit Close/un-favorite paths also close the detail. The
bottom navigation was moved out of `.wrap`, its compositor transform was removed, and
safe-area content clearance was added. Local HTTP smoke returned 200 for `/`, `app.js`
and `drinks.json`. These two fixes are not yet verified in a controllable mobile browser.
