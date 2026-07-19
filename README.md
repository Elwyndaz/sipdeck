# Sipdeck

*Swipe. Save. Shake.* Browse cocktails as a swipeable card deck: swipe right to save,
left to skip, tap to flip a card over for the full recipe. Vanilla HTML/CSS/JS, no
build, no dependencies. English + Swedish.

## Current state

The complete seed contains 92 reviewed recipes and 92 optimized, visually reviewed
640×800 WebP illustrations, all under 58 kB. Filters, pantry, essential-ingredient
makeability, EN/SV switching and glass-specific missing-art fallbacks are implemented.
Favorites use compact art rows and a continuous recipe view with checkmarks, clipboard
copy, published-recipe links and mobile Back navigation. Card gestures suppress native
image/text dragging and also support Arrow Left/Right. A relative web app manifest and the
finalized icon set make the app installable without a service worker. The starting page also
opens a tactile EN/SV spinning wheel that adapts 12 visible choices to a five-step mood
slider while keeping its sound, result and history visit-local. See `HANDOFF.md` for
the current verification state and `BACKLOG.md` for the remaining v1 work.

## Run

```
python -m http.server   # then open http://localhost:8000
node test.js            # plain node asserts, no framework
```

## Docs

- `HANDOFF.md` — start here: current state, conventions, next steps
- `PRODUCT.md` — product spec, locked decisions, acceptance criteria
- `BACKLOG.md` — ordered work list
- `design/` — finalized visual identity (tokens, wordmark, icons)

## Image assets

- `img/<drink-id>.webp` — committed production card art, exactly 640×800 and ≤ 80 kB
- `img-src/<drink-id>.png` — local generated source, intentionally gitignored
- `img-wheel/<wheel-item>.webp` — committed 512×512 wheel art; reusable portrait masters
  and card-ready 640×800 variants stay local in `img-src/`
- `HANDOFF.md` "Image pipeline" — exact references, prompt template, curation,
  conversion and deployment handling
