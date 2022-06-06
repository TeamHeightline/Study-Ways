export const initialState = {
    loading_question_statuses: true,
    question_statuses_load_error: null,
    question_statuses: [] as IQuestionStatus[],
    selected_question_id: null as number | null,
    exam_name: ""
}


export interface IQuestionStatus {
    "id": number,
    "passing_the_exam_id": number,
    "question_id": number,
    "status": number,
    "statistic_id"?: number,
}
