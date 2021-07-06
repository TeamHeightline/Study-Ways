import {gql} from "graphql.macro";

export const QSBYID = gql`
    query QSBYID($id: ID!){
        questionSequenceById(id:$id){
            id
            name
            sequenceData
        }
    }
    `