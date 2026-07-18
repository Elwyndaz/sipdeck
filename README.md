# Sipdeck

*Swipe. Save. Shake.* Browse cocktails as a swipeable card deck: swipe right to save,
left to skip, tap to flip a card over for the full recipe. Vanilla HTML/CSS/JS, no
build, no dependencies. English + Swedish.

## Current state

The 10-drink seed has a complete optimized illustration set. Every card art asset is a
visually reviewed 640×800 WebP under 46 kB, generated from the frozen reference workflow
in `HANDOFF.md`. Filters, favorites, pantry and essential-ingredient makeability are
implemented; see `BACKLOG.md` for the remaining v1 work.

## Run

```
python -m http.server   # then open http://localhost:8000
node test.js            # 528 checks (plain node asserts, no framework)
```

## Docs

- `HANDOFF.md` — start here: current state, conventions, next steps
- `PRODUCT.md` — product spec, locked decisions, acceptance criteria
- `BACKLOG.md` — ordered work list
- `design/` — finalized visual identity (tokens, wordmark, icons)

## Image assets

- `img/<drink-id>.webp` — committed production card art, exactly 640×800 and ≤ 80 kB
- `img-src/<drink-id>.png` — local generated source, intentionally gitignored
- `HANDOFF.md` "Image pipeline" — exact references, prompt template, curation,
  conversion and deployment handling
