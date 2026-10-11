import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { EditorAnswer } from '../../../../question-read-api';

export type AnswerField = keyof Omit<EditorAnswer, 'id' | 'question' | 'image'>;
interface Entry {
  draft: EditorAnswer;
  revision: number;
  savedRevision: number;
  saveState: 'saved' | 'pending' | 'saving' | 'error';
  imageVersion: number;
  mounts: number;
}
interface AnswerEditorState {
  entries: Record<string, Entry>;
}
const initialState: AnswerEditorState = { entries: {} };
const slice = createSlice({
  name: 'answerEditor',
  initialState,
  reducers: {
    initializeAnswer(
      state,
      { payload }: PayloadAction<{ key: string; draft: EditorAnswer }>,
    ) {
      if (state.entries[payload.key]) return;
      state.entries[payload.key] = {
        draft: payload.draft,
        revision: 0,
        savedRevision: 0,
        saveState: 'saved',
        imageVersion: 0,
        mounts: 0,
      };
    },
    attachAnswer(state, { payload: key }: PayloadAction<string>) {
      const entry = state.entries[key];
      if (entry) entry.mounts++;
    },
    detachAnswer(state, { payload: key }: PayloadAction<string>) {
      const entry = state.entries[key];
      if (entry) entry.mounts = Math.max(0, entry.mounts - 1);
    },
    releaseSavedAnswer(state, { payload: key }: PayloadAction<string>) {
      const entry = state.entries[key];
      if (entry && !entry.mounts && entry.revision === entry.savedRevision)
        delete state.entries[key];
    },
    changeAnswerField(
      state,
      {
        payload,
      }: PayloadAction<{
        key: string;
        field: AnswerField;
        value: string | number | boolean;
      }>,
    ) {
      const entry = state.entries[payload.key];
      if (!entry || entry.draft[payload.field] === payload.value) return;
      Object.assign(entry.draft, { [payload.field]: payload.value });
      if (payload.field === 'isTrue') {
        const previous = payload.value
          ? 'Вы допустили одну или более ошибок'
          : 'Ваш ответ следует дополнить';
        const next = payload.value
          ? 'Ваш ответ следует дополнить'
          : 'Вы допустили одну или более ошибок';
        for (const field of [
          'helpTextv1',
          'helpTextv2',
          'helpTextv3',
        ] as const) {
          if (!entry.draft[field] || entry.draft[field] === previous)
            entry.draft[field] = next;
        }
      }
      entry.revision++;
      entry.saveState = 'pending';
    },
    savingAnswer(state, { payload: key }: PayloadAction<string>) {
      const entry = state.entries[key];
      if (entry) entry.saveState = 'saving';
    },
    answerSaved(
      state,
      { payload }: PayloadAction<{ key: string; revision: number }>,
    ) {
      const entry = state.entries[payload.key];
      if (!entry) return;
      entry.savedRevision = Math.max(entry.savedRevision, payload.revision);
      entry.saveState =
        entry.savedRevision === entry.revision ? 'saved' : 'pending';
    },
    answerSaveFailed(
      state,
      { payload }: PayloadAction<{ key: string; revision: number }>,
    ) {
      const entry = state.entries[payload.key];
      if (entry)
        entry.saveState =
          entry.revision === payload.revision ? 'error' : 'pending';
    },
    answerImageUploaded(
      state,
      { payload }: PayloadAction<{ key: string; image: string }>,
    ) {
      const entry = state.entries[payload.key];
      if (!entry) return;
      entry.draft.image = payload.image;
      entry.imageVersion++;
      // The upload endpoint stores the file; restoring a previously deleted image
      // is a separate answer field and must also be saved.
      if (entry.draft.isImageDeleted) {
        entry.draft.isImageDeleted = false;
        entry.revision++;
        entry.saveState = 'pending';
      }
    },
  },
});
export const {
  initializeAnswer,
  attachAnswer,
  detachAnswer,
  releaseSavedAnswer,
  changeAnswerField,
  savingAnswer,
  answerSaved,
  answerSaveFailed,
  answerImageUploaded,
} = slice.actions;
export default slice.reducer;
