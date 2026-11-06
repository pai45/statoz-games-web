import { FINISH_SET } from "../layout"
import { STAND_FRONT } from "./Grandstands"

const TOWERS: [number, number][] = []
// all the way down the straight to the finish
for (let z = 18; z > FINISH_SET.z - 25; z -= 22) {
  // behind the grandstands, looking down over their roofs
  TOWERS.push([STAND_FRONT + 14, z], [-(STAND_FRONT + 14), z])
}

/** Night-race floodlight towers: visual emitters that bloom in the distance. */
export function Floodlights() {
  return (
    <group>
      {TOWERS.map(([x, z]) => (
        <group
          key={`${x}:${z}`}
          position={[x, 0, z]}
          rotation-y={x > 0 ? -Math.PI / 2 : Math.PI / 2}
        >
          <mesh position={[0, 8, 0]}>
            <cylinderGeometry args={[0.14, 0.2, 16, 8]} />
            <meshStandardMaterial
              color="#1c1f24"
              roughness={0.6}
              metalness={0.6}
            />
          </mesh>
          <group position={[0, 16.2, 0.15]} rotation-x={0.45}>
            <mesh>
              <boxGeometry args={[3.4, 1.5, 0.3]} />
              <meshStandardMaterial color="#121418" roughness={0.6} />
            </mesh>
            <mesh position={[0, 0, 0.16]}>
              <planeGeometry args={[3.1, 1.25]} />
              <meshBasicMaterial color={[3.4, 3.5, 3.8]} toneMapped={false} />
            </mesh>
          </group>
        </group>
      ))}
    </group>
  )
}
