import {gql} from "@apollo/client";


export const STATISTIC = gql`
    mutation STATISTIC_FOR_QUESTION($questionID: ID!, $numberOfPasses: Int!, $sumOfAllAttempts: Int!, $id: ID){
        statistic(input:{question:$questionID, numberOfPasses: $numberOfPasses, sumOfAllAttempts: $sumOfAllAttempts, id: $id}){
            errors{
                field
                messages
            }
        }
    }`
