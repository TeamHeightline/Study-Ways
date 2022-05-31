import axiosClient from "./config";

export async function loadExamByID(examID: string) {
    return axiosClient.get(`/exam/data/${examID}`)
        .then((res) => res.data.examData)
}

export async function updateExam(examID: string, examData: any) {
    return axiosClient.post(`/exam/update/${examID}`, examData)
        .then((res) => res.data.updatedExam)
}
