import {
    changeExamName,
    examByUidLoadError,
    examByUidLoadSuccess,
    questionDataLoadSuccess,
    startLoadingExamByUid,
    startLoadingQuestionData
} from "./actions";
import {examNameByUID, loadExamOnOpenData} from "../../../../../ServerLayer/QueryLayer/exam.query";
import {loadQuestionByID} from "../../../../../ServerLayer/QueryLayer/question.query";

export const openExamPageAsync = (examUID) => async (dispatch) => {
    dispatch(startLoadingExamByUid());
    return loadExamOnOpenData(examUID)
        .then((examPassData) => {
            dispatch(examByUidLoadSuccess(examPassData));
        })
        .catch((error) => {
            dispatch(examByUidLoadError(error));
        })
}

export const loadExamNameAsync = (examUID) => async (dispatch) => {
    return examNameByUID(examUID)
        .then((examName) => {
            dispatch(changeExamName(examName))
        })
}

export const loadQuestionDataAsync = (selectedQuestionID) => async (dispatch) => {
    dispatch(startLoadingQuestionData(selectedQuestionID))
    return loadQuestionByID(selectedQuestionID)
        .then((questionData) => {
            dispatch(questionDataLoadSuccess(questionData))
        })
}
