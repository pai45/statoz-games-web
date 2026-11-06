import { useStore } from "@/state/store"
import { GANTRY_Z, TRACK_HALF_WIDTH } from "../layout"

const SPAN = TRACK_HALF_WIDTH + 1.4
const LIT = [9, 0.12, 0.08] as const
const OFF = "#160909"

/**
 * Start-light gantry above the start line, driven by the intro sequence and
 * the race start. Columns light left to right as seen from the grid.
 */
export function Gantry() {
  const lights = useStore((s) => s.lights)
  return (
    <group position={[0, 0, GANTRY_Z]}>
      {[-SPAN, SPAN].map((x) => (
        <mesh key={x} position={[x, 3.6, 0]} castShadow>
          <boxGeometry args={[0.5, 7.2, 0.5]} />
          <meshStandardMaterial
            color="#202329"
            roughness={0.6}
            metalness={0.5}
          />
        </mesh>
      ))}
      <mesh position={[0, 6.85, 0]} castShadow>
        <boxGeometry args={[SPAN * 2 + 0.5, 0.55, 0.6]} />
        <meshStandardMaterial color="#202329" roughness={0.6} metalness={0.5} />
      </mesh>
      {/* light housing, facing the grid (-Z) */}
      <group position={[0, 5.75, -0.2]}>
        <mesh>
          <boxGeometry args={[4.2, 1.7, 0.4]} />
          <meshStandardMaterial
            color="#0a0b0d"
            roughness={0.5}
            metalness={0.3}
          />
        </mesh>
        {Array.from({ length: 5 }, (_, col) =>
          [0, 1].map((row) => (
            <mesh
              key={`${col}-${row}`}
              position={[-1.64 + col * 0.82, 0.36 - row * 0.72, -0.205]}
              rotation-y={Math.PI}
            >
              <circleGeometry args={[0.24, 28]} />
              <meshBasicMaterial
                color={lights > 4 - col ? LIT : OFF}
                toneMapped={false}
              />
            </mesh>
          )),
        )}
      </group>
    </group>
  )
}
