import {IQuestionWithAnswers} from "../../../../../ServerLayer/Types/question.type";
import {IStatistic} from "../../../../../ServerLayer/Types/detail-statistic.types";

export const initialState = {
    loading_question_statuses: true,
    question_statuses_load_error: null,
    question_statuses: [] as IQuestionStatus[],
    selected_question_id: null as number | null,
    exam_name: "",
    selected_question_data: null as IQuestionWithAnswers | null,
    help_text: '',
    loading_selected_question_data: true,
    selected_answers_id: new Set(),
    max_sum_of_points: 0,
    statistic: null as IStatistic | null,
    is_question_completed: false,

    await_statistic_save: false,
}


export interface IQuestionStatus {
    "id": number,
    "passing_the_exam_id": number,
    "question_id": number,
    "status": number,
    "statistic_id"?: number,
}
