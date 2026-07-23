# Sipdeck visual identity — source assets

Output of the Claude design session (brief: `../DESIGN-BRIEF.md`), baked in 2026-07-18.
Full rationale and all seven deliverables are archived in `identity-full.html` for
reference (open it in a browser); the files below are what the scaffold session
(BACKLOG item 1) and the icon-export session (BACKLOG item 11) actually consume.

- **`tokens.css`** — every CSS custom property (color, type, motion). Inline its
  contents into `index.html`'s `<style>` block at scaffold time (project convention:
  tokens live in `:root`, no separate stylesheet request, no build step). One
  deliberate deviation from the raw design output is documented in its header comment:
  dark mode activates via `prefers-color-scheme` automatically rather than a manual
  `[data-theme]` attribute, since v1 has no theme toggle (YAGNI).
- **`wordmark.svg`** — logotype. Uses `stroke="currentColor"`, so it must be inlined as
  an `<svg>` in the HTML (not `<img src>`) to inherit `--sd-ink`/dark-mode ink. Only the
  i-dot is a fixed accent fill. Minimum display width 90px; below that, use an icon file.
  The wheel top bar is the sole external-`img` exception: it sits at 90px on permanent
  `#FBF7EF` paper, where the SVG's default black `currentColor` is the intended ink.
- **`icon.svg`** — master mark (ghost card + top card + garnish), viewBox 0 0 96 96.
  Source for the 512/192/apple-touch/maskable exports: render on a solid `#FBF7EF`
  square for standard icons, full-bleed for maskable (the mark already sits in the
  central 80% safe zone).
- **`icon-48.svg`** — same mark, thicker strokes, ghost card dropped: the legibility
  floor for the "card" story. Use verbatim for 48px; don't rescale `icon.svg` down.
- **`favicon.svg`** — a different, simplified mark (glass only, no card) for 16/32px,
  per the design's explicit guidance that the card doesn't read below 48px.

The completed raster exports live in `../icons/`: standard 192/512, maskable 512,
Apple-touch 180, the purpose-built 48, and favicon 16/32 PNGs. `../manifest.webmanifest`
references the installable variants with subpath-safe relative URLs.

## Cocktail artwork

Cocktail illustrations are content assets, not identity source files, so they live at
`../img/<drink-id>.webp`. All 93 current drinks have complete, visually reviewed 640×800
coverage at ≤ 80 kB. Local generated PNG sources live in gitignored `../img-src/`; the
frozen `gpt-image-2`
reference prompt, curation checklist and WebP conversion command live in
`../HANDOFF.md` "Image pipeline". Do not copy illustration colors into the brand token
system: the identity stays ink plus vermouth green while each drink supplies its own
restrained watercolor accents.

The spinning wheel adds 13 committed square illustrations under `../img-wheel/`. They use
the same approved references and visual direction, but are content-aware cropped/padded to
512×512 so the entire subject remains legible in a small circular sector. Their 1024×1536
PNG masters and 640×800 card-ready WebP variants remain in gitignored `../img-src/` for
future drink-card reuse. The inventory and conversion command are frozen in `HANDOFF.md`.

## Locked from this session

- Fonts: **Instrument Serif** (400 + italic, drink names/titles only) + **Work Sans**
  (400/500/600, everything else). Both cover Swedish å/ä/ö. Google Fonts CDN link is in
  `tokens.css`'s header comment — consistent with the recept project's precedent of
  loading Firebase from a CDN with no build step.
- Accent = vermouth green, doubles as the "save" gesture color. Skip = muted brick red
  (`#A03B2E`, changed 2026-07-20 from an earlier bitters amber) — gesture feedback only,
  never reused for errors/warnings/destructive actions.
- Motion is opinionated and final: deck moves on `transform`/`opacity` only; spring-back
  is the one place overshoot is allowed; fly-off never fades (leaves the screen, doesn't
  evaporate); tint the card edge with save-green/skip-red past 30% of the commit
  threshold during drag. Exact curves/durations are in `tokens.css`.
- Usage rules (don'ts), full list in `identity-full.html` §07 — the two most likely to
  matter mid-build: cards are always `--sd-card`, never themed/tinted or dark-mode
  inverted; no playing-card iconography anywhere (suits, pips, dealer language).
