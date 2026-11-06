import { useState, type ReactNode } from 'react'

import type { Settings } from '../../game/progression.ts'
import { ScreenHeader, Segmented, Switch, sfx, useEscape } from '../common.tsx'

function Row({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <div className="setting">
      <div>
        <div className="text-[15px] font-medium">{label}</div>
        {hint && <div className="text-[12.5px] text-[var(--text-faint)]">{hint}</div>}
      </div>
      <div className="flex justify-end">{children}</div>
    </div>
  )
}

function Slider({ value, min, max, step, onChange, format }: { value: number; min: number; max: number; step: number; onChange: (value: number) => void; format: (value: number) => string }) {
  return (
    <div className="flex w-full items-center gap-3">
      <input className="range" type="range" min={min} max={max} step={step} value={value} onChange={(event) => onChange(Number(event.target.value))} />
      <span className="mono w-12 text-right text-[12px] text-[var(--text-dim)]">{format(value)}</span>
    </div>
  )
}

const CONTROLS: Array<[string, string]> = [
  ['Mouse', 'Aim'],
  ['Right mouse', 'Scope (hold or toggle)'],
  ['Left mouse', 'Fire · skip bullet camera'],
  ['Wheel · Q / E', 'Magnification'],
  ['Shift', 'Hold breath'],
  ['Space', 'Drop into cover'],
  ['↑ / ↓', 'Adjust zero'],
  ['F', 'Rangefinder and tag'],
  ['R', 'Reload'],
  ['T', 'Thermal (night missions)'],
  ['W A S D', 'Fine aim without a mouse'],
  ['Esc', 'Pause'],
]

export function SettingsScreen({
  settings,
  callsign,
  onChange,
  onCallsign,
  onReset,
  onBack,
  inGame = false,
}: {
  settings: Settings
  callsign: string
  onChange: (settings: Settings) => void
  onCallsign: (callsign: string) => void
  onReset: () => void
  onBack: () => void
  inGame?: boolean
}) {
  useEscape(onBack)
  const [name, setName] = useState(callsign)
  const [confirm, setConfirm] = useState(false)
  const set = <K extends keyof Settings>(key: K, value: Settings[K]) => onChange({ ...settings, [key]: value })
  const pct = (value: number) => `${Math.round(value * 100)}%`
  return (
    <div className="screen">
      <ScreenHeader kicker="Configuration" title="Settings" onBack={onBack} />
      <div className="grid min-h-0 flex-1 gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_300px]">
        <div className="panel scroll min-h-0 px-5 pb-4">
          <div className="label accent pb-1 pt-5">Controls</div>
          <Row label="Mouse sensitivity">
            <Slider value={settings.sensitivity} min={0.2} max={3} step={0.05} onChange={(v) => set('sensitivity', v)} format={(v) => v.toFixed(2)} />
          </Row>
          <Row label="Scoped sensitivity" hint="Relative to magnification">
            <Slider value={settings.scopedSensitivity} min={0.2} max={2} step={0.05} onChange={(v) => set('scopedSensitivity', v)} format={(v) => v.toFixed(2)} />
          </Row>
          <Row label="Invert vertical look">
            <Switch label="Invert vertical look" on={settings.invertY} onChange={(v) => set('invertY', v)} />
          </Row>
          <Row label="Scope input">
            <Segmented
              options={[
                { value: 'hold', label: 'Hold' },
                { value: 'toggle', label: 'Toggle' },
              ]}
              value={settings.scopeMode}
              onChange={(v) => set('scopeMode', v)}
            />
          </Row>
          <div className="label accent pb-1 pt-6">Gameplay</div>
          <Row label="Ballistic assist" hint="Red dot shows predicted impact. +20% XP when off">
            <Switch label="Ballistic assist" on={settings.ballisticAssist} onChange={(v) => set('ballisticAssist', v)} />
          </Row>
          <Row label="Field hints">
            <Switch label="Field hints" on={settings.hints} onChange={(v) => set('hints', v)} />
          </Row>
          <Row label="Bullet camera">
            <Segmented
              options={[
                { value: 'final', label: 'Final' },
                { value: 'always', label: 'Kills' },
                { value: 'off', label: 'Off' },
              ]}
              value={settings.killCam}
              onChange={(v) => set('killCam', v)}
            />
          </Row>
        </div>
        <div className="panel scroll min-h-0 px-5 pb-4">
          <div className="label accent pb-1 pt-5">Video</div>
          <Row label="Quality" hint="Resolution, anti-aliasing, shadows and bloom">
            <Segmented
              options={[
                { value: 'high', label: 'High' },
                { value: 'balanced', label: 'Balanced' },
                { value: 'performance', label: 'Fast' },
              ]}
              value={settings.quality}
              onChange={(v) => set('quality', v)}
            />
          </Row>
          <Row label="Field of view">
            <Slider value={settings.fov} min={55} max={90} step={1} onChange={(v) => set('fov', v)} format={(v) => `${v}°`} />
          </Row>
          <Row label="Reduce camera shake">
            <Switch label="Reduce camera shake" on={settings.reduceShake} onChange={(v) => set('reduceShake', v)} />
          </Row>
          <Row label="Reduce flashing" hint="Dims muzzle flash, glint and sparks">
            <Switch label="Reduce flashing" on={settings.reduceFlashing} onChange={(v) => set('reduceFlashing', v)} />
          </Row>
          <div className="label accent pb-1 pt-6">Audio</div>
          <Row label="Master volume">
            <Slider value={settings.masterVolume} min={0} max={1} step={0.01} onChange={(v) => set('masterVolume', v)} format={pct} />
          </Row>
          <Row label="Effects">
            <Slider value={settings.sfxVolume} min={0} max={1} step={0.01} onChange={(v) => set('sfxVolume', v)} format={pct} />
          </Row>
          <Row label="Music">
            <Slider value={settings.musicVolume} min={0} max={1} step={0.01} onChange={(v) => set('musicVolume', v)} format={pct} />
          </Row>
        </div>
        <div className="flex min-h-0 flex-col gap-4">
          <div className="panel p-5">
            <div className="label accent mb-3">Callsign</div>
            <input
              className="text-input"
              value={name}
              maxLength={16}
              onChange={(event) => setName(event.target.value)}
              onBlur={() => onCallsign(name)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') onCallsign(name)
                event.stopPropagation()
              }}
              aria-label="Callsign"
            />
            {!inGame && (
              <div className="mt-5">
                {confirm ? (
                  <div className="flex flex-col gap-2">
                    <span className="text-[13px] text-[var(--text-dim)]">Erase rank, unlocks and campaign progress?</span>
                    <div className="flex gap-2">
                      <button type="button" className="btn danger small flex-1" onClick={onReset} {...sfx('back')}>
                        Erase
                      </button>
                      <button type="button" className="btn small flex-1" onClick={() => setConfirm(false)} {...sfx()}>
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <button type="button" className="btn-ghost" onClick={() => setConfirm(true)} {...sfx()}>
                    Reset progress
                  </button>
                )}
              </div>
            )}
          </div>
          <div className="panel scroll min-h-0 p-5">
            <div className="label accent mb-3">Controls</div>
            <div className="flex flex-col gap-2">
              {CONTROLS.map(([key, action]) => (
                <div key={key} className="flex items-center justify-between gap-3 text-[13px]">
                  <span className="keycap">{key}</span>
                  <span className="text-right text-[var(--text-dim)]">{action}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
