import {gql} from "graphql.macro";

export const GET_QUESTION_SEQUENCE_BY_ID = gql`
    query GET_QUESTION_SEQUENCE_BY_ID($id: ID!){
        questionSequenceById(id: $id){
            sequenceData
            name
            id
        }
    }`