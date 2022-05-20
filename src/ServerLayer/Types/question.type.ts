export interface QuestionAuthorI{
    "user_id": 528
    "firstname": string
    "lastname": string
    "avatar_src": string
    "study_in_id": string
}

export interface IQuestionPreviewData{
    "id": string,
    "text": string,
    "themeString": string,
    "questionAuthor": {
        "id": string,
        "fullName": string
    }
}
