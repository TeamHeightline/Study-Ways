import {gql} from "@apollo/client";


export const GET_CARD_DATA_BY_ID = gql`
    query GET_CARD_DATA_BY_ID($id: ID!){
        cardById(id: $id){
            id
            text
            additionalText
            arrowBefore
            arrowDown
            arrowNext
            arrowUp
            author{id}
            cardContentType
            copyright
            hardLevel
            isCardUseAdditionalText
            isCardUseArrowNavigation
            isCardUseCopyright
            isCardUseMainContent
            isCardUseMainText
            isCardUseTestBeforeCard
            isCardUseTestInCard
            siteUrl
            subTheme{id}
            testBeforeCard{id}
            testInCard{id}
            text
            title
            videoUrl
            cardBefore{id}
            cardDown{id}
            cardNext{id}
            cardUp{id}
        }
    }
    `

export const GET_MY_CARD_AUTHOR = gql`
    query GET_MY_CARD_AUTHOR{
        me{
            cardauthorSet{
                id
                name
            }
        }
    }
    `