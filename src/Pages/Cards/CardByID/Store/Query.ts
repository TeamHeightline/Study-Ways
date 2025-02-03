import {gql} from "@apollo/client";


export const GET_ALL_COURSE = gql`
    query GET_ALL_COURSE{
        cardCourse{
            id
            courseData
            name
        }
    }
`

export const ADD_TO_BOOKMARK = gql`
    mutation ADD_TO_BOOKMARK($id: Int!){
        addCardToBookmark(cardId: $id){
            ok
        }
    }`

export const REMOVE_CARD_FROM_BOOKMARK = gql`
    mutation REMOVE_CARD_FROM_BOOKMARK($id: Int!){
        removeCardFromBookmark(cardId: $id){
            ok
        }
    }`

export const SET_RATING = gql`
    mutation SET_RATING($id: Int!, $rating: Float!){
        setCardRating(cardId: $id, rating: $rating){
            ok
        }
    }`

export const GET_THEME_ANCESTORS = gql`
    query GET_THEME_ANCESTORS($theme_id: Int!){
        themeAncestors(themeId: $theme_id){
            id
            text
        }
    }`

export const GET_SIMILAR_CARDS_ID_ARRAY = gql`
    query GET_SIMILAR_CARDS($card_id: Int!){
        similarCards(cardId: $card_id){
            IDs
        }
    }
`
