# Sipdeck — backlog

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
   HANDOFF.md, exact 640×800 WebP outputs at 11–58 kB, complete id coverage and lazy
   loading for the top four cards. Resilient inline SVG silhouettes are keyed by the
   seed's `coupe`, `highball`, `rocks` and `martini` glass values. (G1)
10. ✅ **Full drink seed** — 92 reviewed recipes and 123 normalized ingredients, with EN/SV
    methods, reviewed `bar` flags and direct published sources. All 92 ids have curated
    source illustrations and exact 640×800 production WebPs at ≤ 80 kB. The original 26
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
    and do not change recipes, ingredients or the 92-drink seed. (D1)
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

## v1.2 — planned (2026-07-20)

18. **Email + password sign-in** — add as a second sign-in method alongside Google, same
    Firebase project, zero Worker/D1 changes (`worker.js` verifies the Firebase ID token,
    identical shape regardless of provider). Reverses the BACKLOG 15 YAGNI cut: that decision
    assumed a "Patrik + friends" v1.1 audience where "add later if a real friend asks" was
    the right bar; it no longer holds because the user plans to post sipdeck on an AI forum,
    a concrete anticipated audience that includes people who can't or won't use Google
    sign-in (no Google account, work SSO lock-in, or just don't want to link random apps to
    it). Do before that launch, not after. Copy recept's pattern nearly verbatim
    (`recept/app.js` lines ~1157-1179: `createUserWithEmailAndPassword`,
    `signInWithEmailAndPassword`, `sendPasswordResetEmail`, all Firebase client SDK, same
    `esc()`-escaped rendering). Steps: enable Email/Password sign-in method in sipdeck's
    Firebase console (Authentication → Sign-in method), possibly `firebase_deploy(only:
    "auth")` afterward (same provisioning gotcha Google hit in BACKLOG 15); add email +
    password fields and Login/Register/Forgot-password controls to `accountSection()`;
    check the 65 kB `app.js` budget (`app.js` was 64,066 bytes as of BACKLOG 17's follow-up
    fix, ~1 kB of headroom left, budget will likely need another bump in `test.js` — it was
    already raised once, 60 kB → 65 kB, for the whole accounts feature); `node test.js`
    green; Playwright-verify register/login/forgot-password same rigor as the Google flow
    got (BACKLOG 15's HANDOFF.md notes); update HANDOFF.md/BACKLOG.md, commit, push, deploy.

## v2 / ideas (unordered)

- Richer filter UI over existing tags: style, strength, **alcohol-free mode**.
- Search box (name + ingredient).
- Custom domain once the name is final.
- Service worker/offline (only if real-world use shows the need — recept precedent).
- "Missing one ingredient" pantry view (shopping nudge).
- Shake-to-shuffle, haptics on save (progressive enhancement only).

## Known accepted limitations

- Last-write-wins sync (v1.1): fine, state has a single owner.
- Pantry matching is id-exact: seeding discipline on ingredient ids is what makes it work.
- No image = the drink's glass silhouette forever; acceptable for future additions and
  tracked per drink by file absence. All 92 current drinks have complete production art.
