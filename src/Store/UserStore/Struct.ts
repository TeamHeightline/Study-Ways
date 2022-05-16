import {gql} from "@apollo/client";

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

export const LoadUserProfile = gql`
    query LoadUserProfile{
        myProfile {
            firstname
            lastname
            avatarSrc
            studyIn {
                id
            }
        }
    }
`