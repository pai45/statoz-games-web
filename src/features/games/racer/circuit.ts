/** Authored centreline measured from the FIA Silverstone GP diagram, not a survey. */
export const CIRCUIT_ID='silverstone-gp-arcade';
export const CIRCUIT_NAME='SILVERSTONE GP';
export const CIRCUIT_SOURCE='https://www.fia.com/system/files/decision-document/2025_british_grand_prix_-_event_notes_-_circuit_map_v2.pdf';
export const REFERENCE_LENGTH_METRES=5891;
export const ARCADE_SCALE=.95;
const origin=[265,675],fx=.554700196,fz=-.832050294;
// Start -> Abbey/Farm -> Village/Loop/Aintree -> Brooklands/Luffield/Woodcote
// -> Copse -> Maggotts/Becketts/Chapel -> Hangar/Stowe -> Vale/Club.
export const referencePoints=[
 [265,675],[300,624],[342,584],[363,581],[401,586],[425,582],
 [462,555],[494,532],[507,530],[514,541],[522,568],[531,573],
 [539,563],[546,538],[549,515],[534,498],[474,447],[412,394],
 [371,359],[353,350],[340,352],[334,363],[332,386],[325,397],
 [311,402],[299,399],[294,388],[301,364],[317,327],[337,302],
 [356,292],[419,284],[499,277],[528,276],[540,282],[548,303],
 [563,352],[571,404],[577,451],[580,472],[592,488],[594,500],
 [586,527],[584,546],[594,565],[602,585],[597,603],[578,619],
 [557,639],[515,727],[465,824],[433,872],[419,885],[400,889],
 [382,883],[370,871],[358,846],[338,815],[310,782],[295,769],
 [286,772],[276,783],[267,785],[255,775],[246,760],[239,740],
 [238,726],[244,708],
] as const;
export const circuitPoints=referencePoints.map(([x,y])=>{const dx=x-origin[0],dy=y-origin[1];return[(fz*dx-fx*dy)*ARCADE_SCALE,(fx*dx+fz*dy)*ARCADE_SCALE];});
export function mapPosition(x:number,z:number){
 const rawX=origin[0]+(fz*x+fx*z)/ARCADE_SCALE,rawY=origin[1]+(-fx*x+fz*z)/ARCADE_SCALE;
 return{x:40+(rawX-238)*.208,y:8+(rawY-276)*.208};
}
export const cornerReferences=[
 {name:'Abbey',point:[342,584]},{name:'Farm',point:[425,582]},
 {name:'Village',point:[507,530]},{name:'The Loop',point:[531,573]},
 {name:'Aintree',point:[549,515]},{name:'Brooklands',point:[334,363]},
 {name:'Luffield',point:[311,402]},{name:'Woodcote',point:[337,302]},
 {name:'Copse',point:[528,276]},{name:'Maggotts',point:[580,472]},
 {name:'Becketts',point:[592,488]},{name:'Becketts',point:[584,546]},
 {name:'Becketts',point:[602,585]},{name:'Chapel',point:[557,639]},
 {name:'Stowe',point:[400,889]},{name:'Vale',point:[295,769]},
 {name:'Club',point:[267,785]},{name:'Club',point:[239,740]},
];

export type CircuitDefinition={readonly id:string;readonly name:string;readonly points:readonly (readonly number[])[];readonly startOffset:number};
// Original closed layouts. Long opening straights keep the full staggered grid clear of bends.
export const CIRCUITS:readonly CircuitDefinition[]=[
 {id:CIRCUIT_ID,name:CIRCUIT_NAME,points:circuitPoints,startOffset:60},
 {id:'starter-oval',name:'STARTER OVAL',startOffset:90,points:[[0,0],[0,100],[25,150],[85,170],[145,150],[170,100],[170,0],[145,-50],[85,-70],[25,-50]]},
 {id:'meadow-loop',name:'MEADOW LOOP',startOffset:90,points:[[0,0],[0,120],[40,175],[115,190],[190,160],[230,95],[215,35],[165,5],[135,-65],[65,-90],[10,-60]]},
 {id:'club-circuit',name:'CLUB CIRCUIT',startOffset:90,points:[[0,0],[0,140],[30,210],[100,235],[165,195],[175,125],[125,90],[135,35],[225,15],[275,-45],[250,-120],[160,-145],[75,-120],[10,-65]]},
 {id:'ridge-gp',name:'RIDGE GP',startOffset:90,points:[[0,0],[0,150],[45,225],[135,260],[220,220],[260,150],[230,80],[155,60],[145,0],[220,-30],[300,-15],[345,-75],[310,-155],[230,-185],[150,-150],[95,-185],[25,-150],[0,-75]]},
];
