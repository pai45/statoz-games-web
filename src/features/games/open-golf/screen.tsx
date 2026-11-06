"use client";
import {useCallback, useState} from 'react';
import {useAuthSession} from '@/features/auth';
import {BundledGame} from '../shared/components/bundled-game';
import {useGameReturn} from '../shared/hooks/use-game-return';
import type {GameLauncherProps} from '../components/game-launcher';
import {OpenGolfLobby, type OpenGolfLaunch} from './components/open-golf-lobby';
import {useOpenGolfProgress} from './state/open-golf-progress';

// StatOz lobby first; the bundle (ordinary WebAssembly memory, also in WebViews)
// opens on the chosen hole or on its own hole select, and exits back here.
export function OpenGolf(props: GameLauncherProps) {
  const account = useAuthSession().email;
  return <AccountOpenGolf key={account || 'guest'} {...props} account={account}/>;
}

function AccountOpenGolf({account, ...props}: GameLauncherProps & {account: string | null}) {
  const leave = useGameReturn();
  const progress = useOpenGolfProgress(account);
  const [round, setRound] = useState<{id: number; launch: OpenGolfLaunch} | null>(null);
  const exit = useCallback(() => setRound(null), []);
  const play = useCallback((launch: OpenGolfLaunch) => setRound(previous => ({id: (previous?.id ?? 0) + 1, launch})), []);
  if (round) return <BundledGame key={round.id} {...props} launch={round.launch} onExit={exit}/>;
  return <OpenGolfLobby progress={progress} onBack={leave} onPlay={play}/>;
}
