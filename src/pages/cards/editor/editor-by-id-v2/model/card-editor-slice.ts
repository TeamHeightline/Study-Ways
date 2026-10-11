import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CardDraft } from './types';

export type SaveState = 'saved' | 'pending' | 'saving' | 'error';
interface DraftEntry {
  draft: CardDraft;
  imagePath: string;
  imageVersion: number;
  revision: number;
  savedRevision: number;
  saveState: SaveState;
  mounts: number;
}
interface CardEditorState {
  entries: Record<string, DraftEntry>;
}
const initialState: CardEditorState = { entries: {} };
export type CardField = keyof Omit<CardDraft, 'id' | 'created_by_id'>;
export type CardFieldChange = {
  key: string;
  field: CardField;
  value: string | number | boolean | string[] | number[] | null;
};

const slice = createSlice({
  name: 'cardEditor',
  initialState,
  reducers: {
    initializeDraft(
      state,
      {
        payload,
      }: PayloadAction<{ key: string; draft: CardDraft; imagePath: string }>,
    ) {
      if (state.entries[payload.key]) return;
      state.entries[payload.key] = {
        draft: payload.draft,
        imagePath: payload.imagePath,
        imageVersion: 0,
        revision: 0,
        savedRevision: 0,
        saveState: 'saved',
        mounts: 0,
      };
    },
    attachDraft(state, { payload: key }: PayloadAction<string>) {
      const entry = state.entries[key];
      if (entry) entry.mounts++;
    },
    detachDraft(state, { payload: key }: PayloadAction<string>) {
      const entry = state.entries[key];
      if (entry) entry.mounts = Math.max(0, entry.mounts - 1);
    },
    releaseSavedDraft(state, { payload: key }: PayloadAction<string>) {
      const entry = state.entries[key];
      if (entry && !entry.mounts && entry.revision === entry.savedRevision)
        delete state.entries[key];
    },
    changeCardField(state, { payload }: PayloadAction<CardFieldChange>) {
      const entry = state.entries[payload.key];
      if (!entry) return;
      let value = payload.value;
      if (payload.field === 'connectedTheme')
        value = [
          ...new Set((value as Array<string | number>).map(Number)),
        ].filter(id => Number.isInteger(id) && id > 0);
      else if (
        payload.field === 'test_before_card_id' ||
        payload.field === 'test_in_card_id'
      )
        value = value === '' || value === null ? null : Number(value);
      else if (
        payload.field === 'hard_level' ||
        payload.field === 'card_content_type'
      )
        value = Number(value);
      if (JSON.stringify(entry.draft[payload.field]) === JSON.stringify(value))
        return;
      Object.assign(entry.draft, { [payload.field]: value });
      entry.revision++;
      entry.saveState = 'pending';
    },
    savingDraft(state, { payload: key }: PayloadAction<string>) {
      const entry = state.entries[key];
      if (entry) entry.saveState = 'saving';
    },
    draftSaved(
      state,
      { payload }: PayloadAction<{ key: string; revision: number }>,
    ) {
      const entry = state.entries[payload.key];
      if (!entry) return;
      entry.savedRevision = Math.max(entry.savedRevision, payload.revision);
      entry.saveState =
        entry.savedRevision === entry.revision ? 'saved' : 'pending';
    },
    draftSaveFailed(
      state,
      { payload }: PayloadAction<{ key: string; revision: number }>,
    ) {
      const entry = state.entries[payload.key];
      if (entry)
        entry.saveState =
          entry.revision === payload.revision ? 'error' : 'pending';
    },
    cardImageUploaded(
      state,
      { payload }: PayloadAction<{ key: string; image: string }>,
    ) {
      const entry = state.entries[payload.key];
      if (!entry) return;
      entry.imagePath = payload.image;
      entry.imageVersion++;
    },
  },
});

export const {
  initializeDraft,
  attachDraft,
  detachDraft,
  releaseSavedDraft,
  changeCardField,
  savingDraft,
  draftSaved,
  draftSaveFailed,
  cardImageUploaded,
} = slice.actions;
export default slice.reducer;
