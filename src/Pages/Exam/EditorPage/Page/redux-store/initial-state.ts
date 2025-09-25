import { IExamDataWithQSData } from "../../../../../Shared/ServerLayer/Types/exam.types";
import { sequenceDataI } from "../../../../../Shared/ServerLayer/Types/question-sequence.type";

export const initialState = {
  exams: [] as IExamDataWithQSData[],
  loading_exams: true,
  selected_exam_id: null as number | null,
  exams_load_error: null as string | null,
  exam_qs_id_for_create: null as number | null,
  exam_name_for_create: null as string | null,
  is_open_create_exam_dialog: false as boolean,

  selected_qs_data: null as null | sequenceDataI,

  create_exam_pending: false as boolean,
};
