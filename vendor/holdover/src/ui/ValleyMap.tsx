// Tactical map of the Sarn Valley drawn from the live layout data.
import { NEST, ROADS, ZONES, type XZ, type ZoneId } from '../game/layout.ts'

export interface MapPoint {
  x: number
  z: number
  kind: 'hostile' | 'hvt' | 'civilian' | 'nest'
}

const ZONE_ORDER: ZoneId[] = ['checkpoint', 'village', 'depot', 'compound', 'outpost']

export function ValleyMap({ focus, points = [], height = 230 }: { focus?: ZoneId; points?: MapPoint[]; height?: number }) {
  const viewBox = '-300 -790 600 860'
  const fan = (radius: number) => {
    const a = (40 * Math.PI) / 180
    const x0 = NEST.x + Math.sin(-a) * radius
    const z0 = NEST.z - Math.cos(-a) * radius
    const x1 = NEST.x + Math.sin(a) * radius
    const z1 = NEST.z - Math.cos(a) * radius
    return `M${NEST.x} ${NEST.z} L${x0} ${z0} A${radius} ${radius} 0 0 1 ${x1} ${z1} Z`
  }
  const target = focus ? ZONES[focus] : null
  const range = target ? Math.round(Math.hypot(target.center[0] - NEST.x, target.center[1] - NEST.z)) : 0
  return (
    <div className="map-frame" style={{ height }}>
      <svg viewBox={viewBox} preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full">
        <path d={fan(820)} fill="rgb(217 160 63 / 5%)" stroke="rgb(217 160 63 / 22%)" strokeWidth="1.2" strokeDasharray="6 8" />
        {[200, 400, 600, 800].map((r) => (
          <g key={r}>
            <circle cx={NEST.x} cy={NEST.z} r={r} fill="none" stroke="rgb(255 255 255 / 9%)" strokeWidth="1.2" strokeDasharray="2 10" />
            <text x={NEST.x + 6} y={NEST.z - r + 16} fill="rgb(255 255 255 / 30%)" fontSize="15" fontFamily="JetBrains Mono, monospace">
              {r}
            </text>
          </g>
        ))}
        {ROADS.map((road, i) => (
          <polyline
            key={i}
            points={road.points.map(([x, z]: XZ) => `${x},${z}`).join(' ')}
            fill="none"
            stroke={road.surface === 'asphalt' ? 'rgb(220 226 214 / 30%)' : 'rgb(196 170 120 / 26%)'}
            strokeWidth={road.surface === 'asphalt' ? 5 : 3.5}
            strokeLinejoin="round"
          />
        ))}
        {ZONE_ORDER.map((id) => {
          const zone = ZONES[id]
          const active = id === focus
          return (
            <g key={id}>
              <circle cx={zone.center[0]} cy={zone.center[1]} r={zone.radius * 0.72} fill={active ? 'rgb(217 160 63 / 14%)' : 'rgb(255 255 255 / 3%)'} stroke={active ? '#d9a03f' : 'rgb(255 255 255 / 20%)'} strokeWidth={active ? 2.5 : 1.2} />
              <text x={zone.center[0]} y={zone.center[1] - zone.radius * 0.72 - 10} textAnchor="middle" fill={active ? '#f3c162' : 'rgb(255 255 255 / 45%)'} fontSize="17" fontFamily="Barlow Condensed, sans-serif" fontWeight="600" letterSpacing="2">
                {zone.name.toUpperCase()}
              </text>
            </g>
          )
        })}
        {target && <line x1={NEST.x} y1={NEST.z} x2={target.center[0]} y2={target.center[1]} stroke="#d9a03f" strokeWidth="1.6" strokeDasharray="10 6" />}
        {points.map((point, i) =>
          point.kind === 'nest' ? (
            <rect key={i} x={point.x - 5} y={point.z - 5} width="10" height="10" fill="none" stroke="#e4553e" strokeWidth="2.4" transform={`rotate(45 ${point.x} ${point.z})`} />
          ) : (
            <circle key={i} cx={point.x} cy={point.z} r={point.kind === 'hvt' ? 6 : 4} fill={point.kind === 'civilian' ? '#cfe6ff' : point.kind === 'hvt' ? '#f5c04a' : '#e4553e'} opacity={point.kind === 'civilian' ? 0.6 : 0.95} />
          ),
        )}
        <path d={`M${NEST.x} ${NEST.z - 16} L${NEST.x + 11} ${NEST.z + 8} L${NEST.x - 11} ${NEST.z + 8} Z`} fill="#f3c162" />
        <text x={NEST.x + 18} y={NEST.z + 12} fill="#f3c162" fontSize="15" fontFamily="JetBrains Mono, monospace">
          OVERWATCH
        </text>
      </svg>
      <div className="absolute left-3 top-3 flex gap-2">
        <span className="chip">Sarn Valley · 1:10k</span>
        {target && <span className="chip accent">Range ≈ {range} m</span>}
      </div>
      <div className="label absolute bottom-3 right-3">N ↑</div>
    </div>
  )
}
