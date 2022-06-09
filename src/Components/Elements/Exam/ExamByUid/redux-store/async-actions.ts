import {
    changeExamName,
    examByUidLoadError,
    examByUidLoadSuccess,
    questionDataLoadSuccess,
    saveDetailStatisticError,
    saveDetailStatisticSuccess,
    startLoadingExamByUid,
    startLoadingQuestionData,
    startSavingDetailStatistic
} from "./actions";
import {examNameByUID, loadExamOnOpenData} from "../../../../../ServerLayer/QueryLayer/exam.query";
import {loadQuestionByID} from "../../../../../ServerLayer/QueryLayer/question.query";
import {createDetailStatistic} from "../../../../../ServerLayer/QueryLayer/detail-statistic.query";
import {UserStorage} from "../../../../../Store/UserStore/UserStore";

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
    if (selectedQuestionID) {
        dispatch(startLoadingQuestionData(selectedQuestionID))
        return loadQuestionByID(selectedQuestionID)
            .then((questionData) => {
                dispatch(questionDataLoadSuccess(questionData))
            })
    }
}

export const saveDetailStatisticAsync = (store) => async (dispatch) => {
    dispatch(startSavingDetailStatistic());
    if (store.selected_question_id && store?.statistic && store?.max_sum_of_points) {
        return createDetailStatistic({
            question_id: Number(store.selected_question_id),
            user_name: UserStorage.username,
            is_login: true,
            question_has_been_completed: store.is_question_completed,
            statistic: store.statistic,
            is_useExamMode: true,
            max_sum_of_answers_point: store.max_sum_of_points,
            question_sequence_id: undefined
        })
            .then((createdStatistic) => dispatch(saveDetailStatisticSuccess(createdStatistic)))
            .catch((error) => {
                dispatch(saveDetailStatisticError(error))
            })
    }
}
