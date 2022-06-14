import {IExamDataWithQSData} from "../../../../../../ServerLayer/Types/exam.types";

export const initialState = {
    exams: [] as IExamDataWithQSData[],
    loading_exams: true,
    selected_exam_id: null as number | null,
    exams_load_error: null as string | null,

}
