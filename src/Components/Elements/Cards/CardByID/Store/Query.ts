import {gql} from "@apollo/client";

export const LOAD_CARD_DATA_BY_ID = gql`
    query LOAD_CARD_DATA_BY_ID($id: ID!){
        cardById(id: $id){
            id
            videoUrl
            title
            text
            isBookmarked
            isExistRating
            rating
            connectedTheme {
                id
                text
            }
            cardUp {
                id
            }
            cardNext {
                id
            }
            cardDown {
                id
            }
            cardBefore {
                id
            }
            siteUrl
            testInCard{
                id
            }
            testBeforeCard{
                id
            }
            isCardUseTestInCard
            isCardUseTestBeforeCard
            isCardUseMainText
            isCardUseMainContent
            isCardUseAdditionalText
            isCardUseCopyright
            isCardUseArrowNavigation
            arrowBefore
            arrowDown
            arrowUp
            arrowNext
            copyright
            cardContentType
            additionalText
            author{
                name
                id
            }
        }
    }`


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