import {gql} from "@apollo/client";

export const GET_MY_QUESTIONS_ID_ARRAY = gql`
    query GET_MY_QUESTIONS_ID_ARRAY($page: Int!){
        myQuestionsId(page: $page){
            IDs
            activePage
            numPages
        }
    }`

export const GET_USERS_WITH_QUESTION_CREATOR_STATUS = gql`
    query GET_USERS_WITH_QUESTION_CREATOR_STATUS{
        userWithQuestion {
            id
            username
        }
    }`

export const GET_QUESTION_NANO_VIEW_BY_ID = gql`
    query GET_QUESTION_NANO_VIEW_BY_ID($id: Int!){
        questionNanoViewById(id: $id) {
            id
            text
            questionImage
            ownerUsername
        }
    }`

export const GET_QUESTIONS_ID_ARRAY_FOY_USER = gql`
    query GET_QUESTIONS_ID_ARRAY_FOY_USER($ownerUserId: Int!, $page: Int!){
        questionsId(ownerUserId: $ownerUserId, page: $page){
            IDs
            activePage
            numPages
            ownerUserId
        }
    }`