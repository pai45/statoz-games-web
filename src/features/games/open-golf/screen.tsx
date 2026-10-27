"use client";
import {BundledGame} from '../shared/components/bundled-game';
import type {GameLauncherProps} from '../components/game-launcher';

// The mobile runtime uses ordinary WebAssembly memory, including in WebViews.
export function OpenGolf(props: GameLauncherProps) {
  return <BundledGame {...props}/>;
}
