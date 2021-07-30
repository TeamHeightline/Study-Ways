import {gql} from "@apollo/client";

export const GET_ALL_QUESTIONS = gql`
    query GET_ALL_QUESTIONS{
        question{
            id
            text
            theme{
                id
                name
            }
            author{
                id
                name
            }
        }
    }`
export const GET_QUESTION_DATA = gql`
    query GET_QUESTION_DATA($id: ID!) {
        questionById(id: $id){
            text
            videoUrl
            id
            isImageQuestion
            answers{
                id
                isTrue
                text
                helpTextv1
                helpTextv2
                helpTextv3
                videoUrl
                checkQueue
                hardLevelOfAnswer
            }
        }
    }
`