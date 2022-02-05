import {gql} from "@apollo/client";

export const CREATE_DEEP_QUESTION_COPY = gql`
    mutation CREATE_DEEP_QUESTION_COPY($questionId: Int!){
        copyQuestionWithAnswers(questionId: $questionId){
            newQuestionId
            ok
        }
    }`

export const THEMES_AND_AUTHORS_FOR_QUESTION = gql`
    query{
        me{
            questionauthorSet{
                id
                name
            }
        }
        questionThemes{
            id
            name
            description
        }
    }`
export const MY_QUESTIONS_BASIC_DATA = gql`
    query{
        me{
            questionSet{
                id
                text
            }
        }
    }`

export const GET_QUESTION_DATA_BY_ID = gql`
    query GET_QUESTION_DATA_BY_ID($id: ID!){
        questionById(id: $id){
            id
            numberOfShowingAnswers
            text
            videoUrl
            author{
                id
            }
            theme{
                id
            }
            answers{
                id
                checkQueue
                hardLevelOfAnswer
                helpTextv1
                helpTextv2
                helpTextv3
                isTrue
                text
                videoUrl
                isDeleted
                isInvisible
                isRequired
                isImageDeleted
                onlyForExam
            }
        }
    }
`

export const CREATE_NEW_ANSWER = gql`mutation CREATE_ANSWER($question: ID!){
    createAnswer(input: {createdBy:0, question: $question, isTrue:true, checkQueue: 1, hardLevelOfAnswer:"MEDIUM", helpTextv3: "Вы допустили одну или более ошибок"}){
        errors{
            field
            messages
        }
        answer {
            id
            checkQueue
            hardLevelOfAnswer
            helpTextv1
            helpTextv2
            helpTextv3
            isTrue
            text
            videoUrl
            isDeleted
            isInvisible
            isRequired
            isImageDeleted
            onlyForExam
        }
    }
}`

export const CREATE_NEW_ANSWER_BASED_ON_DATA = gql`mutation CREATE_ANSWER($question: ID!, $id: ID, $isTrue: Boolean, $text: String, $helpTextv1: String,
    $helpTextv2: String, $helpTextv3: String, $videoUrl: String, $checkQueue: Int!, $hardLevelOfAnswer: String!, $isDeleted: Boolean,
    $isInvisible: Boolean){
    createAnswer(input: {createdBy: 0, question: $question, isTrue: $isTrue, text: $text, helpTextv1: $helpTextv1,
        helpTextv2: $helpTextv2, helpTextv3: $helpTextv3, videoUrl: $videoUrl, checkQueue: $checkQueue,
        hardLevelOfAnswer: $hardLevelOfAnswer, id: $id, isDeleted: $isDeleted, isInvisible: $isInvisible}){
        errors{
            field
            messages
        }
        answer {
            id
            checkQueue
            hardLevelOfAnswer
            helpTextv1
            helpTextv2
            helpTextv3
            isTrue
            text
            videoUrl
            isDeleted
            isInvisible
            isRequired
            isImageDeleted
        }
    }
}`

export const UPDATE_QUESTION = gql`mutation UPDATE_QUESTION($createdBy: ID!, $theme: [ID]!, $author: [ID]!, $text: String!, $videoUrl: String, $id: ID!, $isImageQuestion: Boolean, $numberOfShowingAnswers: Int){
    updateQuestion(input: {createdBy:$createdBy, theme: $theme, author: $author, text: $text, videoUrl: $videoUrl, id: $id, isImageQuestion: $isImageQuestion, numberOfShowingAnswers: $numberOfShowingAnswers}){
        errors{
            field
            messages
        }
        question{
            id
            theme{
                id
                name
            }
            author{
                id
                name
            }
            
        }
    }
}`

export const ITEM_HEIGHT = 48;
export const ITEM_PADDING_TOP = 8;

export const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 7.5 + ITEM_PADDING_TOP,
            // width: "250vw",
        },
    },
};
export const CREATE_NEW_QUESTION = gql`
    mutation CREATE_NEW_QUESTION{
        updateQuestion(input: {createdBy: 0, text: "Новый вопрос"}){
            clientMutationId,
            question{
                id
            }
        }
    }`

export const UPDATE_ANSWER = gql`mutation UPDATE_ANSWER(
    $question: ID!, 
    $id: ID, 
    $isTrue: Boolean, 
    $text: String, 
    $helpTextv1: String,
    $helpTextv2: String, 
    $helpTextv3: String, 
    $videoUrl: String, 
    $checkQueue: Int!, 
    $hardLevelOfAnswer: String!, $isDeleted: Boolean,
    $isInvisible: Boolean, 
    $isRequired: Boolean, 
    $onlyForExam:Boolean!,
    $isImageDeleted: Boolean){
    updateAnswer(input: {
        createdBy: 0, 
        question: $question, 
        isTrue: $isTrue, 
        text: $text, 
        helpTextv1: $helpTextv1,
        helpTextv2: $helpTextv2, 
        helpTextv3: $helpTextv3, 
        videoUrl: $videoUrl, 
        checkQueue: $checkQueue,
        hardLevelOfAnswer: $hardLevelOfAnswer, 
        id: $id, 
        isDeleted: $isDeleted, 
        isInvisible: $isInvisible,
        isImageDeleted: $isImageDeleted
        onlyForExam: $onlyForExam,
    isRequired: $isRequired}){
        errors{
            field
            messages
        }
    }
}`