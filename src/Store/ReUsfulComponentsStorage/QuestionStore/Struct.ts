import {gql} from "@apollo/client";

export const GET_QUESTION_DATA = gql`
    query GET_QUESTION_DATA($id: ID!) {
        questionById(id: $id){
            questionstatistic{
                id
                numberOfPasses
                sumOfAllAttempts
            }
            text
            videoUrl
            id
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

export const STATISTIC = gql`
    mutation STATISTIC_FOR_QUESTION($questionID: ID!, $numberOfPasses: Int!, $sumOfAllAttempts: Int!, $id: ID){
        statistic(input:{question:$questionID, numberOfPasses: $numberOfPasses, sumOfAllAttempts: $sumOfAllAttempts, id: $id}){
            errors{
                field
                messages
            }
        }
    }`
