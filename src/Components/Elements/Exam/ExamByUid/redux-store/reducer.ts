import * as Actions from './actions';
import {initialState, IQuestionStatus} from "./initial-state";
import {ActionType} from "typesafe-actions";
import {
    CHANGE_EXAM_NAME,
    CHANGE_HELP_TEXT,
    CHANGE_SELECTED_ANSWERS_ID,
    CHANGE_SELECTED_QUESTION_ID,
    CHECK_ANSWERS,
    EXAM_BY_UID_LOAD_ERROR,
    EXAM_BY_UID_LOAD_SUCCESS,
    QUESTION_DATA_LOAD_SUCCESS,
    SAVE_DETAIL_STATISTIC_SUCCESS,
    START_LOADING_EXAM_BY_UID,
    START_LOADING_QUESTION_DATA,
    START_SAVING_DETAIL_STATISTIC
} from "./action-types";
import produce from "immer";
import {shuffle} from "lodash"

export type ExamByIDAction = ActionType<typeof Actions>;

export const ExamByUIDReducer = produce((state: typeof initialState = initialState, action: ExamByIDAction) => {
    switch (action.type) {

        case START_LOADING_EXAM_BY_UID:
            state.loading_question_statuses = true;
            break

        case EXAM_BY_UID_LOAD_ERROR:
            state.loading_question_statuses = false;
            state.question_statuses_load_error = action.payload.error;
            break

        case EXAM_BY_UID_LOAD_SUCCESS:
            const questionStatuses: IQuestionStatus[] = shuffle(action.payload.examPassData.question_statuses)
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
            break

        case CHANGE_SELECTED_QUESTION_ID:
            state.selected_question_id = action.payload.selectedQuestionId;
            state.help_text = ''
            state.statistic = null
            state.is_question_completed = false
            state.max_sum_of_points = 0
            state.selected_answers_id = new Set()
            break

        case CHANGE_EXAM_NAME:
            state.exam_name = action.payload.examName;
            break

        case START_LOADING_QUESTION_DATA:
            state.loading_selected_question_data = true
            break

        case QUESTION_DATA_LOAD_SUCCESS:

            const questionData = action.payload.questionData
            const all_answers = action.payload.questionData?.usertests_answer

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


            state.loading_selected_question_data = false
            break

        case CHANGE_HELP_TEXT:
            state.help_text = action.payload.helpText
            break

        case CHANGE_SELECTED_ANSWERS_ID:
            const answersId = action.payload.answerId
            if (state.selected_answers_id.has(answersId)) {
                state.selected_answers_id.delete(answersId)
            } else {
                state.selected_answers_id.add(answersId)
            }
            break

        case CHECK_ANSWERS:
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

            state.help_text = state.selected_question_data?.usertests_answer[indexOfMostWantedError]?.help_textV3
                || state.selected_question_data?.usertests_answer[indexOfMostWantedError]?.help_textV2
                || state.selected_question_data?.usertests_answer[indexOfMostWantedError]?.help_textV1
                || ""

            break

        case START_SAVING_DETAIL_STATISTIC:
            state.await_statistic_save = true
            break

        case SAVE_DETAIL_STATISTIC_SUCCESS:
            const newQuestionStatus = state.question_statuses.find((questionStatus) => questionStatus.question_id == action.payload.statistic.question_id)
            if (newQuestionStatus) {
                newQuestionStatus.statistic_id = action.payload.statistic.id
            }
            state.await_statistic_save = false
            break


        default:
            return state
    }
})
