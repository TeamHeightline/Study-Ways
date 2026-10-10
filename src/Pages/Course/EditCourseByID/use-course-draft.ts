import { useCallback, useEffect, useRef, useState } from 'react';
import { CourseDraft } from './course-data';

type SaveState = 'saved' | 'pending' | 'saving' | 'error';
type SaveCourse = (options: {
  variables: {
    course_id: string | number;
    name: string;
    new_data: CourseDraft['lines'];
  };
}) => Promise<unknown>;

export function useCourseDraft(
  initial: CourseDraft,
  id: string | number,
  save: SaveCourse,
) {
  const [draft, setDraft] = useState(initial);
  const [saveState, setSaveState] = useState<SaveState>('saved');
  const latest = useRef(initial);
  const revision = useRef(0);
  const savedRevision = useRef(0);
  const pending = useRef<Promise<boolean> | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>();
  const alive = useRef(true);
  const saveRef = useRef(save);
  saveRef.current = save;

  const saveNow = useCallback(
    async function persist(): Promise<boolean> {
      clearTimeout(timer.current);
      if (pending.current) {
        const success = await pending.current;
        return success ? persist() : false;
      }
      if (revision.current === savedRevision.current) return true;
      const snapshot = latest.current;
      const version = revision.current;
      if (alive.current) setSaveState('saving');
      const request = saveRef
        .current({
          variables: {
            course_id: id,
            name: snapshot.name,
            new_data: snapshot.lines,
          },
        })
        .then(() => {
          savedRevision.current = version;
          if (alive.current)
            setSaveState(revision.current === version ? 'saved' : 'pending');
          return true;
        })
        .catch(() => {
          if (alive.current) setSaveState('error');
          return false;
        })
        .finally(() => {
          pending.current = null;
        });
      pending.current = request;
      return request;
    },
    [id],
  );

  const updateDraft = (change: (current: CourseDraft) => CourseDraft) => {
    const next = change(latest.current);
    latest.current = next;
    revision.current++;
    setDraft(next);
    setSaveState('pending');
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      void saveNow();
    }, 2000);
  };

  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
      clearTimeout(timer.current);
      void saveNow();
    };
  }, [saveNow]);
  return { draft, updateDraft, saveState, saveNow };
}
