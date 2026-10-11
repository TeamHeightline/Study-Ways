import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useStore } from 'react-redux';
import {
  RootState,
  useAppDispatch,
  useAppSelector,
} from '../../../../../app/redux-store/RootStore';
import {
  useSaveCardMutation,
  useCopyCardMutation,
  useUploadMaterialImageMutation,
} from '../../../../../shared/server-layer/query-layer/write-api';
import {
  getAuthSessionVersion,
  isAuthSessionActive,
} from '../../../../../shared/server-layer/query-layer/auth-session';
import { selectUserSession } from '../../../../../shared/store/user-store/user-session';
import { serializeWrite } from '../../../../../shared/server-layer/query-layer/write-queue';
import { FILE_URL } from '../../../../../settings';
import { cardWriteData } from './types';
import {
  attachDraft,
  detachDraft,
  releaseSavedDraft,
  changeCardField,
  savingDraft,
  draftSaved,
  draftSaveFailed,
  cardImageUploaded,
  CardField,
  CardFieldChange,
} from './card-editor-slice';

const editorRoles = ['ADMIN', 'TEACHER', 'CARD_EDITOR'];

export function useCardEditorController(key: string, userId: number) {
  const store = useStore<RootState>();
  const dispatch = useAppDispatch();
  const entry = useAppSelector(state => state.cardEditor.entries[key]);
  const [saveCard] = useSaveCardMutation();
  const [copyCard, copy] = useCopyCardMutation();
  const [uploadImage, upload] = useUploadMaterialImageMutation();
  const [copyOpen, setCopyOpen] = useState(false);
  const version = useRef(getAuthSessionVersion()).current;
  const timer = useRef<ReturnType<typeof setTimeout>>();
  const pending = useRef<Promise<boolean> | null>(null);
  const getEntry = useCallback(
    () => store.getState().cardEditor.entries[key],
    [store, key],
  );
  const assertSession = useCallback(() => {
    const session = selectUserSession(store.getState());
    const draft = getEntry()?.draft;
    if (
      !isAuthSessionActive() ||
      getAuthSessionVersion() !== version ||
      session.user?.id !== userId ||
      !editorRoles.includes(session.role) ||
      !draft ||
      (session.role !== 'ADMIN' && draft.created_by_id !== userId)
    ) {
      throw new Error('Недостаточно прав или сессия изменилась.');
    }
  }, [getEntry, store, userId, version]);

  const saveNow = useCallback(
    async function flush(): Promise<boolean> {
      if (getAuthSessionVersion() !== version) return false;
      clearTimeout(timer.current);
      if (pending.current) {
        const ok = await pending.current;
        return ok || getEntry()?.saveState === 'pending' ? flush() : false;
      }
      const current = getEntry();
      if (!current || current.revision === current.savedRevision) return true;
      const { draft, revision } = current;
      dispatch(savingDraft(key));
      pending.current = serializeWrite(`card-${draft.id}`, async () => {
        assertSession();
        await saveCard({ id: draft.id, data: cardWriteData(draft) }).unwrap();
      })
        .then(() => {
          if (getAuthSessionVersion() !== version) return false;
          dispatch(draftSaved({ key, revision }));
          return true;
        })
        .catch(() => {
          if (getAuthSessionVersion() !== version) return false;
          dispatch(draftSaveFailed({ key, revision }));
          return false;
        })
        .finally(() => {
          pending.current = null;
        });
      const ok = await pending.current;
      const latest = getEntry();
      return latest &&
        latest.revision > revision &&
        latest.revision !== latest.savedRevision
        ? flush()
        : ok;
    },
    [assertSession, dispatch, getEntry, key, saveCard, version],
  );

  useEffect(() => {
    if (entry?.saveState !== 'pending') return;
    timer.current = setTimeout(() => {
      void saveNow();
    }, 2000);
    return () => clearTimeout(timer.current);
  }, [entry?.revision, entry?.saveState, saveNow]);

  const ready = !!entry;
  useEffect(() => {
    if (!ready) return;
    dispatch(attachDraft(key));
    return () => {
      clearTimeout(timer.current);
      dispatch(detachDraft(key));
      void saveNow().finally(() => dispatch(releaseSavedDraft(key)));
    };
  }, [dispatch, key, ready, saveNow]);

  const isSaved =
    entry?.saveState === 'saved' && !upload.isLoading && !copy.isLoading;
  useEffect(() => {
    if (!entry || isSaved) return;
    const warn = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = '';
    };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [ready, isSaved]);

  if (!entry) return undefined;
  const siteUrl = entry.draft.site_url;
  let isUrlValid = true;
  if (siteUrl) {
    try {
      isUrlValid = ['http:', 'https:'].includes(new URL(siteUrl).protocol);
    } catch {
      isUrlValid = false;
    }
  }
  const imagePath = entry.imagePath;
  const imageUrl = imagePath
    ? `${/^https?:\/\//.test(imagePath) ? imagePath : `${FILE_URL}/${imagePath}`}${imagePath.includes('?') ? '&' : '?'}v=${entry.imageVersion}`
    : undefined;
  const changeFieldByValue = (
    field: CardField,
    value: CardFieldChange['value'],
  ) => dispatch(changeCardField({ key, field, value }));
  return {
    draft: entry.draft,
    saveState: entry.saveState,
    isSaved,
    imageUrl,
    isUrlValid,
    saveNow,
    changeFieldByValue,
    changeField:
      (field: CardField, eventField: 'value' | 'checked' = 'value') =>
      ({ target }: { target: { value?: unknown; checked?: boolean } }) =>
        changeFieldByValue(
          field,
          target[eventField] as CardFieldChange['value'],
        ),
    copyOpen,
    copying: copy.isLoading,
    openCopyCardDialog: () => setCopyOpen(true),
    closeCopyCardDialog: () => setCopyOpen(false),
    createCopyCard: async () => {
      if (!(await saveNow()))
        throw new Error('Не удалось сохранить карточку перед копированием.');
      return serializeWrite(`card-${entry.draft.id}`, async () => {
        assertSession();
        const data = await copyCard(entry.draft.id).unwrap();
        assertSession();
        return { data };
      });
    },
    handleUploadImage: async (file: File) => {
      assertSession();
      const result = await uploadImage({
        kind: 'card',
        id: entry.draft.id,
        file,
      }).unwrap();
      assertSession();
      dispatch(cardImageUploaded({ key, image: result.image }));
    },
  };
}

type CardEditorController = NonNullable<
  ReturnType<typeof useCardEditorController>
>;
const CardEditorContext = createContext<CardEditorController | null>(null);
export const CardEditorProvider = CardEditorContext.Provider;
export function useCardEditor() {
  const value = useContext(CardEditorContext);
  if (!value)
    throw new Error(
      'Редактор карточки должен находиться внутри CardEditorProvider',
    );
  return value;
}
