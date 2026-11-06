/**
 * National colours for the walkout's nation beat: plain colour bands, not
 * flag artwork. Unknown codes fall back to the game's violet, pink and cyan.
 */
const bands: Record<string, string[]> = {
  ARG: ["#74acdf", "#ffffff", "#74acdf"],
  AUS: ["#012169", "#ffcd00", "#00843d"],
  BEL: ["#111111", "#fdda24", "#ef3340"],
  BRA: ["#009c3b", "#ffdf00", "#002776"],
  CAN: ["#d80621", "#ffffff", "#d80621"],
  COL: ["#fcd116", "#003893", "#ce1126"],
  CRO: ["#ff0000", "#ffffff", "#171796"],
  ENG: ["#ffffff", "#cf081f", "#ffffff"],
  ESP: ["#aa151b", "#f1bf00", "#aa151b"],
  FRA: ["#0055a4", "#ffffff", "#ef4135"],
  GER: ["#111111", "#dd0000", "#ffce00"],
  JPN: ["#ffffff", "#bc002d", "#ffffff"],
  KOR: ["#ffffff", "#cd2e3a", "#0047a0"],
  MEX: ["#006847", "#ffffff", "#ce1126"],
  NED: ["#ae1c28", "#ffffff", "#21468b"],
  POR: ["#006600", "#ff0000", "#ffcc00"],
  URU: ["#ffffff", "#0038a8", "#fcd116"],
  USA: ["#b22234", "#ffffff", "#3c3b6e"],
};

const fallback = ["#a855f7", "#ec4899", "#38bdf8"];

export function nationColours(code: string): string[] {
  return bands[code] ?? fallback;
}

/** A hard-stop gradient of the three bands, top to bottom. */
export function nationStripes(code: string, angle = 180): string {
  const [a, b, c] = nationColours(code);
  return `linear-gradient(${angle}deg, ${a} 0 33.3%, ${b} 33.3% 66.6%, ${c} 66.6% 100%)`;
}

const placeNames: Record<string, string> = {
  GK: "GOALKEEPER",
  LB: "LEFT BACK",
  CB: "CENTRE BACK",
  RB: "RIGHT BACK",
  LWB: "LEFT WING BACK",
  RWB: "RIGHT WING BACK",
  CDM: "HOLDING MIDFIELD",
  CM: "CENTRAL MIDFIELD",
  CAM: "ATTACKING MIDFIELD",
  LM: "LEFT MIDFIELD",
  RM: "RIGHT MIDFIELD",
  LW: "LEFT WING",
  RW: "RIGHT WING",
  ST: "STRIKER",
};

export function placeName(pos: string): string {
  return placeNames[pos] ?? pos;
}
