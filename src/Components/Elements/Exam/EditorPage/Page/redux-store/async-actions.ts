import {loadMyExamsError, loadMyExamsSuccess, startLoadingMyExam} from "./actions";
import {loadMyExams} from "../../../../../../ServerLayer/QueryLayer/exam.query";

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
