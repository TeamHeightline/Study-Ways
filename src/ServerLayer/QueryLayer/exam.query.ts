import axiosClient from "./config";
import {IQuestionStatus} from "../../Components/Elements/Exam/ExamByUid/redux-store/initial-state";

export async function loadExamByID(examID: string) {
    return axiosClient.get(`/exam/data/${examID}`)
        .then((res) => res.data.examData)
}

export async function updateExam(examID: string, examData: any) {
    return axiosClient.post(`/exam/update/${examID}`, examData)
        .then((res) => res.data.updatedExam)
}

export async function loadExamOnOpenData(examUID: string) {
    return axiosClient.post(`/exam/open/${examUID}`)
        .then((res) => res.data.examPass)
}

export async function examNameByUID(examUID: string) {
    return axiosClient.get(`/exam/name/${examUID}`)
        .then((res) => res.data.examName)
}

export async function updateQuestionProgress(questionProgressData: IQuestionStatus): Promise<IQuestionStatus> {
    return axiosClient.post(`/exam/question-progress/update`, {questionProgressData})
        .then((res) => res.data.updatedQuestionStatus)
}
