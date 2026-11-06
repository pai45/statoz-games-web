import type { TimePresetId } from '../../game/data.ts'
import { IconCloud, IconHorizon, IconMoon, IconSun } from '../icons.tsx'

export function TimeIcon({ time, size = 15 }: { time: TimePresetId; size?: number }) {
  if (time === 'night') return <IconMoon size={size} />
  if (time === 'overcast') return <IconCloud size={size} />
  if (time === 'dawn' || time === 'dusk') return <IconHorizon size={size} />
  return <IconSun size={size} />
}

export const TIME_LABEL: Record<TimePresetId, string> = {
  dawn: 'Dawn',
  day: 'Morning',
  noon: 'Noon',
  overcast: 'Overcast',
  dusk: 'Dusk',
  night: 'Night',
}
