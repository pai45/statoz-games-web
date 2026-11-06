import { sfx, useEscape } from '../common.tsx'

export function PauseMenu({ title, sub, onResume, onRestart, onSettings, onQuit }: { title: string; sub: string; onResume: () => void; onRestart: () => void; onSettings: () => void; onQuit: () => void }) {
  useEscape(onResume)
  return (
    <div className="modal">
      <div className="panel flex w-[min(440px,92vw)] flex-col gap-2 p-7">
        <div className="label accent">{sub}</div>
        <div className="display mb-4 text-[52px]">{title}</div>
        <button type="button" className="btn primary" onClick={onResume} {...sfx('confirm')}>
          Resume
        </button>
        <button type="button" className="btn" onClick={onRestart} {...sfx()}>
          Restart
        </button>
        <button type="button" className="btn" onClick={onSettings} {...sfx()}>
          Settings
        </button>
        <button type="button" className="btn danger" onClick={onQuit} {...sfx('back')}>
          Abandon
        </button>
      </div>
    </div>
  )
}
