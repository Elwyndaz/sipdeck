# Sipdeck

*Swipe. Save. Shake.* Browse cocktails as a swipeable card deck: swipe right to save,
left to skip, tap to flip a card over for the full recipe. Vanilla HTML/CSS/JS, no
build, no dependencies. English + Swedish.

## Current state

The complete seed contains 92 reviewed recipes. The original 26 have optimized,
visually reviewed 640×800 WebP illustrations under 46 kB; art generation for the 66-drink
expansion is in progress, with Manhattan's source PNG complete. Filters, pantry,
essential-ingredient makeability, EN/SV switching and glass-specific missing-art
fallbacks are implemented. Favorites use compact art rows and a continuous recipe view
with checkmarks, clipboard copy, published-recipe links and mobile Back navigation. See
`HANDOFF.md` for the exact image checkpoint and `BACKLOG.md` for the remaining v1 work.

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
- `HANDOFF.md` "Image pipeline" — exact references, prompt template, curation,
  conversion and deployment handling
