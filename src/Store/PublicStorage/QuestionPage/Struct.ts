import {gql} from "@apollo/client";

export const GET_ALL_QUESTIONS = gql`
    query GET_ALL_QUESTIONS{
        question{
            id
            text
            theme{
                id
                name
            }
            author{
                id
                name
            }
        }
    }`
