# Sipdeck — backlog

Ordered by priority. Work top-down; each item is meant to be finishable in one focused
agent session. Story/AC references point into PRODUCT.md.

## v1 (the cut line is explicit below)

Items 1–9 ✅ done 2026-07-18 (see HANDOFF.md "Current state"). Next up: item 10.

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
   + unit toggle on the back. The feel-great milestone; budget real polish time. (Epic A, B)
5. ✅ **Favorites view** — list, open card, un-favorite. (C1)
6. ✅ **Filters** — `bar` toggle + base-spirit select, deck rebuild + reshuffle, match count,
   empty state. (D1, D2)
7. ✅ **Pantry + "what can I make"** — grouped checklist, essential-subset match, combinable
   with filters. (E1, E2)
8. ✅ **i18n** — EN/SV string table, language toggle, browser-language default, sv typography
   rules enforced in one format layer. Settings persists `settings.lang`; navigation,
   taxonomy labels, controls and accessibility labels all route through `t()`. (F1)
9. ✅ **Image pipeline + placeholders** — frozen `gpt-image-2` reference workflow in
   HANDOFF.md, exact 640×800 WebP outputs at 18–45 kB, complete id coverage and lazy
   loading for the top four cards. Resilient inline SVG silhouettes are keyed by the
   seed's `coupe`, `highball`, `rocks` and `martini` glass values. (G1)
10. **Full drink seed** — grow drinks.json to ~80–100 (IBA list + modern classics), all
    flags/ids reviewed, images generated batch-wise. Editorial pass on `bar` flag.
11. **PWA manifest + icons** — relative paths, standalone. Export PNGs from
    `design/icon.svg` (192/512/apple-touch/maskable, on `#FBF7EF` except maskable which
    is full-bleed) and from `design/favicon.svg` (16/32) — see `design/README.md` for
    which file backs which size; don't rescale `icon.svg` down to 48/16. (H1)
12. **Performance pass + deploy** — verify budgets on a throttled phone profile, then
    Cloudflare Pages direct upload; smoke-test the pages.dev URL on mobile.

——————————— **v1 CUT — everything below ships after v1 is live** ———————————

## v1.1

13. **Accounts + sync** — copy recept worker pattern, minimal: Firebase project, Worker +
    D1 `users(id, firebase_uid UNIQUE, state)`, `GET/PUT /state` + `DELETE /account`,
    JWT verification code lifted from recept worker, debounced PUT, server-wins-on-load,
    logged-out untouched. (I1)
14. **Deep links** — `#/drink/<id>` opens a card directly (shareable).

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
- No image = the drink's glass silhouette forever; acceptable for future additions,
  tracked per drink by file absence. The current 10-drink seed has complete image coverage.
