import {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useStore } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  RootState,
  useAppDispatch,
  useAppSelector,
} from '../../../../../app/redux-store/RootStore';
import {
  selectUserSession,
  useUserSession,
} from '../../../../../shared/store/user-store/user-session';
import {
  getAuthSessionVersion,
  isAuthSessionActive,
} from '../../../../../shared/server-layer/query-layer/auth-session';
import { serializeWrite } from '../../../../../shared/server-layer/query-layer/write-queue';
import {
  useSaveQuestionMutation,
  useCopyQuestionMutation,
  useUploadMaterialImageMutation,
} from '../../../../../shared/server-layer/query-layer/write-api';
import {
  useGetQuestionEditorDataQuery,
  questionReadApi,
} from '../../../question-read-api';
import { FILE_URL } from '../../../../../settings';
import {
  questionEditorActions as actions,
  QuestionDraft,
  variantsOfStateOfSave,
} from './QuestionEditorStorage';
export function useQuestionEditorController(id: number) {
  const store = useStore<RootState>();
  const dispatch = useAppDispatch();
  const session = useUserSession();
  const userId = session.user?.id;
  const key = userId + ':' + id;
  const navigate = useNavigate();
  const query = useGetQuestionEditorDataQuery(
    { id, userId },
    {
      skip:
        !userId ||
        !['ADMIN', 'TEACHER'].includes(session.role) ||
        !Number.isInteger(id) ||
        id < 1,
    },
  );
  const entry = useAppSelector(s => s.questionEditor.entries[key]);
  const [saveQuestion] = useSaveQuestionMutation();
  const [copyQuestion, copy] = useCopyQuestionMutation();
  const [uploadImage, upload] = useUploadMaterialImageMutation();
  const [operationError, setOperationError] = useState('');
  const version = useMemo(getAuthSessionVersion, [userId]);
  const timer = useRef<ReturnType<typeof setTimeout>>();
  const pending = useRef<Promise<boolean> | null>(null);
  const copying = useRef(false);
  const uploading = useRef(false);
  const getEntry = useCallback(
    () => store.getState().questionEditor.entries[key],
    [store, key],
  );
  const assertSession = useCallback(() => {
    const current = selectUserSession(store.getState());
    const draft = getEntry()?.draft;
    if (
      !isAuthSessionActive() ||
      getAuthSessionVersion() !== version ||
      current.user?.id !== userId ||
      !['ADMIN', 'TEACHER'].includes(current.role) ||
      !draft ||
      (current.role !== 'ADMIN' && draft.createdById !== userId)
    )
      throw new Error('Недостаточно прав или сессия изменилась.');
  }, [store, getEntry, userId, version]);
  useEffect(() => {
    if (query.currentData)
      dispatch(actions.initialized({ key, data: query.currentData }));
  }, [dispatch, key, query.currentData]);
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
      dispatch(actions.saving(key));
      pending.current = serializeWrite('question-' + draft.id, async () => {
        assertSession();
        await saveQuestion({
          id: draft.id,
          data: {
            text: draft.text,
            number_of_showing_answers: Number(draft.numberOfShowingAnswers),
            connected_theme_id: draft.connectedThemeId
              ? Number(draft.connectedThemeId)
              : null,
          },
        }).unwrap();
        assertSession();
        dispatch(
          questionReadApi.util.updateQueryData(
            'getQuestionEditorData',
            { id: draft.id, userId },
            cached => {
              if (cached) {
                cached.text = draft.text;
                cached.numberOfShowingAnswers = Number(
                  draft.numberOfShowingAnswers,
                );
                cached.connectedTheme = draft.connectedThemeId
                  ? { id: draft.connectedThemeId }
                  : null;
              }
            },
          ),
        );
      })
        .then(() => {
          if (getAuthSessionVersion() !== version) return false;
          dispatch(actions.saved({ key, revision }));
          return true;
        })
        .catch(() => {
          if (getAuthSessionVersion() === version)
            dispatch(actions.failed({ key, revision }));
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
    [assertSession, dispatch, getEntry, key, saveQuestion, userId, version],
  );
  useEffect(() => {
    if (entry?.saveState !== 'pending') return;
    timer.current = setTimeout(() => {
      void saveNow();
    }, 1500);
    return () => clearTimeout(timer.current);
  }, [entry?.revision, entry?.saveState, saveNow]);
  const ready = !!entry;
  useEffect(() => {
    if (!ready) return;
    dispatch(actions.attached(key));
    return () => {
      clearTimeout(timer.current);
      dispatch(actions.detached(key));
      void saveNow().finally(() => dispatch(actions.released(key)));
    };
  }, [dispatch, key, ready, saveNow]);
  const unsavedFlag =
    !!entry &&
    (entry.saveState !== 'saved' || upload.isLoading || copy.isLoading);
  useEffect(() => {
    if (!unsavedFlag) return;
    const warn = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = '';
    };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [unsavedFlag]);
  const image = entry?.draft.image;
  const selectedQuestionImageURL = image
    ? /^https?:\/\//.test(image)
      ? image
      : FILE_URL + '/' + image
    : '';
  return {
    canEdit:
      !!entry &&
      (session.role === 'ADMIN' ||
        (session.role === 'TEACHER' && entry.draft.createdById === userId)),
    questionHasBeenSelected: ready,
    loadingQuestionData: !ready && query.isFetching,
    questionLoadError: query.isError || query.currentData === null,
    selectedQuestionID: id,
    selectedQuestionText: entry?.draft.text || '',
    selectedQuestionNumberOfShowingAnswers:
      entry?.draft.numberOfShowingAnswers || '8',
    selectedConnectedTheme: entry?.draft.connectedThemeId,
    selectedQuestionImageURL,
    QuestionImageName: image?.split('?')[0].split('/').pop() || '',
    showPreview: entry?.showPreview || false,
    stateOfSave:
      entry?.saveState === 'error'
        ? variantsOfStateOfSave.ERROR
        : unsavedFlag
          ? variantsOfStateOfSave.SAVING
          : variantsOfStateOfSave.SAVED,
    unsavedFlag,
    operationError,
    createDeepCopyInProgress: copy.isLoading,
    changeFields: (patch: Partial<QuestionDraft>) => {
      assertSession();
      dispatch(actions.changed({ key, patch }));
    },
    togglePreview: () => dispatch(actions.previewToggled(key)),
    saveDataOnServer: saveNow,
    reload: query.refetch,
    uploadNewQuestionImage: async (event: any) => {
      const file = event.target.files?.[0];
      if (!file || uploading.current) return;
      uploading.current = true;
      setOperationError('');
      try {
        await serializeWrite('question-' + id, async () => {
          assertSession();
          const result = await uploadImage({
            kind: 'question',
            id,
            file,
          }).unwrap();
          assertSession();
          dispatch(actions.imageUploaded({ key, image: result.image }));
        });
      } catch {
        if (getAuthSessionVersion() === version)
          setOperationError(
            'Не удалось загрузить изображение. Попробуйте ещё раз.',
          );
      } finally {
        uploading.current = false;
      }
    },
    deepQuestionCopyWithAnswers: async () => {
      if (copying.current) return;
      copying.current = true;
      setOperationError('');
      try {
        if (!(await saveNow())) throw new Error('save');
        assertSession();
        const result = await copyQuestion(id).unwrap();
        assertSession();
        navigate('/editor/question/selected/' + result.id);
      } catch {
        if (getAuthSessionVersion() === version)
          setOperationError('Не удалось создать копию вопроса.');
      } finally {
        copying.current = false;
      }
    },
  };
}
export const QuestionEditorContext = createContext<ReturnType<
  typeof useQuestionEditorController
> | null>(null);
export function useQuestionEditor() {
  const editor = useContext(QuestionEditorContext);
  if (!editor)
    throw new Error(
      'Редактор вопроса должен находиться внутри QuestionEditorContext',
    );
  return editor;
}
