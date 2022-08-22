import {shuffle} from "lodash"
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {loadExamDataThunk, loadQuestionDataThunk, openExamPageThunk, saveDetailStatisticThunk} from "./AsyncActions";
import {IQuestionWithAnswers} from "../../../../../ServerLayer/Types/question.type";
import {IDetailStatistic} from "../../../../../ServerLayer/Types/detail-statistic.types";
import CryptoJS from "crypto-js";

import {IExamData, initialState, IQuestionStatus} from "./InitialState";


const examPlayerSlicer = createSlice({
    name: "examPlayer",
    initialState,
    reducers: {
        changeSelectedQuestionId: (state, action: PayloadAction<number | null>) => {
            state.selected_question_id = action?.payload;
            state.help_text = ''
            state.statistic = null
            state.is_question_completed = false
            state.max_sum_of_points = 0
            state.selected_answers_id = new Set()
        },
        changeSelectedAnswersId: (state, action: PayloadAction<number>) => {
            const answersId = action.payload
            if (state.selected_answers_id.has(answersId)) {
                state.selected_answers_id.delete(answersId)
            } else {
                state.selected_answers_id.add(answersId)
            }
        },
        checkAnswers: (state) => {
            if (state.statistic == null) {
                state.statistic = {
                    numberOfPasses: 0,
                    ArrayForShowAnswerPoints: [],
                    ArrayForShowWrongAnswers: []
                }
            }
            const attemptIndex = state.statistic.numberOfPasses + 1

            state.statistic.numberOfPasses = attemptIndex

            let indexOfMostWantedError = -1
            let minCheckQueue = 100000000000
            const __errorArray: number[] = []

            //Сумма потерянных баллов за неправильно выбранные ответы
            let __sumOfLoosedAnswerPoints = 0

            //Полученные баллы за правильные выбранные ответы
            let __sumOfGotAnswerPoints = 0

            state.selected_question_data?.usertests_answer.map((answer, aIndex) => {
                if ((answer.is_true && !state.selected_answers_id.has(answer.id)) || (!answer.is_true && state.selected_answers_id.has(answer.id))) {
                    __errorArray.push(answer.id)


                    if (answer.hard_level_of_answer == "EASY") {
                        __sumOfLoosedAnswerPoints += 15
                    } else if (answer.hard_level_of_answer == "MEDIUM") {
                        __sumOfLoosedAnswerPoints += 10
                    } else {
                        __sumOfLoosedAnswerPoints += 5
                    }


                    if (Number(answer.check_queue) < Number(minCheckQueue)) {
                        minCheckQueue = answer.check_queue
                        indexOfMostWantedError = aIndex
                    }
                } else {
                    if (answer.hard_level_of_answer == "EASY") {
                        __sumOfGotAnswerPoints += 5
                    } else if (answer.hard_level_of_answer == "MEDIUM") {
                        __sumOfGotAnswerPoints += 10
                    } else {
                        __sumOfGotAnswerPoints += 15
                    }
                }
            })

            //Добавляем в историю сколько баллов было получено за эту попытку
            state.statistic.ArrayForShowAnswerPoints.push({
                numberOfPasses: attemptIndex,
                answerPoints: __sumOfGotAnswerPoints - __sumOfLoosedAnswerPoints
            })
            //Добавляем в историю выбора эти неправильные ответы
            state.statistic.ArrayForShowWrongAnswers.push({
                numberOfPasses: attemptIndex,
                numberOfWrongAnswers: __errorArray
            })

            //Если нет неправильных ответов, то вопрос пройден
            if (__errorArray.length == 0) {
                state.is_question_completed = true
            }

            state.help_text = String(!state?.exam_data?.is_enable_help_text ? "Подсказки отключены" :
                state?.exam_data?.help_text_level === 0 ? state.selected_question_data?.usertests_answer[indexOfMostWantedError]?.help_textV1 :
                    state?.exam_data?.help_text_level === 1 ? state.selected_question_data?.usertests_answer[indexOfMostWantedError]?.help_textV2 :
                        state.selected_question_data?.usertests_answer[indexOfMostWantedError]?.help_textV3 || "Автор ответа не указал подсказку")

            state.remaining_attempts = state.remaining_attempts - 1

        },
        setAccessPassword: (state, action: PayloadAction<string>) => {
            state.access_password = action.payload
            //Именно так, потому что нам критически важно нигде (ни в экшене, ни в стейте не отображать реальный пароль)
            const original_password = CryptoJS.AES.decrypt(state?.exam_data?.password, "sw-secret-key").toString(CryptoJS.enc.Utf8)
            if (action.payload === original_password) {
                state.is_password_check_passed = true
            }
        },
        removeOneMinute: (state) => {
            state.remaining_minutes = state.remaining_minutes - 1
        }

    },
    extraReducers: {
        [loadExamDataThunk.fulfilled.type]: (state, action: PayloadAction<{ data: IExamData }>) => {
            // @ts-ignore
            state.exam_data = action.payload.data
            state.remaining_minutes = action.payload.data.minutes || 100
            state.remaining_attempts = action.payload.data.max_question_attempts
        },
        [saveDetailStatisticThunk.pending.type]: (state) => {
            state.await_statistic_save = true
            state.is_statistic_save_error = false
        },
        [saveDetailStatisticThunk.fulfilled.type]: (state, action: PayloadAction<IDetailStatistic>) => {
            const newQuestionStatus = state.question_statuses.find((questionStatus) => questionStatus.question_id == action.payload.question_id)
            if (newQuestionStatus) {
                newQuestionStatus.statistic_id = action.payload.id
            }
            state.await_statistic_save = false
            state.is_statistic_save_error = false
        },
        [saveDetailStatisticThunk.rejected.type]: (state) => {
            state.await_statistic_save = false
            state.is_statistic_save_error = true
        },

        [openExamPageThunk.pending.type]: (state) => {
            state.loading_question_statuses = true;
        },
        [openExamPageThunk.rejected.type]: (state, action: any) => {
            state.loading_question_statuses = false;
            state.question_statuses_load_error = action.payload;
        },
        [openExamPageThunk.fulfilled.type]: (state, action: PayloadAction<{ question_statuses: IQuestionStatus[] }>) => {
            const questionStatuses: IQuestionStatus[] = shuffle(action.payload.question_statuses)
            let selectedQuestionStatus: IQuestionStatus | null = null
            for (let i in questionStatuses) {
                if (!questionStatuses[i].statistic_id && selectedQuestionStatus == null) {
                    selectedQuestionStatus = questionStatuses[i]
                }
            }

            state.loading_question_statuses = false;
            state.question_statuses = questionStatuses;
            if (selectedQuestionStatus) {
                state.selected_question_id = selectedQuestionStatus.question_id
            }
        },
        [loadQuestionDataThunk.pending.type]: (state) => {
            state.loading_selected_question_data = true
        },
        [loadQuestionDataThunk.fulfilled.type]: (state, action: PayloadAction<IQuestionWithAnswers>) => {
            const questionData = action.payload
            const all_answers = action.payload?.usertests_answer

            //Пересборка ответов, перемешивание, срезание обязательных, добавление необязательных
            const __requiredAnswersForDisplay = shuffle(all_answers?.filter((answer) => !answer.is_deleted)?.filter((answer) => answer.is_required))?.slice(0, questionData?.number_of_showing_answers)
            const __notRequiredAnswersForDisplay = shuffle(all_answers?.filter((answer) => !answer.is_deleted)?.filter((answer) => !answer.is_required))?.slice(0, questionData?.number_of_showing_answers - __requiredAnswersForDisplay.length)
            let __answersForDisplay = __requiredAnswersForDisplay.length > 0 ? __requiredAnswersForDisplay.concat(__notRequiredAnswersForDisplay) : __notRequiredAnswersForDisplay;
            __answersForDisplay = shuffle(__answersForDisplay)

            state.selected_question_data = {...questionData, usertests_answer: __answersForDisplay}


            //Вычисляется максимальная сумма баллов за вопрос
            let max_sum_of_points = 0

            for (let i of __answersForDisplay) {
                if (i.hard_level_of_answer == "EASY") {
                    max_sum_of_points += 5
                } else if (i.hard_level_of_answer == "MEDIUM") {
                    max_sum_of_points += 10
                } else {
                    max_sum_of_points += 15
                }
            }

            state.max_sum_of_points = max_sum_of_points
            state.remaining_attempts = state?.exam_data?.max_question_attempts || 100

            state.loading_selected_question_data = false

        }


    }
})

export default examPlayerSlicer.reducer

export const {
    changeSelectedAnswersId,
    changeSelectedQuestionId,
    checkAnswers,
    setAccessPassword,
    removeOneMinute
} = examPlayerSlicer.actions
