import { gql } from "@apollo/client";


export const GET_QUESTIONS_FROM_QS_BY_ID = gql`
    query GET_QUESTIONS_FROM_QS_BY_ID($id: ID!){
        questionSequenceById(id: $id){
            id
            sequenceData
        }
    }
    `
export const GET_ALL_QUESTIONS_ID = gql`
    query GET_ALL_QUESTIONS_ID{
        question {
            id
        }
    }
    `