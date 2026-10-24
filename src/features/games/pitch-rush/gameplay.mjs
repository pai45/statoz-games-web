// Build-time adaptations keep the pinned MIT vendor files unchanged.
export const GAMEPLAY_RATE = 0.75;
export function adaptSimulation(source) {
  source=source.replaceAll('\r\n','\n');
  const replace=(from,to)=>{if(!source.includes(from))throw Error('Pitch Rush simulation integration changed: '+from);source=source.replace(from,to);};
  replace('      p.charge = 0;\n    } else if (p.cooldown', '      p.charge = 0;\n      p.kickAim = dir.x || dir.y ? {x:dir.x,y:dir.y} : {x:p.dirX,y:p.dirY};\n    } else if (p.cooldown');
  replace('      p.charge++;\n      if (!fire || p.charge >= CHARGE_MAX) {', '      if (dir.x || dir.y) p.kickAim = {x:dir.x,y:dir.y};\n      p.charge = Math.min(CHARGE_MAX,p.charge+1);\n      if (!fire) {');
  replace('const aimed = assistedAim(state, t, i, dir.x || p.dirX, dir.y || p.dirY);','const aimed = p.kickAim || {x:p.dirX,y:p.dirY};');
  // assistedAim is still used by the CPU elsewhere; human kicks use exact aim.
  return source;
}
export function adaptKicks(source) {
  return source.replace('p.vx * 0.28','p.vx * (state.teams[teamIdx].human ? 0 : 0.28)').replace('p.vy * 0.28','p.vy * (state.teams[teamIdx].human ? 0 : 0.28)');
}
