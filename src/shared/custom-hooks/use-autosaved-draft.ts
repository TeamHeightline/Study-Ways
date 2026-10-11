import { useCallback, useEffect, useRef, useState } from 'react';

export function useAutosavedDraft<T>(
  initial: T,
  save: (draft: T) => Promise<unknown>,
  delay = 1500,
) {
  const [draft, setDraft] = useState(initial);
  const [state, setState] = useState<'saved' | 'pending' | 'saving' | 'error'>(
    'saved',
  );
  const latest = useRef(initial);
  const revision = useRef(0),
    saved = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout>>();
  const pending = useRef<Promise<boolean> | null>(null);
  const alive = useRef(true);
  const persist = useRef(save);
  persist.current = save;
  const saveNow = useCallback(async function flush(): Promise<boolean> {
    clearTimeout(timer.current);
    if (pending.current) {
      const ok = await pending.current;
      return ok ? flush() : false;
    }
    if (saved.current === revision.current) return true;
    const version = revision.current,
      snapshot = latest.current;
    if (alive.current) setState('saving');
    pending.current = persist
      .current(snapshot)
      .then(() => {
        saved.current = version;
        if (alive.current)
          setState(revision.current === version ? 'saved' : 'pending');
        return true;
      })
      .catch(() => {
        if (alive.current) setState('error');
        return false;
      })
      .finally(() => {
        pending.current = null;
      });
    const ok = await pending.current;
    return ok && revision.current !== saved.current ? flush() : ok;
  }, []);
  const updateDraft = (change: (value: T) => T) => {
    latest.current = change(latest.current);
    revision.current++;
    setDraft(latest.current);
    setState('pending');
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      void saveNow();
    }, delay);
  };
  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
      clearTimeout(timer.current);
      void saveNow();
    };
  }, [saveNow]);
  return { draft, updateDraft, state, saveNow };
}
