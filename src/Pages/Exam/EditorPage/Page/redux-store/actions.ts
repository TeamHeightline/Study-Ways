import {action} from "typesafe-actions";
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
    START_LOADING_QS_DATA
} from "./action-types";
import {IExamDataWithQSData} from "../../../../../Shared/ServerLayer/Types/exam.types";

export const startLoadingMyExam = () => action(START_LOADING_MY_EXAMS);
export const loadMyExamsSuccess = (exams: IExamDataWithQSData[]) => action(LOAD_MY_EXAMS_SUCCESS, {exams});
export const loadMyExamsError = (error) => action(LOAD_MY_EXAMS_ERROR, error);
export const changeExamNameForCreate = (name: string) => action(CHANGE_EXAM_NAME_FOR_CREATE, name);
export const changeExamQSIDForCreate = (qsID: number | null) => action(CHANGE_EXAM_QS_ID_FOR_CREATE, qsID);
export const changeIsOpenCreateExamDialog = (isOpen: boolean) => action(CHANGE_IS_OPEN_CREATE_EXAM_DIALOG, isOpen);

export const startLoadingQSData = () => action(START_LOADING_QS_DATA);
export const loadQSDataSuccess = (qsData) => action(LOAD_QS_DATA_SUCCESS, qsData);
export const loadQSDataError = (error) => action(LOAD_QS_DATA_ERROR, error);

export const createExamPending = () => action(CREATE_EXAM_PENDING);
export const createExamSuccess = (examID: number) => action(CREATE_EXAM_SUCCESS, examID);
export const createExamError = () => action(CREATE_EXAM_ERROR);

export const closeDialogAndClearCreateData = () => action(CLOSE_DIALOG_AND_CLEAR_CREATE_DATA);
