import {
    loadExamEditorSelectedQsDataError,
    loadExamEditorSelectedQsDataSuccess,
    startLoadingExamData,
    startLoadingExamEditorSelectedQsData,
    successLoadExamData
} from "./actions";
import {getQSByID} from "../../ServerLayer/QueryLayer/question-sequence.query";
import {loadExamByID} from "../../ServerLayer/QueryLayer/exam.query";

export const loadQSData = (qsID) => (dispatch) => {
    if (qsID) {
        dispatch(startLoadingExamEditorSelectedQsData());

        return getQSByID(qsID)
            .then((data) => dispatch(loadExamEditorSelectedQsDataSuccess(data)))
            .catch((error) => dispatch(loadExamEditorSelectedQsDataError(error.message)));
    }
}

export const loadExamData = (examID) => (dispatch) => {
    dispatch(startLoadingExamData());

    return loadExamByID(examID)
        .then((data) => dispatch(successLoadExamData(data)))
}
