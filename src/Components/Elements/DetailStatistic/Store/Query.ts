import {gql} from "@apollo/client";

export const LOAD_ATTEMPT_BY_ID = gql`
    query LOAD_ATTEMPT_BY_ID($ID: ID!){
        detailStatisticById(id: $ID){
            id
            userName
            isLogin
            isUseexammode
            maxSumOfAnswersPoint
            question{id}
            questionHasBeenCompleted
            questionSequence{id}
            statistic
            createdAt
        }
    }
    `

export const GET_WRONG_ANSWERS = gql`
    query GET_WRONG_ANSWERS($id: ID!){
        answerById(id: $id){
            text
            isTrue
        }
    }
    `