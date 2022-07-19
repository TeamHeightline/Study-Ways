import {loadExamOnOpenData} from "../../../../../ServerLayer/QueryLayer/exam.query";
import {loadQuestionByID} from "../../../../../ServerLayer/QueryLayer/question.query";
import {createDetailStatistic} from "../../../../../ServerLayer/QueryLayer/detail-statistic.query";
import {UserStorage} from "../../../../../Store/UserStore/UserStore";
import {createAsyncThunk} from "@reduxjs/toolkit";
import {initialState} from "./InitialState";
import axiosClient from "../../../../../ServerLayer/QueryLayer/config";


const emptyStatistic = {
    "numberOfPasses": 0,
    "ArrayForShowAnswerPoints": [],
    "ArrayForShowWrongAnswers": []
}


export const loadExamDataThunk = createAsyncThunk(
    'examPlayer/loadExamName',
    async (examUID: string) => {
        return axiosClient.get(`page/exam-player/exam-data/uid/${examUID}`)
    })


export const loadQuestionDataThunk = createAsyncThunk(
    'examPlayer/loadQuestionData',
    async (selectedQuestionID: number) => {
        return loadQuestionByID(String(selectedQuestionID))
    }
)


export const openExamPageThunk = createAsyncThunk(
    'examPlayer/openExamPage',
    async (examUID: string) => {
        return loadExamOnOpenData(examUID)
    }
)

export const saveDetailStatisticThunk = createAsyncThunk(
    'examPlayer/saveDetailStatistic',
    async (store: typeof initialState) => {
        if (store.selected_question_id) {
            return createDetailStatistic({
                question_id: Number(store.selected_question_id),
                user_name: UserStorage.username,
                is_login: true,
                question_has_been_completed: store.is_question_completed,
                statistic: store.statistic || emptyStatistic,
                is_useExamMode: true,
                max_sum_of_answers_point: store.max_sum_of_points,
                question_sequence_id: undefined
            })
        }
    }
)
