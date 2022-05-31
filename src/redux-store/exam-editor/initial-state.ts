import {IExamData} from "../../ServerLayer/Types/exam.types";

export const initialState = {
    selected_qs_id: null,

    selected_qs_data: null,
    selected_qs_data_loading: true,
    selected_qs_data_error: null,
    
    access_type: "manual" as "manual" | "timeInterval",
    exam_data: null as null | IExamData,
    exam_data_loading: true,
    exam_id: null as null | string,

    update_exam_data_loading: false,
    update_exam_data_error: null,

}
