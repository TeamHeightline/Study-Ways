import {gql} from "@apollo/client";

export const GET_COURSES_ID = gql`
    query GET_COURSES_ID{
        cardCourse {
            id
        }
    }`