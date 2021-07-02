import {gql} from "graphql.macro";

export const GET_QUESTION_SEQUENCE_BY_ID = gql`
    query GET_QUESTION_SEQUENCE_BY_ID($id: ID!){
        questionSequenceById(id: $id){
            sequenceData
            name
            id
        }
    }`

export const GET_THEMES = gql`
    query GET_THEMES{
        cardGlobalTheme{
            id
            name
            cardthemeSet{
                id
                name
                cardsubthemeSet{
                    id
                    name
                }
            }
        }
    }`

export const UPDATE_QUESTION_SEQUENCE = gql`
    mutation UPDATE_QUESTION_SEQUENCE($sequenceData: GenericScalar!, $sequenceId: ID!, $name: String!){
        updateQuestionSequence(input: {name: $name, sequenceId: $sequenceId, sequenceData: $sequenceData}){
            clientMutationId
        }
    }`