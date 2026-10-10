import {
  closeDialogAndClearCreateData,
  createExamError,
  createExamPending,
  createExamSuccess,
  loadMyExamsError,
  loadMyExamsSuccess,
  loadQSDataError,
  loadQSDataSuccess,
  startLoadingMyExam,
  startLoadingQSData,
} from './actions';
import {
  createExam,
  loadMyExams,
} from '../../../../../Shared/ServerLayer/QueryLayer/exam.query';
import { getQSByID } from '../../../../../Shared/ServerLayer/QueryLayer/question-sequence.query';
import { initialState } from './initial-state';

type GetState = () => { examEditorPageReducer: typeof initialState };

export const loadMyExamsAsync = () => async dispatch => {
  dispatch(startLoadingMyExam());
  try {
    dispatch(loadMyExamsSuccess(await loadMyExams()));
  } catch (error) {
    dispatch(loadMyExamsError(error));
  }
};

export const loadQSData =
  (qsID: string) => async (dispatch, getState: GetState) => {
    if (!qsID) return;
    dispatch(startLoadingQSData());
    try {
      const data = await getQSByID(qsID);
      if (
        String(getState().examEditorPageReducer.exam_qs_id_for_create) !== qsID
      )
        return;
      if (!data?.id || String(data.id) !== qsID)
        throw new Error('Серия вопросов недоступна');
      dispatch(loadQSDataSuccess(data));
    } catch (error) {
      if (
        String(getState().examEditorPageReducer.exam_qs_id_for_create) === qsID
      ) {
        dispatch(
          loadQSDataError(
            error instanceof Error ? error.message : 'Ошибка загрузки',
          ),
        );
      }
    }
  };

export const createExamAsync =
  (examName: string, qsID: number, redirect: (examID: number) => void) =>
  async (dispatch, getState: GetState) => {
    const draft = getState().examEditorPageReducer;
    if (
      draft.create_exam_pending ||
      !examName.trim() ||
      !Number.isFinite(qsID) ||
      qsID <= 0
    )
      return;
    dispatch(createExamPending());
    try {
      const exam = await createExam(qsID, examName.trim());
      const id = Number(exam?.id);
      if (!Number.isFinite(id) || id <= 0)
        throw new Error('No created exam returned');
      dispatch(
        createExamSuccess(
          id,
          draft.selected_qs_data
            ? { ...exam, question_sequence: draft.selected_qs_data }
            : undefined,
        ),
      );
      dispatch(closeDialogAndClearCreateData());
      redirect(id);
    } catch {
      dispatch(createExamError());
    }
  };
