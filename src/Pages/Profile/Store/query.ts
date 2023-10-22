import {gql} from "graphql.macro";

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

export const UpdateUserProfile = gql`
    mutation UpdateUserProfile($lastname: String, $firstname: String, $studyIn: Int, $avatarSrc: String){
        createOrUpdateUserProfile(
            lastname: $lastname,
            firstname: $firstname,
            studyIn: $studyIn,
            avatarSrc: $avatarSrc){
            firstname
            lastname
            avatarSrc
            studyIn {
                id
            }
        }
    }`
