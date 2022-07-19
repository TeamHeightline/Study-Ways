import {IQuestionWithAnswers} from "../../../../../ServerLayer/Types/question.type";
import {IStatistic} from "../../../../../ServerLayer/Types/detail-statistic.types";

export interface IQuestionStatus {
    "id": number,
    "passing_the_exam_id": number,
    "question_id": number,
    "status": number,
    "statistic_id"?: number,
}

interface IExamData {
    id: number,
    name: string
    start_at: Date | null
    end_at: Date | null
    uid: string
    minutes: number | null
}

export const initialState = {
    loading_question_statuses: true,
    question_statuses_load_error: null,
    question_statuses: [] as IQuestionStatus[],
    selected_question_id: null as number | null,
    exam_data: null as IExamData | null,
    selected_question_data: null as IQuestionWithAnswers | null,
    help_text: '',
    loading_selected_question_data: true,
    selected_answers_id: new Set(),
    max_sum_of_points: 0,
    statistic: null as IStatistic | null,
    is_question_completed: false,
    await_statistic_save: false,
    is_statistic_save_error: false,
}
