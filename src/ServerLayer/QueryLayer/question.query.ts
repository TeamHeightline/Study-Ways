import axiosClient from "./config";
import {IQuestionPreviewData, QuestionAuthorI} from "../Types/question.type";

export async function loadQuestionAuthors(): Promise<QuestionAuthorI[]>{
    return axiosClient.get("/question/authors")
        .then((res) => res.data.question_authors)
}

export async function loadAllQuestions(): Promise<IQuestionPreviewData[]>{
    return axiosClient.get("/question/all/data")
        .then((res) => res.data.questions_data)
}
