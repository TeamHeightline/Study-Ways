import React, { useState } from 'react';
import { observer } from 'mobx-react';
import ThemeStoreObject from '../../global-theme';
import { ThemeStore } from './theme-store';
import { ThemeIllustration } from './ThemeIllustration';
import { ManulContext, manulNotes } from './manul-content';

export const ThemeManulNote = observer(
  ({
    context,
    compact = false,
    store = ThemeStoreObject,
  }: {
    context: ManulContext;
    compact?: boolean;
    store?: ThemeStore;
  }) => {
    const [selection, setSelection] = useState({ context, index: 0 });
    if (store.definition.illustrations !== 'manul') return null;
    const note = manulNotes[context];
    const index = selection.context === context ? selection.index : 0;
    return (
      <aside
        className={`sw-manul-note${compact ? ' is-compact' : ''}${context === 'history' ? ' is-scene' : ''}`}
        aria-label={note.label}
      >
        <div className="sw-manul-note-art" aria-hidden="true">
          <span />
          <ThemeIllustration
            variant={note.variants[index % note.variants.length]}
            store={store}
          />
        </div>
        <div className="sw-manul-note-copy">
          <span className="sw-manul-note-label">{note.label}</span>
          <blockquote aria-live="polite" aria-atomic="true">
            <p>{note.quotes[index]}</p>
          </blockquote>
          <div className="sw-manul-note-footer">
            <span aria-hidden="true">
              Мысль {index + 1} из {note.quotes.length}
            </span>
            <button
              type="button"
              aria-label={`Ещё манулья мысль: ${note.label}`}
              onClick={() =>
                setSelection({
                  context,
                  index: (index + 1) % note.quotes.length,
                })
              }
            >
              <span aria-hidden="true">↻</span> Ещё мысль
            </button>
          </div>
        </div>
      </aside>
    );
  },
);
