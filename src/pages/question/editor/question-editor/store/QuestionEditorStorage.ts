import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { QuestionEditorData } from '../../../question-read-api';
export enum variantsOfStateOfSave {
  SAVED = 'SAVED',
  SAVING = 'SAVING',
  ERROR = 'ERROR',
}
export interface QuestionDraft {
  id: number;
  createdById: number | null;
  text: string;
  numberOfShowingAnswers: string;
  connectedThemeId?: string;
  image: string | null;
}
interface Entry {
  draft: QuestionDraft;
  revision: number;
  savedRevision: number;
  saveState: 'saved' | 'pending' | 'saving' | 'error';
  showPreview: boolean;
  mounts: number;
}
const slice = createSlice({
  name: 'questionEditor',
  initialState: { entries: {} as Record<string, Entry> },
  reducers: {
    initialized(
      state,
      action: PayloadAction<{ key: string; data: QuestionEditorData }>,
    ) {
      const { key, data } = action.payload;
      if (state.entries[key]) return;
      state.entries[key] = {
        draft: {
          id: Number(data.id),
          createdById: data.createdById,
          text: data.text,
          numberOfShowingAnswers: String(data.numberOfShowingAnswers),
          connectedThemeId: data.connectedTheme?.id,
          image: data.image,
        },
        revision: 0,
        savedRevision: 0,
        saveState: 'saved',
        showPreview: false,
        mounts: 0,
      };
    },
    attached(state, action: PayloadAction<string>) {
      const e = state.entries[action.payload];
      if (e) e.mounts++;
    },
    detached(state, action: PayloadAction<string>) {
      const e = state.entries[action.payload];
      if (e) e.mounts = Math.max(0, e.mounts - 1);
    },
    released(state, action: PayloadAction<string>) {
      const e = state.entries[action.payload];
      if (e && !e.mounts && e.revision === e.savedRevision)
        delete state.entries[action.payload];
    },
    changed(
      state,
      action: PayloadAction<{ key: string; patch: Partial<QuestionDraft> }>,
    ) {
      const e = state.entries[action.payload.key];
      if (!e) return;
      const changed = Object.entries(action.payload.patch).some(
        ([field, value]) => e.draft[field] !== value,
      );
      if (!changed) return;
      Object.assign(e.draft, action.payload.patch);
      e.revision++;
      e.saveState = 'pending';
    },
    previewToggled(state, action: PayloadAction<string>) {
      const e = state.entries[action.payload];
      if (e) e.showPreview = !e.showPreview;
    },
    saving(state, action: PayloadAction<string>) {
      const e = state.entries[action.payload];
      if (e) e.saveState = 'saving';
    },
    saved(state, action: PayloadAction<{ key: string; revision: number }>) {
      const e = state.entries[action.payload.key];
      if (!e) return;
      e.savedRevision = Math.max(e.savedRevision, action.payload.revision);
      e.saveState = e.savedRevision === e.revision ? 'saved' : 'pending';
    },
    failed(state, action: PayloadAction<{ key: string; revision: number }>) {
      const e = state.entries[action.payload.key];
      if (e)
        e.saveState =
          e.revision === action.payload.revision ? 'error' : 'pending';
    },
    imageUploaded(
      state,
      action: PayloadAction<{ key: string; image: string }>,
    ) {
      const e = state.entries[action.payload.key];
      if (e) e.draft.image = action.payload.image;
    },
  },
});
export const questionEditorActions = slice.actions;
export default slice.reducer;
