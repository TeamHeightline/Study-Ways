import { useCallback, useEffect, useRef, useState } from 'react';
import { useStore } from 'react-redux';
import {
  RootState,
  useAppDispatch,
  useAppSelector,
} from '../../../../../../app/redux-store/RootStore';
import {
  useSaveAnswerMutation,
  useCreateAnswerMutation,
  useUploadMaterialImageMutation,
  useCloseAnswerReportMutation,
} from '../../../../../../shared/server-layer/query-layer/write-api';
import {
  getAuthSessionVersion,
  isAuthSessionActive,
} from '../../../../../../shared/server-layer/query-layer/auth-session';
import { selectUserSession } from '../../../../../../shared/store/user-store/user-session';
import { serializeWrite } from '../../../../../../shared/server-layer/query-layer/write-queue';
import { answerWriteData } from '../../../../../../shared/server-layer/query-layer/answer-write-data';
import { FILE_URL } from '../../../../../../settings';
import { useGetAnswerReportsQuery } from './answer-editor-api';
import { cacheCreatedAnswer, cacheSavedAnswer } from './cache-created-answer';
import {
  AnswerField,
  attachAnswer,
  detachAnswer,
  releaseSavedAnswer,
  changeAnswerField,
  savingAnswer,
  answerSaved,
  answerSaveFailed,
  answerImageUploaded,
} from './answer-editor-slice';

export function useAnswerEditorController(key: string, userId: number) {
  const store = useStore<RootState>();
  const dispatch = useAppDispatch();
  const entry = useAppSelector(state => state.answerEditor.entries[key]);
  const [saveAnswer] = useSaveAnswerMutation();
  const [createAnswer, copy] = useCreateAnswerMutation();
  const [uploadImage, upload] = useUploadMaterialImageMutation();
  const [closeReport, close] = useCloseAnswerReportMutation();
  const [isOpenForEdit, setOpenForEdit] = useState(false);
  const [isEditTextInSimpleMode, setSimpleText] = useState(false);
  const [isShowAnswerPreview, setShowAnswerPreview] = useState(false);
  const [isOpenDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [isOpenAnswerErrorMessageDialog, setReportsOpen] = useState(false);
  const [operationError, setOperationError] = useState('');
  const [messages, setMessages] = useState<boolean[]>([]);
  const [updatingReportId, setUpdatingReportId] = useState<number | null>(null);
  const version = useRef(getAuthSessionVersion()).current;
  const timer = useRef<ReturnType<typeof setTimeout>>();
  const pending = useRef<Promise<boolean> | null>(null);
  const uploadPending = useRef(false);
  const copyPending = useRef(false);
  const lastFile = useRef<File>();
  const getEntry = useCallback(
    () => store.getState().answerEditor.entries[key],
    [store, key],
  );
  const assertSession = useCallback(() => {
    const session = selectUserSession(store.getState());
    const draft = getEntry()?.draft;
    if (
      !isAuthSessionActive() ||
      getAuthSessionVersion() !== version ||
      session.user?.id !== userId ||
      !['ADMIN', 'TEACHER'].includes(session.role) ||
      !draft ||
      (session.role !== 'ADMIN' && draft.question.createdById !== userId)
    ) {
      throw new Error('Недостаточно прав или сессия изменилась.');
    }
  }, [getEntry, store, userId, version]);
  const reports = useGetAnswerReportsQuery(
    { id: Number(entry?.draft.id), userId },
    { skip: !entry },
  );

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
      dispatch(savingAnswer(key));
      pending.current = serializeWrite(`answer-${draft.id}`, async () => {
        assertSession();
        const answer = await saveAnswer({
          id: Number(draft.id),
          data: answerWriteData(draft),
        }).unwrap();
        assertSession();
        cacheSavedAnswer(dispatch, userId, answer);
      })
        .then(() => {
          if (getAuthSessionVersion() !== version) return false;
          dispatch(answerSaved({ key, revision }));
          return true;
        })
        .catch(() => {
          if (getAuthSessionVersion() === version)
            dispatch(answerSaveFailed({ key, revision }));
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
    [assertSession, dispatch, getEntry, key, saveAnswer, version],
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
    dispatch(attachAnswer(key));
    return () => {
      clearTimeout(timer.current);
      dispatch(detachAnswer(key));
      void saveNow().finally(() => dispatch(releaseSavedAnswer(key)));
    };
  }, [dispatch, key, ready, saveNow]);
  const isSaved =
    entry?.saveState === 'saved' && !upload.isLoading && !copy.isLoading;
  useEffect(() => {
    if (!ready || isSaved) return;
    const warn = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = '';
    };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [ready, isSaved]);

  const handleUpload = async (file: File) => {
    if (uploadPending.current) return;
    lastFile.current = file;
    uploadPending.current = true;
    setOperationError('');
    try {
      await serializeWrite(`answer-${getEntry()?.draft.id}`, async () => {
        assertSession();
        const result = await uploadImage({
          kind: 'answer',
          id: Number(getEntry()!.draft.id),
          file,
        }).unwrap();
        assertSession();
        dispatch(answerImageUploaded({ key, image: result.image }));
      });
      lastFile.current = undefined;
    } catch {
      if (getAuthSessionVersion() === version)
        setOperationError(
          'Не удалось загрузить изображение. Повторите попытку.',
        );
    } finally {
      uploadPending.current = false;
    }
  };

  if (!entry) return undefined;
  const changeValue = (
    field: AnswerField,
    value: string | number | boolean,
  ) => {
    assertSession();
    dispatch(changeAnswerField({ key, field, value }));
  };
  const image = entry.draft.image;
  return {
    draft: entry.draft,
    answer_id: Number(entry.draft.id),
    userId,
    stateOfSave: isSaved,
    hasSaveError: entry.saveState === 'error',
    saveState: entry.saveState,
    updateAnswerData: saveNow,
    changeField:
      (field: AnswerField) =>
      ({ target }: { target: { value: unknown } }) =>
        changeValue(field, target.value as string),
    changeValue,
    changeIsRequired: () => changeValue('isRequired', !entry.draft.isRequired),
    changeOnlyForExam: () =>
      changeValue('onlyForExam', !entry.draft.onlyForExam),
    changeIsTrue: () => changeValue('isTrue', !entry.draft.isTrue),
    isTrue: String(entry.draft.isTrue),
    changeHardLevelSimpleMode: () => {
      const levels = ['EASY', 'MEDIUM', 'HARD'];
      changeValue(
        'hardLevelOfAnswer',
        levels[(levels.indexOf(entry.draft.hardLevelOfAnswer) + 1) % 3],
      );
    },
    imageUrl: image
      ? `${/^https?:\/\//.test(image) ? image : `${FILE_URL}/${image}`}${image.includes('?') ? '&' : '?'}v=${entry.imageVersion}`
      : '',
    imageName: image?.split('?')[0].split('/').pop() ?? '',
    uploading: upload.isLoading,
    updateImage: handleUpload,
    retryUpload: () => lastFile.current && void handleUpload(lastFile.current),
    canRetryUpload: !!lastFile.current,
    operationError,
    dismissOperationError: () => setOperationError(''),
    isOpenForEdit,
    changeIsOpenForEdit: () => setOpenForEdit(value => !value),
    isEditTextInSimpleMode,
    edittextInSimpleMode: () => setSimpleText(value => !value),
    stopTextEditingInSimpleMode: () => setSimpleText(false),
    isShowAnswerPreview,
    toggleAnswerPreview: () => setShowAnswerPreview(value => !value),
    isOpenDeleteDialog,
    setOpenDeleteDialog: (open: boolean) => {
      if (getEntry()?.saveState === 'saving') return;
      if (!open && getEntry()?.draft.isDeleted) changeValue('isDeleted', false);
      setOpenDeleteDialog(open);
    },
    deleteAnswer: async () => {
      changeValue('isDeleted', true);
      if (await saveNow()) setOpenDeleteDialog(false);
    },
    copying: copy.isLoading,
    createNewAnswerBasedOnExist: async () => {
      if (copyPending.current) return;
      copyPending.current = true;
      setOperationError('');
      try {
        if (!(await saveNow())) throw new Error('save');
        await serializeWrite(`answer-${entry.draft.id}`, async () => {
          assertSession();
          const draft = getEntry()!.draft;
          const answer = await createAnswer({
            questionId: Number(draft.question.id),
            data: { ...answerWriteData(draft), is_deleted: false },
          }).unwrap();
          assertSession();
          cacheCreatedAnswer(dispatch, userId, answer);
        });
      } catch {
        if (getAuthSessionVersion() === version)
          setOperationError(
            'Не удалось создать копию ответа. Повторите попытку.',
          );
      } finally {
        copyPending.current = false;
      }
    },
    answerErrorMessage: reports.currentData ?? [],
    reportsLoading: reports.isFetching,
    reportsError: reports.isError,
    retryReports: reports.refetch,
    isOpenAnswerErrorMessageDialog,
    openAnswerErrorMessageDialog: () => setReportsOpen(true),
    closeAnswerErrorMessageDialog: () => setReportsOpen(false),
    updatingAnswerErrorMessageID: updatingReportId,
    onCloseAnswerReportClick: async (id: number) => {
      if (close.isLoading) return;
      setUpdatingReportId(id);
      try {
        assertSession();
        await closeReport(id).unwrap();
        assertSession();
        setMessages(values => [...values, true]);
      } catch {
        if (getAuthSessionVersion() === version)
          setMessages(values => [...values, false]);
      } finally {
        setUpdatingReportId(null);
      }
    },
    errorMessageClosedSuccessArray: messages,
    removeElementFromErrorMessageClosedSuccessArray: () =>
      setMessages(values => values.slice(1)),
  };
}
export type AnswerEditorController = NonNullable<
  ReturnType<typeof useAnswerEditorController>
>;
