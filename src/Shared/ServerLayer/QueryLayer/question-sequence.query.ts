import axiosClient from "./config";
import { sequenceDataI } from "../Types/question-sequence.type";

export async function getQSByID(id: string): Promise<sequenceDataI> {
  return axiosClient
    .get(`/question-sequence/data/${id}`)
    .then((res) => res.data.questionSequence);
}

export async function updateQS(qsData: sequenceDataI): Promise<sequenceDataI> {
  return axiosClient
    .post("/question-sequence/update", {
      sequenceData: qsData,
    })
    .then((res) => res.data.updatedSequence);
}
