import {IExamResult} from "../../../../../ServerLayer/Types/exam.types";

export const initialState = {
    exam_id: null as number | null,

    users_results: [] as IExamResult[],
    loading_users_results: true,
    users_results_load_error: null as any | null,
}
