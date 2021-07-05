import {gql} from "graphql.macro";

export const ALL_QuestionSequences = gql`
    query ALL_QuestionSequences{
        questionSequence{
            id
            name
            sequenceData
        }
    }
    `