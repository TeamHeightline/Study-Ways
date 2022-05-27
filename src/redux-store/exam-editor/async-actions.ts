import {
    loadExamEditorSelectedQsDataError,
    loadExamEditorSelectedQsDataSuccess,
    startLoadingExamEditorSelectedQsData
} from "./actions";
import {getQSByID} from "../../ServerLayer/QueryLayer/question-sequence.query";

export const loadQSData = (qsID) => (dispatch) => {
    dispatch(startLoadingExamEditorSelectedQsData());

    return getQSByID(qsID)
        .then((data) => dispatch(loadExamEditorSelectedQsDataSuccess(data)))
        .catch((error) => dispatch(loadExamEditorSelectedQsDataError(error.message)));
}
