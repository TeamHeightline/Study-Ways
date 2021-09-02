import {gql} from "graphql.macro";

export const GET_QS_DATA_BY_ID = gql`
    query GET_QS_DATA_BY_ID($id: ID!){
        questionSequenceById(id: $id){
            id
            name
            sequenceData
        }
    }
    `

export const GET_QUESTION_DATA_BY_ID = gql`
    query GET_QUESTION_DATA_BY_ID($id: ID!){
        questionById(id: $id){
            id
            numberOfShowingAnswers
            text
            videoUrl
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
            }
        }
    }
    `