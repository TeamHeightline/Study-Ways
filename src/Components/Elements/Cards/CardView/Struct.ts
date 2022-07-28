import {gql} from "@apollo/client/core";


export const GET_CARD_FOR_MICRO_VIEW_BY_ID = gql`
    query GET_CARD_FOR_MICRO_VIEW_BY_ID($id: ID!){
        cardById(id: $id){
            id
            title
            cardContentType
            videoUrl
            hardLevel
            imageUrl
            cCardTheme {
                id
                text
            }
            authorProfile {
                firstname
                lastname
            }

        }
    }`
