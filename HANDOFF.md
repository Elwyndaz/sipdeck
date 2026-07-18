# Handoff: Sipdeck

Read this first, then PRODUCT.md (what to build + acceptance criteria), then BACKLOG.md
(what's next). Written for AI agent sessions picking this up cold.

## Current state in one paragraph

**BACKLOG items 1–7 done** (2026-07-18), and the image-generation portion of item 9 is
complete for the 10-drink seed. Every drink now has visually reviewed 640×800 WebP art at
18–45 kB, generated in one coherent ink-and-watercolor family. Card fronts lazy-load the
top four and retain the inline SVG fallback without changing layout if future art is
missing; item 9 only still owes silhouettes keyed by `glass`. Filters combine editorial
`bar`, base spirit and transient makeable mode; pantry persists all 26 grouped ingredient
choices. `test.js`: 528 checks green. Items 1–5 retain earlier phone-browser verification,
but no controllable browser was available for the filters/pantry/full-image sessions, so
those flows still need the phone-viewport pass. Real-phone 60 fps feel is also outstanding.
Next: BACKLOG item 8.

## Implementation notes for the next session (things the code assumes)

- `app.js` layout: pure functions top (exported), then one browser IIFE. Module vars
  `db` (fetched drinks.json), `deckQueue` (deck order, ids), `flippedId` (deck flip),
  `favOpenId`/`favFlipped` (favorites overlay) — all transient, never in the state blob.
- Card faces use fixed paper-ink hex (`#211B12`/`#6E6455`), not `--sd-ink` — cards never
  theme-invert (design rule). Gesture tints are opacity-only overlays (composited).
- Flip must animate by toggling `.flipped` on the LIVE element; a re-render rebuilds the
  card with the class pre-applied and snaps instead of animating.
- `formatAmount` returns non-convertible unit labels as raw keys (`dash`); the view layer
  translates via `t('unit_' + key)`; unit `top` renders as just "toppa upp"/"top up".
- Card fronts try `img/<drink-id>.webp` for the top four live cards and retain the favicon
  glass monoline (`GLASS_PH`) until load or on error. All 10 current ids have art; the
  fallback protects future additions and broken requests. Item 9 still owes per-glass
  silhouettes. `convert()` uses 30 ml/oz (bar standard; PRODUCT.md doesn't pin it).
- The `#view` click delegate is attached ONCE at startup (the element is never replaced);
  `#deck`/`#favDeck` listeners re-attach per render (those nodes are recreated).

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
   `loading="lazy" decoding="async"`, keeps `GLASS_PH` behind the image until load and
   hides a failed `<img>` on error. Missing art must never break layout or animation.
   Before Wrangler deploy, temporarily move `img-src/` outside the repo root because
   Wrangler does not honor `.gitignore`, then restore it immediately afterward.

## Immediate next steps (in order)

1. Phone-viewport browser pass for filters, pantry, all-image deck loading and
   missing-image fallback; then do the outstanding real-phone 60 fps feel check.
2. BACKLOG 8: i18n polish (language toggle in settings — the string table and browser
   default already exist, this is mostly the settings controls).
3. Finish BACKLOG 9 by replacing the generic fallback with SVG silhouettes keyed by
   `glass`; seed image generation is complete.
4. BACKLOG 10: grow and review the drink seed.

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

`node test.js`: 528 green; `node --check app.js`: green; `git diff --check`: green;
`app.js`: 29.5 kB. All 10 drink ids have exactly one visually inspected 640×800 WebP,
17,672–45,038 bytes; no missing or extra production filenames. Local HTTP smoke verifies
index/app/art responses and `image/webp`; a deliberately missing image returns 404 and is
handled by the live `<img>` error fallback. Items 1–5 retain their earlier Playwright
phone-viewport smoke (deck gestures/flip/recipe/favorites/settings), zero console errors.
No controllable browser was available in the 2026-07-18 filters/pantry/full-image
sessions, so those newer flows are not yet browser-verified. Real-phone feel check NOT
done. This file's "Current state" paragraph must be updated at the end of every working
session (recept/Årshjul convention).
