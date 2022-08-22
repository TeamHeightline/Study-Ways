import {IQuestionWithAnswers} from "../../../../../ServerLayer/Types/question.type";
import {IStatistic} from "../../../../../ServerLayer/Types/detail-statistic.types";

export interface IQuestionStatus {
    "id": number,
    "passing_the_exam_id": number,
    "question_id": number,
    "status": number,
    "statistic_id"?: number,
}

export interface IExamData {
    id: number,
    name: string
    start_at: Date | null
    end_at: Date | null
    uid: string
    minutes: number | null,
    access_mode: string,
    is_enable_help_text: boolean,
    is_enable_password_check: boolean,
    is_enable_start_and_finish_time: boolean,
    is_enable_max_question_attempts: boolean,
    help_text_level: number,
    password: string,
    max_question_attempts: number
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
    access_password: "",
    is_password_check_passed: false,
    remaining_minutes: 100,
    remaining_attempts: 100
}
