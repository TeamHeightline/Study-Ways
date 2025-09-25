import axiosClient from "./config";
import {
  IQuestionPreviewData,
  IQuestionWithAnswers,
  QuestionAuthorI,
} from "../Types/question.type";
import CryptoJS from "crypto-js";

export async function loadQuestionAuthors(): Promise<QuestionAuthorI[]> {
  return axiosClient
    .get("/question/authors")
    .then((res) => res.data.question_authors);
}

export async function loadAllQuestions(): Promise<IQuestionPreviewData[]> {
  return axiosClient
    .get("/question/all/data")
    .then((res) => res.data.questions_data);
}

export async function loadQuestionByID(
  id: string,
): Promise<IQuestionWithAnswers> {
  return axiosClient.get(`/question/encrypted/${id}`).then((res) => {
    const decryptedQuestionData = CryptoJS.AES.decrypt(
      res.data.encryptedQuestionData,
      "sw-secret-key",
    ).toString(CryptoJS.enc.Utf8);
    return JSON.parse(decryptedQuestionData);
  });
}
