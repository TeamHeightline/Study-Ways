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
            authorizedUser{
                userprofile{
                    lastname
                    avatarSrc
                    firstname
                }
            }
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

export const GET_QUESTION_TEXT_BY_ID = gql`
    query GET_QUESTION_TEXT_BY_ID($id: ID!){
        questionText(id: $id){
            id
            text
        }
    }
`
