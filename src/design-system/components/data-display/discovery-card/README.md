# Discovery card primitives

Canonical React source: statoz_web. A checked local copy is shipped by Designer.
Import through this directory's index. Do not import application features here.

- DiscoveryPlate / discoveryPlateClass: continuous chamfer shell and etched chrome.
- DiscoveryStatus: flush lifecycle tab, reserved header room and de-duplicated timing.
- DiscoveryOutcomeRow: full-height right-docked percentage, explicit fill/ink, disabled/focus states.
- DiscoveryVersus / DiscoveryTeamName: shared small VS and two-line accessible names.
- DiscoveryQuestionProgress: display genuine answered/total counts supplied by a feature.

Sport fixtures, markets, trade sheets, routing, authentication and selection stay in features.
Use discoveryPlateClass and DiscoveryChrome on native/Next links instead of wrapping a link in another interactive surface.
Tokens come from card_game/design/match-discovery.json through local generated adapters.
Run discovery:sync with --designer-root to refresh the copy; discovery:check detects local drift without needing another checkout at runtime.

## React usage

Import from the directory index (or statoz_web's public design-system barrel).
Load the global StatOz tokens and shared local fonts once in the host app. The
library needs React and a CSS Modules capable bundler; it has no router dependency.

```tsx
import {DiscoveryPlate, DiscoveryStatus, DiscoveryOutcomeRow} from '@/design-system/components/data-display/discovery-card';

// Inside an existing feature component. Values and permission come from the model.
<DiscoveryPlate>
  <DiscoveryStatus label={market.leagueLabel} status={market.status} timing={deadline} />
  <h3>{market.question}</h3>
  {market.outcomes.map(outcome => <DiscoveryOutcomeRow
    key={outcome.id}
    label={outcome.label}
    percentage={outcome.probabilityPercent}
    fill={outcomeFill(outcome)}
    ink={outcomeInk(outcome)}
    disabled={!canBuy}
    onClick={() => openExistingTradeSheet(market, outcome)}
  />)}
</DiscoveryPlate>
```

For a whole-card link, put discoveryPlateClass on the native/Next anchor, then
render DiscoveryChrome, DiscoveryStatus and the card body inside it. Do not nest
an anchor inside a button or create a clickable div. Keep one whole-card action
or independent outcome buttons, according to the existing card type.

## Flutter usage

Import package:card_game/widgets/cyber/match_discovery.dart. Existing callers
remain valid; the focused Dart parts are one library rather than new import paths.

```dart
EditorialOutcomeRow(
  label: outcome.label,
  percentage: outcome.probabilityPercent,
  accent: outcome.color,
  onPressed: market.canBuy ? () => onBuy(outcome) : null,
)
```

The outcome primitive supplies its own selection haptic. Keep authentication,
pricing, settlement and the trade sheet in the feature callback. Use
EditorialTeamName and EditorialVersus for the approved identity treatment.

## Adding or migrating a variant

1. Start from an existing fixture, Events, market or mission adapter. Preserve its
   navigation and access behavior; old editorial-discovery imports stay compatible.
2. Reuse these visual primitives. Data loading, sport structure, selection and
   trading belong in feature modules, never in the design-system directory.
3. Change shared measurements in card_game/design/match-discovery.json, generate
   the explicitly selected local copies, and run match-discovery:check in each app.
4. Update React primitives in statoz_web, then run discovery:sync with
   --designer-root <checkout>. Both React apps run discovery:check independently.
   Hashes normalize CRLF/LF so Windows checkouts do not report false drift.
5. Update the canonical Designer catalog rules/demo and Flutter product guide/ledger.
   Run Designer's design:sync when brand-guide.ts changes. Review real narrow and
   wide cards, increased text, lifecycle states, keyboard/tap and reduced motion.

Source examples: editorial-match-card.tsx, editorial-events-panel.tsx,
editorial-market-card.tsx and editorial-mission.tsx in web's matches feature;
the corresponding focused parts under Flutter's match_discovery library.
