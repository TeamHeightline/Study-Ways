import axiosClient from "./config";

export async function loadExamByID(examID: string) {
    return axiosClient.get(`/exam/data/${examID}`)
        .then((res) => res.data.examData)
}
