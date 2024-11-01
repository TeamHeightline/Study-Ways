import {IExamResult} from "../../../../Shared/ServerLayer/Types/exam.types";

export const initialState = {
    exam_id: null as number | null,

    exam_results: [] as IExamResult[],
    exam_results_order_by_sum: [] as IExamResult[],
    loading_exam_results: true,
    exam_results_load_error: null as any | null,
    result_array_for_chart: [] as { index: number, result: number }[],
    show_results_by_sum: false,

    user_id_for_block: null as number | null,
}
