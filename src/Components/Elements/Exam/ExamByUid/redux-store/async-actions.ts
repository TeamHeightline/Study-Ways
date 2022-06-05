import {changeExamName, examByUidLoadError, examByUidLoadSuccess, startLoadingExamByUid} from "./actions";
import {examNameByUID, loadExamOnOpenData} from "../../../../../ServerLayer/QueryLayer/exam.query";

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
