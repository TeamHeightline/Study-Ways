import {gql} from "@apollo/client";

export const ALL_QUESTION_SEQUENCES = gql`
    query ALL_QUESTION_SEQUENCES{
        questionSequence {
            id
            name
            sequenceData
        }
    }
    `