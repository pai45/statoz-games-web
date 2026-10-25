"use client";
import { accentVar, UnderlineTabs, type UnderlineTab } from "@/design-system";
import { gameSportModuleFor, gameSportOrder, type GameSport } from "@/domain/game-sports";
import { SportIcon } from "@/features/matches/components/sport-icon";

export type GameSportSelection = GameSport | null;
const tabs: UnderlineTab[] = [
  { id: "all", label: "ALL GAMES" },
  ...gameSportOrder.map(sport => ({ id: sport, label: gameSportModuleFor(sport).label.toUpperCase(), icon: <SportIcon sport={sport} size={24} /> })),
];
export function GameSportTabs({selected,onSelect}:{selected:GameSportSelection;onSelect:(sport:GameSportSelection)=>void}) {
  return <UnderlineTabs label="Browse games by sport" tabs={tabs}
    activeIndex={selected === null ? 0 : gameSportOrder.indexOf(selected)+1}
    accent={accentVar(selected ? gameSportModuleFor(selected).accent : "cyan")}
    iconColors={[accentVar("cyan"),...gameSportOrder.map(sport=>accentVar(gameSportModuleFor(sport).accent))]}
    minTabWidth={96} onChange={index=>onSelect(index===0?null:gameSportOrder[index-1])} />;
}
