# Sipdeck

Sipdeck helps a person discover a suitable drink to make or order through playful, card- and wheel-based choosing.

## Language

**Spinning wheel**:
A visual bar-order chooser whose sectors represent possible drink outcomes and which selects one outcome when spun.
_Avoid_: Roulette, roulette wheel, casino wheel

**Bar-order chooser**:
A chooser for deciding what the chooser should order at an ordinary, non-specialist bar.
_Avoid_: Pantry chooser, home recipe chooser

**Wheel outcome**:
A bar order represented by a spinning-wheel sector. It is either an audited cocktail or a simple bar order.

**Sector label**:
The compact English or Swedish name shown inside a wheel sector.

**Result name**:
The complete English or Swedish order name shown after landing.
_Avoid_: Sector label

**Spin lineup**:
The twelve visible sectors prepared from the eligible wheel catalog. It stays stable across re-spins and changes only for a new mood, a requested new wheel, or a new wheel visit; an outcome may occupy multiple sectors to express greater weight.
_Avoid_: Full catalog

**Flex sector**:
The twelfth Fresh-sector slot, which usually contains an audited cocktail but occasionally contains the shared-table outcome.

**Audited cocktail**:
A Sipdeck cocktail that remains reliably orderable at an ordinary, non-specialist bar after the strict bar audit.

**Cocktail pool**:
The Sipdeck cocktails currently eligible for wheel lineups through the `bar` classification. It is provisional until the strict bar audit is complete.

**Strong cocktail**:
An audited cocktail carrying Sipdeck's editorial `strong` classification; it is not an independently calculated alcohol measure.
_Avoid_: Calculated-ABV cocktail

**Simple bar order**:
A wheel-only order such as beer, wine, a shot, water, or an energy drink that is not represented as a Sipdeck cocktail recipe.
_Avoid_: Cocktail recipe

**Jägermeister shot**:
A simple bar order for a poured shot of Jägermeister, represented without bottle branding or a logo.
_Avoid_: Herbal-bitter shot

**Fernet shot**:
A simple bar order for a poured shot of Fernet, represented without bottle branding or a logo.
_Avoid_: Herbal-bitter shot

**Drunkenness level**:
A five-step, self-reported description of how drunk the person feels, selected before spinning. Each step has a user-facing mood name rather than a number.
_Avoid_: Score, achievement, tolerance level

**Mood selection**:
The chooser's required, transient choice of drunkenness level for the current wheel visit. It starts unset and is never persisted.
_Avoid_: Saved intoxication setting

**Tequila shot / Tequilashot**:
The canonical English and Swedish names of the simple bar order for a poured shot of tequila.

**Shared-table outcome**:
A rare level-1 result intended for the chooser's table rather than for the chooser alone.

**Bottle of sparkling wine / Flaska bubbel**:
The sole shared-table outcome, presented as a bottle for the table.
_Avoid_: Bottle for the chooser

**Fresh / Pigg**:
The canonical English and Swedish names of the lowest drunkenness level.

**In the groove / På gång**:
The canonical English and Swedish names of the second drunkenness level.

**Tipsy / Salongs**:
The canonical English and Swedish names of the middle drunkenness level.

**A bit wobbly / Lite vinglig**:
The canonical English and Swedish names of the fourth drunkenness level.
_Avoid_: Wobbly, Vinglig

**Shitfaced / Kanon**:
The canonical English and Swedish names of the highest drunkenness level.
_Avoid_: Dazed, Snurrig

**Chooser**:
The person currently using the spinning wheel to choose their own next drink. In a group, people take turns as chooser by passing the device; a shared-table outcome is the sole exception.
_Avoid_: Player, contestant

**Pick for me / Välj åt mig**:
The canonical English and Swedish name of the action that opens the spinning wheel.
_Avoid_: I'm feeling lucky, Jag har tur, icon-only entry action

**Forced-water spin**:
A level-5 spin whose water-heavy wheel also shows a few non-water decoy sectors but is guaranteed to land on water.
_Avoid_: Random level-5 spin

**Repeat-spin message**:
The level-5 supporting copy that acknowledges the forced-water result before the second spin and becomes firmer before the third and later spins.

**Decoy sector**:
A visible beer or cocktail sector on the level-5 wheel that preserves the playful reveal but cannot be selected.
_Avoid_: Eligible outcome

**Water variant**:
One of three visual treatments for the same water outcome: plain iced water, water with lemon, or water with lime.
_Avoid_: Separate outcome

**Wheel visit**:
The period from entering the spinning wheel until leaving it or reloading Sipdeck. Repeat-spin messages reset at the end of the visit.
_Avoid_: Persisted session

**Current result**:
The most recent landing shown during a wheel visit. A re-spin replaces it, and Sipdeck keeps no result history.
_Avoid_: Result history, drinking history

**Re-spin**:
Another spin using the current spin lineup.

**New wheel**:
An explicit request to replace the current spin lineup while keeping the selected mood.

**Spin / Snurra**:
The canonical English and Swedish names of the action that starts the spinning wheel.
_Avoid_: Flick, throw
