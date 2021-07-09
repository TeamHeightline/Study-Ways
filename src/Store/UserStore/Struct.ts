import {gql} from "@apollo/client";

export const LOGIN_MUTATION = gql`
    mutation AUTHORIZATION($pass: String!, $mail: String!){
        tokenAuth(password: $pass, email: $mail){
            token
            refreshToken
            success
            errors
            user{
                id
                username
                isStaff
                userAccessLevel
            }
        }
    }`



export const GET_USER_DATA = gql`
    query{
        me{
            id
            firstName
            username
            userAccessLevel
        }
    }
`