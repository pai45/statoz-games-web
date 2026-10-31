import { useCallback, useEffect, useRef, useState } from 'react';
import { emptySave, readSave, writeSave } from './storage';
import type { CupSave } from './types';

/** A synchronous owner prevents checkpoint callbacks overwriting newer results. */
export function useCupSave(scope: string) {
  const current = useRef<CupSave>(emptySave());
  const [save, setSave] = useState<CupSave>(emptySave), [ready, setReady] = useState(false), [error, setError] = useState(''), [notice, setNotice] = useState('');
  useEffect(() => {
    const timer = setTimeout(() => {
      let loaded: ReturnType<typeof readSave>;
      try { loaded = readSave(localStorage, scope); } catch { loaded = { save: emptySave(), error: '', unavailable: true }; }
      current.current = loaded.save; setSave(loaded.save); setError(loaded.error); setReady(true);
      if (loaded.unavailable) setNotice('Session only'); else if (loaded.recovered) setNotice('Cup recovered');
    }, 0);
    return () => clearTimeout(timer);
  }, [scope]);
  const commit = useCallback((change: (previous: CupSave) => CupSave) => {
    const previous = current.current, next = change(previous);
    if (next === previous) return;
    const updated = { ...next, revision: previous.revision + 1 };
    current.current = updated; setSave(updated);
    try { if (writeSave(localStorage, scope, updated)) return; } catch {}
    setNotice('Progress stays in this session');
  }, [scope]);
  return { save, ready, error, notice, commit, clearError: () => setError('') };
}
