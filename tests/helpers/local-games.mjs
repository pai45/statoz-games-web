export const localGames=[
 {id:'stick-cricket',title:'STICK CRICKET CHASE',sport:'cricket',start:'Play Stick Cricket Chase',ready:()=>window.__stickCricketDebug?.ready},
 {id:'archery-test',title:'ARCHERY MASTER',sport:'archery',start:'Play Archery Master',ready:()=>window.__archeryTestDebug?.ready},
 {id:'penalty-shooters-2',title:'PENALTY SHOOTERS 2',sport:'football',start:'Play Penalty Shooters 2',ready:()=>window.__penaltyLocalDebug?.layout==='pickLeague'},
 {id:'tennis-bits',title:'TENNIS BITS',sport:'tennis',start:'Play Tennis Bits',ready:()=>!!window.tennisEngine},
 {id:'soccer-real',title:'SOCCER REAL',sport:'football',start:'Play Soccer REAL',ready:()=>typeof window.s==='number'&&window.start_cnt>2},
 {id:'f1-racing',title:'CRAZY GRAND PRIX',sport:'motorsport',start:'Play Crazy Grand Prix',ready:()=>window.F1Native?.getState().ready},
];
