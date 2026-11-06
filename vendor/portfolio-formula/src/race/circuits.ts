/** Original circuits share the supplied grid straight; all other knots are game-owned. */
export const CIRCUITS = [
  { id: "night", name: "Night Circuit", description: "Fast esses. A late hairpin. The original floodlit circuit.", character: "BALANCED", scale: 1.2 },
  { id: "harbor", name: "Harbor Run", description: "Long straights and deep braking beside the harbor lights.", character: "HIGH SPEED", scale: 1.2 },
  { id: "switchback", name: "Switchback Ring", description: "Linked corners and tight hairpins. Find your rhythm.", character: "TECHNICAL", scale: 1.2 },
] as const
export type CircuitId = typeof CIRCUITS[number]["id"]
export const isCircuit = (id: unknown): id is CircuitId => CIRCUITS.some(c => c.id === id)
export const circuitOf = (id: CircuitId) => CIRCUITS.find(c => c.id === id)!

export const EXTRA_PLANS: Record<Exclude<CircuitId, "night">, [number, number][]> = {
  harbor: [
    [0,-80],[0,-62],[0,-45],[0,0],[0,45],[0,95],
    [3,125],[22,147],[55,155],[115,155],[180,155],[220,150],
    [242,133],[250,105],[250,45],[250,-20],[247,-70],
    [232,-100],[205,-112],[180,-110],[162,-93],[158,-65],
    [155,-37],[137,-20],[112,-20],[91,-34],[85,-59],
    [85,-95],[76,-120],[56,-134],[32,-134],[12,-119],
  ],
  switchback: [
    [0,-80],[0,-62],[0,-45],[0,0],[0,45],[0,95],
    [3,120],[20,139],[45,143],[70,138],[90,118],
    [112,108],[140,108],[164,121],[185,142],[210,145],
    [233,132],[244,110],[244,82],[233,59],[211,50],
    [186,50],[164,43],[150,24],[150,0],[161,-23],
    [185,-35],[210,-35],[232,-48],[243,-70],[239,-95],
    [220,-112],[195,-117],[158,-117],[130,-109],[115,-88],
    [113,-60],[97,-43],[75,-43],[57,-58],[55,-81],
    [51,-108],[34,-122],[16,-115],
  ],
}

export function seededGrid(slugs: string[], seed: number): string[] {
  const grid = [...slugs]
  let value = seed >>> 0
  for (let i = grid.length - 1; i > 0; i--) {
    value = (Math.imul(value, 1664525) + 1013904223) >>> 0
    const j = value % (i + 1)
    ;[grid[i], grid[j]] = [grid[j], grid[i]]
  }
  return grid
}
