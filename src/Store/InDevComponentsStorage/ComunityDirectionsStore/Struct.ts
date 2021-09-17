export const directionData = [
    {
        type: "CardElement",
        id: 17
    },
    {
        type: "CourseElement",
        cardPositionData: {
            courseIndex: 0,
            row: 1,
            fragment: 0,
            buttonIndex: 3,
            courseID: 20
        }
    },
    {
        type: "QuestionElement",
        id: 82
    },
    {
        type: "QuestionSequenceElement",
        id: 20
    },
    {
        type: "CardElement",
        id: 36
    },
    {
        type: "CardElement",
        id: 6
    },
    {
        type: "CardElement",
        id: 3
    },
    {
        type: "CourseElement",
        cardPositionData: {
            courseIndex: 0,
            row: 1,
            fragment: 0,
            buttonIndex: 3,
            courseID: 8
        }
    },
    {
        type: "CardElement",
        id: 5
    },
    {
        type: "CardElement",
        id: 12
    },
    {
        type: "CardElement",
        id: 14
    },

]

import {gql} from "graphql.macro";

export const GET_ALL_COURSE = gql`
    query GET_ALL_COURSE{
        cardCourse{
            id
            name
            courseData
        }
    }`

export const GET_QUESTION_TEXT_BY_ID = gql`
    query GET_QUESTION_TEXT_BY_ID($id: ID!){
        questionById(id: $id){
            text
            id
            
    }}
    `

export const GET_ALL_CARD_SUB_THEMES = gql`
    query GET_ALL_CARD_THEMES{
        cardSubTheme{
            id
            name
        }
    }
`

