# Handoff: Sipdeck

Read this first, then PRODUCT.md (what to build + acceptance criteria), then BACKLOG.md
(what's next). Written for AI agent sessions picking this up cold.

## Current state in one paragraph

**Editable recipe scaling 2026-07-23.** Recipe cards and favorite details now use a number
input plus minus/plus buttons for 1–100 servings. Native browser spinner arrows are hidden so
the larger controls remain the only visible steppers. The count is transient to the active drink,
so moving to another recipe starts at 1 instead of carrying a batch size across recipes.
The legacy `settings.servings` field remains in the v1 sync shape for compatibility but is no
longer used by the UI. The Settings screen no longer repeats the read-only unit, servings,
bar-only or base-spirit values because those controls already live in their working contexts.
`app.js?v=1.8` cache-busts the change.

**Wheel-transition follow-up 2026-07-23.** The shared mini-to-full wheel transition now runs
in Firefox again and is shortened from 560 ms to 360 ms. Opening displays the populated
full-wheel snapshot while it grows; closing explicitly keeps that same populated snapshot
visible while it shrinks, instead of scaling up the empty mini-wheel artwork first.
`app.js?v=1.7` cache-busts the route change. The privacy contact in both languages is now
`kontakt@orgutveckling.se`. `node test.js`: 4,930 green.

**Privacy/global-launch baseline deployed 2026-07-23 (`a66c15d`).** `info.html` contains
Swedish and English privacy information, local-storage/cookie information, terms and
responsible-alcohol guidance, and is linked from both account states. Fonts are now served
locally. Firebase is dynamically imported only after account use (or for a returning signed-in
user), so ordinary logged-out visits no longer contact Google or create Firebase storage.
No client analytics, consent banner or age gate was added. Cloudflare reports the existing D1
database with `jurisdiction: null`; an EU lock requires a separately planned create/migrate/swap.
`node test.js`: 4,924 green. The same release deployed the sync/security and wheel changes
below. Worker version: `1fa52455-c0af-4882-b331-d94efaf6ee07`; Pages deployment:
`fb6ece2f.sipdeck.pages.dev`, redirected to the custom domain. `buildapp.se/sipdeck/info.html`
returned 200 with the expected policy and unauthenticated `GET /state` returned 401 after
deployment. Previous paragraph, superseded below, kept for history:

**Sync/security hardening done 2026-07-23, deployed in `a66c15d`.** `PUT /state` now uses an
SHA-256 state tag plus atomic compare-and-swap; the browser persists a per-account sync base
and three-way merges conflicts, preserving both independent edits and removals. Account
deletion wipes state before deleting the Firebase user, leaves a two-hour tombstone so old
tokens cannot recreate data, and an hourly Worker cron purges that marker. Firebase token
verification now validates `iat`/`auth_time` and refreshes JWKS once on an unknown `kid`.
`node test.js`: 4,915 green. The wheel View Transition smoothing changes in `app.js` and
`index.html` were included in the same release. Previous paragraph, superseded below, kept
for history:

**BACKLOG 22 done, v1.5 closed, deployed in `a66c15d`.** Two independent wheel-preference toggles in
Settings, grilled first (`/grilling`) to resolve the opt-in/opt-out mismatch and empty-pool edge
cases. (1) "Bara favoritdrinkar" — `buildSpinLineup`'s cocktail slots draw first from
`state.favorites` (still intersected with `bar:true`), topping up from the full `bar:true`
catalog with no repeats whenever favorites can't fill every slot; zero favorites = toggle-off
behavior. (2) Per-outcome checkboxes for beer/cider, wine and shot (`wheel.json` outcomes), all
checked by default; emptying a whole category redirects that mood's slots to extra cocktails
instead of breaking the 12-sector lineup (`buildSpinLineup` precomputes "dead" category slots
before sampling cocktail picks). Both fields live in `state.settings`, last-write-wins on sync
like every other setting, no Worker/D1 schema change. `app.js` grew to 78,377 bytes; `test.js`
budget bumped 74 kB → 79 kB, 14 new cases. `node test.js`: 4,335 green. Chrome DevTools
MCP-verified on local HTTP: both settings persist across reload, wheel spins correctly with a
shot excluded and with favorites-only on but zero favorites saved (full-catalog fallback, no
crash), zero console errors. Not yet exercised: real multi-device sync of the two new settings
fields, or a spin with enough real favorites saved to see the "only mine" pool actually bite.
Follow-up same day: Konto (account/sign-in) moved up in `viewSettings()` to sit above both
wheel-preference blocks (split into a second `<dl class="settings">` after `accountSection()`),
markup reorder only, no new strings or state.
Previous paragraph, superseded below, kept for history:

**BACKLOG 21 done, v1.4 closed, deployed 2026-07-21.** Full-catalog search over all 92 drinks
by name or ingredient (`#/sok`), separate from filtering the saved favorites list — the ask was
to find *any* drink to read its recipe or save it, not narrow down what's already saved.
Reuses the wheel's established full-screen pattern: a new header icon (`#searchEntry`, visible
on every tab) opens `#/sok`, which reuses `.wheel-screen`/`.wheel-topbar` for the shell and the
existing `.fav-open`/`data-id` open-detail pattern (already shared by the favorites list and the
wheel result) to land on the `#/favoriter/<id>` detail view — Save/Remove and the full recipe
needed zero new code. New pure `searchHaystack(drink, ingredientNames)` +
`matchesSearch(haystack, query)`, substring/case-insensitive against the drink name and
current-language ingredient names. One bug caught before shipping: `render()`'s transient-state
reset was clearing `searchQuery` on the Back-from-a-result round trip, losing the typed query —
fixed with the same `detailId === null` guard the wheel-visit tracking already used for
surviving a detail peek. Live-as-you-type re-renders the whole view like every other control, so
the input handler saves/restores focus and cursor position around `render()`. Zero Worker/D1/
state-shape changes. `app.js` grew to 73,504 bytes; `test.js` budget bumped 71 kB → 74 kB.
`node test.js`: 4,321 green. Playwright-verified on local HTTP (phone viewport): search opened
from both Kortlek and Favoriter (Back returns to whichever tab it opened from), live filtering,
opening a result and saving it, no-match empty state, query+results surviving a detail round
trip, zero console errors. Committed (`722f51f`), pushed to main, and deployed: `npx wrangler
pages deploy . --project-name sipdeck --branch main` succeeded, both production origins
(`sipdeck.pages.dev` and `buildapp.se/sipdeck`) reverified serving the new `app.js` after
deploy. Not exercised: mobile Safari/real-device touch typing (only Playwright/Chromium tested
locally). Previous paragraph, superseded below, kept for history:

**Pantry-awareness pass done 2026-07-20 (grilled via `/grilling` before building, not on the
backlog as a numbered item yet).** Three things, all sharing one new pure helper
`missingIngredients(drink, pantry)` (app.js, next to `canMake`) that returns the essential
ingredient lines a drink is missing from `state.pantry`: (1) favorite list rows
(`viewFavorites()`) show a muted badge when a drink isn't makeable — the missing ingredient
name(s) if 1-2 are missing, "Missing 3+" past that; the favorite **detail** view is untouched
except missing essential ingredient rows get `--sd-ink-2` text via a new `.pantry-missing`
class, kept strictly separate from the pre-existing `favChecked` mixing-checkoff (`.done`,
strikethrough) — the two can coexist on the same row without conflict, verified in Playwright.
(2) `viewPantry()` gained a "Nästan klara"/"Almost there" section listing every drink missing
*exactly* one essential ingredient, each row a plain `<a href="#/drink/<id>">` (the existing
BACKLOG-16 deep-link route, free reuse). (3) Bugfix: `pullState()` no longer does unconditional
server-wins — it now unions `favorites`/`pantry` between local and server state via a new pure
`mergeState(local, server)` (settings stay server-wins, unchanged direction) so pantry/favorite
edits made while logged out survive the next login instead of being silently overwritten.
`pullState()` also now pushes the merged result back after merging, so the server converges to
the same union. No new state keys — still the exact `sipdeck` blob shape in PRODUCT.md. Design
was grilled question-by-question first (three explicit decisions locked: badge text is
name+cutoff not a bare count; the "already have" bonus in the detail view is a plain muted
color, deliberately not reusing the save/skip gesture colors per the documented rule that
skip-red is gesture-only; and the sync fix is a pure union-merge, not a warn-dialog or a
pantry lock, since the "logged-out is the product" principle rules out locking and a union can
never lose data in either direction). `app.js` grew to 69,641 bytes; `test.js` budget bumped
70th time, 68 kB → 70 kB (comment dated in `test.js`). `node test.js`: 4,315 green (7 new:
`missingIngredients` essential/non-essential/empty-pantry cases, `mergeState` union/dedupe/
settings-server-wins cases). Playwright-verified on local HTTP (phone viewport, 390×760) with a
seeded pantry/favorites state covering all badge cases (0, 1, 2, 3+ missing): favorite list
badges render correct SV and EN text ("Saknar: Triple sec" / "Missing: Triple sec", etc.),
"Nästan klara" lists exactly the 1-missing drinks with working deep links, the detail view's
Triple sec row got `.pantry-missing` (muted color confirmed via computed style,
`rgb(110, 100, 85)` = `--sd-ink-2`) while non-essential garnish rows stayed unaffected, and
toggling the mixing checkbox on that same row added `.done` alongside `.pantry-missing` without
disturbing either. Zero console errors on a clean reload. The merge-on-login fix itself is only
unit-tested (`mergeState` in test.js) — a live two-device logged-out-edit-then-login scenario
against the real Worker needs real Firebase credentials, same standing limitation as the
Google-login and account-linking gaps noted below. Not yet promoted to a numbered BACKLOG item
or deployed. Previous paragraph, superseded below, kept for history:

**v1.2 is closed 2026-07-20 (BACKLOG 18 + 19, email + password sign-in and account
linking).** BACKLOG 19 (requested same session, right after 18): a couple can now share one
account across both sign-in methods instead of being forced into two separate accounts
(Firebase's default duplicate-email prevention rejects registering email/password on an
email already tied to a Google account — there was no way to combine them before this).
Signed-in `accountSection()` conditionally shows a "Koppla Google-inloggning" button
(`fb.linkWithPopup`) when the account lacks a `google.com` provider, or a "Skapa lösenord"
form (`fb.updatePassword` — adds the `password` provider to a Google-only account; this is
the same call recept already runs in production) when it lacks a `password` provider,
computed from `fbUser.providerData`. No risk/downside beyond the feature's own point (an
account reachable by two auth factors instead of one is what "share with your partner"
means) — no Worker/D1 changes, JWT verification stays provider-agnostic. `app.js` grew to
67,422 bytes; `test.js` budget bumped again, 67 kB → 68 kB. `node test.js`: 4,308 green.
Playwright-verified on local HTTP: a fresh password account shows exactly the "link Google"
button (not the password form, since one already exists); clicking it opens the correct
Firebase popup (`authType=linkViaPopup`, confirming the link flow, not a fresh sign-in); an
unexpected `auth/credential-already-in-use` response (the automated Chrome profile had a
cached Google session already linked elsewhere) surfaced cleanly in `#accError` with zero
console errors, which incidentally exercised the failure path too. Test account deleted
after. **Not exercised**: the Google-account → add-password direction end-to-end (needs a
real Google login, same standing limitation as BACKLOG 15 — left for the user's own first
try). One operational note from BACKLOG 18/19: `firebase_init` **overwrites** rather than
merges `auth.providers` in `firebase.json` — calling it with only `emailPassword: true`
silently dropped the already-configured `googleSignIn` block; caught via `git diff
firebase.json` before commit and restored, then redeployed. Diff `firebase.json` after any
`firebase_init` call that touches a feature with existing config. Previous paragraph,
superseded below, kept for history:

**v1.2 is closed 2026-07-20 (BACKLOG 18, email + password sign-in).** Second sign-in method
alongside Google, same Firebase project `sipdeck`, zero Worker/D1 changes (JWT verification
in `worker.js` is provider-agnostic). Firebase console step done via MCP instead of the
console UI: `firebase_init` with `auth.providers.emailPassword: true`, then
`firebase_deploy(only: "auth")` to provision the remote Identity Platform config (same
provisioning gotcha Google's provider hit in BACKLOG 15 — `firebase_init` only writes local
config, `firebase_deploy` pushes it remotely). `accountSection()` in `app.js` gained an
`#emailForm` (email + password inputs, Log in/Create account/Forgot password buttons) next
to the existing Google button, shown only when logged out; the logged-in view (email,
sign-out, delete) is unchanged. Event wiring: a `submit` delegate on `#view` for
`#emailForm` (mirrors the existing once-attached delegate pattern) calls
`createUserWithEmailAndPassword`/`signInWithEmailAndPassword` based on `e.submitter.dataset.mode`;
a new `forgot` branch in the existing `data-acc` click delegate calls
`sendPasswordResetEmail` and reuses `#accError` for the success message. No Firebase
error-code → i18n translation map was added — matches the existing ponytail decision on the
Google/delete flow (raw `err.message`, add a map only if real users hit it often).
`app.js` grew to 66,096 bytes, so the `test.js` bundle budget was bumped again (65 kB → 67
kB, comment dated in `test.js`). `node test.js`: 4,308 green. Playwright-verified on local
HTTP (phone viewport, 390×760): register with a fresh email → immediately signed in;
sign out → form reappears; log in with the same credentials → signed in again; forgot
password with the email field filled → "Återställningsmejl skickat." success message;
delete account (confirm dialog accepted via Playwright's dialog handler) → back to the
logged-out form. Zero console errors/warnings at every step. The test account was deleted
at the end, no leftover row. Previous paragraph, superseded below, kept for history:

**v1.1 is fully closed 2026-07-20, including BACKLOG 17 (security review of accounts+sync,
the last item).** Both the `security-review` skill and an independent cross-check sub-agent
reviewed `worker/worker.js` (JWT verification, D1 access, `/state` + `/account`),
`worker/schema.sql` and the new `app.js`/`index.html` auth/sync code, diffed from the
pre-BACKLOG-15 baseline (`e0cf8a2^..HEAD`). **No HIGH/MEDIUM confidence findings.** Verified:
every D1 query is parameterized (no SQLi); `/state` and `/account` scope by `u.id` looked up
via the JWT-verified `firebase_uid` (`claims.sub`), never a client-supplied id (no IDOR);
`header.alg !== 'RS256'` is rejected before any JWKS key lookup and the signature is verified
before claims are trusted, with `aud`/`iss` pinned to the `sipdeck` project (no algorithm-
confusion); `accountSection()` runs `fbUser.email`/`displayName` through the existing `esc()`
and pulled server state is re-run through `normalizeState()` before render/persist (no stored
XSS via sync); the wildcard CORS origin is safe because auth is Bearer-token, not cookie-based
(no CSRF vector). Two sub-threshold observations (confidence <8/10, logged not fixed): no
Firebase ID-token revocation check (only `exp`/`aud`/`iss`/signature — accepted JWT tradeoff,
not new); and the `/account` DELETE handler removed the D1 row before the client called
`fbUser.delete()`, so a failed Firebase call (e.g. `requires-recent-login`) could orphan a
deleted-but-still-existing Firebase account that silently re-provisioned an empty D1 row on
next login. **Fixed same day**: the client now grabs the ID token, calls `fbUser.delete()`
first (the irreversible, user-visible commitment), and only then fires the `/account` DELETE
using the pre-fetched token (fire-and-forget — `fbUser` is unusable for a fresh token once
deleted, and if this best-effort cleanup fails the only cost is a harmless orphaned row under
a now-dead `firebase_uid` that can never be reached again). If `fbUser.delete()` itself throws,
nothing else runs and the D1 row stays fully intact. `node test.js`: 4,308 green; `app.js` is
64,066 bytes (still under the 65 kB budget). Previous paragraph, superseded below, kept for
history:

**v1.1 accounts+sync (BACKLOG 15), the second-to-last v1.1 item, done.** Firebase
project `sipdeck` (Google account patz.lofgren@gmail.com) + Cloudflare Worker `sipdeck-api`
(https://sipdeck-api.sipdeck.workers.dev, account subdomain `sipdeck`) + D1 `sipdeck`
(`users(id, firebase_uid UNIQUE, state)`) implement `GET/PUT /state` + `DELETE /account`
per the locked minimal cut. Client: Google Sign-In only (recept-style email+password was
skipped as YAGNI — the locked decision said "email+password and/or Google", either
satisfies it; add email+password later if a real friend asks). Settings view gained an
account section (signed-out: hint + Google button; signed-in: email + sign-out + delete).
`save()` triggers a debounced (800 ms) whole-blob `PUT /state` when logged in; auth state
change triggers `GET /state` (server-wins-on-load: adopts server state if non-null, else
uploads local to seed it); logged-out stays exactly the existing localStorage-only app.
Verified in Playwright (localhost, phone viewport): settings renders the account section,
clicking Google Sign-In opens the real Firebase OAuth popup for the `sipdeck` project.
First pass failed cleanly with `auth/unauthorized-domain` (caught, shown in `#accError`,
zero console errors/crashes) because Firebase's authorized-domains list only had the two
auto-created domains — user added `sipdeck.pages.dev`, `orgutveckling.se` and `localhost`
via Firebase Console → Authentication → Settings → Authorized domains (no MCP/API path
was found for this one setting; it's console-only). Re-verified same session: the popup
now proceeds all the way to Google's real account chooser
(`accounts.google.com/v3/signin/identifier`) instead of stopping at the domain check —
**this gap is closed.** Completing an actual login with real credentials was left to the
user, not attempted here. (Two benign console errors — `Cross-Origin-Opener-Policy policy
would block the window.closed call` — are a known cosmetic quirk of the Firebase Auth SDK's
popup-close polling under COOP, not an app bug.) Worker smoke-tested directly:
unauthenticated `GET /state` returns 401. `app.js` is 63,853 bytes — the 60 kB budget was deliberately
bumped to 65 kB in `test.js` for this feature (see "Decisions locked" below). `node
test.js`: 4,308 checks green (unchanged; no new pure functions, so no new pure-function
tests — the new code is all browser-only auth/sync wiring next to the existing app IIFE).
Two real bugs were caught and fixed by the Playwright pass before this could be called
done: a TDZ ReferenceError from calling `save()` (which now reads `fbUser`) before the new
`let fb, fbUser` block had executed, and a variable-shadowing bug where a pre-existing
local `const fb` (a favorite-button element ref) in the shared click handler shadowed the
new outer `fb` (the Firebase module) for the whole handler — renamed the local one to
`favBtn`. Previous paragraph, superseded below, kept for history:

**v1 (BACKLOG 1–14) closed 2026-07-19. v1.1 BACKLOG 16 (deep links) done 2026-07-20;
BACKLOG 15 (accounts + sync) is next and last for v1.1.** `#/drink/<id>` now opens any
drink's continuous illustrated detail directly (reuses the favorite-detail view/state,
see implementation notes below), with a Save/Remove-favorite toggle and a Back that
returns to the deck rather than the favorites list. Verified in a Playwright phone
viewport (390×760) against local HTTP: direct load of a valid id, saving from the
deep-link view, list pickup, Back-to-deck fallback, and an invalid id degrading
gracefully to the favorites list — all with zero console errors. `app.js` is 59,995
bytes (still under the 60 kB budget; the budget is tight, watch it on the next change).
`node test.js`: 4,308 checks green (5 new deep-link tests). Committed (`3cb2d5f`), pushed,
and deployed to both production origins on 2026-07-20. Previous paragraph, superseded
below in "v1 close-out", kept for history:

**BACKLOG items 1–12 done; item 13 next; item 14 partially verified** (updated 2026-07-19).
The approved 93-drink/123-ingredient seed and complete card artwork remain intact. Sipdeck
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
  `rocks`. All 93 current ids have production art; the fallback remains resilient for
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

## Accounts + sync implementation (locked 2026-07-20, BACKLOG 15 done)

- Firebase project `sipdeck` (Google account patz.lofgren@gmail.com, same account as the
  `grammat` project). Web app SDK config is inlined in `index.html`'s `type="module"`
  script (apiKey is a public identifier, not a secret — same as recept's pattern).
- Cloudflare account subdomain `sipdeck` was registered (one-time, account-wide;
  `patz.lofgren@gmail.com`'s account had none yet) so `sipdeck-api.sipdeck.workers.dev`
  could deploy without a custom domain. `worker/wrangler.toml` has no `routes` (unlike
  recept-api's custom domain) — deliberate, no custom domain needed for a tiny API.
- `worker/worker.js` + `worker/schema.sql`: nearly-verbatim copy of recept's Firebase
  JWT verification (RS256 against Google's JWKS, `aud`/`iss` check, key caching, zero SDK
  dependency), trimmed to the locked minimal cut — only `GET/PUT /state` and
  `DELETE /account`, table is just `users(id, firebase_uid UNIQUE, state)` (no name/PIN/
  legacy columns, no `recipes_index`/`groups`/`saves` — none of that applies here).
  Deploy: `cd worker && npx wrangler deploy` (D1 binding `DB` -> database `sipdeck`).
- `firebase_init`'s MCP `auth` feature only writes local `firebase.json`; it does **not**
  provision the remote Identity Platform config by itself — `firebase_deploy(only: "auth")`
  must run afterward, or `signInWithPopup` fails client-side with `CONFIGURATION_NOT_FOUND`
  from `identitytoolkit.googleapis.com`. Do this once per project; already done for
  `sipdeck`.
- Client is Google Sign-In only (YAGNI cut of "email+password and/or Google" — the locked
  decision's "and/or" permits either alone). `save()` calls `pushState()` (800 ms debounce)
  when `fbUser` is set; `onAuthStateChanged` calls `pullState()` on login (server-wins if
  server `state` is non-null, else uploads local to seed the row). Logged-out is 100%
  unchanged — no network calls happen unless `fbUser` is set.
- **Known gotcha for future edits near the account code**: the pre-existing click handler
  already had a local `const fb` (a favorite-button element reference) in the same
  function scope as the new outer `fb` (the Firebase module). `const`/`let` TDZ means the
  inner declaration shadows the outer one for the *entire* enclosing function, not just
  after its own line — this threw `Cannot access 'fb' before initialization` on every
  click until the local one was renamed to `favBtn`. Grep for bare `\bfb\b` before adding
  more code near either.
- Firebase's authorized-domains list (Console → Authentication → Settings) needed
  `sipdeck.pages.dev`, `orgutveckling.se` and `localhost` added manually — no MCP/CLI tool
  exposes this one setting (not in `firebase_init`'s auth schema), it's console-only. Done
  2026-07-20; re-verified the popup now reaches Google's real account chooser instead of
  stopping at `auth/unauthorized-domain`.
- `test.js`'s bundle-budget check was bumped 60 kB → 65 kB for this feature (comment above
  the check dates and explains it) — `app.js` is 63,853 bytes.
- Deployed 2026-07-20: committed (`77ffb2f`), pushed, `sipdeck-api` Worker deployed, and
  wrangler-uploaded to Cloudflare Pages (`img-src/` moved out and restored around the
  upload, as always). Both production origins reverified after deploy — `app.js` on each
  serves the `sipdeck-api.sipdeck.workers.dev` endpoint and `index.html` carries the
  correct `authDomain`.

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
   one targeted correction. All 93 current sources have passed this review.

4. **Convert approved sources.** Pillow is available as tooling and is not an app
   dependency. Center-crop the 2:3 source to 4:5, resize to exactly 640×800 and encode
   WebP with quality 72/method 6:

   ```powershell
   python -c "from pathlib import Path; from PIL import Image,ImageOps; name='DRINK_ID'; ImageOps.fit(Image.open(Path('img-src')/(name+'.png')).convert('RGB'),(640,800),Image.Resampling.LANCZOS).save(Path('img')/(name+'.webp'),'WEBP',quality=72,method=6)"
   ```

   Filename **must** be `img/<drink-id>.webp`; verify every output is 640×800 and
   ≤ 80 kB. Current range is 8,630–57,952 bytes across 93 production images.

   **Completed 66-drink expansion (2026-07-19).** Manhattan's preexisting reviewed source
   and 65 new one-call sources were curated in `drinks.json` order using Margarita, Mojito,
   Negroni and Daiquiri strictly as style references. Manhattan and the 65 new sources were
   converted together with the frozen quality 72/method 6 pipeline. Do not regenerate any
   current source unless a future task explicitly replaces this reviewed set.

   **2026-07-23 image refresh and Cranberry Jack addition.** Ramos Gin Fizz and Dirty
   Martini were regenerated from their committed artwork as precise edit targets to
   correct the foam height and olive geometry. Cranberry Jack was generated once from
   the four frozen style references, then all three approved sources were converted with
   the same 640×800 quality-72/method-6 pipeline.

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

**v1.2 is closed** (BACKLOG 1–19 all ✅, done 2026-07-20). No v2 item is prioritized yet;
see BACKLOG.md "v2 / ideas" for unordered candidates (richer filter UI, search, custom
domain, service worker/offline, "missing one ingredient" pantry view, shake-to-shuffle).

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
cd worker && npx wrangler deploy                                   # sipdeck-api Worker
```

Live: **https://sipdeck.pages.dev** (Cloudflare Pages, deploy = wrangler command above)
and **https://buildapp.se/sipdeck/** (custom domain/subpath; asset paths must therefore
stay relative). The custom domain, privacy page and API boundary were reverified after
the 2026-07-23 deployment. Delete `.playwright-mcp/` before wrangler
deploys — wrangler doesn't read `.gitignore`. API since 2026-07-20:
**https://sipdeck-api.sipdeck.workers.dev** (Cloudflare Worker + D1, deploy = command
above from `worker/`); smoke-tested directly (401 on unauthenticated `GET /state`).
Authorized domains fixed 2026-07-20 (see "Accounts + sync implementation" above); an
actual end-to-end logged-in session (real Google credentials completing `GET`/`PUT
/state` against the live Worker) has still not been exercised — that's the user's own
first real login to try.

## Git

Own repo at `C:\dev\sipdeck` → github.com/Elwyndaz/sipdeck (like recept; each project
under C:\dev is its own repo — ignore the stale parent repo at C:\dev, never push it).
Commit messages: `sipdeck: <what>`.

## Verification state

`node test.js`: 4908 green; `node --check app.js`: green; `git diff --check`: green.
The 93-drink dataset validates with 149 normalized ingredients, 13 supported glass values
and source URLs that are present and unique for every recipe. All 93 production filenames
exactly match the drink ids;
every WebP is 640×800 and 8,630–57,952 bytes. The 26 preexisting production files are
byte-identical to their committed versions, and the recorded SHA-256 hashes for Manhattan
plus the four frozen style references are unchanged. Ramos Gin Fizz and Dirty Martini use
the reviewed 2026-07-23 corrections; Cranberry Jack was generated once and visually
reviewed.

Recipe-source audit on 2026-07-23: all 93 recipes were compared with their exact live
published source. Sixty recipe deviations and three stale or insufficient source records
were corrected in `drinks.json`; the Gimlet and Caipiroska links now target Difford's
current recipes, and White Russian uses Kahlúa's direct 30/30/30 ml recipe. The ingredient
catalog grew from 123 to 149 entries to preserve source-specific ingredients instead of
silently substituting generic ones. Optional ingredients remain omitted only where the
source explicitly marks them optional. Dirty Martini is now 60 ml gin, 22,5 ml dry
vermouth and 15 ml olive brine.

Display follow-up on 2026-07-23: every `barspoon` amount now includes its 5 ml / 0,5 cl
equivalent after serving scaling, for example `2 barsked (1 cl)`. Cranberry Jack is a
highball topped with lemon-lime soda (`top`), without a fabricated fixed volume; Lynchburg
Lemonade separately retains its source's explicit 120 ml soda amount. `app.js` is 79,183
bytes unminified (< 79.2 kB).

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
rejection cases). Committed as `3cb2d5f`, pushed to main, and deployed: wrangler upload to
Cloudflare Pages (`img-src/` moved out of the repo root first, restored after) plus the
`git push` that updates the GitHub Pages origin. Both origins reverified after deploy —
`app.js` on each serves `drinkIdFromHash`, and a Playwright load of
`https://sipdeck.pages.dev/#/drink/margarita` produced zero console errors.

Wheel heading reflow 2026-07-20 (user feedback from a screenshot): the mood
emoji/name + "Hela hjulet är med." block sat above the wheel disc, cramped
under the topbar. Moved `.wheel-heading` in `viewWheel()` (`app.js`) to render
below `#wheelStage` and above `.wheel-controls`, so it now sits between the
wheel and the fyllenivå/berusningsnivå slider. `index.html`'s `.wheel-heading`
margin changed from `.1rem 0 .2rem` to `0 0 .5rem` (top margin dropped since
`.wheel-stage` already carries `.6rem` below it; bottom margin grown so the
text doesn't sit flush against the slider card border). Landscape mode is
unaffected — its grid already places `heading` above `controls` via named
grid-areas regardless of DOM order. `app.js` is 67,422 bytes, under the 68 kB
budget; 4,308 tests green (no test covers heading DOM order). Committed as
`a6f9f67` and pushed to main; not deployed to Cloudflare Pages/GitHub Pages
(not requested).
