import React, { useEffect, useMemo, useState } from 'react';
import { useThemeSettings } from '../../global-theme';
import { ThemeIllustration } from './ThemeIllustration';
import {
  ManulContext,
  ManulThought,
  manulNotes,
  pickManulThoughts,
} from './manul-content';
const previousSelections = new Map<ManulContext, ManulThought[]>();
export const ThemeManulNote = ({
  context,
  compact = false,
}: {
  context: ManulContext;
  compact?: boolean;
}) => {
  const store = useThemeSettings();
  const thoughts = useMemo(
    () => pickManulThoughts(context, previousSelections.get(context)),
    [context],
  );
  const [selection, setSelection] = useState({ thoughts, index: 0 });
  const pack = store.definition.illustrations;
  useEffect(() => {
    if (pack === 'manul') previousSelections.set(context, thoughts);
  }, [context, thoughts, pack]);
  if (pack !== 'manul') return null;
  const note = manulNotes[context];
  const index = selection.thoughts === thoughts ? selection.index : 0;
  const thought = thoughts[index];
  return (
    <aside
      className={`sw-manul-note${compact ? ' is-compact' : ''}${thought.variant === 'counting' ? ' is-scene' : ''}`}
      aria-label={note.label}
    >
      <div className="sw-manul-note-art" aria-hidden="true">
        <span />
        <ThemeIllustration variant={thought.variant} />
      </div>
      <div className="sw-manul-note-copy">
        <span className="sw-manul-note-label">{note.label}</span>
        <blockquote aria-live="polite" aria-atomic="true">
          <p>{thought.quote}</p>
        </blockquote>
        <div className="sw-manul-note-footer">
          <span aria-hidden="true">
            Мысль {index + 1} из {thoughts.length}
          </span>
          <button
            type="button"
            aria-label={`Ещё манулья мысль: ${note.label}`}
            onClick={() =>
              setSelection({ thoughts, index: (index + 1) % thoughts.length })
            }
          >
            <span aria-hidden="true">↻</span> Ещё мысль
          </button>
        </div>
      </div>
    </aside>
  );
};
