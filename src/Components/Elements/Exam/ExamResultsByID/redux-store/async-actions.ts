import * as Actions from "./actions";
import {getExamResults} from "../../../../../ServerLayer/QueryLayer/exam.query";

export const loadExamResultsAsync = (exam_id: number) => async (dispatch: any) => {
    dispatch(Actions.startLoadingExamResults())
    return getExamResults(exam_id)
        .then((users_results) => {
            dispatch(Actions.examResultsLoadSuccess(users_results))
        })
        .catch((error) => {
            dispatch(Actions.examResultsLoadFail(error))
        })
}
