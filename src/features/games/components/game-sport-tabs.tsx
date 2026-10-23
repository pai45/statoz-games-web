"use client";
import { accentVar, UnderlineTabs, type UnderlineTab } from "@/design-system";
import { sportModuleFor, sportOrder, type Sport } from "@/domain/sports";
import { SportIcon } from "@/features/matches/components/sport-icon";

export type GameSportSelection = Sport | null;
const tabs: UnderlineTab[] = [
  { id: "all", label: "ALL GAMES" },
  ...sportOrder.map(sport => ({ id: sport, label: sportModuleFor(sport).label.toUpperCase(), icon: <SportIcon sport={sport} size={24} /> })),
];
export function GameSportTabs({selected,onSelect}:{selected:GameSportSelection;onSelect:(sport:GameSportSelection)=>void}) {
  return <UnderlineTabs label="Browse games by sport" tabs={tabs}
    activeIndex={selected === null ? 0 : sportOrder.indexOf(selected)+1}
    accent={accentVar(selected ? sportModuleFor(selected).accent : "cyan")}
    iconColors={[accentVar("cyan"),...sportOrder.map(sport=>accentVar(sportModuleFor(sport).accent))]}
    minTabWidth={96} onChange={index=>onSelect(index===0?null:sportOrder[index-1])} />;
}
