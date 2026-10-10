import {
  CHANGE_EXAM_NAME_FOR_CREATE,
  CHANGE_EXAM_QS_ID_FOR_CREATE,
  CHANGE_IS_OPEN_CREATE_EXAM_DIALOG,
  CLOSE_DIALOG_AND_CLEAR_CREATE_DATA,
  CREATE_EXAM_ERROR,
  CREATE_EXAM_PENDING,
  CREATE_EXAM_SUCCESS,
  LOAD_MY_EXAMS_ERROR,
  LOAD_MY_EXAMS_SUCCESS,
  LOAD_QS_DATA_ERROR,
  LOAD_QS_DATA_SUCCESS,
  START_LOADING_MY_EXAMS,
  START_LOADING_QS_DATA,
} from './action-types';
import { IExamDataWithQSData } from '../../../../../Shared/ServerLayer/Types/exam.types';
import { sequenceDataI } from '../../../../../Shared/ServerLayer/Types/question-sequence.type';

export const startLoadingMyExam = () =>
  ({ type: START_LOADING_MY_EXAMS }) as const;
export const loadMyExamsSuccess = (exams: IExamDataWithQSData[]) =>
  ({ type: LOAD_MY_EXAMS_SUCCESS, payload: { exams } }) as const;
export const loadMyExamsError = error =>
  ({
    type: LOAD_MY_EXAMS_ERROR,
    payload: {
      error: String(
        error?.error || error?.message || error || 'Ошибка загрузки',
      ),
    },
  }) as const;
export const changeExamNameForCreate = (name: string) =>
  ({ type: CHANGE_EXAM_NAME_FOR_CREATE, payload: name }) as const;
export const changeExamQSIDForCreate = (qsID: number | null) =>
  ({ type: CHANGE_EXAM_QS_ID_FOR_CREATE, payload: qsID }) as const;
export const changeIsOpenCreateExamDialog = (isOpen: boolean) =>
  ({ type: CHANGE_IS_OPEN_CREATE_EXAM_DIALOG, payload: isOpen }) as const;

export const startLoadingQSData = () =>
  ({ type: START_LOADING_QS_DATA }) as const;
export const loadQSDataSuccess = (qsData: sequenceDataI) =>
  ({ type: LOAD_QS_DATA_SUCCESS, payload: qsData }) as const;
export const loadQSDataError = error =>
  ({ type: LOAD_QS_DATA_ERROR, payload: error }) as const;

export const createExamPending = () => ({ type: CREATE_EXAM_PENDING }) as const;
export const createExamSuccess = (examID: number, exam?: IExamDataWithQSData) =>
  ({ type: CREATE_EXAM_SUCCESS, payload: examID, exam }) as const;
export const createExamError = () => ({ type: CREATE_EXAM_ERROR }) as const;

export const closeDialogAndClearCreateData = () =>
  ({ type: CLOSE_DIALOG_AND_CLEAR_CREATE_DATA }) as const;
