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
    startLoadingQSData
} from "./actions";
import {createExam, loadMyExams} from "../../../../../Shared/ServerLayer/QueryLayer/exam.query";
import {getQSByID} from "../../../../../Shared/ServerLayer/QueryLayer/question-sequence.query";

export const loadMyExamsAsync = () => async (dispatch) => {
    dispatch(startLoadingMyExam());
    return loadMyExams()
        .then((exams) => {
                dispatch(loadMyExamsSuccess(exams));
            }
        ).catch((error) => {
            dispatch(loadMyExamsError(error));
        })
}


export const loadQSData = (qsID) => (dispatch) => {
    if (qsID) {
        dispatch(startLoadingQSData());
        return getQSByID(qsID)
            .then((data) => dispatch(loadQSDataSuccess(data)))
            .catch((error) => dispatch(loadQSDataError(error.message)));
    }
}

export const createExamAsync = (examName: string, qsID: number, redirectCallBackFn: (examID: number) => void) => async (dispatch) => {
    dispatch(createExamPending());

    return createExam(qsID, examName)
        .then((examData) => {
            dispatch(createExamSuccess(Number(examData.id)));
            redirectCallBackFn(Number(examData.id))
            dispatch(closeDialogAndClearCreateData())
        })
        .catch(() => {
            dispatch(createExamError());
        })
}
