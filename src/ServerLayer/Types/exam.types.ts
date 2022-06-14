import {sequenceDataI} from "./question-sequence.type";

export interface IExamData {
    "id": string,
    "name": string,
    "start_at": string,
    "end_at": string,
    "access_mode": string,
    "uid": string,
    "created_by_id": string,
    "minutes": number,
    question_sequence_id: number
}

export interface IExamDataWithQSData extends IExamData {
    question_sequence: sequenceDataI
}
