# Sipdeck — backlog

> Tvärprojekt-prio: se `../master-backlog.md`, uppdatera båda vid ändring.

Ordered by priority. Work top-down; each item is meant to be finishable in one focused
agent session. Story/AC references point into PRODUCT.md.

## v1 (the cut line is explicit below)

Items 1–12 ✅ done 2026-07-19 (see HANDOFF.md "Current state"). Next up: item 13.

1. ✅ **Scaffold** — `index.html` (inline the contents of `design/tokens.css` into
   `<style>`, inline `design/wordmark.svg` in the header), `app.js` (pure functions on
   top, exported for test), hash views `#/` deck, `#/favoriter`, `#/skafferi`,
   `#/installningar`; state load/save to localStorage key `sipdeck` (blob shape in
   PRODUCT.md). Mobile-first bottom nav, recept/Årshjul conventions. Visual identity is
   final (`design/README.md`) — use it, don't reinvent tokens or motion curves.
2. ✅ **Data schema + validator + first 10 drinks** — `drinks.json` per PRODUCT.md schema;
   validator in `test.js` (unique ids, every ingredient id resolvable, `essential`
   explicit, `ml` xor `qty`+`unit`, method en+sv). 10 well-known IBA drinks as seed.
3. ✅ **Unit engine** — pure functions: linear scaling, cl/ml/oz conversion, bar rounding
   (oz ¼ with vulgar fractions, cl 0,5, ml 5), sv/en number formatting, non-convertible
   units passthrough. Full `test.js` coverage. (B2, B3, F1 formatting)
4. ✅ **Deck + swipe physics + flip** — card stack, pointer-event drag, thresholds,
   spring-back, left = requeue, right = save, tap-flip with recipe back, serving stepper
   + unit toggle on the back. Committed swipes promote the existing live cards with the
   list motion curve; the deck view is not re-rendered between cards. Native image drag
   and text selection are suppressed; Arrow Left/Right use the same live swipe path. (Epic A, B)
5. ✅ **Favorites view** — compact rows with real art, continuous illustrated recipe
   detail, transient ingredient checkmarks, readable clipboard copy, un-favorite and a
   history-aware detail route whose Back action returns to the favorite list. (C1)
6. ✅ **Filters** — `bar` toggle + base-spirit select, deck rebuild + reshuffle, match count,
   empty state. (D1, D2)
7. ✅ **Pantry + "what can I make"** — grouped checklist, essential-subset match, combinable
   with filters. (E1, E2)
8. ✅ **i18n** — EN/SV string table, language toggle, browser-language default, sv typography
   rules enforced in one format layer. Settings persists `settings.lang`; navigation,
   taxonomy labels, controls and accessibility labels all route through `t()`. (F1)
9. ✅ **Image pipeline + placeholders** — frozen `gpt-image-2` reference workflow in
   HANDOFF.md, exact 640×800 WebP outputs at 8–68 kB, complete id coverage and lazy
   loading for the top four cards. Resilient inline SVG silhouettes cover all 13 glass
   values used by the seed, with close-family silhouettes reused where appropriate. (G1)
10. ✅ **Full drink seed** — 93 source-audited recipes and 149 normalized ingredients,
    with EN/SV methods, reviewed `bar` flags and unique direct published sources. All 93
    recipes were rechecked against their live source pages on 2026-07-23. All 93 ids have
    curated source illustrations and exact 640×800 production WebPs at ≤ 80 kB. The original 26
    sources and production files, plus the preexisting Manhattan source, were preserved.
11. ✅ **PWA manifest + icons** — relative paths, standalone. Export PNGs from
    `design/icon.svg` (192/512/apple-touch/maskable, on `#FBF7EF` except maskable which
    is full-bleed) and from `design/favicon.svg` (16/32) — see `design/README.md` for
    which file backs which size; don't rescale `icon.svg` down to 48/16. (H1)
12. ✅ **Spinning wheel + artwork pipeline** — a starting-page mini-wheel opens the
    localized full-screen `#/hjul` order chooser. Five visit-local drunkenness levels build
    exactly 12 visible sectors with tested contents/weights; the highest level shows seven
    water sectors and always lands on water. Includes exact landing geometry, re-spin/New
    wheel behavior, sound/mute, ticking, one landing haptic, reduced-motion handling,
    repeat safety copy and 13 optimized illustrations with reusable local masters. (J1)
13. ✅ **Strict normal-bar audit** (done 2026-07-19, see BAR-AUDIT.md: 37 stay `bar: true`,
    20 flipped, exact allowlist under regression) — research the reliably stocked baseline at representative
    ordinary, non-specialist bars, then reassess every drink currently marked `bar: true`.
    Review all essential ingredients drink by drink; IBA status and cocktail-bar availability
    are not sufficient. If a normal bar is unlikely to stock or routinely prep even one
    required spirit, liqueur, fortified wine, bitters, syrup, purée, juice, herb or other
    ingredient, set the drink to `bar: false`. Record a concise decision and blocking
    ingredient(s) for every reviewed drink, add regression coverage for the final allowlist,
    and do not change recipes, ingredients or the 93-drink seed. (D1)
14. ✅ **Performance pass + deploy** (done 2026-07-19) — static budgets, local HTTP smoke and
    Cloudflare Pages upload, plus the throttled-phone trace and live mobile smoke via
    Playwright CDP against both production origins: cold 4G load 1,8 s / LCP 1,9 s
    (budget < 2,5 s), repeat 0,3–0,4 s (budget < 1 s), full interaction/wheel/console pass
    green. Details in HANDOFF.md "v1 close-out". **v1 cut is closed.**

——————————— **v1 CUT — everything below ships after v1 is live** ———————————

## v1.1 — closed 2026-07-20 (all three items done)

15. ✅ **Accounts + sync** (done 2026-07-20) — Firebase project `sipdeck` + Cloudflare Worker
    `sipdeck-api` + D1 `users(id, firebase_uid UNIQUE, state)`, `GET/PUT /state` +
    `DELETE /account`, JWT verification lifted nearly verbatim from recept's worker,
    debounced (800 ms) whole-blob PUT, server-wins-on-load, logged-out untouched.
    Google Sign-In only (email/password skipped as YAGNI for a "Patrik + friends" v1.1 —
    the locked decision said "email+password and/or Google", either satisfies it).
16. ✅ **Deep links** (done 2026-07-20) — `#/drink/<id>` opens the continuous illustrated
    detail directly (reuses the favorite-detail view), with a Save/Remove favorite toggle
    and a Back that returns to the deck (not the favorites list) when reached this way.
17. ✅ **Security review of accounts + sync** (done 2026-07-20) — `security-review` skill run
    plus an independent sub-agent cross-check against `worker.js` (JWT verify, D1 access,
    `/account` deletion) and `app.js`'s auth/sync code. No HIGH/MEDIUM findings: queries
    parameterized, rows scoped by JWT-verified `firebase_uid` (no IDOR), RS256 pinned before
    key lookup (no alg confusion), `esc()`/`normalizeState()` cover all new rendered/synced
    fields (no XSS), CORS is safe given Bearer-token (not cookie) auth. One sub-threshold
    note logged in HANDOFF.md, not a security bug (no token revocation check — accepted JWT
    tradeoff). The other sub-threshold note — `/account` delete ordering could orphan a D1
    row if `fbUser.delete()` failed — was fixed same day: `fbUser.delete()` now runs first
    (using a pre-fetched token for the fire-and-forget D1 cleanup after), so a failed
    Firebase call leaves the D1 row fully intact instead.

## v1.2 — closed 2026-07-20 (items 18-19 done)

18. ✅ **Email + password sign-in** (done 2026-07-20) — added as a second sign-in method
    alongside Google, same Firebase project, zero Worker/D1 changes. `accountSection()`
    gained an `#emailForm` (email + password fields, Log in/Create account/Forgot password)
    next to the existing Google button when logged out; logged-in view unchanged. Firebase
    console step done via MCP: `firebase_init` with `auth.providers.emailPassword: true`,
    then `firebase_deploy(only: "auth")` to provision the remote Identity Platform config
    (same gotcha Google hit in BACKLOG 15). `app.js` grew to 66,096 bytes, so the `test.js`
    budget was bumped again, 65 kB → 67 kB. `node test.js`: 4,308 green. Playwright-verified
    on local HTTP (phone viewport): register, log out, log in with the same credentials,
    forgot-password (reset email sent, confirmed by the success message), and account
    deletion — all with zero console errors. No error-code i18n map was added (matches the
    existing ponytail decision for the Google/delete flow: raw Firebase `err.message`, add
    translation only if real users hit it often).

19. ✅ **Account linking** (done 2026-07-20, requested same session after 18) — lets a couple
    share one account across both sign-in methods instead of ending up with two separate
    accounts (registering email/password on an email already used by a Google account fails
    with `auth/email-already-in-use`, Firebase's default duplicate-email prevention; there was
    previously no way to combine them). Signed-in `accountSection()` now shows a "Link Google
    sign-in" button (`fb.linkWithPopup`) when the account has no `google.com` provider, or a
    "Create password" form (`fb.updatePassword`, adds the `password` provider to a Google-only
    account per Firebase's account-linking semantics — same call recept already uses in
    production) when it has no `password` provider; neither shows once both are present. Zero
    Worker/D1 changes. `app.js` grew to 67,422 bytes, `test.js` budget bumped again, 67 kB →
    68 kB. `node test.js`: 4,308 green. Playwright-verified on local HTTP: registering a
    password account shows exactly the "Link Google sign-in" button (not the password form,
    since one already exists); clicking it opens the correct Firebase popup
    (`authType=linkViaPopup`, confirming the link flow and not a fresh sign-in); an
    unexpected `auth/credential-already-in-use` response (the automated browser's cached
    Google session was already linked to a different Firebase user) surfaced cleanly in
    `#accError` with zero console errors or crashes, which incidentally verified the failure
    path too. Test account deleted after. The Google-account → add-password direction
    (`pwForm`/`updatePassword`) was not exercised end-to-end — same limitation as BACKLOG 15's
    real Google login, needs real credentials, left for the user's own first try.

## v1.3 — closed 2026-07-20 (item 20 done)

20. ✅ **Pantry-awareness + sync merge bugfix** (done 2026-07-20, grilled via `/grilling`
    before building) — new pure `missingIngredients(drink, pantry)` shared by three pieces:
    favorite list rows show a muted "Saknar: X"/"Missing: X" badge (names when 1-2 essentials
    are missing, "Saknar 3+" beyond that), the favorite detail view mutes missing-essential
    ingredient rows (`--sd-ink-2`, deliberately not the save/skip gesture colors) alongside
    the pre-existing `favChecked` mixing-checkoff (kept fully separate, both classes coexist
    on a row), and the pantry view gained a "Nästan klara"/"Almost there" section listing
    drinks missing exactly one essential ingredient, linking via the existing `#/drink/<id>`
    deep link. Also fixed BACKLOG 15's known accepted-limitation edge case: `pullState()` used
    to unconditionally overwrite local state with server state on login, silently discarding
    pantry/favorite edits made while logged out (they're never pushed, since `save()` only
    pushes when `fbUser` is set). `pullState()` now unions `favorites`/`pantry` via a new pure
    `mergeState(local, server)` and pushes the merged result back; `settings` stays
    server-wins (scalar values, union doesn't apply). No new state keys, no Worker/D1 changes.
    `app.js` grew to 69,641 bytes, `test.js` budget bumped 68 kB → 70 kB. `node test.js`:
    4,315 green (7 new: `missingIngredients` and `mergeState` cases). Playwright-verified on
    local HTTP (phone viewport) with a seeded pantry/favorites state covering 0/1/2/3+-missing
    drinks in both SV and EN: badge text, "Nästan klara" list + working deep links, the
    `.pantry-missing` muted class (confirmed via computed style) coexisting with `.done` on
    the same row, zero console errors. The merge fix itself is unit-tested only — a live
    two-device logged-out-edit-then-login run against the real Worker needs real Firebase
    credentials (same standing limitation as BACKLOG 15/18/19's real-login gaps).

## v1.4 — closed 2026-07-21 (item 21 done)

21. ✅ **Catalog search** (done 2026-07-21) — a full-catalog "find a specific drink" search,
    distinct from filtering the saved favorites list: the ask was to look up any of the 93
    drinks by name or ingredient, to read the recipe or add it as a favorite, not to narrow
    down what's already saved. Placement was grilled first (deck filter box risked feeling
    crowded, a favorites-only filter didn't cover "not yet a favorite" drinks); landed on the
    same pattern the wheel already established: a header icon (`#searchEntry`, visible on
    every tab except while the wheel or search screen itself is open) opens a full-screen
    `#/sok` route reusing `.wheel-screen`/`.wheel-topbar` for the shell. New pure
    `searchHaystack(drink, ingredientNames)` + `matchesSearch(haystack, query)` match on drink
    name and current-language ingredient names (substring, case-insensitive); results reuse the
    existing `.fav-open`/`data-id` open-detail pattern (already shared by the favorites list and
    the wheel result) straight into the `#/favoriter/<id>` detail view, so Save/Remove and the
    full recipe need no new code. `render()` only clears the transient `searchQuery` when
    leaving both the search route and any detail peek (`detailId === null`), mirroring the
    existing wheel-visit-survives-a-peek guard — first pass missed this and lost the typed query
    on Back after opening a result, caught and fixed via Playwright before shipping. Live-as-you-
    type filtering re-renders the whole view (same architecture as every other control), so the
    input handler saves/restores focus and cursor position around `render()` to avoid dropping
    keystrokes. Zero Worker/D1/state-shape changes (search state is transient, not persisted).
    `app.js` grew to 73,504 bytes, `test.js` budget bumped 71 kB → 74 kB. `node test.js`: 4,321
    green (7 new: `searchHaystack`/`matchesSearch` cases). Playwright-verified on local HTTP
    (phone viewport): open search from Kortlek and from Favoriter (Back returns to whichever tab
    it was opened from, not always the deck), live-filtered results including a same-name
    substring false-positive check ("gin" matching "ginger" ingredients — accepted, standard
    substring-search behavior), opening a result shows the correct recipe with a working Save
    button, no-match empty state, and query+results surviving a result-detail round trip. Zero
    console errors throughout.

## v1.5 — closed 2026-07-21 (item 22 done)

22. ✅ **Wheel preferences** (done 2026-07-21) — restrict what the spinning wheel can land on
    to your own taste, instead of always the full fixed catalog. Grilled first (`/grilling`):
    resolved the opt-in/opt-out mismatch between cocktail favorites (empty by default) and
    beer/wine/shot outcomes (start fully checked, since unchecking is the deliberate action
    here), where the UI lives (Settings, next to each other, not the Favorites tab), and what
    happens when a pool empties out (never break the lineup). Two independent toggles, both new
    `state.settings` fields, both last-write-wins on sync like every other setting: (1) "Bara
    favoritdrinkar" checkbox — when on, `buildSpinLineup`'s cocktail slots draw first from
    `state.favorites` (still intersected with `bar:true`, same pool the wheel already used), and
    silently top up from the full `bar:true` catalog — no repeats — whenever unique favorites
    can't fill every cocktail slot on their own; zero favorites behaves exactly like the toggle
    being off. (2) Per-outcome checkboxes for the three non-cocktail wheel categories (beer/cider,
    wine, shot outcomes from `wheel.json`), all checked by default; unchecking every outcome in a
    category doesn't break the lineup, it redirects that mood's slots to extra cocktail draws
    instead (`buildSpinLineup` precomputes "dead" category slots before sampling so the cocktail
    pick count still lands on exactly 12). `app.js` grew to 78,377 bytes; `test.js` budget bumped
    74 kB → 79 kB, 14 new cases (favorites-only sufficient/insufficient/zero-favorites parity,
    excluded-category fallback, `defaultState`/`normalizeState` round-trips). `node test.js`:
    4,335 green. Chrome DevTools MCP-verified on local HTTP: both settings persist across reload,
    wheel renders and spins with a shot excluded and favorites-only on with zero favorites saved
    (full-catalog fallback, no crash), zero console errors. Follow-up same day: moved the Konto
    (account/sign-in) section up so it sits above both wheel-preference blocks instead of after
    them — `viewSettings()` now renders `<dl class="settings">` (language/unit/servings/filters)
    → `accountSection()` → a second `<dl class="settings">` (wheel favorites-only) → the outcome
    checkboxes. Purely a markup reorder, no new strings or state.

23. ✅ **Conflict-safe sync + account deletion hardening** (done 2026-07-23) — D1 state writes
    now use an SHA-256 state tag and atomic compare-and-swap. The client keeps a per-account
    last-synced base and three-way merges a `409`, so independent edits survive and removed
    favorites/pantry entries stay removed. Account deletion awaits the D1 wipe before Firebase
    deletion; a two-hour tombstone blocks still-valid tokens from recreating the row and an
    hourly Worker cron purges it. JWT checks now include `iat`/`auth_time`, and an unknown
    `kid` triggers one rate-limited JWKS refresh.

24. ✅ **Global privacy baseline** (done 2026-07-23) — Added a bilingual privacy, storage,
    terms and responsible-alcohol page linked from both account states. Google Fonts are
    self-hosted and Firebase is loaded only when account functionality is used. No client
    analytics, advertising, cookie banner or age popup was added. The current D1 database
    has no EU jurisdiction lock; moving it to a newly created EU-jurisdiction database is a
    separate production migration, not a silent configuration change.

25. ✅ **Premium wheel transition + current device matrix** (done 2026-07-24) — Gave the
    full-wheel pointer its own View Transition layer so it enters after the expanding disc
    and exits before the disc shrinks. Firefox keeps native same-document View Transitions
    but uses a compositor-safe fade-only snapshot path instead of nested transforms; the CSS
    fallback remains for browsers without View Transitions with a 900 ms lifetime, and
    reduced motion removes the pointer animation. Added a Firefox-specific regression test,
    updated mobile Safari emulation from iPhone 13 to iPhone 15 Pro, and cache-busted
    `app.js?v=1.12`. Firefox passes 3/3 locally and against the isolated Cloudflare preview;
    ten repeated open/close cycles retained the native shared-element geometry without
    clipping or console errors.

26. ✅ **Vibekollen follow-up: accessibility, metadata and Pages headers** (done
    2026-07-24) — Verified the scanner against project code and live responses before
    changing anything. The deck now removes non-top cards and hidden faces from keyboard
    and accessibility traversal with native `inert`, exposes only the current face through
    `aria-hidden`, flips with Enter/Space, preserves Arrow Left/Right and focus promotion,
    marks active units with `aria-pressed`, and gives missing ingredients both text/ARIA and
    non-color visual cues. Account feedback is a polite live region associated with its
    fields. Added localized hidden H1s, canonical links for both HTML pages, Cloudflare Pages
    `_headers` (`nosniff`, clickjacking/referrer/permissions policies, minimal enforced CSP,
    fuller CSP Report-Only), and `tests/a11y.spec.js`. `node test.js`: 4,936 green; Chromium
    accessibility 2/2 and wheel 2/2 green; non-Firefox browser matrix green. Firefox wheel
    tests pass 3/3 outside the managed Windows sandbox; inside it, Firefox cannot spawn its
    tab subprocess before navigation.

## v2 / ideas (unordered)

- **Canonical-domain transport/header follow-up**: `buildapp.se/sipdeck/` is currently
  Cloudflare-fronted but exposes GitHub Pages/Fastly origin behavior. Configure permanent
  HTTP→HTTPS and mirror `_headers` at that external proxy/zone. Inventory every
  `buildapp.se` subdomain before any HSTS `includeSubDomains` rollout.
- **CSP promotion**: exercise Firebase email/Google sign-in and sync on a deployed preview,
  inspect the Report-Only console/reports, then narrow and promote directives only if no
  required origin is blocked.
- Richer filter UI over existing tags: style, strength.
- **Alcohol-free mode**: separate boolean toggle (same pattern as the `bar` filter, D1),
  off by default. Mixing mocktails into the normal deck unprompted isn't wanted (nobody
  asked for tequila-free surprises); an explicit "Alkoholfritt"/"Alcohol-free" toggle that
  only shows alcohol-free-tagged drinks is the actual ask.
- Fill out alcohol-free-tagged drinks in the seed — only worth doing once the toggle
  above exists, otherwise they're stuck behind a tag nothing filters on.
- Weighted shuffle: bias the deck shuffle away from recently-surfaced top drinks
  (recency-only, no new data, pure shuffle-logic tweak).
- ~~Custom domain once the name is final.~~ Done 2026-07-21: live at buildapp.se/sipdeck.
- Service worker/offline (only if real-world use shows the need — recept precedent).
- Shake-to-shuffle, haptics on save (progressive enhancement only).

## Known accepted limitations

- A first login without a stored sync baseline still unions local and remote lists once;
  subsequent syncs use conflict-safe three-way merge.
- Pantry matching is id-exact: seeding discipline on ingredient ids is what makes it work.
- No image = the drink's glass silhouette forever; acceptable for future additions and
  tracked per drink by file absence. All 93 current drinks have complete production art.
