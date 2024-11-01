import {loadExamOnOpenData} from "../../../../Shared/ServerLayer/QueryLayer/exam.query";
import {loadQuestionByID} from "../../../../Shared/ServerLayer/QueryLayer/question.query";
import {createDetailStatistic} from "../../../../Shared/ServerLayer/QueryLayer/detail-statistic.query";
import {UserStorage} from "../../../../Shared/Store/UserStore/UserStore";
import {createAsyncThunk} from "@reduxjs/toolkit";
import {initialState} from "./InitialState";
import axiosClient from "../../../../Shared/ServerLayer/QueryLayer/config";


const emptyStatistic = {
    "numberOfPasses": 0,
    "ArrayForShowAnswerPoints": [],
    "ArrayForShowWrongAnswers": []
}


export const loadExamDataThunk = createAsyncThunk(
    'examPlayer/loadExamData',
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
                question_sequence_id: undefined,
                answers_id_array: store.selected_question_data?.usertests_answer?.map((answer) => answer.id) || []
            })
        }
    }
)
