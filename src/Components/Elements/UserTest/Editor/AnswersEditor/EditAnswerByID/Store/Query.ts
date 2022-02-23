import {gql} from "@apollo/client";

export const LOAD_ANSWER_BY_ID = gql`
    query LOAD_ANSWER_BY_ID($answer_id: ID!){
        answerById(id: $answer_id){
            question{
                id
            }
            id
            isTrue
            text
            helpTextv1
            helpTextv2
            helpTextv3
            videoUrl
            checkQueue
            hardLevelOfAnswer
            isImageDeleted
            isDeleted
            isInvisible
            isRequired
            onlyForExam
        }
    }
`


export const CREATE_NEW_ANSWER_BASED_ON_DATA = gql`mutation CREATE_ANSWER($question: ID!,  $isTrue: Boolean, $text: String, $helpTextv1: String,
    $helpTextv2: String, $helpTextv3: String, $videoUrl: String, $checkQueue: Int!, $hardLevelOfAnswer: String!, $isDeleted: Boolean,
    $isInvisible: Boolean, $isRequired: Boolean){
    createAnswer(input: {createdBy: 0, question: $question, isTrue: $isTrue, text: $text, helpTextv1: $helpTextv1,
        helpTextv2: $helpTextv2, helpTextv3: $helpTextv3, videoUrl: $videoUrl, checkQueue: $checkQueue,
        hardLevelOfAnswer: $hardLevelOfAnswer,
        isRequired: $isRequired,
        isDeleted: $isDeleted, isInvisible: $isInvisible}){
        errors{
            field
            messages
        }
        answer {
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