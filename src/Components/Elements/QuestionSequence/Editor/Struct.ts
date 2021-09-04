import {gql} from "graphql.macro";

export const one_question_struct = {
    question_id: null, //ID вопроса

}

export const question_sequence_struct = {
    sequence: []
}

export const CREATE_QUESTION_SEQUENCE = gql`
    mutation CREATE_QUESTION_SEQUENCE($sequenceData: GenericScalar!){
        createQuestionSequence(input: {sequenceData: $sequenceData,}){
            clientMutationId
        }
    }`

export const GET_MY_QUESTION_SEQUENCE = gql`
    query GET_MY_QUESTION_SEQUENCE{
        me{
            questionsequenceSet{
                sequenceData
                id
                name
                description
            }
        }
    }`