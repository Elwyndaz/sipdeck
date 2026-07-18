# Sipdeck — design brief

Copy-paste prompt for the Claude design session. Fold its output into BACKLOG item 1
(design tokens) and item 11 (icons). Everything inside the fence goes to the designer
verbatim; it is written to be self-contained (the design session has no repo access).

```
Design the visual identity and UI design language for **Sipdeck**, a mobile-first web app
for browsing cocktails as a swipeable card deck.

## The product (context)

Tinder-style deck of cocktail cards. Card front: a drawn illustration of the drink, its
name, type, and ingredient tags. Tap flips the card to the full recipe (ingredients with
amounts, method, serving stepper, cl/ml/oz toggle). Swipe right saves to favorites, swipe
left sends the card to the back of the deck. Other views: favorites list, pantry
checklist ("what can I make with what's home"), settings. Bilingual English/Swedish.
Personal project going public later. Ships as a PWA; hand-written vanilla HTML/CSS/JS,
no frameworks — your output must be code-ready for that.

The card illustrations already have a fixed style you must harmonize with, not compete
with: hand-drawn ink-and-watercolor sketches, loose confident linework, limited palette,
on a plain warm-white background. The identity is the frame; the sketches are the art.

## Fixed decisions

- Name: **Sipdeck**. Tagline: "Swipe. Save. Shake."
- Tone: stylish, dry, slightly playful. Grown-up bar, not frat party; it must also feel
  right for alcohol-free drinks. The "deck" is a deck of recipe cards — lean into card
  language if it helps, but it must never tip into casino/gambling or dating-app visuals.

## Starting direction (a floor, not a ceiling — improve on it if you see better)

Minimal thin-line martini-glass mark, possibly with a subtle swipe/card-tilt gesture in
it; black/white base plus one cocktail accent (lime, vermouth green, cherry red, or
electric blue); clean wordmark with slightly rounded letterforms. If you have a stronger
concept that fits the fixed decisions, propose it and say why.

## Hard constraints

1. All assets code-ready: SVG in code blocks (inline-able, hand-editable, no raster, no
   embedded fonts — outline any text), colors/type as CSS custom properties for `:root`.
2. App icon must be legible at 16 px (favicon) and beautiful at 512 px, and survive
   iOS/Android maskable-icon cropping (keep the mark in the safe zone).
3. Typography: max 2 font families, must cover Swedish å ä ö, fast to load (name exact
   families + a system fallback stack). Amount displays need tabular numerals.
4. Accessibility: every text/background pair you specify must pass WCAG AA — list the
   pairs with their contrast ratios.
5. The deck sits on screen with the warm-white illustration cards on top — specify how
   app background, card surface, and chrome relate so the sketches feel at home in both
   a light and a dark UI (dark mode optional; if you cut it, say so).

## Deliverables (one response, in this order)

1. Brand rationale — a short paragraph: the concept and why it fits.
2. Wordmark — SVG.
3. App icon — SVG, plus one-line guidance for the 192/512/maskable/apple-touch/favicon
   exports.
4. Color system — one `:root` CSS block: background, card surface, ink, secondary ink,
   accent + accent-pressed, and the two gesture-feedback colors (save/right vs
   skip/left); include the AA contrast table from constraint 4.
5. Typography — families, weights, a small type scale, and where each step is used
   (drink name on card, tags, recipe body, amounts, UI chrome).
6. Motion language — durations and easing curves (CSS `cubic-bezier`) for: card drag
   release, spring-back, fly-off left/right, card flip, list transitions. This app lives
   or dies on buttery feel; be opinionated.
7. Usage rules — 3-5 don'ts (misuse of mark, accent overuse, etc.).

Ask me at most 3 clarifying questions before starting if something genuinely blocks you;
otherwise make the call and note the assumption.
```
