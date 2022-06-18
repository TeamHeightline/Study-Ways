import {IExamResult} from "../../../../../ServerLayer/Types/exam.types";

export const initialState = {
    exam_id: null as number | null,

    exam_results: [] as IExamResult[],
    loading_exam_results: true,
    exam_results_load_error: null as any | null,
    result_array_for_chart: [] as { index: number, result: number }[],
}
